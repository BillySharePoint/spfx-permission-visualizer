import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { Text } from "@fluentui/react/lib/Text";
import { ProgressIndicator } from "@fluentui/react/lib/ProgressIndicator";

export interface IScanProgressProps {
    message: string;
    isScanning: boolean;
}

export const ScanProgress: React.FC<IScanProgressProps> = ({ message, isScanning }) => {
    if (!isScanning) return null;

    return (
        <Stack
            tokens={{ childrenGap: 12 }}
            styles={{
                root: {
                    padding: 20,
                    borderRadius: 8,
                    backgroundColor: "#f3f2f1",
                    marginBottom: 24
                }
            }}
        >
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
                <Spinner size={SpinnerSize.medium} />
                <Text variant="medium">{message || "Scanning..."}</Text>
            </Stack>
            <ProgressIndicator />
        </Stack>
    );
};
