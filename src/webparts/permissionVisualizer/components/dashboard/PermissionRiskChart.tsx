import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { IPermissionScanResult } from "../../models";
import { getRiskColor } from "../../utils/riskUtils";

export interface IPermissionRiskChartProps {
    result: IPermissionScanResult;
}

export const PermissionRiskChart: React.FC<IPermissionRiskChartProps> = ({ result }) => {
    const lowCount = result.objects.filter(o => o.riskLevel === "Low").length;
    const mediumCount = result.objects.filter(o => o.riskLevel === "Medium").length;
    const highCount = result.objects.filter(o => o.riskLevel === "High").length;
    const total = result.objects.length || 1;

    const lowPct = Math.round((lowCount / total) * 100);
    const mediumPct = Math.round((mediumCount / total) * 100);
    const highPct = Math.round((highCount / total) * 100);

    return (
        <Stack
            styles={{
                root: {
                    padding: 16,
                    borderRadius: 8,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    backgroundColor: "#ffffff",
                    border: "1px solid #edebe9",
                    marginBottom: 24
                }
            }}
            tokens={{ childrenGap: 12 }}
        >
            <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
                Risk Distribution
            </Text>

            {/* Bar chart */}
            <Stack horizontal styles={{ root: { height: 24, borderRadius: 4, overflow: "hidden" } }}>
                {lowCount > 0 && (
                    <div
                        style={{
                            width: `${lowPct}%`,
                            backgroundColor: getRiskColor("Low"),
                            height: "100%",
                            minWidth: lowCount > 0 ? 20 : 0
                        }}
                    />
                )}
                {mediumCount > 0 && (
                    <div
                        style={{
                            width: `${mediumPct}%`,
                            backgroundColor: getRiskColor("Medium"),
                            height: "100%",
                            minWidth: mediumCount > 0 ? 20 : 0
                        }}
                    />
                )}
                {highCount > 0 && (
                    <div
                        style={{
                            width: `${highPct}%`,
                            backgroundColor: getRiskColor("High"),
                            height: "100%",
                            minWidth: highCount > 0 ? 20 : 0
                        }}
                    />
                )}
            </Stack>

            {/* Legend */}
            <Stack horizontal tokens={{ childrenGap: 24 }}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 2,
                            backgroundColor: getRiskColor("Low")
                        }}
                    />
                    <Text variant="small">Low: {lowCount}</Text>
                </Stack>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 2,
                            backgroundColor: getRiskColor("Medium")
                        }}
                    />
                    <Text variant="small">Medium: {mediumCount}</Text>
                </Stack>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 2,
                            backgroundColor: getRiskColor("High")
                        }}
                    />
                    <Text variant="small">High: {highCount}</Text>
                </Stack>
            </Stack>
        </Stack>
    );
};
