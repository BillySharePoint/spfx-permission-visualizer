import { RiskLevel } from "./IPermissionObject";

export interface IRiskScore {
    score: number;
    level: RiskLevel;
    factors: IRiskFactor[];
}

export interface IRiskFactor {
    rule: string;
    points: number;
    description: string;
}
