import { IPermissionPrincipal } from "./IPermissionPrincipal";
import { IPermissionFinding } from "./IPermissionFinding";

export interface IPermissionRole {
    id: number;
    name: string;
    description?: string;
    hidden?: boolean;
    order?: number;
}

export interface IPermissionAssignment {
    principal: IPermissionPrincipal;
    roles: IPermissionRole[];
    assignmentType: "GroupBased" | "Direct" | "Inherited" | "Unknown";
}

export type ObjectType = "Site" | "List" | "Library" | "Folder" | "Item";
export type RiskLevel = "Low" | "Medium" | "High";

export interface IPermissionObject {
    id: string;
    title: string;
    url: string;
    objectType: ObjectType;
    parentId?: string;
    hasUniqueRoleAssignments: boolean;
    inheritsPermissions: boolean;
    permissionAssignments: IPermissionAssignment[];
    externalUsers: IPermissionPrincipal[];
    directAssignments: IPermissionAssignment[];
    riskLevel: RiskLevel;
    riskScore: number;
    findings: IPermissionFinding[];
    itemCount?: number;
    lastModified?: string;
}
