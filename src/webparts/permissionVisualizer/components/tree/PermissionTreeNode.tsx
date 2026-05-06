import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Icon } from "@fluentui/react/lib/Icon";
import { Text } from "@fluentui/react/lib/Text";
import { IPermissionObject, ObjectType } from "../../models";
import { RiskBadge } from "../common/RiskBadge";

export interface IPermissionTreeNodeProps {
    object: IPermissionObject;
    childMap: Map<string, IPermissionObject[]>;
    depth: number;
    onSelect: (object: IPermissionObject) => void;
    selectedId?: string;
}

function getObjectIcon(objectType: ObjectType): string {
    switch (objectType) {
        case "Site":
            return "Globe";
        case "Library":
            return "DocLibrary";
        case "List":
            return "BulletedList";
        case "Folder":
            return "FabricFolder";
        case "Item":
            return "Page";
        default:
            return "Document";
    }
}

export const PermissionTreeNode: React.FC<IPermissionTreeNodeProps> = ({
    object,
    childMap,
    depth,
    onSelect,
    selectedId
}) => {
    const [expanded, setExpanded] = React.useState(depth < 1);
    const children = childMap.get(object.id) || [];
    const hasChildren = children.length > 0;
    const isSelected = selectedId === object.id;

    return (
        <Stack>
            <Stack
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: 6 }}
                styles={{
                    root: {
                        padding: "4px 8px",
                        paddingLeft: depth * 20 + 8,
                        cursor: "pointer",
                        borderRadius: 4,
                        backgroundColor: isSelected ? "#deecf9" : "transparent",
                        ":hover": {
                            backgroundColor: isSelected ? "#deecf9" : "#f3f2f1"
                        }
                    }
                }}
                onClick={() => onSelect(object)}
            >
                {hasChildren ? (
                    <Icon
                        iconName={expanded ? "ChevronDown" : "ChevronRight"}
                        styles={{ root: { fontSize: 10, cursor: "pointer", width: 12 } }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                        }}
                    />
                ) : (
                    <span style={{ width: 12 }} />
                )}

                <Icon
                    iconName={getObjectIcon(object.objectType)}
                    styles={{ root: { fontSize: 14, color: "#0078d4" } }}
                />

                <Text variant="small" styles={{ root: { flex: 1 } }}>
                    {object.title}
                </Text>

                {object.hasUniqueRoleAssignments && object.objectType !== "Site" && (
                    <Icon
                        iconName="LockSolid"
                        styles={{ root: { fontSize: 12, color: "#ffaa44" } }}
                        title="Unique permissions"
                    />
                )}

                {object.externalUsers.length > 0 && (
                    <Icon
                        iconName="People"
                        styles={{ root: { fontSize: 12, color: "#d13438" } }}
                        title={`${object.externalUsers.length} external user(s)`}
                    />
                )}

                {object.directAssignments.length > 0 && (
                    <Icon
                        iconName="Contact"
                        styles={{ root: { fontSize: 12, color: "#8764b8" } }}
                        title={`${object.directAssignments.length} direct assignment(s)`}
                    />
                )}

                <RiskBadge level={object.riskLevel} showLabel={false} />
            </Stack>

            {expanded &&
                hasChildren &&
                children.map(child => (
                    <PermissionTreeNode
                        key={child.id}
                        object={child}
                        childMap={childMap}
                        depth={depth + 1}
                        onSelect={onSelect}
                        selectedId={selectedId}
                    />
                ))}
        </Stack>
    );
};
