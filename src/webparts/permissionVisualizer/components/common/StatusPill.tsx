import * as React from "react";

export interface IStatusPillProps {
    label: string;
    color: string;
    backgroundColor?: string;
}

export const StatusPill: React.FC<IStatusPillProps> = ({ label, color, backgroundColor }) => {
    const bgColor = backgroundColor || `${color}15`;

    return (
        <span
            style={{
                display: "inline-block",
                padding: "2px 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                color: color,
                backgroundColor: bgColor,
                border: `1px solid ${color}40`,
                whiteSpace: "nowrap"
            }}
        >
            {label}
        </span>
    );
};
