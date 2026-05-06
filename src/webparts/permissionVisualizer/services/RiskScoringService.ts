import {
    IPermissionObject,
    IPermissionFinding,
    IRiskScore,
    IRiskFactor,
    RiskLevel
} from "../models";
import { RISK_RULES } from "../constants/riskRules";
import { getRiskLevel } from "../utils/riskUtils";
import { PERMISSION_LEVELS } from "../constants/permissionLevels";

export class RiskScoringService {
    /**
     * Calculates a risk score for an object based on its permission state
     */
    public scoreObject(object: IPermissionObject): IRiskScore {
        const factors: IRiskFactor[] = [];
        let score = 0;

        // Unique permissions (broken inheritance)
        if (object.hasUniqueRoleAssignments && object.objectType !== "Site") {
            factors.push(RISK_RULES.UNIQUE_PERMISSIONS);
            score += RISK_RULES.UNIQUE_PERMISSIONS.points;
        }

        // External users
        if (object.externalUsers.length > 0) {
            factors.push(RISK_RULES.EXTERNAL_USERS);
            score += RISK_RULES.EXTERNAL_USERS.points;
        }

        // Direct assignments
        if (object.directAssignments.length > 0) {
            factors.push(RISK_RULES.DIRECT_ASSIGNMENTS);
            score += RISK_RULES.DIRECT_ASSIGNMENTS.points;
        }

        // Full Control outside Owners group
        const fullControlNonOwners = object.permissionAssignments.filter(
            a =>
                a.roles.some(r => r.name === PERMISSION_LEVELS.FULL_CONTROL) &&
                !a.principal.title.toLowerCase().includes("owner")
        );
        if (fullControlNonOwners.length > 0) {
            factors.push(RISK_RULES.FULL_CONTROL_OUTSIDE_OWNERS);
            score += RISK_RULES.FULL_CONTROL_OUTSIDE_OWNERS.points;
        }

        // Edit/Contribute broadly
        const editAssignments = object.permissionAssignments.filter(a =>
            a.roles.some(
                r =>
                    r.name === PERMISSION_LEVELS.EDIT ||
                    r.name === PERMISSION_LEVELS.CONTRIBUTE
            )
        );
        if (editAssignments.length > 3) {
            factors.push(RISK_RULES.EDIT_CONTRIBUTE_BROADLY);
            score += RISK_RULES.EDIT_CONTRIBUTE_BROADLY.points;
        }

        const level: RiskLevel = getRiskLevel(score);

        return { score, level, factors };
    }

    /**
     * Generates findings for an object
     */
    public generateFindings(object: IPermissionObject): IPermissionFinding[] {
        const findings: IPermissionFinding[] = [];

        // Broken inheritance finding
        if (object.hasUniqueRoleAssignments && object.objectType !== "Site") {
            findings.push({
                id: `finding-broken-${object.id}`,
                objectId: object.id,
                objectTitle: object.title,
                objectUrl: object.url,
                severity: "Medium",
                category: "BrokenInheritance",
                title: "Broken permission inheritance",
                description:
                    "This object does not inherit permissions from its parent. It has unique permissions that are managed separately.",
                recommendation:
                    "Review whether unique permissions are still required. Reinherit permissions where possible to reduce administrative complexity."
            });
        }

        // External user findings
        if (object.externalUsers.length > 0) {
            findings.push({
                id: `finding-external-${object.id}`,
                objectId: object.id,
                objectTitle: object.title,
                objectUrl: object.url,
                severity: "High",
                category: "ExternalAccess",
                title: `External users detected (${object.externalUsers.length})`,
                description: `${object.externalUsers.length} external user(s) have access to this object. External users are people outside your organization.`,
                recommendation:
                    "Verify that external access is still required and appropriate. Remove external users who no longer need access."
            });
        }

        // Direct assignment findings
        if (object.directAssignments.length > 0) {
            findings.push({
                id: `finding-direct-${object.id}`,
                objectId: object.id,
                objectTitle: object.title,
                objectUrl: object.url,
                severity: "Low",
                category: "DirectAssignment",
                title: `Direct user permission assignments (${object.directAssignments.length})`,
                description:
                    "This object grants permissions directly to one or more users instead of using a SharePoint or security group.",
                recommendation:
                    "Review whether direct access is required. Prefer group-based permissions for easier administration."
            });
        }

        // Full Control outside Owners
        const fullControlNonOwners = object.permissionAssignments.filter(
            a =>
                a.roles.some(r => r.name === PERMISSION_LEVELS.FULL_CONTROL) &&
                !a.principal.title.toLowerCase().includes("owner")
        );
        if (fullControlNonOwners.length > 0) {
            findings.push({
                id: `finding-fullcontrol-${object.id}`,
                objectId: object.id,
                objectTitle: object.title,
                objectUrl: object.url,
                severity: "Medium",
                category: "OwnerRisk",
                title: "Full Control assigned outside Owners group",
                description: `${fullControlNonOwners.length} principal(s) have Full Control on this object but are not in the Owners group.`,
                recommendation:
                    "Review whether Full Control is required. Consider using Edit or Contribute instead to reduce risk."
            });
        }

        return findings;
    }
}
