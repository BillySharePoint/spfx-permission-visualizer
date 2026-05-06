import * as React from "react";
import styles from "./PermissionVisualizer.module.scss";
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";

import { IPermissionScanResult, IScanOptions, IPermissionObject, DEFAULT_SCAN_OPTIONS } from "../models";
import { PermissionService, MockPermissionService } from "../services";

import { EmptyState, ErrorMessage } from "./common";
import { PermissionSummaryCards, PermissionRiskChart } from "./dashboard";
import { ScanControls, ScanProgress } from "./scanner";
import { PermissionTreeView } from "./tree";
import { FindingsPanel } from "./findings";
import { SharePointGroupsPanel } from "./groups";
import { PermissionObjectsTable, ExternalUsersTable, DirectAssignmentsTable } from "./tables";
import { ExportActions } from "./export";
import { formatDuration } from "../utils/dateUtils";

import { SPFI } from "@pnp/sp";

export interface IPermissionVisualizerProps {
    sp: SPFI | null;
    siteUrl: string;
    title: string;
    description: string;
    defaultOptions?: Partial<IScanOptions>;
    enableMockMode: boolean;
}

export const PermissionVisualizer: React.FC<IPermissionVisualizerProps> = (props) => {
    const { sp, siteUrl, title, description, defaultOptions, enableMockMode } = props;

    const [isScanning, setIsScanning] = React.useState(false);
    const [scanResult, setScanResult] = React.useState<IPermissionScanResult | undefined>();
    const [scanOptions, setScanOptions] = React.useState<IScanOptions>({
        ...DEFAULT_SCAN_OPTIONS,
        ...defaultOptions,
        useMockData: enableMockMode
    });
    const [error, setError] = React.useState<string | undefined>();
    const [progressMessage, setProgressMessage] = React.useState<string>("");
    const [selectedObject, setSelectedObject] = React.useState<IPermissionObject | undefined>();

    const handleStartScan = async (): Promise<void> => {
        setIsScanning(true);
        setError(undefined);
        setScanResult(undefined);
        setProgressMessage("Initializing scan...");

        try {
            let result: IPermissionScanResult;

            if (scanOptions.useMockData) {
                const mockService = new MockPermissionService();
                result = await mockService.scanCurrentSite(scanOptions, setProgressMessage);
            } else {
                if (!sp) {
                    throw new Error("SharePoint context is not available. Please ensure the web part is running in a SharePoint site.");
                }
                const permService = new PermissionService(sp);
                result = await permService.scanCurrentSite(scanOptions, setProgressMessage);
            }

            setScanResult(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred during the scan.";
            setError(errorMessage);
        } finally {
            setIsScanning(false);
            setProgressMessage("");
        }
    };

    const handleReset = (): void => {
        setScanResult(undefined);
        setError(undefined);
        setProgressMessage("");
        setSelectedObject(undefined);
    };

    return (
        <div className={styles.permissionVisualizer}>
            <div className={styles.header}>
                <div className={styles.title}>{title || "SharePoint Permission Visualizer"}</div>
                <div className={styles.description}>
                    {description ||
                        "Analyze the current SharePoint site to identify broken inheritance, external users, direct permissions, SharePoint groups, and risky access patterns."}
                </div>
            </div>

            <div className={styles.content}>
                <ScanControls
                    options={scanOptions}
                    onOptionsChange={setScanOptions}
                    onStartScan={handleStartScan}
                    onReset={handleReset}
                    isScanning={isScanning}
                    siteUrl={siteUrl}
                />

                {isScanning && (
                    <ScanProgress message={progressMessage} isScanning={isScanning} />
                )}

                {error && (
                    <ErrorMessage
                        message="Scan failed"
                        details={error}
                        onDismiss={() => setError(undefined)}
                    />
                )}

                {scanResult && scanResult.warnings.length > 0 && (
                    <MessageBar
                        messageBarType={MessageBarType.warning}
                        isMultiline
                        styles={{ root: { marginBottom: 16 } }}
                    >
                        <strong>Some data could not be loaded:</strong>
                        <ul style={{ margin: "4px 0", paddingLeft: 20 }}>
                            {scanResult.warnings.map((w, i) => (
                                <li key={i}>
                                    {w.source}: {w.message}
                                </li>
                            ))}
                        </ul>
                    </MessageBar>
                )}

                {!scanResult && !isScanning && !error && (
                    <EmptyState
                        iconName="Shield"
                        title="Permission Scan"
                        message="Run a permission scan to visualize access risks on this SharePoint site."
                    />
                )}

                {scanResult && (
                    <>
                        <div className={styles.scanInfo}>
                            <span>Scanned: {new Date(scanResult.scannedAt).toLocaleString()}</span>
                            <span>Duration: {formatDuration(scanResult.scanDurationMs)}</span>
                            <span>Site: {scanResult.siteUrl}</span>
                        </div>

                        <PermissionSummaryCards result={scanResult} />
                        <PermissionRiskChart result={scanResult} />

                        <Pivot className={styles.tabs}>
                            <PivotItem headerText="Tree View" itemIcon="Org">
                                <PermissionTreeView
                                    objects={scanResult.objects}
                                    onSelectObject={setSelectedObject}
                                    selectedObjectId={selectedObject?.id}
                                />
                            </PivotItem>

                            <PivotItem headerText="Objects" itemIcon="Table">
                                <PermissionObjectsTable
                                    objects={scanResult.objects}
                                    onSelectObject={setSelectedObject}
                                />
                            </PivotItem>

                            <PivotItem headerText="Findings" itemIcon="Warning">
                                <FindingsPanel findings={scanResult.findings} />
                            </PivotItem>

                            <PivotItem headerText="External Users" itemIcon="People">
                                <ExternalUsersTable result={scanResult} />
                            </PivotItem>

                            <PivotItem headerText="Direct Assignments" itemIcon="Contact">
                                <DirectAssignmentsTable result={scanResult} />
                            </PivotItem>

                            <PivotItem headerText="Groups" itemIcon="Group">
                                <SharePointGroupsPanel groups={scanResult.groups} />
                            </PivotItem>

                            <PivotItem headerText="Export" itemIcon="Download">
                                <ExportActions result={scanResult} />
                            </PivotItem>
                        </Pivot>
                    </>
                )}
            </div>
        </div>
    );
};
