import { RiskLevel } from "../models";
import { RISK_THRESHOLDS } from "../constants/riskRules";

/**
 * Determines risk level from a numeric score
 */
export function getRiskLevel(score: number): RiskLevel {
    if (score <= RISK_THRESHOLDS.LOW_MAX) return "Low";
    if (score <= RISK_THRESHOLDS.MEDIUM_MAX) return "Medium";
    return "High";
}

/**
 * Returns semantic color for a risk level
 */
export function getRiskColor(level: RiskLevel): string {
    switch (level) {
        case "Low":
            return "#107c10"; // green
        case "Medium":
            return "#ffaa44"; // orange
        case "High":
            return "#d13438"; // red
        default:
            return "#605e5c"; // neutral
    }
}

/**
 * Returns icon name for a risk level
 */
export function getRiskIcon(level: RiskLevel): string {
    switch (level) {
        case "Low":
            return "SkypeCircleCheck";
        case "Medium":
            return "Warning";
        case "High":
            return "ErrorBadge";
        default:
            return "Info";
    }
}
