import * as React from "react";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";

export interface IErrorMessageProps {
    message: string;
    details?: string;
    onDismiss?: () => void;
}

export const ErrorMessage: React.FC<IErrorMessageProps> = ({ message, details, onDismiss }) => {
    return (
        <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={!!details}
            onDismiss={onDismiss}
            dismissButtonAriaLabel="Close"
            styles={{ root: { marginBottom: 16 } }}
        >
            <strong>{message}</strong>
            {details && <div style={{ marginTop: 4, fontSize: 12 }}>{details}</div>}
        </MessageBar>
    );
};
