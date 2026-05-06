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
import { RiskBadge } from "../common/RiskBadge";

interface IDirectAssignmentRow {
    user: string;
    email: string;
    objectTitle: string;
    permissionLevel: string;
    riskLevel: "Low" | "Medium" | "High";
}

export interface IDirectAssignmentsTableProps {
    result: IPermissionScanResult;
}

export const DirectAssignmentsTable: React.FC<IDirectAssignmentsTableProps> = ({ result }) => {
    const rows: IDirectAssignmentRow[] = [];

    for (const obj of result.objects) {
        for (const assignment of obj.directAssignments) {
            rows.push({
                user: assignment.principal.title,
                email: assignment.principal.email || assignment.principal.loginName,
                objectTitle: obj.title,
                permissionLevel: assignment.roles.map(r => r.name).join(", "),
                riskLevel: obj.riskLevel
            });
        }
    }

    const columns: IColumn[] = [
        {
            key: "user",
            name: "User",
            fieldName: "user",
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
            key: "riskLevel",
            name: "Risk Level",
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            onRender: (item: IDirectAssignmentRow) => (
                <RiskBadge level={item.riskLevel} />
            )
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
                Direct User Assignments ({rows.length})
            </Text>

            {rows.length === 0 ? (
                <Text variant="small" styles={{ root: { color: "#605e5c", fontStyle: "italic" } }}>
                    No direct user assignments detected.
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
