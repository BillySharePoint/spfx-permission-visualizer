import { IPermissionScanResult } from "../models";
import { downloadCsv } from "../utils/csvUtils";
import { getDateForFilename } from "../utils/dateUtils";

export class CsvExportService {
    public exportObjects(result: IPermissionScanResult): void {
        const rows = result.objects.map(o => ({
            Title: o.title,
            Type: o.objectType,
            URL: o.url,
            "Has Unique Permissions": o.hasUniqueRoleAssignments ? "Yes" : "No",
            "External Users": o.externalUsers.length,
            "Direct Assignments": o.directAssignments.length,
            "Risk Level": o.riskLevel,
            "Risk Score": o.riskScore,
            "Findings Count": o.findings.length,
            "Item Count": o.itemCount || "",
            "Last Modified": o.lastModified || ""
        }));

        const filename = `permission-visualizer-objects-${getDateForFilename()}.csv`;
        downloadCsv(filename, rows);
    }

    public exportFindings(result: IPermissionScanResult): void {
        const rows = result.findings.map(f => ({
            Severity: f.severity,
            Category: f.category,
            Object: f.objectTitle,
            "Object URL": f.objectUrl,
            Finding: f.title,
            Description: f.description,
            Recommendation: f.recommendation
        }));

        const filename = `permission-visualizer-findings-${getDateForFilename()}.csv`;
        downloadCsv(filename, rows);
    }

    public exportExternalUsers(result: IPermissionScanResult): void {
        const rows: Record<string, unknown>[] = [];

        for (const obj of result.objects) {
            for (const assignment of obj.permissionAssignments) {
                if (assignment.principal.isExternal) {
                    rows.push({
                        "Display Name": assignment.principal.title,
                        "Email / Login": assignment.principal.email || assignment.principal.loginName,
                        "Object Title": obj.title,
                        "Object URL": obj.url,
                        "Permission Level": assignment.roles.map(r => r.name).join(", "),
                        "Assignment Type": assignment.assignmentType
                    });
                }
            }
        }

        const filename = `permission-visualizer-external-users-${getDateForFilename()}.csv`;
        downloadCsv(filename, rows);
    }

    public exportDirectAssignments(result: IPermissionScanResult): void {
        const rows: Record<string, unknown>[] = [];

        for (const obj of result.objects) {
            for (const assignment of obj.directAssignments) {
                rows.push({
                    User: assignment.principal.title,
                    "Email / Login": assignment.principal.email || assignment.principal.loginName,
                    Object: obj.title,
                    "Object URL": obj.url,
                    "Permission Level": assignment.roles.map(r => r.name).join(", "),
                    "Risk Level": obj.riskLevel
                });
            }
        }

        const filename = `permission-visualizer-direct-assignments-${getDateForFilename()}.csv`;
        downloadCsv(filename, rows);
    }

    public exportGroups(result: IPermissionScanResult): void {
        const rows: Record<string, unknown>[] = [];

        for (const group of result.groups) {
            for (const user of group.users) {
                rows.push({
                    "Group Name": group.title,
                    "Group Owner": group.ownerTitle || "",
                    "User Count": group.usersCount,
                    "Member Name": user.title,
                    "Member Email": user.email || user.loginName,
                    "Is External": user.isExternal ? "Yes" : "No"
                });
            }

            // If group has no users, still include the group
            if (group.users.length === 0) {
                rows.push({
                    "Group Name": group.title,
                    "Group Owner": group.ownerTitle || "",
                    "User Count": 0,
                    "Member Name": "(No members)",
                    "Member Email": "",
                    "Is External": ""
                });
            }
        }

        const filename = `permission-visualizer-groups-${getDateForFilename()}.csv`;
        downloadCsv(filename, rows);
    }
}
