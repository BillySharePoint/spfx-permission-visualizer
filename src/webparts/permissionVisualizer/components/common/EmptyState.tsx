import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Icon } from "@fluentui/react/lib/Icon";

export interface IEmptyStateProps {
    title?: string;
    message: string;
    iconName?: string;
}

export const EmptyState: React.FC<IEmptyStateProps> = ({ title, message, iconName }) => {
    return (
        <Stack
            horizontalAlign="center"
            verticalAlign="center"
            tokens={{ childrenGap: 12 }}
            styles={{ root: { padding: 40, textAlign: "center" } }}
        >
            {iconName && (
                <Icon
                    iconName={iconName}
                    styles={{ root: { fontSize: 48, color: "#605e5c" } }}
                />
            )}
            {title && (
                <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
                    {title}
                </Text>
            )}
            <Text variant="medium" styles={{ root: { color: "#605e5c", maxWidth: 400 } }}>
                {message}
            </Text>
        </Stack>
    );
};
