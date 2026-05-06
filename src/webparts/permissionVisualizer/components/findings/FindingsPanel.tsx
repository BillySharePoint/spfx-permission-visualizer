import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { IPermissionFinding } from "../../models";
import { FindingCard } from "./FindingCard";

export interface IFindingsPanelProps {
    findings: IPermissionFinding[];
}

export const FindingsPanel: React.FC<IFindingsPanelProps> = ({ findings }) => {
    const [severityFilter, setSeverityFilter] = React.useState<string>("All");
    const [categoryFilter, setCategoryFilter] = React.useState<string>("All");

    const severityOptions: IDropdownOption[] = [
        { key: "All", text: "All Severities" },
        { key: "High", text: "High" },
        { key: "Medium", text: "Medium" },
        { key: "Low", text: "Low" },
        { key: "Info", text: "Info" }
    ];

    const categoryOptions: IDropdownOption[] = [
        { key: "All", text: "All Categories" },
        { key: "BrokenInheritance", text: "Broken Inheritance" },
        { key: "ExternalAccess", text: "External Access" },
        { key: "DirectAssignment", text: "Direct Assignment" },
        { key: "OwnerRisk", text: "Owner Risk" },
        { key: "AnonymousLink", text: "Anonymous Link" },
        { key: "SensitiveLibrary", text: "Sensitive Library" },
        { key: "LargeGroup", text: "Large Group" }
    ];

    const filteredFindings = findings.filter(f => {
        if (severityFilter !== "All" && f.severity !== severityFilter) return false;
        if (categoryFilter !== "All" && f.category !== categoryFilter) return false;
        return true;
    });

    return (
        <Stack
            styles={{
                root: {
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    border: "1px solid #edebe9",
                    marginBottom: 24
                }
            }}
            tokens={{ childrenGap: 12 }}
        >
            <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
                Findings & Recommendations ({findings.length})
            </Text>

            <Stack horizontal tokens={{ childrenGap: 12 }}>
                <Dropdown
                    placeholder="Filter by severity"
                    options={severityOptions}
                    selectedKey={severityFilter}
                    onChange={(_, option) => setSeverityFilter(option?.key as string || "All")}
                    styles={{ root: { width: 180 } }}
                />
                <Dropdown
                    placeholder="Filter by category"
                    options={categoryOptions}
                    selectedKey={categoryFilter}
                    onChange={(_, option) => setCategoryFilter(option?.key as string || "All")}
                    styles={{ root: { width: 200 } }}
                />
            </Stack>

            <Stack tokens={{ childrenGap: 8 }}>
                {filteredFindings.length === 0 ? (
                    <Text variant="small" styles={{ root: { color: "#605e5c", fontStyle: "italic" } }}>
                        No findings match the current filters.
                    </Text>
                ) : (
                    filteredFindings.map(finding => (
                        <FindingCard key={finding.id} finding={finding} />
                    ))
                )}
            </Stack>
        </Stack>
    );
};
