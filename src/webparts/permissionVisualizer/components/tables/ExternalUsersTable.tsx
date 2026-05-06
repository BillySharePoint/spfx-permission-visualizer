import * as React from "react";
import {
    DetailsList,
    DetailsListLayoutMode,
    IColumn,
    SelectionMode
} from "@fluentui/react/lib/DetailsList";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { IPermissionScanResult } from "../../models";

interface IExternalUserRow {
    displayName: string;
    email: string;
    objectTitle: string;
    permissionLevel: string;
    assignmentType: string;
}

export interface IExternalUsersTableProps {
    result: IPermissionScanResult;
}

export const ExternalUsersTable: React.FC<IExternalUsersTableProps> = ({ result }) => {
    const rows: IExternalUserRow[] = [];

    for (const obj of result.objects) {
        for (const assignment of obj.permissionAssignments) {
            if (assignment.principal.isExternal) {
                rows.push({
                    displayName: assignment.principal.title,
                    email: assignment.principal.email || assignment.principal.loginName,
                    objectTitle: obj.title,
                    permissionLevel: assignment.roles.map(r => r.name).join(", "),
                    assignmentType: assignment.assignmentType
                });
            }
        }
    }

    // Also include external users from groups
    for (const group of result.groups) {
        for (const user of group.users) {
            if (user.isExternal) {
                const exists = rows.find(
                    r => r.email === (user.email || user.loginName) && r.objectTitle === `Group: ${group.title}`
                );
                if (!exists) {
                    rows.push({
                        displayName: user.title,
                        email: user.email || user.loginName,
                        objectTitle: `Group: ${group.title}`,
                        permissionLevel: "Group Member",
                        assignmentType: "GroupBased"
                    });
                }
            }
        }
    }

    const columns: IColumn[] = [
        {
            key: "displayName",
            name: "Display Name",
            fieldName: "displayName",
            minWidth: 150,
            maxWidth: 200,
            isResizable: true
        },
        {
            key: "email",
            name: "Email / Login",
            fieldName: "email",
            minWidth: 200,
            maxWidth: 300,
            isResizable: true
        },
        {
            key: "objectTitle",
            name: "Object",
            fieldName: "objectTitle",
            minWidth: 150,
            maxWidth: 200,
            isResizable: true
        },
        {
            key: "permissionLevel",
            name: "Permission Level",
            fieldName: "permissionLevel",
            minWidth: 120,
            maxWidth: 180,
            isResizable: true
        },
        {
            key: "assignmentType",
            name: "Assignment Type",
            fieldName: "assignmentType",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true
        }
    ];

    return (
        <Stack
            styles={{
                root: {
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    border: "1px solid #edebe9",
                    marginBottom: 24
                }
            }}
            tokens={{ childrenGap: 12 }}
        >
            <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
                External Users ({rows.length})
            </Text>

            {rows.length === 0 ? (
                <Text variant="small" styles={{ root: { color: "#605e5c", fontStyle: "italic" } }}>
                    No external users detected.
                </Text>
            ) : (
                <DetailsList
                    items={rows}
                    columns={columns}
                    layoutMode={DetailsListLayoutMode.justified}
                    selectionMode={SelectionMode.none}
                    isHeaderVisible={true}
                    compact={true}
                />
            )}
        </Stack>
    );
};
