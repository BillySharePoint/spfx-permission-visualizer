import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { IPermissionObject } from "../../models";
import { PermissionTreeNode } from "./PermissionTreeNode";

export interface IPermissionTreeViewProps {
    objects: IPermissionObject[];
    onSelectObject: (object: IPermissionObject) => void;
    selectedObjectId?: string;
}

export const PermissionTreeView: React.FC<IPermissionTreeViewProps> = ({
    objects,
    onSelectObject,
    selectedObjectId
}) => {
    // Build hierarchy
    const rootObjects = objects.filter(o => !o.parentId || o.objectType === "Site");
    const childMap = new Map<string, IPermissionObject[]>();

    for (const obj of objects) {
        if (obj.parentId) {
            const children = childMap.get(obj.parentId) || [];
            children.push(obj);
            childMap.set(obj.parentId, children);
        }
    }

    return (
        <Stack
            styles={{
                root: {
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    border: "1px solid #edebe9",
                    marginBottom: 24,
                    maxHeight: 500,
                    overflowY: "auto"
                }
            }}
            tokens={{ childrenGap: 4 }}
        >
            <Text variant="mediumPlus" styles={{ root: { fontWeight: 600, marginBottom: 8 } }}>
                Permission Hierarchy
            </Text>
            {rootObjects.map(obj => (
                <PermissionTreeNode
                    key={obj.id}
                    object={obj}
                    childMap={childMap}
                    depth={0}
                    onSelect={onSelectObject}
                    selectedId={selectedObjectId}
                />
            ))}
        </Stack>
    );
};
