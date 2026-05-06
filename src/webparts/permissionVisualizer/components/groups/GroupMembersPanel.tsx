import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Icon } from "@fluentui/react/lib/Icon";
import { ISharePointGroup } from "../../models";

export interface IGroupMembersPanelProps {
    group: ISharePointGroup;
}

export const GroupMembersPanel: React.FC<IGroupMembersPanelProps> = ({ group }) => {
    if (group.users.length === 0) {
        return (
            <Stack styles={{ root: { padding: "8px 12px 8px 36px" } }}>
                <Text variant="small" styles={{ root: { color: "#605e5c", fontStyle: "italic" } }}>
                    This group has no members.
                </Text>
            </Stack>
        );
    }

    return (
        <Stack
            styles={{ root: { padding: "8px 12px 8px 36px" } }}
            tokens={{ childrenGap: 4 }}
        >
            {group.ownerTitle && (
                <Text variant="tiny" styles={{ root: { color: "#605e5c", marginBottom: 4 } }}>
                    Owner: {group.ownerTitle}
                </Text>
            )}
            {group.users.map((user, index) => (
                <Stack
                    key={`${user.id}-${index}`}
                    horizontal
                    verticalAlign="center"
                    tokens={{ childrenGap: 8 }}
                    styles={{
                        root: {
                            padding: "4px 8px",
                            borderRadius: 4,
                            backgroundColor: user.isExternal ? "#d1343808" : "transparent"
                        }
                    }}
                >
                    <Icon
                        iconName={user.isExternal ? "People" : "Contact"}
                        styles={{
                            root: {
                                fontSize: 12,
                                color: user.isExternal ? "#d13438" : "#0078d4"
                            }
                        }}
                    />
                    <Text variant="small" styles={{ root: { flex: 1 } }}>
                        {user.title}
                    </Text>
                    <Text variant="tiny" styles={{ root: { color: "#605e5c" } }}>
                        {user.email || user.loginName}
                    </Text>
                    {user.isExternal && (
                        <Text
                            variant="tiny"
                            styles={{
                                root: {
                                    color: "#d13438",
                                    fontWeight: 600,
                                    padding: "1px 4px",
                                    borderRadius: 3,
                                    backgroundColor: "#d1343815"
                                }
                            }}
                        >
                            External
                        </Text>
                    )}
                </Stack>
            ))}
        </Stack>
    );
};
