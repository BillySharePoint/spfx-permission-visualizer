export enum PrincipalType {
    User = "User",
    SharePointGroup = "SharePointGroup",
    SecurityGroup = "SecurityGroup",
    M365Group = "M365Group",
    Unknown = "Unknown"
}

export interface IPermissionPrincipal {
    id: number;
    title: string;
    loginName: string;
    email?: string;
    principalType: PrincipalType;
    isExternal: boolean;
    isSharePointGroup: boolean;
    isSecurityGroup: boolean;
    isM365Group: boolean;
}
