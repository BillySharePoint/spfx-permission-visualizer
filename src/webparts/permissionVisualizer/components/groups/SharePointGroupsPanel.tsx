import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Icon } from "@fluentui/react/lib/Icon";
import { ISharePointGroup } from "../../models";
import { GroupMembersPanel } from "./GroupMembersPanel";

export interface ISharePointGroupsPanelProps {
    groups: ISharePointGroup[];
}

export const SharePointGroupsPanel: React.FC<ISharePointGroupsPanelProps> = ({ groups }) => {
    const [expandedGroupId, setExpandedGroupId] = React.useState<number | null>(null);

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
                SharePoint Groups ({groups.length})
            </Text>

            <Stack tokens={{ childrenGap: 8 }}>
                {groups.map(group => {
                    const hasExternalUsers = group.users.some(u => u.isExternal);
                    const isExpanded = expandedGroupId === group.id;
                    const externalCount = group.users.filter(u => u.isExternal).length;

                    return (
                        <Stack key={group.id}>
                            <Stack
                                horizontal
                                verticalAlign="center"
                                tokens={{ childrenGap: 10 }}
                                styles={{
                                    root: {
                                        padding: "8px 12px",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                        backgroundColor: isExpanded ? "#f3f2f1" : "transparent",
                                        border: "1px solid #edebe9",
                                        ":hover": { backgroundColor: "#f3f2f1" }
                                    }
                                }}
                                onClick={() => setExpandedGroupId(isExpanded ? null : group.id)}
                            >
                                <Icon
                                    iconName={isExpanded ? "ChevronDown" : "ChevronRight"}
                                    styles={{ root: { fontSize: 10 } }}
                                />
                                <Icon
                                    iconName="Group"
                                    styles={{ root: { fontSize: 16, color: "#0078d4" } }}
                                />
                                <Stack styles={{ root: { flex: 1 } }}>
                                    <Text variant="smallPlus" styles={{ root: { fontWeight: 600 } }}>
                                        {group.title}
                                    </Text>
                                    {group.description && (
                                        <Text variant="tiny" styles={{ root: { color: "#605e5c" } }}>
                                            {group.description}
                                        </Text>
                                    )}
                                </Stack>
                                <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                                    <Text variant="tiny" styles={{ root: { color: "#605e5c" } }}>
                                        {group.usersCount} member{group.usersCount !== 1 ? "s" : ""}
                                    </Text>
                                    {hasExternalUsers && (
                                        <Stack
                                            horizontal
                                            verticalAlign="center"
                                            tokens={{ childrenGap: 4 }}
                                            styles={{
                                                root: {
                                                    padding: "2px 6px",
                                                    borderRadius: 4,
                                                    backgroundColor: "#d1343815",
                                                    border: "1px solid #d1343830"
                                                }
                                            }}
                                        >
                                            <Icon
                                                iconName="People"
                                                styles={{ root: { fontSize: 10, color: "#d13438" } }}
                                            />
                                            <Text
                                                variant="tiny"
                                                styles={{ root: { color: "#d13438", fontWeight: 600 } }}
                                            >
                                                {externalCount} external
                                            </Text>
                                        </Stack>
                                    )}
                                    {group.usersCount === 0 && (
                                        <Stack
                                            horizontal
                                            verticalAlign="center"
                                            tokens={{ childrenGap: 4 }}
                                            styles={{
                                                root: {
                                                    padding: "2px 6px",
                                                    borderRadius: 4,
                                                    backgroundColor: "#ffaa4415",
                                                    border: "1px solid #ffaa4430"
                                                }
                                            }}
                                        >
                                            <Icon
                                                iconName="Warning"
                                                styles={{ root: { fontSize: 10, color: "#ffaa44" } }}
                                            />
                                            <Text
                                                variant="tiny"
                                                styles={{ root: { color: "#ffaa44", fontWeight: 600 } }}
                                            >
                                                Empty
                                            </Text>
                                        </Stack>
                                    )}
                                </Stack>
                            </Stack>

                            {isExpanded && <GroupMembersPanel group={group} />}
                        </Stack>
                    );
                })}
            </Stack>
        </Stack>
    );
};
