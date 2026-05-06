import * as React from "react";
import { Icon } from "@fluentui/react/lib/Icon";
import { RiskLevel } from "../../models";
import { getRiskColor, getRiskIcon } from "../../utils/riskUtils";

export interface IRiskBadgeProps {
    level: RiskLevel;
    showLabel?: boolean;
    score?: number;
}

export const RiskBadge: React.FC<IRiskBadgeProps> = ({ level, showLabel = true, score }) => {
    const color = getRiskColor(level);
    const iconName = getRiskIcon(level);

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                color: color,
                backgroundColor: `${color}15`,
                border: `1px solid ${color}30`
            }}
        >
            <Icon iconName={iconName} styles={{ root: { fontSize: 12, color } }} />
            {showLabel && <span>{level}</span>}
            {score !== undefined && <span>({score})</span>}
        </span>
    );
};
