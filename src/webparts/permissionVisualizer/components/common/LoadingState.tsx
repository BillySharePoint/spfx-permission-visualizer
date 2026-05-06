import * as React from "react";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { Stack } from "@fluentui/react/lib/Stack";

export interface ILoadingStateProps {
    label?: string;
}

export const LoadingState: React.FC<ILoadingStateProps> = ({ label }) => {
    return (
        <Stack
            horizontalAlign="center"
            verticalAlign="center"
            tokens={{ childrenGap: 12 }}
            styles={{ root: { padding: 40 } }}
        >
            <Spinner size={SpinnerSize.large} label={label || "Loading..."} />
        </Stack>
    );
};
