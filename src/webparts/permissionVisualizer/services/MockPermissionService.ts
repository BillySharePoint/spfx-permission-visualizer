import {
    IPermissionScanResult,
    IPermissionObject,
    ISharePointGroup,
    IPermissionPrincipal,
    PrincipalType,
    IScanOptions
} from "../models";
import { RiskScoringService } from "./RiskScoringService";

export class MockPermissionService {
    private riskService: RiskScoringService;

    constructor() {
        this.riskService = new RiskScoringService();
    }

    public async scanCurrentSite(
        _options: IScanOptions,
        onProgress?: (message: string) => void
    ): Promise<IPermissionScanResult> {
        const progress = (msg: string): void => {
            if (onProgress) onProgress(msg);
        };

        progress("Loading site information...");
        await this.delay(300);

        progress("Loading site permissions...");
        await this.delay(400);

        progress("Loading SharePoint groups...");
        await this.delay(300);

        progress("Scanning lists and libraries...");
        await this.delay(500);

        progress("Checking unique permissions...");
        await this.delay(300);

        progress("Detecting external users...");
        await this.delay(200);

        progress("Calculating risk scores...");
        await this.delay(200);

        progress("Preparing report...");
        await this.delay(200);

        const objects = this.getMockObjects();

        // Apply risk scoring
        for (const obj of objects) {
            const riskResult = this.riskService.scoreObject(obj);
            obj.riskScore = riskResult.score;
            obj.riskLevel = riskResult.level;
            obj.findings = this.riskService.generateFindings(obj);
        }

        const allFindings = objects.flatMap(o => o.findings);
        const groups = this.getMockGroups();

        return {
            siteUrl: "https://contoso.sharepoint.com/sites/demo-project",
            scannedAt: new Date().toISOString(),
            scanDurationMs: 2400,
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
            warnings: []
        };
    }

    private getMockObjects(): IPermissionObject[] {
        const siteOwnersPrincipal = this.createGroupPrincipal(1, "Demo Project Owners");
        const siteMembersPrincipal = this.createGroupPrincipal(2, "Demo Project Members");
        const siteVisitorsPrincipal = this.createGroupPrincipal(3, "Demo Project Visitors");
        const externalUser1 = this.createExternalUser(10, "John External", "john.external_contoso.com#ext#@contoso.onmicrosoft.com");
        const externalUser2 = this.createExternalUser(11, "Sara Partner", "sara.partner_partner.com#ext#@contoso.onmicrosoft.com");
        const externalUser3 = this.createExternalUser(12, "Mike Contractor", "mike.contractor_vendor.io#ext#@contoso.onmicrosoft.com");
        const directUser1 = this.createDirectUser(20, "Alice Johnson", "alice.johnson@contoso.com");
        const directUser2 = this.createDirectUser(21, "Bob Smith", "bob.smith@contoso.com");
        const directUser3 = this.createDirectUser(22, "Carol Davis", "carol.davis@contoso.com");
        const directUser4 = this.createDirectUser(23, "Dave Wilson", "dave.wilson@contoso.com");
        const directUser5 = this.createDirectUser(24, "Eve Taylor", "eve.taylor@contoso.com");
        const hrGroupPrincipal = this.createGroupPrincipal(4, "HR Reviewers");
        const financeGroupPrincipal = this.createGroupPrincipal(5, "Finance Contributors");

        const fullControlRole = { id: 1073741829, name: "Full Control", description: "Has full control." };
        const editRole = { id: 1073741830, name: "Edit", description: "Can add, edit and delete lists." };
        const contributeRole = { id: 1073741827, name: "Contribute", description: "Can view, add, update, and delete." };
        const readRole = { id: 1073741826, name: "Read", description: "Can view only." };

        const objects: IPermissionObject[] = [
            // Site
            {
                id: "site-root",
                title: "Demo Project Site",
                url: "https://contoso.sharepoint.com/sites/demo-project",
                objectType: "Site",
                hasUniqueRoleAssignments: false,
                inheritsPermissions: false,
                permissionAssignments: [
                    { principal: siteOwnersPrincipal, roles: [fullControlRole], assignmentType: "GroupBased" },
                    { principal: siteMembersPrincipal, roles: [editRole], assignmentType: "GroupBased" },
                    { principal: siteVisitorsPrincipal, roles: [readRole], assignmentType: "GroupBased" },
                    { principal: directUser1, roles: [editRole], assignmentType: "Direct" }
                ],
                externalUsers: [],
                directAssignments: [{ principal: directUser1, roles: [editRole], assignmentType: "Direct" }],
                riskLevel: "Low",
                riskScore: 0,
                findings: []
            },
            // Documents Library (inherits)
            {
                id: "library-documents",
                title: "Documents",
                url: "/sites/demo-project/Shared Documents",
                objectType: "Library",
                parentId: "site-root",
                hasUniqueRoleAssignments: false,
                inheritsPermissions: true,
                permissionAssignments: [],
                externalUsers: [],
                directAssignments: [],
                riskLevel: "Low",
                riskScore: 0,
                findings: [],
                itemCount: 156,
                lastModified: "2026-04-28T14:30:00Z"
            },
            // HR Policies Library (unique perms, external user)
            {
                id: "library-hr-policies",
                title: "HR Policies",
                url: "/sites/demo-project/HR Policies",
                objectType: "Library",
                parentId: "site-root",
                hasUniqueRoleAssignments: true,
                inheritsPermissions: false,
                permissionAssignments: [
                    { principal: siteOwnersPrincipal, roles: [fullControlRole], assignmentType: "GroupBased" },
                    { principal: hrGroupPrincipal, roles: [contributeRole], assignmentType: "GroupBased" },
                    { principal: externalUser1, roles: [readRole], assignmentType: "Direct" },
                    { principal: directUser2, roles: [editRole], assignmentType: "Direct" },
                    { principal: directUser3, roles: [contributeRole], assignmentType: "Direct" }
                ],
                externalUsers: [externalUser1],
                directAssignments: [
                    { principal: externalUser1, roles: [readRole], assignmentType: "Direct" },
                    { principal: directUser2, roles: [editRole], assignmentType: "Direct" },
                    { principal: directUser3, roles: [contributeRole], assignmentType: "Direct" }
                ],
                riskLevel: "High",
                riskScore: 0,
                findings: [],
                itemCount: 42,
                lastModified: "2026-05-01T09:15:00Z"
            },
            // Finance Reports Library (unique perms, external users)
            {
                id: "library-finance",
                title: "Finance Reports",
                url: "/sites/demo-project/Finance Reports",
                objectType: "Library",
                parentId: "site-root",
                hasUniqueRoleAssignments: true,
                inheritsPermissions: false,
                permissionAssignments: [
                    { principal: siteOwnersPrincipal, roles: [fullControlRole], assignmentType: "GroupBased" },
                    { principal: financeGroupPrincipal, roles: [contributeRole], assignmentType: "GroupBased" },
                    { principal: externalUser2, roles: [editRole], assignmentType: "Direct" },
                    { principal: externalUser3, roles: [readRole], assignmentType: "Direct" },
                    { principal: directUser4, roles: [fullControlRole], assignmentType: "Direct" }
                ],
                externalUsers: [externalUser2, externalUser3],
                directAssignments: [
                    { principal: externalUser2, roles: [editRole], assignmentType: "Direct" },
                    { principal: externalUser3, roles: [readRole], assignmentType: "Direct" },
                    { principal: directUser4, roles: [fullControlRole], assignmentType: "Direct" }
                ],
                riskLevel: "High",
                riskScore: 0,
                findings: [],
                itemCount: 89,
                lastModified: "2026-04-30T16:45:00Z"
            },
            // Site Pages (inherits)
            {
                id: "library-sitepages",
                title: "Site Pages",
                url: "/sites/demo-project/SitePages",
                objectType: "Library",
                parentId: "site-root",
                hasUniqueRoleAssignments: false,
                inheritsPermissions: true,
                permissionAssignments: [],
                externalUsers: [],
                directAssignments: [],
                riskLevel: "Low",
                riskScore: 0,
                findings: [],
                itemCount: 12,
                lastModified: "2026-04-25T11:00:00Z"
            },
            // Project Tasks list (unique perms)
            {
                id: "list-tasks",
                title: "Project Tasks",
                url: "/sites/demo-project/Lists/ProjectTasks",
                objectType: "List",
                parentId: "site-root",
                hasUniqueRoleAssignments: true,
                inheritsPermissions: false,
                permissionAssignments: [
                    { principal: siteOwnersPrincipal, roles: [fullControlRole], assignmentType: "GroupBased" },
                    { principal: siteMembersPrincipal, roles: [contributeRole], assignmentType: "GroupBased" },
                    { principal: directUser5, roles: [editRole], assignmentType: "Direct" }
                ],
                externalUsers: [],
                directAssignments: [
                    { principal: directUser5, roles: [editRole], assignmentType: "Direct" }
                ],
                riskLevel: "Medium",
                riskScore: 0,
                findings: [],
                itemCount: 234,
                lastModified: "2026-05-03T08:20:00Z"
            },
            // Announcements list (inherits)
            {
                id: "list-announcements",
                title: "Announcements",
                url: "/sites/demo-project/Lists/Announcements",
                objectType: "List",
                parentId: "site-root",
                hasUniqueRoleAssignments: false,
                inheritsPermissions: true,
                permissionAssignments: [],
                externalUsers: [],
                directAssignments: [],
                riskLevel: "Low",
                riskScore: 0,
                findings: [],
                itemCount: 18,
                lastModified: "2026-04-20T10:00:00Z"
            },
            // Folder: HR Folder with broken inheritance
            {
                id: "folder-hr-confidential",
                title: "Confidential",
                url: "/sites/demo-project/HR Policies/Confidential",
                objectType: "Folder",
                parentId: "library-hr-policies",
                hasUniqueRoleAssignments: true,
                inheritsPermissions: false,
                permissionAssignments: [
                    { principal: siteOwnersPrincipal, roles: [fullControlRole], assignmentType: "GroupBased" },
                    { principal: directUser2, roles: [readRole], assignmentType: "Direct" }
                ],
                externalUsers: [],
                directAssignments: [
                    { principal: directUser2, roles: [readRole], assignmentType: "Direct" }
                ],
                riskLevel: "Medium",
                riskScore: 0,
                findings: [],
                lastModified: "2026-04-15T14:00:00Z"
            },
            // Folder: Finance Q1 with broken inheritance and external user
            {
                id: "folder-finance-q1",
                title: "Q1 2026 Reports",
                url: "/sites/demo-project/Finance Reports/Q1 2026 Reports",
                objectType: "Folder",
                parentId: "library-finance",
                hasUniqueRoleAssignments: true,
                inheritsPermissions: false,
                permissionAssignments: [
                    { principal: siteOwnersPrincipal, roles: [fullControlRole], assignmentType: "GroupBased" },
                    { principal: financeGroupPrincipal, roles: [readRole], assignmentType: "GroupBased" },
                    { principal: externalUser2, roles: [readRole], assignmentType: "Direct" }
                ],
                externalUsers: [externalUser2],
                directAssignments: [
                    { principal: externalUser2, roles: [readRole], assignmentType: "Direct" }
                ],
                riskLevel: "High",
                riskScore: 0,
                findings: [],
                lastModified: "2026-03-31T17:30:00Z"
            }
        ];

        return objects;
    }

    private getMockGroups(): ISharePointGroup[] {
        return [
            {
                id: 1,
                title: "Demo Project Owners",
                description: "Site owners with full control",
                ownerTitle: "Alice Johnson",
                usersCount: 3,
                users: [
                    this.createDirectUser(20, "Alice Johnson", "alice.johnson@contoso.com"),
                    this.createDirectUser(25, "Admin User", "admin@contoso.com"),
                    this.createDirectUser(26, "Site Admin", "siteadmin@contoso.com")
                ]
            },
            {
                id: 2,
                title: "Demo Project Members",
                description: "Site members with edit permissions",
                ownerTitle: "Demo Project Owners",
                usersCount: 8,
                users: [
                    this.createDirectUser(21, "Bob Smith", "bob.smith@contoso.com"),
                    this.createDirectUser(22, "Carol Davis", "carol.davis@contoso.com"),
                    this.createDirectUser(23, "Dave Wilson", "dave.wilson@contoso.com"),
                    this.createDirectUser(24, "Eve Taylor", "eve.taylor@contoso.com"),
                    this.createDirectUser(27, "Frank Miller", "frank.miller@contoso.com"),
                    this.createDirectUser(28, "Grace Lee", "grace.lee@contoso.com"),
                    this.createDirectUser(29, "Henry Brown", "henry.brown@contoso.com"),
                    this.createExternalUser(10, "John External", "john.external_contoso.com#ext#@contoso.onmicrosoft.com")
                ]
            },
            {
                id: 3,
                title: "Demo Project Visitors",
                description: "Site visitors with read-only access",
                ownerTitle: "Demo Project Owners",
                usersCount: 2,
                users: [
                    this.createDirectUser(30, "Visitor One", "visitor1@contoso.com"),
                    this.createDirectUser(31, "Visitor Two", "visitor2@contoso.com")
                ]
            },
            {
                id: 4,
                title: "HR Reviewers",
                description: "Users who review HR documents",
                ownerTitle: "Alice Johnson",
                usersCount: 4,
                users: [
                    this.createDirectUser(22, "Carol Davis", "carol.davis@contoso.com"),
                    this.createDirectUser(32, "HR Manager", "hr.manager@contoso.com"),
                    this.createDirectUser(33, "HR Analyst", "hr.analyst@contoso.com"),
                    this.createExternalUser(11, "Sara Partner", "sara.partner_partner.com#ext#@contoso.onmicrosoft.com")
                ]
            },
            {
                id: 5,
                title: "Finance Contributors",
                description: "Finance team with contributor access to reports",
                ownerTitle: "Demo Project Owners",
                usersCount: 5,
                users: [
                    this.createDirectUser(23, "Dave Wilson", "dave.wilson@contoso.com"),
                    this.createDirectUser(34, "CFO User", "cfo@contoso.com"),
                    this.createDirectUser(35, "Finance Analyst 1", "finance1@contoso.com"),
                    this.createDirectUser(36, "Finance Analyst 2", "finance2@contoso.com"),
                    this.createExternalUser(12, "Mike Contractor", "mike.contractor_vendor.io#ext#@contoso.onmicrosoft.com")
                ]
            },
            {
                id: 6,
                title: "Empty Legacy Group",
                description: "Old group with no members",
                ownerTitle: "Demo Project Owners",
                usersCount: 0,
                users: []
            },
            {
                id: 7,
                title: "All Staff",
                description: "All company staff members",
                ownerTitle: "Admin User",
                usersCount: 15,
                users: [
                    this.createDirectUser(20, "Alice Johnson", "alice.johnson@contoso.com"),
                    this.createDirectUser(21, "Bob Smith", "bob.smith@contoso.com"),
                    this.createDirectUser(22, "Carol Davis", "carol.davis@contoso.com"),
                    this.createDirectUser(23, "Dave Wilson", "dave.wilson@contoso.com"),
                    this.createDirectUser(24, "Eve Taylor", "eve.taylor@contoso.com"),
                    this.createDirectUser(25, "Admin User", "admin@contoso.com"),
                    this.createDirectUser(26, "Site Admin", "siteadmin@contoso.com"),
                    this.createDirectUser(27, "Frank Miller", "frank.miller@contoso.com"),
                    this.createDirectUser(28, "Grace Lee", "grace.lee@contoso.com"),
                    this.createDirectUser(29, "Henry Brown", "henry.brown@contoso.com"),
                    this.createDirectUser(30, "Visitor One", "visitor1@contoso.com"),
                    this.createDirectUser(31, "Visitor Two", "visitor2@contoso.com"),
                    this.createDirectUser(32, "HR Manager", "hr.manager@contoso.com"),
                    this.createDirectUser(33, "HR Analyst", "hr.analyst@contoso.com"),
                    this.createDirectUser(34, "CFO User", "cfo@contoso.com")
                ]
            },
            {
                id: 8,
                title: "External Partners",
                description: "External partner accounts",
                ownerTitle: "Alice Johnson",
                usersCount: 3,
                users: [
                    this.createExternalUser(10, "John External", "john.external_contoso.com#ext#@contoso.onmicrosoft.com"),
                    this.createExternalUser(11, "Sara Partner", "sara.partner_partner.com#ext#@contoso.onmicrosoft.com"),
                    this.createExternalUser(12, "Mike Contractor", "mike.contractor_vendor.io#ext#@contoso.onmicrosoft.com")
                ]
            }
        ];
    }

    private createGroupPrincipal(id: number, title: string): IPermissionPrincipal {
        return {
            id,
            title,
            loginName: `c:0t.c|tenant|${title.replace(/\s/g, "").toLowerCase()}`,
            principalType: PrincipalType.SharePointGroup,
            isExternal: false,
            isSharePointGroup: true,
            isSecurityGroup: false,
            isM365Group: false
        };
    }

    private createExternalUser(id: number, title: string, loginName: string): IPermissionPrincipal {
        return {
            id,
            title,
            loginName,
            email: loginName,
            principalType: PrincipalType.User,
            isExternal: true,
            isSharePointGroup: false,
            isSecurityGroup: false,
            isM365Group: false
        };
    }

    private createDirectUser(id: number, title: string, email: string): IPermissionPrincipal {
        return {
            id,
            title,
            loginName: `i:0#.f|membership|${email}`,
            email,
            principalType: PrincipalType.User,
            isExternal: false,
            isSharePointGroup: false,
            isSecurityGroup: false,
            isM365Group: false
        };
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
