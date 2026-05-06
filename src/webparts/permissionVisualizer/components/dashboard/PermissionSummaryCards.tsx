import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Icon } from "@fluentui/react/lib/Icon";
import { IPermissionScanResult } from "../../models";

export interface IPermissionSummaryCardsProps {
    result: IPermissionScanResult;
}

interface ISummaryCard {
    title: string;
    value: number;
    iconName: string;
    color: string;
}

export const PermissionSummaryCards: React.FC<IPermissionSummaryCardsProps> = ({ result }) => {
    const cards: ISummaryCard[] = [
        {
            title: "Objects Scanned",
            value: result.totalObjectsScanned,
            iconName: "FabricFolder",
            color: "#0078d4"
        },
        {
            title: "Broken Inheritance",
            value: result.brokenInheritanceCount,
            iconName: "Warning",
            color: "#ffaa44"
        },
        {
            title: "External Users",
            value: result.externalUsersCount,
            iconName: "People",
            color: "#d13438"
        },
        {
            title: "Direct Assignments",
            value: result.directAssignmentsCount,
            iconName: "Contact",
            color: "#8764b8"
        },
        {
            title: "High Risk Findings",
            value: result.highRiskFindings,
            iconName: "ErrorBadge",
            color: "#d13438"
        },
        {
            title: "SharePoint Groups",
            value: result.groups.length,
            iconName: "Group",
            color: "#107c10"
        }
    ];

    return (
        <Stack horizontal wrap tokens={{ childrenGap: 16 }} styles={{ root: { marginBottom: 24 } }}>
            {cards.map((card, index) => (
                <Stack
                    key={index}
                    styles={{
                        root: {
                            padding: 16,
                            borderRadius: 8,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                            backgroundColor: "#ffffff",
                            minWidth: 150,
                            flex: "1 1 150px",
                            maxWidth: 200,
                            border: "1px solid #edebe9"
                        }
                    }}
                    tokens={{ childrenGap: 8 }}
                >
                    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                        <Icon
                            iconName={card.iconName}
                            styles={{ root: { fontSize: 20, color: card.color } }}
                        />
                        <Text variant="small" styles={{ root: { color: "#605e5c" } }}>
                            {card.title}
                        </Text>
                    </Stack>
                    <Text
                        variant="xxLarge"
                        styles={{ root: { fontWeight: 700, color: card.color } }}
                    >
                        {card.value}
                    </Text>
                </Stack>
            ))}
        </Stack>
    );
};
