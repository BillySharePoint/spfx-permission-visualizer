export const RISK_THRESHOLDS = {
    LOW_MAX: 24,
    MEDIUM_MAX: 59
};

export const RISK_POINTS = {
    UNIQUE_PERMISSIONS: 30,
    EXTERNAL_USERS: 25,
    DIRECT_ASSIGNMENTS: 20,
    ANONYMOUS_LINK: 20,
    BROKEN_INHERITANCE_CHILD: 15,
    NO_OWNER: 15,
    TOO_MANY_OWNERS: 10,
    LARGE_GROUP_BROAD_ACCESS: 10,
    FULL_CONTROL_OUTSIDE_OWNERS: 10,
    EDIT_CONTRIBUTE_BROADLY: 5
};

export const RISK_RULES = {
    UNIQUE_PERMISSIONS: {
        rule: "UniquePermissions",
        points: RISK_POINTS.UNIQUE_PERMISSIONS,
        description: "Object has unique permissions (broken inheritance)"
    },
    EXTERNAL_USERS: {
        rule: "ExternalUsers",
        points: RISK_POINTS.EXTERNAL_USERS,
        description: "External users have access to this object"
    },
    DIRECT_ASSIGNMENTS: {
        rule: "DirectAssignments",
        points: RISK_POINTS.DIRECT_ASSIGNMENTS,
        description: "Users are assigned directly instead of through groups"
    },
    ANONYMOUS_LINK: {
        rule: "AnonymousLink",
        points: RISK_POINTS.ANONYMOUS_LINK,
        description: "Anonymous or anyone link detected"
    },
    BROKEN_INHERITANCE_CHILD: {
        rule: "BrokenInheritanceChild",
        points: RISK_POINTS.BROKEN_INHERITANCE_CHILD,
        description: "Item or folder has broken inheritance from its parent"
    },
    NO_OWNER: {
        rule: "NoOwner",
        points: RISK_POINTS.NO_OWNER,
        description: "Owner count is zero or cannot be detected"
    },
    TOO_MANY_OWNERS: {
        rule: "TooManyOwners",
        points: RISK_POINTS.TOO_MANY_OWNERS,
        description: "More than 10 owners detected"
    },
    LARGE_GROUP_BROAD_ACCESS: {
        rule: "LargeGroupBroadAccess",
        points: RISK_POINTS.LARGE_GROUP_BROAD_ACCESS,
        description: "Large SharePoint group has broad access"
    },
    FULL_CONTROL_OUTSIDE_OWNERS: {
        rule: "FullControlOutsideOwners",
        points: RISK_POINTS.FULL_CONTROL_OUTSIDE_OWNERS,
        description: "Full Control assigned to principals outside the Owners group"
    },
    EDIT_CONTRIBUTE_BROADLY: {
        rule: "EditContributeBroadly",
        points: RISK_POINTS.EDIT_CONTRIBUTE_BROADLY,
        description: "Edit or Contribute permission assigned broadly"
    }
};
