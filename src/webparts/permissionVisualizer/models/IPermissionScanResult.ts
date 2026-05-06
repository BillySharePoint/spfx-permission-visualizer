import { IPermissionObject } from "./IPermissionObject";
import { IPermissionFinding } from "./IPermissionFinding";
import { ISharePointGroup } from "./ISharePointGroup";

export interface IScanWarning {
    source: string;
    message: string;
    details?: string;
}

export interface IPermissionScanResult {
    siteUrl: string;
    scannedAt: string;
    scanDurationMs: number;
    totalObjectsScanned: number;
    totalFindings: number;
    highRiskFindings: number;
    mediumRiskFindings: number;
    lowRiskFindings: number;
    externalUsersCount: number;
    directAssignmentsCount: number;
    brokenInheritanceCount: number;
    objects: IPermissionObject[];
    findings: IPermissionFinding[];
    groups: ISharePointGroup[];
    warnings: IScanWarning[];
}
