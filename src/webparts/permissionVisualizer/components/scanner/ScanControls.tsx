import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Toggle } from "@fluentui/react/lib/Toggle";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { Text } from "@fluentui/react/lib/Text";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { IScanOptions } from "../../models";

export interface IScanControlsProps {
    options: IScanOptions;
    onOptionsChange: (options: IScanOptions) => void;
    onStartScan: () => void;
    onReset: () => void;
    isScanning: boolean;
    siteUrl?: string;
}

export const ScanControls: React.FC<IScanControlsProps> = ({
    options,
    onOptionsChange,
    onStartScan,
    onReset,
    isScanning,
    siteUrl
}) => {
    const updateOption = (key: keyof IScanOptions, value: boolean): void => {
        onOptionsChange({ ...options, [key]: value });
    };

    return (
        <Stack tokens={{ childrenGap: 16 }} styles={{ root: { marginBottom: 24 } }}>
            <Stack
                styles={{
                    root: {
                        padding: 20,
                        borderRadius: 8,
                        backgroundColor: "#ffffff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        border: "1px solid #edebe9"
                    }
                }}
                tokens={{ childrenGap: 12 }}
            >
                <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
                    Scan Options
                </Text>

                {siteUrl && (
                    <Text variant="small" styles={{ root: { color: "#605e5c" } }}>
                        Current site: {siteUrl}
                    </Text>
                )}

                <Stack horizontal wrap tokens={{ childrenGap: 24 }}>
                    <Stack tokens={{ childrenGap: 8 }} styles={{ root: { minWidth: 200 } }}>
                        <Toggle
                            label="Scan site permissions"
                            checked={options.scanSitePermissions}
                            onChange={(_, checked) => updateOption("scanSitePermissions", !!checked)}
                            disabled={isScanning}
                        />
                        <Toggle
                            label="Scan lists and libraries"
                            checked={options.scanListsAndLibraries}
                            onChange={(_, checked) => updateOption("scanListsAndLibraries", !!checked)}
                            disabled={isScanning}
                        />
                        <Toggle
                            label="Include folders"
                            checked={options.includeFolders}
                            onChange={(_, checked) => updateOption("includeFolders", !!checked)}
                            disabled={isScanning}
                        />
                        <Toggle
                            label="Include list items"
                            checked={options.includeItems}
                            onChange={(_, checked) => updateOption("includeItems", !!checked)}
                            disabled={isScanning}
                        />
                    </Stack>
                    <Stack tokens={{ childrenGap: 8 }} styles={{ root: { minWidth: 200 } }}>
                        <Toggle
                            label="Detect external users"
                            checked={options.detectExternalUsers}
                            onChange={(_, checked) => updateOption("detectExternalUsers", !!checked)}
                            disabled={isScanning}
                        />
                        <Toggle
                            label="Detect direct assignments"
                            checked={options.detectDirectAssignments}
                            onChange={(_, checked) => updateOption("detectDirectAssignments", !!checked)}
                            disabled={isScanning}
                        />
                        <Toggle
                            label="Include hidden lists"
                            checked={options.includeHiddenLists}
                            onChange={(_, checked) => updateOption("includeHiddenLists", !!checked)}
                            disabled={isScanning}
                        />
                        <Toggle
                            label="Use demo data"
                            checked={options.useMockData}
                            onChange={(_, checked) => updateOption("useMockData", !!checked)}
                            disabled={isScanning}
                        />
                    </Stack>
                </Stack>

                {options.includeItems && (
                    <MessageBar messageBarType={MessageBarType.warning}>
                        Item-level scanning may take longer on large libraries. Use it only when you need
                        deep permission analysis.
                    </MessageBar>
                )}

                <Stack horizontal tokens={{ childrenGap: 12 }}>
                    <PrimaryButton
                        text={isScanning ? "Scanning..." : "Start Scan"}
                        onClick={onStartScan}
                        disabled={isScanning}
                        iconProps={{ iconName: "Search" }}
                    />
                    <DefaultButton
                        text="Reset"
                        onClick={onReset}
                        disabled={isScanning}
                        iconProps={{ iconName: "Refresh" }}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
};
