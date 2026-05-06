import * as React from "react";
import {
    DetailsList,
    DetailsListLayoutMode,
    IColumn,
    SelectionMode
} from "@fluentui/react/lib/DetailsList";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Link } from "@fluentui/react/lib/Link";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { IPermissionObject } from "../../models";
import { RiskBadge } from "../common/RiskBadge";
import { formatDate } from "../../utils/dateUtils";

export interface IPermissionObjectsTableProps {
    objects: IPermissionObject[];
    onSelectObject?: (object: IPermissionObject) => void;
}

export const PermissionObjectsTable: React.FC<IPermissionObjectsTableProps> = ({
    objects,
    onSelectObject
}) => {
    const [searchText, setSearchText] = React.useState("");

    const filteredObjects = objects.filter(o =>
        o.title.toLowerCase().includes(searchText.toLowerCase()) ||
        o.url.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: IColumn[] = [
        {
            key: "title",
            name: "Title",
            fieldName: "title",
            minWidth: 150,
            maxWidth: 250,
            isResizable: true,
            onRender: (item: IPermissionObject) => (
                <Link onClick={() => onSelectObject && onSelectObject(item)}>
                    {item.title}
                </Link>
            )
        },
        {
            key: "type",
            name: "Type",
            fieldName: "objectType",
            minWidth: 70,
            maxWidth: 90,
            isResizable: true
        },
        {
            key: "inheritance",
            name: "Inheritance",
            minWidth: 90,
            maxWidth: 120,
            isResizable: true,
            onRender: (item: IPermissionObject) => (
                <Text variant="small">
                    {item.hasUniqueRoleAssignments ? "🔒 Unique" : "✓ Inherited"}
                </Text>
            )
        },
        {
            key: "external",
            name: "External Users",
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            onRender: (item: IPermissionObject) => (
                <Text
                    variant="small"
                    styles={{
                        root: { color: item.externalUsers.length > 0 ? "#d13438" : "#605e5c" }
                    }}
                >
                    {item.externalUsers.length}
                </Text>
            )
        },
        {
            key: "direct",
            name: "Direct Assigns",
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            onRender: (item: IPermissionObject) => (
                <Text variant="small">{item.directAssignments.length}</Text>
            )
        },
        {
            key: "risk",
            name: "Risk",
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            onRender: (item: IPermissionObject) => (
                <RiskBadge level={item.riskLevel} score={item.riskScore} />
            )
        },
        {
            key: "findings",
            name: "Findings",
            minWidth: 60,
            maxWidth: 80,
            isResizable: true,
            onRender: (item: IPermissionObject) => (
                <Text variant="small">{item.findings.length}</Text>
            )
        },
        {
            key: "lastModified",
            name: "Last Modified",
            minWidth: 100,
            maxWidth: 120,
            isResizable: true,
            onRender: (item: IPermissionObject) => (
                <Text variant="small">{formatDate(item.lastModified)}</Text>
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
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
                    Permission Objects ({objects.length})
                </Text>
                <SearchBox
                    placeholder="Search by title or URL..."
                    value={searchText}
                    onChange={(_, newValue) => setSearchText(newValue || "")}
                    styles={{ root: { width: 250 } }}
                />
            </Stack>

            <DetailsList
                items={filteredObjects}
                columns={columns}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
                isHeaderVisible={true}
                compact={true}
            />
        </Stack>
    );
};
