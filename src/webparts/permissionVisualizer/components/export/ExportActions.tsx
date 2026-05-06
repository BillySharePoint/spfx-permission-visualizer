import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { IPermissionScanResult } from "../../models";
import { CsvExportService } from "../../services/CsvExportService";

export interface IExportActionsProps {
    result: IPermissionScanResult;
}

export const ExportActions: React.FC<IExportActionsProps> = ({ result }) => {
    const exportService = React.useMemo(() => new CsvExportService(), []);

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
                Export Data
            </Text>

            <Stack horizontal wrap tokens={{ childrenGap: 8 }}>
                <DefaultButton
                    text="Export Objects"
                    iconProps={{ iconName: "Download" }}
                    onClick={() => exportService.exportObjects(result)}
                />
                <DefaultButton
                    text="Export Findings"
                    iconProps={{ iconName: "Download" }}
                    onClick={() => exportService.exportFindings(result)}
                />
                <DefaultButton
                    text="Export External Users"
                    iconProps={{ iconName: "Download" }}
                    onClick={() => exportService.exportExternalUsers(result)}
                />
                <DefaultButton
                    text="Export Direct Assignments"
                    iconProps={{ iconName: "Download" }}
                    onClick={() => exportService.exportDirectAssignments(result)}
                />
                <DefaultButton
                    text="Export Groups"
                    iconProps={{ iconName: "Download" }}
                    onClick={() => exportService.exportGroups(result)}
                />
            </Stack>
        </Stack>
    );
};
