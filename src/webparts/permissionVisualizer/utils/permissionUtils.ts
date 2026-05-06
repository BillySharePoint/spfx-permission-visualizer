import { PrincipalType, IPermissionPrincipal } from "../models";

/**
 * Maps SharePoint numeric principal type to our enum
 */
export function mapPrincipalType(value: number): PrincipalType {
    switch (value) {
        case 1:
            return PrincipalType.User;
        case 2:
            return PrincipalType.User; // Distribution list treated as user in some contexts
        case 4:
            return PrincipalType.SecurityGroup;
        case 8:
            return PrincipalType.SharePointGroup;
        default:
            return PrincipalType.Unknown;
    }
}

/**
 * Detects if a user is external based on login name or email patterns
 */
export function isExternalUser(loginName?: string, email?: string): boolean {
    const login = (loginName || "").toLowerCase();
    const mail = (email || "").toLowerCase();

    return (
        login.includes("#ext#") ||
        mail.includes("#ext#") ||
        login.includes("urn:spo:guest") ||
        (login.includes("membership|") && login.includes("#ext#"))
    );
}

/**
 * Determines if a principal represents a direct user assignment
 */
export function isDirectAssignment(principal: IPermissionPrincipal): boolean {
    return (
        principal.principalType === PrincipalType.User &&
        !principal.isSharePointGroup &&
        !principal.isSecurityGroup &&
        !principal.isM365Group
    );
}

/**
 * Creates an IPermissionPrincipal from raw SharePoint data
 */
export function mapPrincipal(rawMember: {
    Id: number;
    Title: string;
    LoginName: string;
    Email?: string;
    PrincipalType: number;
}): IPermissionPrincipal {
    const principalType = mapPrincipalType(rawMember.PrincipalType);
    const external = isExternalUser(rawMember.LoginName, rawMember.Email);

    return {
        id: rawMember.Id,
        title: rawMember.Title,
        loginName: rawMember.LoginName,
        email: rawMember.Email || undefined,
        principalType: principalType,
        isExternal: external,
        isSharePointGroup: principalType === PrincipalType.SharePointGroup,
        isSecurityGroup: principalType === PrincipalType.SecurityGroup,
        isM365Group: principalType === PrincipalType.M365Group
    };
}

/**
 * Generates a unique ID for permission objects
 */
export function generateObjectId(objectType: string, id: string | number): string {
    return `${objectType.toLowerCase()}-${id}`;
}
