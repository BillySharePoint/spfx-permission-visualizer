import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Icon } from "@fluentui/react/lib/Icon";
import { IPermissionFinding, FindingSeverity } from "../../models";

export interface IFindingCardProps {
    finding: IPermissionFinding;
}

function getSeverityColor(severity: FindingSeverity): string {
    switch (severity) {
        case "High":
            return "#d13438";
        case "Medium":
            return "#ffaa44";
        case "Low":
            return "#0078d4";
        case "Info":
            return "#605e5c";
        default:
            return "#605e5c";
    }
}

function getSeverityIcon(severity: FindingSeverity): string {
    switch (severity) {
        case "High":
            return "ErrorBadge";
        case "Medium":
            return "Warning";
        case "Low":
            return "Info";
        case "Info":
            return "Info";
        default:
            return "Info";
    }
}

export const FindingCard: React.FC<IFindingCardProps> = ({ finding }) => {
    const color = getSeverityColor(finding.severity);

    return (
        <Stack
            styles={{
                root: {
                    padding: 12,
                    borderRadius: 6,
                    border: `1px solid ${color}30`,
                    borderLeft: `4px solid ${color}`,
                    backgroundColor: `${color}08`
                }
            }}
            tokens={{ childrenGap: 6 }}
        >
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <Icon
                    iconName={getSeverityIcon(finding.severity)}
                    styles={{ root: { color, fontSize: 14 } }}
                />
                <Text variant="smallPlus" styles={{ root: { fontWeight: 600, flex: 1 } }}>
                    {finding.title}
                </Text>
                <Text
                    variant="tiny"
                    styles={{
                        root: {
                            padding: "2px 6px",
                            borderRadius: 4,
                            backgroundColor: `${color}20`,
                            color,
                            fontWeight: 600
                        }
                    }}
                >
                    {finding.severity}
                </Text>
            </Stack>

            <Text variant="small" styles={{ root: { color: "#323130" } }}>
                {finding.description}
            </Text>

            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                <Icon iconName="LightBulb" styles={{ root: { fontSize: 12, color: "#107c10" } }} />
                <Text variant="small" styles={{ root: { color: "#107c10", fontStyle: "italic" } }}>
                    {finding.recommendation}
                </Text>
            </Stack>

            <Text variant="tiny" styles={{ root: { color: "#605e5c" } }}>
                {finding.objectTitle} • {finding.category}
            </Text>
        </Stack>
    );
};
