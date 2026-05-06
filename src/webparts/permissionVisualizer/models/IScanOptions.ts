export interface IScanOptions {
    scanSitePermissions: boolean;
    scanListsAndLibraries: boolean;
    includeFolders: boolean;
    includeItems: boolean;
    detectExternalUsers: boolean;
    detectDirectAssignments: boolean;
    includeHiddenLists: boolean;
    useMockData: boolean;
}

export const DEFAULT_SCAN_OPTIONS: IScanOptions = {
    scanSitePermissions: true,
    scanListsAndLibraries: true,
    includeFolders: true,
    includeItems: false,
    detectExternalUsers: true,
    detectDirectAssignments: true,
    includeHiddenLists: false,
    useMockData: false
};
