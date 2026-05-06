export type FindingSeverity = "Info" | "Low" | "Medium" | "High";

export type FindingCategory =
    | "BrokenInheritance"
    | "ExternalAccess"
    | "DirectAssignment"
    | "OwnerRisk"
    | "AnonymousLink"
    | "SensitiveLibrary"
    | "LargeGroup"
    | "Unknown";

export interface IPermissionFinding {
    id: string;
    objectId: string;
    objectTitle: string;
    objectUrl: string;
    severity: FindingSeverity;
    category: FindingCategory;
    title: string;
    description: string;
    recommendation: string;
}
