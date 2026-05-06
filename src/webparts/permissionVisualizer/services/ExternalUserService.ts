import { IPermissionPrincipal, IPermissionScanResult } from "../models";

export class ExternalUserService {
    /**
     * Gets all unique external users from the scan result
     */
    public getExternalUsers(result: IPermissionScanResult): IExternalUserEntry[] {
        const entries: IExternalUserEntry[] = [];

        for (const obj of result.objects) {
            for (const assignment of obj.permissionAssignments) {
                if (assignment.principal.isExternal) {
                    entries.push({
                        principal: assignment.principal,
                        objectTitle: obj.title,
                        objectUrl: obj.url,
                        objectType: obj.objectType,
                        permissionLevels: assignment.roles.map(r => r.name).join(", "),
                        assignmentType: assignment.assignmentType
                    });
                }
            }
        }

        // Also check group members
        for (const group of result.groups) {
            for (const user of group.users) {
                if (user.isExternal) {
                    const existing = entries.find(
                        e => e.principal.loginName === user.loginName && e.objectTitle === group.title
                    );
                    if (!existing) {
                        entries.push({
                            principal: user,
                            objectTitle: `Group: ${group.title}`,
                            objectUrl: "",
                            objectType: "Site",
                            permissionLevels: "Group Member",
                            assignmentType: "GroupBased"
                        });
                    }
                }
            }
        }

        return entries;
    }

    /**
     * Gets unique external user count
     */
    public getUniqueExternalUserCount(result: IPermissionScanResult): number {
        const uniqueLogins = new Set<string>();

        for (const obj of result.objects) {
            for (const ext of obj.externalUsers) {
                uniqueLogins.add(ext.loginName.toLowerCase());
            }
        }

        for (const group of result.groups) {
            for (const user of group.users) {
                if (user.isExternal) {
                    uniqueLogins.add(user.loginName.toLowerCase());
                }
            }
        }

        return uniqueLogins.size;
    }
}

export interface IExternalUserEntry {
    principal: IPermissionPrincipal;
    objectTitle: string;
    objectUrl: string;
    objectType: string;
    permissionLevels: string;
    assignmentType: string;
}
