import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/security/web";
import "@pnp/sp/security/list";
import "@pnp/sp/security/item";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";

import {
    IPermissionObject,
    IPermissionAssignment,
    IPermissionScanResult,
    IScanOptions,
    IScanWarning,
    IPermissionRole
} from "../models";
import { mapPrincipal, generateObjectId, isDirectAssignment } from "../utils/permissionUtils";
import { SCAN_DEFAULTS, LIST_TEMPLATES } from "../constants";
import { SharePointGroupService } from "./SharePointGroupService";
import { RiskScoringService } from "./RiskScoringService";

export interface IPermissionService {
    scanCurrentSite(
        options: IScanOptions,
        onProgress?: (message: string) => void
    ): Promise<IPermissionScanResult>;
}

export class PermissionService implements IPermissionService {
    private sp: SPFI;
    private groupService: SharePointGroupService;
    private riskService: RiskScoringService;

    constructor(sp: SPFI) {
        this.sp = sp;
        this.groupService = new SharePointGroupService(sp);
        this.riskService = new RiskScoringService();
    }

    public async scanCurrentSite(
        options: IScanOptions,
        onProgress?: (message: string) => void
    ): Promise<IPermissionScanResult> {
        const startTime = Date.now();
        const warnings: IScanWarning[] = [];
        const objects: IPermissionObject[] = [];

        const progress = (msg: string): void => {
            if (onProgress) onProgress(msg);
        };

        // Get current web info
        progress("Loading site information...");
        const web = await this.sp.web.select("Title", "Url")();

        // Scan site permissions
        if (options.scanSitePermissions) {
            progress("Loading site permissions...");
            try {
                const siteObj = await this.getSitePermissions(web.Title, web.Url);
                objects.push(siteObj);
            } catch (err) {
                warnings.push({
                    source: "Site Permissions",
                    message: "Failed to load site permissions",
                    details: err instanceof Error ? err.message : String(err)
                });
            }
        }

        // Scan SharePoint groups
        progress("Loading SharePoint groups...");
        let groups = [];
        try {
            groups = await this.groupService.getSiteGroups();
        } catch (err) {
            warnings.push({
                source: "SharePoint Groups",
                message: "Failed to load site groups",
                details: err instanceof Error ? err.message : String(err)
            });
        }

        // Scan lists and libraries
        if (options.scanListsAndLibraries) {
            progress("Scanning lists and libraries...");
            try {
                const listObjects = await this.getListsAndLibraries(options, progress);
                objects.push(...listObjects);
            } catch (err) {
                warnings.push({
                    source: "Lists and Libraries",
                    message: "Failed to scan lists and libraries",
                    details: err instanceof Error ? err.message : String(err)
                });
            }
        }

        // Calculate risk scores and generate findings
        progress("Calculating risk scores...");
        for (const obj of objects) {
            const riskResult = this.riskService.scoreObject(obj);
            obj.riskScore = riskResult.score;
            obj.riskLevel = riskResult.level;
            obj.findings = this.riskService.generateFindings(obj);
        }

        // Aggregate findings
        progress("Preparing report...");
        const allFindings = objects.flatMap(o => o.findings);
        const scanDuration = Date.now() - startTime;

        const result: IPermissionScanResult = {
            siteUrl: web.Url,
            scannedAt: new Date().toISOString(),
            scanDurationMs: scanDuration,
            totalObjectsScanned: objects.length,
            totalFindings: allFindings.length,
            highRiskFindings: allFindings.filter(f => f.severity === "High").length,
            mediumRiskFindings: allFindings.filter(f => f.severity === "Medium").length,
            lowRiskFindings: allFindings.filter(f => f.severity === "Low" || f.severity === "Info").length,
            externalUsersCount: objects.reduce((sum, o) => sum + o.externalUsers.length, 0),
            directAssignmentsCount: objects.reduce((sum, o) => sum + o.directAssignments.length, 0),
            brokenInheritanceCount: objects.filter(o => o.hasUniqueRoleAssignments).length,
            objects,
            findings: allFindings,
            groups,
            warnings
        };

        return result;
    }

    private async getSitePermissions(title: string, url: string): Promise<IPermissionObject> {
        const assignments = await this.sp.web.roleAssignments
            .expand("Member", "RoleDefinitionBindings")
            .select(
                "Member/Id",
                "Member/Title",
                "Member/LoginName",
                "Member/Email",
                "Member/PrincipalType",
                "RoleDefinitionBindings/Id",
                "RoleDefinitionBindings/Name",
                "RoleDefinitionBindings/Description",
                "RoleDefinitionBindings/Hidden",
                "RoleDefinitionBindings/Order"
            )();

        const permAssignments = this.mapRoleAssignments(assignments);
        const externalUsers = permAssignments
            .filter(a => a.principal.isExternal)
            .map(a => a.principal);
        const directAssigns = permAssignments.filter(a => isDirectAssignment(a.principal));

        return {
            id: generateObjectId("Site", "root"),
            title,
            url,
            objectType: "Site",
            hasUniqueRoleAssignments: false,
            inheritsPermissions: false,
            permissionAssignments: permAssignments,
            externalUsers,
            directAssignments: directAssigns,
            riskLevel: "Low",
            riskScore: 0,
            findings: []
        };
    }

    private async getListsAndLibraries(
        options: IScanOptions,
        progress: (msg: string) => void
    ): Promise<IPermissionObject[]> {
        const results: IPermissionObject[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let lists: any[] = await this.sp.web.lists
            .select(
                "Id",
                "Title",
                "RootFolder/ServerRelativeUrl",
                "BaseTemplate",
                "BaseType",
                "Hidden",
                "ItemCount",
                "HasUniqueRoleAssignments",
                "LastItemModifiedDate"
            )
            .expand("RootFolder")();

        // Filter hidden lists
        if (!options.includeHiddenLists) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            lists = lists.filter((l: any) => !l.Hidden);
        }

        for (const list of lists) {
            progress(`Scanning: ${list.Title}...`);
            try {
                const objectType = list.BaseType === 1 ? "Library" : "List";
                const listObj: IPermissionObject = {
                    id: generateObjectId(objectType, list.Id),
                    title: list.Title,
                    url: list.RootFolder?.ServerRelativeUrl || "",
                    objectType,
                    parentId: generateObjectId("Site", "root"),
                    hasUniqueRoleAssignments: list.HasUniqueRoleAssignments,
                    inheritsPermissions: !list.HasUniqueRoleAssignments,
                    permissionAssignments: [],
                    externalUsers: [],
                    directAssignments: [],
                    riskLevel: "Low",
                    riskScore: 0,
                    findings: [],
                    itemCount: list.ItemCount,
                    lastModified: list.LastItemModifiedDate
                };

                // If unique permissions, fetch role assignments
                if (list.HasUniqueRoleAssignments) {
                    try {
                        const listAssignments = await this.sp.web.lists
                            .getById(list.Id)
                            .roleAssignments.expand("Member", "RoleDefinitionBindings")
                            .select(
                                "Member/Id",
                                "Member/Title",
                                "Member/LoginName",
                                "Member/Email",
                                "Member/PrincipalType",
                                "RoleDefinitionBindings/Id",
                                "RoleDefinitionBindings/Name"
                            )();

                        listObj.permissionAssignments = this.mapRoleAssignments(listAssignments);
                        listObj.externalUsers = listObj.permissionAssignments
                            .filter(a => a.principal.isExternal)
                            .map(a => a.principal);
                        listObj.directAssignments = listObj.permissionAssignments
                            .filter(a => isDirectAssignment(a.principal));
                    } catch (err) {
                        // Continue scanning even if one list fails
                    }
                }

                results.push(listObj);

                // Scan folders if enabled
                if (options.includeFolders && (list.BaseTemplate === LIST_TEMPLATES.DOCUMENT_LIBRARY || list.BaseType === 1)) {
                    try {
                        const folderObjects = await this.scanFolders(list.Id, listObj.id, options);
                        results.push(...folderObjects);
                    } catch {
                        // Continue on folder scan failure
                    }
                }
            } catch (err) {
                // Continue scanning other lists
            }
        }

        return results;
    }

    private async scanFolders(
        listId: string,
        parentId: string,
        options: IScanOptions
    ): Promise<IPermissionObject[]> {
        const results: IPermissionObject[] = [];

        const items = await this.sp.web.lists
            .getById(listId)
            .items.select(
                "Id",
                "Title",
                "FileRef",
                "FileLeafRef",
                "FSObjType",
                "HasUniqueRoleAssignments",
                "Modified"
            )
            .filter("FSObjType eq 1")
            .top(SCAN_DEFAULTS.MAX_ITEMS_PER_LIST)();

        for (const item of items) {
            const folderObj: IPermissionObject = {
                id: generateObjectId("Folder", `${listId}-${item.Id}`),
                title: item.FileLeafRef || item.Title || "Folder",
                url: item.FileRef || "",
                objectType: "Folder",
                parentId,
                hasUniqueRoleAssignments: item.HasUniqueRoleAssignments,
                inheritsPermissions: !item.HasUniqueRoleAssignments,
                permissionAssignments: [],
                externalUsers: [],
                directAssignments: [],
                riskLevel: "Low",
                riskScore: 0,
                findings: [],
                lastModified: item.Modified
            };

            if (item.HasUniqueRoleAssignments) {
                try {
                    const itemAssignments = await this.sp.web.lists
                        .getById(listId)
                        .items.getById(item.Id)
                        .roleAssignments.expand("Member", "RoleDefinitionBindings")
                        .select(
                            "Member/Id",
                            "Member/Title",
                            "Member/LoginName",
                            "Member/Email",
                            "Member/PrincipalType",
                            "RoleDefinitionBindings/Id",
                            "RoleDefinitionBindings/Name"
                        )();

                    folderObj.permissionAssignments = this.mapRoleAssignments(itemAssignments);
                    folderObj.externalUsers = folderObj.permissionAssignments
                        .filter(a => a.principal.isExternal)
                        .map(a => a.principal);
                    folderObj.directAssignments = folderObj.permissionAssignments
                        .filter(a => isDirectAssignment(a.principal));
                } catch {
                    // Continue on item permission read failure
                }
            }

            results.push(folderObj);
        }

        // Optionally scan individual items
        if (options.includeItems) {
            try {
                const fileItems = await this.sp.web.lists
                    .getById(listId)
                    .items.select(
                        "Id",
                        "Title",
                        "FileRef",
                        "FileLeafRef",
                        "FSObjType",
                        "HasUniqueRoleAssignments",
                        "Modified"
                    )
                    .filter("FSObjType eq 0 and HasUniqueRoleAssignments eq 1")
                    .top(SCAN_DEFAULTS.MAX_ITEMS_PER_LIST)();

                for (const fileItem of fileItems) {
                    const itemObj: IPermissionObject = {
                        id: generateObjectId("Item", `${listId}-${fileItem.Id}`),
                        title: fileItem.FileLeafRef || fileItem.Title || "Item",
                        url: fileItem.FileRef || "",
                        objectType: "Item",
                        parentId,
                        hasUniqueRoleAssignments: true,
                        inheritsPermissions: false,
                        permissionAssignments: [],
                        externalUsers: [],
                        directAssignments: [],
                        riskLevel: "Low",
                        riskScore: 0,
                        findings: [],
                        lastModified: fileItem.Modified
                    };

                    try {
                        const itemAssignments = await this.sp.web.lists
                            .getById(listId)
                            .items.getById(fileItem.Id)
                            .roleAssignments.expand("Member", "RoleDefinitionBindings")
                            .select(
                                "Member/Id",
                                "Member/Title",
                                "Member/LoginName",
                                "Member/Email",
                                "Member/PrincipalType",
                                "RoleDefinitionBindings/Id",
                                "RoleDefinitionBindings/Name"
                            )();

                        itemObj.permissionAssignments = this.mapRoleAssignments(itemAssignments);
                        itemObj.externalUsers = itemObj.permissionAssignments
                            .filter(a => a.principal.isExternal)
                            .map(a => a.principal);
                        itemObj.directAssignments = itemObj.permissionAssignments
                            .filter(a => isDirectAssignment(a.principal));
                    } catch {
                        // Continue
                    }

                    results.push(itemObj);
                }
            } catch {
                // Continue on item scan failure
            }
        }

        return results;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapRoleAssignments(assignments: any[]): IPermissionAssignment[] {
        return assignments.map(a => {
            const principal = mapPrincipal(a.Member);
            const roles: IPermissionRole[] = (a.RoleDefinitionBindings || []).map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (r: any) => ({
                    id: r.Id,
                    name: r.Name,
                    description: r.Description || undefined,
                    hidden: r.Hidden || false,
                    order: r.Order || 0
                })
            );

            let assignmentType: IPermissionAssignment["assignmentType"] = "Unknown";
            if (principal.isSharePointGroup || principal.isSecurityGroup || principal.isM365Group) {
                assignmentType = "GroupBased";
            } else if (principal.principalType === "User") {
                assignmentType = "Direct";
            }

            return {
                principal,
                roles,
                assignmentType
            };
        });
    }
}
