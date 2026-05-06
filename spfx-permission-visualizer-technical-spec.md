# SPFx Permission Visualizer — Technical Build Specification

## Project Overview

**Project name:** SPFx Permission Visualizer  
**Suggested repository name:** `spfx-permission-visualizer`  
**Project type:** SharePoint Framework web part  
**Primary goal:** Build a working SPFx solution that helps SharePoint admins visualize SharePoint Online permissions, broken inheritance, external users, direct user access, SharePoint groups, and risky access patterns across sites, lists, libraries, folders, and items.

This project should be production-quality enough to showcase in a portfolio, GitHub repository, blog post, and job interviews.

---

## Portfolio Positioning

This project should demonstrate practical SharePoint and Microsoft 365 expertise, not just UI development.

The tool should answer common SharePoint admin questions:

- Who has access to this site?
- Which lists or libraries have unique permissions?
- Are there folders or items with broken inheritance?
- Are external users present?
- Are users assigned directly instead of through groups?
- Are there too many site owners?
- Are sensitive libraries exposed?
- What should be reviewed or cleaned up?

The project should fit alongside these existing portfolio projects:

- **SPFx Policy Acknowledgement Center** — compliance and acknowledgement tracking
- **SPFx SharePoint Site Governance Dashboard** — governance and site risk visibility
- **SharePoint Migration Scoping Toolkit** — migration readiness and discovery
- **SPFx Permission Visualizer** — permission structure, access risk, and cleanup visibility

---

## Target Users

Primary users:

- SharePoint Administrators
- Microsoft 365 Administrators
- SharePoint Developers
- Migration Consultants
- Compliance / Governance Teams
- Intranet Owners

---

## Recommended Tech Stack

Use the following stack:

- SharePoint Framework
- React
- TypeScript
- Fluent UI React
- PnPjs
- SharePoint REST API
- Microsoft Graph, where needed
- Office UI Fabric / Fluent UI components
- CSV export utility
- Optional: React Tree View package or custom tree component

Recommended SPFx baseline:

```bash
node --version
# Use the Node.js version supported by the installed SPFx version.

npm install -g yo gulp
npm install -g @microsoft/generator-sharepoint
```

Suggested generator options:

```text
Solution name: spfx-permission-visualizer
Target: SharePoint Online only
Place files: current folder
Deployment: tenant-wide deployment optional, recommended yes for portfolio
Permissions: isolated domain no
Component type: WebPart
Web part name: PermissionVisualizer
Framework: React
```

---

## High-Level Features

The solution should include these core features:

1. Permission dashboard summary
2. Site permission overview
3. List and library permission scanner
4. Broken inheritance detection
5. External user detection
6. Direct permission assignment detection
7. SharePoint group/member viewer
8. Permission tree view
9. Risk scoring engine
10. Findings and recommendations panel
11. CSV export
12. Property pane configuration
13. Error handling and loading states
14. Mock mode for demo/testing
15. Responsive design

---

## Web Part Name

**PermissionVisualizerWebPart**

Suggested display name:

```text
SharePoint Permission Visualizer
```

Suggested description:

```text
Visualize SharePoint permission inheritance, external access, direct assignments, SharePoint groups, and risky permission patterns.
```

---

## Folder Structure

Use a clean folder structure:

```text
src/
  webparts/
    permissionVisualizer/
      PermissionVisualizerWebPart.ts
      components/
        PermissionVisualizer.tsx
        PermissionVisualizer.module.scss
        dashboard/
          PermissionSummaryCards.tsx
          PermissionRiskChart.tsx
        scanner/
          ScanControls.tsx
          ScanProgress.tsx
        tree/
          PermissionTreeView.tsx
          PermissionTreeNode.tsx
        findings/
          FindingsPanel.tsx
          FindingCard.tsx
        groups/
          SharePointGroupsPanel.tsx
          GroupMembersPanel.tsx
        tables/
          PermissionObjectsTable.tsx
          ExternalUsersTable.tsx
          DirectAssignmentsTable.tsx
        export/
          ExportActions.tsx
        common/
          LoadingState.tsx
          EmptyState.tsx
          ErrorMessage.tsx
          StatusPill.tsx
          RiskBadge.tsx
      models/
        IPermissionPrincipal.ts
        IPermissionObject.ts
        IPermissionFinding.ts
        IPermissionScanResult.ts
        IRiskScore.ts
        ISharePointGroup.ts
        IScanOptions.ts
      services/
        PermissionService.ts
        SharePointGroupService.ts
        ExternalUserService.ts
        RiskScoringService.ts
        CsvExportService.ts
        MockPermissionService.ts
      utils/
        permissionUtils.ts
        dateUtils.ts
        csvUtils.ts
        riskUtils.ts
      constants/
        riskRules.ts
        permissionLevels.ts
```

---

## Main User Experience

The web part should work from a SharePoint site page.

### Initial View

When the page loads, show:

- Title: **SharePoint Permission Visualizer**
- Description: Short explanation of what the tool scans
- Current site URL
- Scan options
- Start scan button

Example text:

```text
Analyze the current SharePoint site to identify broken inheritance, external users, direct permissions, SharePoint groups, and risky access patterns.
```

### Scan Options

Include checkboxes or toggles:

- Scan site permissions
- Scan lists and libraries
- Include folders
- Include list items
- Detect external users
- Detect direct user assignments
- Include hidden lists
- Use mock/demo data

Default recommended settings:

```text
Scan site permissions: true
Scan lists and libraries: true
Include folders: true
Include list items: false
Detect external users: true
Detect direct user assignments: true
Include hidden lists: false
Use mock/demo data: false
```

Important: Item-level scanning can be expensive in large sites. Keep it optional and clearly label it.

Example helper text:

```text
Item-level scanning may take longer on large libraries. Use it only when you need deep permission analysis.
```

---

## Core Data Models

Create strongly typed interfaces.

### IPermissionPrincipal

```ts
export interface IPermissionPrincipal {
  id: number;
  title: string;
  loginName: string;
  email?: string;
  principalType: PrincipalType;
  isExternal: boolean;
  isSharePointGroup: boolean;
  isSecurityGroup: boolean;
  isM365Group: boolean;
}
```

Recommended enum:

```ts
export enum PrincipalType {
  User = "User",
  SharePointGroup = "SharePointGroup",
  SecurityGroup = "SecurityGroup",
  M365Group = "M365Group",
  Unknown = "Unknown"
}
```

### IPermissionRole

```ts
export interface IPermissionRole {
  id: number;
  name: string;
  description?: string;
  hidden?: boolean;
  order?: number;
}
```

### IPermissionAssignment

```ts
export interface IPermissionAssignment {
  principal: IPermissionPrincipal;
  roles: IPermissionRole[];
  assignmentType: "GroupBased" | "Direct" | "Inherited" | "Unknown";
}
```

### IPermissionObject

```ts
export interface IPermissionObject {
  id: string;
  title: string;
  url: string;
  objectType: "Site" | "List" | "Library" | "Folder" | "Item";
  parentId?: string;
  hasUniqueRoleAssignments: boolean;
  inheritsPermissions: boolean;
  permissionAssignments: IPermissionAssignment[];
  externalUsers: IPermissionPrincipal[];
  directAssignments: IPermissionAssignment[];
  riskLevel: "Low" | "Medium" | "High";
  riskScore: number;
  findings: IPermissionFinding[];
  itemCount?: number;
  lastModified?: string;
}
```

### IPermissionFinding

```ts
export interface IPermissionFinding {
  id: string;
  objectId: string;
  objectTitle: string;
  objectUrl: string;
  severity: "Info" | "Low" | "Medium" | "High";
  category:
    | "BrokenInheritance"
    | "ExternalAccess"
    | "DirectAssignment"
    | "OwnerRisk"
    | "AnonymousLink"
    | "SensitiveLibrary"
    | "LargeGroup"
    | "Unknown";
  title: string;
  description: string;
  recommendation: string;
}
```

### IPermissionScanResult

```ts
export interface IPermissionScanResult {
  siteUrl: string;
  scannedAt: string;
  scanDurationMs: number;
  totalObjectsScanned: number;
  totalFindings: number;
  highRiskFindings: number;
  mediumRiskFindings: number;
  lowRiskFindings: number;
  externalUsersCount: number;
  directAssignmentsCount: number;
  brokenInheritanceCount: number;
  objects: IPermissionObject[];
  findings: IPermissionFinding[];
  groups: ISharePointGroup[];
}
```

### ISharePointGroup

```ts
export interface ISharePointGroup {
  id: number;
  title: string;
  description?: string;
  ownerTitle?: string;
  usersCount: number;
  users: IPermissionPrincipal[];
}
```

### IScanOptions

```ts
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
```

---

## Permission Data Sources

Use SharePoint REST API and PnPjs.

Install PnPjs:

```bash
npm install @pnp/sp @pnp/graph @pnp/logging @pnp/queryable
```

Initialize PnPjs in the web part:

```ts
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/security";
```

Example setup:

```ts
const sp = spfi().using(SPFx(this.context));
```

---

## Required SharePoint APIs

### Current Web

```ts
const web = await sp.web.select("Title", "Url")();
```

### Site Role Assignments

Use REST expand:

```ts
const assignments = await sp.web.roleAssignments
  .expand("Member", "RoleDefinitionBindings")
  .select(
    "Member/Id",
    "Member/Title",
    "Member/LoginName",
    "Member/PrincipalType",
    "RoleDefinitionBindings/Id",
    "RoleDefinitionBindings/Name",
    "RoleDefinitionBindings/Description"
  )();
```

### Lists and Libraries

```ts
const lists = await sp.web.lists
  .select(
    "Id",
    "Title",
    "RootFolder/ServerRelativeUrl",
    "BaseTemplate",
    "BaseType",
    "Hidden",
    "ItemCount",
    "HasUniqueRoleAssignments",
    "LastItemModifiedDate"
  )
  .expand("RootFolder")();
```

Filter out hidden lists unless the user selected **Include hidden lists**.

Common useful templates:

```text
101 = Document Library
100 = Custom List
119 = Site Pages
850 = Pages Library
```

Do not hardcode too aggressively because custom lists/libraries may vary.

### List Role Assignments

```ts
const listAssignments = await sp.web.lists
  .getById(listId)
  .roleAssignments
  .expand("Member", "RoleDefinitionBindings")
  .select(
    "Member/Id",
    "Member/Title",
    "Member/LoginName",
    "Member/PrincipalType",
    "RoleDefinitionBindings/Id",
    "RoleDefinitionBindings/Name"
  )();
```

### Check Unique Permissions

For web/list/item objects, use:

```ts
HasUniqueRoleAssignments
```

For lists, this field is available in list metadata.

For items/folders, fetch fields including:

```ts
HasUniqueRoleAssignments
FileRef
FileLeafRef
FSObjType
```

### Folder and Item Scanning

For libraries:

```ts
const items = await sp.web.lists
  .getById(listId)
  .items
  .select(
    "Id",
    "Title",
    "FileRef",
    "FileLeafRef",
    "FSObjType",
    "HasUniqueRoleAssignments",
    "Modified"
  )
  .top(5000)();
```

`FSObjType`:

```text
0 = File/item
1 = Folder
```

If `includeFolders` is true, include items where `FSObjType === 1`.

If `includeItems` is true, include items where `FSObjType === 0`.

For large lists, implement paging.

---

## Paging Requirement

Do not assume all lists have fewer than 5,000 items.

Implement paging in the service layer. PnPjs supports paged collection patterns depending on version. If using a version where `getPaged()` is available, use it. Otherwise, implement a skip/token approach or keep item-level scanning limited.

Recommended behavior:

- Default scan should not scan all list items.
- Folder scanning can be enabled.
- Item scanning should have a warning.
- Add a max item scan limit in property pane or internal constant.

Suggested default:

```ts
const DEFAULT_MAX_ITEMS_PER_LIST = 2000;
```

---

## Property Pane Settings

Add property pane fields:

```ts
export interface IPermissionVisualizerWebPartProps {
  title: string;
  description: string;
  defaultIncludeFolders: boolean;
  defaultIncludeItems: boolean;
  defaultIncludeHiddenLists: boolean;
  maxItemsPerList: number;
  enableMockMode: boolean;
}
```

Property pane controls:

- Web part title
- Description
- Default include folders
- Default include items
- Default include hidden lists
- Max items per list
- Enable mock/demo mode

---

## Risk Scoring Logic

Create a `RiskScoringService`.

Use a simple scoring model that is easy to understand.

### Risk Score Rules

Start at 0.

Add points:

```text
+30 if object has unique permissions
+25 if external users exist
+20 if direct user assignments exist
+20 if anonymous/anyone link detected, if implemented
+15 if item/folder has broken inheritance
+15 if owner count is 0 or cannot be detected
+10 if owner count is greater than 10
+10 if large SharePoint group has broad access
+10 if permission level includes Full Control outside Owners group
+5 if permission level includes Edit or Contribute broadly
```

Risk levels:

```text
0-24 = Low
25-59 = Medium
60+ = High
```

Create constants:

```ts
export const RISK_THRESHOLDS = {
  LOW_MAX: 24,
  MEDIUM_MAX: 59
};
```

### Risk Badge Colors

Use Fluent UI visual treatment:

- Low: green
- Medium: orange/yellow
- High: red

If using CSS modules, define semantic classes. Avoid hardcoding too many inline styles.

---

## External User Detection

External users often have login names or emails containing:

```text
#EXT#
```

Possible checks:

```ts
const isExternal =
  loginName?.toLowerCase().includes("#ext#") ||
  email?.toLowerCase().includes("#ext#") ||
  loginName?.toLowerCase().includes("spo-grid-all-users") === false && loginName?.includes("#EXT#");
```

Better helper:

```ts
export function isExternalUser(loginName?: string, email?: string): boolean {
  const login = (loginName || "").toLowerCase();
  const mail = (email || "").toLowerCase();

  return (
    login.includes("#ext#") ||
    mail.includes("#ext#") ||
    login.includes("urn:spo:guest") ||
    login.includes("membership|") && login.includes("#ext#")
  );
}
```

Do not mark SharePoint system principals as external.

---

## Principal Type Handling

SharePoint principal type values are numeric flags.

Common values:

```text
1 = User
4 = Security Group
8 = SharePoint Group
```

Create helper:

```ts
export function mapPrincipalType(value: number): PrincipalType {
  switch (value) {
    case 1:
      return PrincipalType.User;
    case 4:
      return PrincipalType.SecurityGroup;
    case 8:
      return PrincipalType.SharePointGroup;
    default:
      return PrincipalType.Unknown;
  }
}
```

Note: PrincipalType can sometimes be a flag combination. Build defensively.

---

## Direct Assignment Detection

A direct assignment means a user is assigned directly to an object instead of getting access through a SharePoint group or security group.

Logic:

```ts
const isDirectAssignment =
  principal.principalType === PrincipalType.User &&
  !principal.isSharePointGroup &&
  !principal.isSecurityGroup &&
  !principal.isM365Group;
```

If a direct user assignment exists, create a finding:

```text
Title: Direct user permission assignment detected
Description: This object grants permissions directly to one or more users instead of using a SharePoint or security group.
Recommendation: Review whether direct access is required. Prefer group-based permissions for easier administration.
```

---

## Broken Inheritance Detection

If an object has `HasUniqueRoleAssignments === true`, then it has broken inheritance.

Create finding:

```text
Title: Broken permission inheritance
Description: This object does not inherit permissions from its parent.
Recommendation: Review whether unique permissions are still required. Reinherit permissions where possible to reduce administrative complexity.
```

For site-level permissions, this does not apply the same way because the site is the root.

---

## SharePoint Groups Panel

Show all SharePoint groups on the current site.

API:

```ts
const groups = await sp.web.siteGroups();
```

For each group:

```ts
const users = await sp.web.siteGroups.getById(group.Id).users();
```

Display:

- Group name
- Group owner
- Description
- User count
- External users inside group
- Members

Add warning if:

- Group has 0 users
- Group has external users
- Owners group has too many users
- Visitors group has users with edit permission, if detected through assignments

---

## Permission Tree View

Build a hierarchical tree:

```text
Site
 ├── Documents
 │    ├── HR Folder
 │    └── Finance Folder
 ├── Site Pages
 └── Policies
```

Each node should show:

- Icon by object type
- Title
- Risk badge
- Broken inheritance indicator
- External user indicator
- Direct assignment indicator

Clicking a node should open a detail panel with:

- Object title
- Object URL
- Object type
- Inheritance status
- Risk score
- Permission assignments
- Findings
- Recommended cleanup actions

---

## Dashboard Summary Cards

At the top after scanning, show:

1. Objects scanned
2. Broken inheritance count
3. External users count
4. Direct assignments count
5. High-risk findings count
6. SharePoint groups count

Example:

```text
Objects Scanned: 42
Broken Inheritance: 7
External Users: 3
Direct Assignments: 11
High Risk Findings: 4
Groups: 8
```

---

## Main Tables

### Permission Objects Table

Columns:

- Object title
- Type
- Inheritance
- External users
- Direct assignments
- Risk level
- Findings count
- Last modified
- Open link

### Findings Table

Columns:

- Severity
- Category
- Object
- Finding
- Recommendation
- Open object

### External Users Table

Columns:

- Display name
- Email/login
- Object title
- Permission level
- Assignment type

### Direct Assignments Table

Columns:

- User
- Object
- Permission level
- Risk level
- Recommendation

---

## CSV Export Requirements

Create `CsvExportService`.

Export options:

1. Export all permission objects
2. Export findings
3. Export external users
4. Export direct assignments
5. Export SharePoint groups

Implementation:

```ts
export function downloadCsv(filename: string, rows: Record<string, unknown>[]): void {
  const csv = convertToCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

File naming:

```text
permission-visualizer-findings-YYYY-MM-DD.csv
permission-visualizer-external-users-YYYY-MM-DD.csv
permission-visualizer-direct-assignments-YYYY-MM-DD.csv
```

---

## Mock Mode

Include mock data so the project can be demoed without needing a complex SharePoint site.

Create `MockPermissionService.ts`.

Mock data should include:

- 1 current site
- 4 document libraries
- 2 lists
- Several folders
- At least 2 folders with broken inheritance
- At least 3 external users
- At least 5 direct user assignments
- Low, medium, and high risk examples
- SharePoint groups: Owners, Members, Visitors, HR Reviewers, Finance Contributors

This is important for screenshots, local testing, and portfolio demos.

Add a toggle in the UI:

```text
Use demo data
```

---

## Performance Requirements

The tool should avoid freezing the page.

Implement:

- Loading indicator
- Scan progress text
- Async scan steps
- Try/catch around each major API call
- Continue scanning if one list fails
- Store errors as warnings in the result
- Avoid deep item-level scanning by default

Suggested progress steps:

```text
Loading site permissions...
Loading SharePoint groups...
Scanning lists and libraries...
Checking unique permissions...
Detecting external users...
Calculating risk scores...
Preparing report...
```

---

## Error Handling

Common issues:

1. User does not have permission to read role assignments
2. List/library access denied
3. Large list threshold issues
4. API throttling
5. Network failures
6. Unsupported principal type
7. Empty site/no lists found

Display friendly errors:

```text
Some permission data could not be loaded. You may need higher permissions on this site to view role assignments.
```

Do not fail the entire scan if one list fails.

Store partial errors:

```ts
export interface IScanWarning {
  source: string;
  message: string;
  details?: string;
}
```

Optionally add warnings to `IPermissionScanResult`.

---

## Required User Permissions

The user running the web part should generally need sufficient permission to view permissions on the site.

Document this in the README:

```text
Recommended permission: Site Owner or SharePoint Administrator.
Users with lower permissions may see partial results.
```

---

## SPFx Package Permissions

If only using SharePoint REST/PnPjs against the current site, tenant API permissions may be minimal.

If using Microsoft Graph for richer user or group details, document the required permissions.

Possible Graph permissions:

```text
User.ReadBasic.All
Group.Read.All
Directory.Read.All
```

Important: For a portfolio project, keep the first version mostly SharePoint REST/PnPjs to reduce tenant admin consent friction.

Recommended version 1:

```text
No required Graph permissions.
Use SharePoint REST/PnPjs only.
```

Recommended version 2:

```text
Optional Graph enrichment for M365 group details.
```

---

## UI/UX Requirements

Use a clean admin dashboard style.

### Visual Style

- Fluent UI components
- Cards for metrics
- Risk badges
- Command bar for actions
- Details panel for selected object
- Search/filter controls
- Responsive layout

### Filters

Add filters for:

- Risk level
- Object type
- Has broken inheritance
- Has external users
- Has direct assignments
- Search by title or URL

### Empty State

Before scan:

```text
Run a permission scan to visualize access risks on this SharePoint site.
```

No findings:

```text
No permission findings were detected based on the selected scan options.
```

---

## Component Responsibilities

### PermissionVisualizer.tsx

Main container.

Responsibilities:

- Hold scan state
- Hold scan options
- Call PermissionService
- Render scan controls
- Render dashboard/results
- Handle errors

State example:

```ts
const [isScanning, setIsScanning] = React.useState(false);
const [scanResult, setScanResult] = React.useState<IPermissionScanResult | undefined>();
const [scanOptions, setScanOptions] = React.useState<IScanOptions>(defaultOptions);
const [error, setError] = React.useState<string | undefined>();
const [progressMessage, setProgressMessage] = React.useState<string>("");
```

### ScanControls.tsx

Responsibilities:

- Render toggles
- Start scan button
- Reset button
- Show warning for item-level scan

### PermissionSummaryCards.tsx

Responsibilities:

- Render metrics after scan

### PermissionTreeView.tsx

Responsibilities:

- Render object hierarchy
- Allow selecting an object
- Show risk indicators

### FindingsPanel.tsx

Responsibilities:

- Show findings grouped by severity
- Allow filtering

### ExportActions.tsx

Responsibilities:

- Render export buttons
- Call CsvExportService

---

## Service Responsibilities

### PermissionService.ts

Main service for scanning.

Methods:

```ts
export interface IPermissionService {
  scanCurrentSite(options: IScanOptions): Promise<IPermissionScanResult>;
  getSitePermissions(): Promise<IPermissionObject>;
  getListsAndLibraries(options: IScanOptions): Promise<IPermissionObject[]>;
  getObjectRoleAssignments(objectType: string, id: string): Promise<IPermissionAssignment[]>;
}
```

### SharePointGroupService.ts

Methods:

```ts
getSiteGroups(): Promise<ISharePointGroup[]>;
getGroupUsers(groupId: number): Promise<IPermissionPrincipal[]>;
```

### RiskScoringService.ts

Methods:

```ts
scoreObject(object: IPermissionObject): IRiskScore;
generateFindings(object: IPermissionObject): IPermissionFinding[];
```

### CsvExportService.ts

Methods:

```ts
exportObjects(result: IPermissionScanResult): void;
exportFindings(result: IPermissionScanResult): void;
exportExternalUsers(result: IPermissionScanResult): void;
exportDirectAssignments(result: IPermissionScanResult): void;
exportGroups(result: IPermissionScanResult): void;
```

---

## Recommended Implementation Sequence

Build in this order.

### Phase 1 — Project Setup

1. Scaffold SPFx React web part.
2. Install PnPjs.
3. Configure PnPjs with SPFx context.
4. Build basic UI shell.
5. Add property pane settings.
6. Add mock data mode.

Acceptance criteria:

- Web part runs locally in SharePoint workbench.
- Web part renders title, description, and scan button.
- Mock scan returns demo dashboard.

---

### Phase 2 — Site-Level Permissions

1. Load current web title and URL.
2. Load site role assignments.
3. Map principals and roles.
4. Detect external users.
5. Detect direct assignments.
6. Generate risk score and findings.

Acceptance criteria:

- Current site permissions display correctly.
- External users are flagged.
- Direct assignments are flagged.
- Risk badge appears.

---

### Phase 3 — SharePoint Groups

1. Load site groups.
2. Load users per group.
3. Display groups panel.
4. Detect external users inside groups.
5. Flag empty groups and large groups.

Acceptance criteria:

- Site groups render in UI.
- Group members can be expanded/viewed.
- External group members are flagged.

---

### Phase 4 — Lists and Libraries

1. Load lists and libraries.
2. Filter hidden lists by option.
3. Identify unique permissions.
4. Fetch role assignments for lists/libraries.
5. Generate findings.

Acceptance criteria:

- Lists/libraries show in table.
- Broken inheritance is detected.
- List/library risk levels are calculated.

---

### Phase 5 — Folder and Item Scanning

1. Add optional folder scan.
2. Add optional item scan.
3. Add max item limit.
4. Detect unique permissions on folders/items.
5. Add progress messages.

Acceptance criteria:

- Folder scan works on a document library.
- Item-level scan is optional.
- Large scans do not freeze UI.
- User receives warning before item-level scan.

---

### Phase 6 — Tree View and Details Panel

1. Build hierarchy.
2. Render tree nodes.
3. Add selected object details panel.
4. Show assignments and findings per object.

Acceptance criteria:

- Site/list/folder hierarchy is visible.
- Clicking an object shows details.
- Risk indicators are visible in tree.

---

### Phase 7 — Export and Polish

1. Add CSV export.
2. Add filtering.
3. Add search.
4. Improve empty/error states.
5. Add responsive layout.
6. Update README.
7. Add screenshots.

Acceptance criteria:

- All export buttons work.
- Filters work.
- README includes setup, permissions, screenshots, and roadmap.

---

## Example README Structure

Create a strong README because this is for portfolio and GitHub visibility.

```md
# SPFx Permission Visualizer

An open-source SharePoint Framework solution that helps SharePoint admins visualize permission inheritance, external users, direct assignments, SharePoint groups, and risky access patterns.

## Features

- Site permission summary
- List and library permission scanning
- Broken inheritance detection
- External user detection
- Direct user assignment detection
- SharePoint group/member viewer
- Risk scoring
- Findings and recommendations
- CSV export
- Demo/mock mode

## Screenshots

Add screenshots here.

## Why I Built This

SharePoint permissions often become difficult to manage over time. Broken inheritance, direct user access, and external sharing can create governance and migration risks. This tool helps admins quickly identify where to review permissions.

## Requirements

- SharePoint Online
- SPFx-compatible Node.js version
- Site Owner or equivalent permission recommended

## Setup

npm install
gulp serve

## Package

gulp bundle --ship
gulp package-solution --ship

## Deployment

Upload the .sppkg file to the tenant app catalog.

## Roadmap

- Graph enrichment
- Tenant-wide scanning
- PDF report
- Sensitivity label awareness
- Permission cleanup suggestions
```

---

## Portfolio Page Content

Use this on the website after the project is built.

### Title

```text
SharePoint Permission Visualizer
```

### Short Description

```text
An SPFx solution that helps SharePoint admins visualize permission inheritance, external users, direct assignments, SharePoint groups, and risky access patterns across SharePoint Online sites.
```

### Longer Description

```text
I built this open-source SPFx project to solve a common SharePoint administration problem: understanding who has access, where permissions are broken, and which areas need cleanup. The solution scans the current SharePoint site, analyzes permission inheritance, highlights external users and direct assignments, scores permission risk, and exports findings for review.
```

### Skills Demonstrated

```text
SPFx, React, TypeScript, PnPjs, SharePoint REST API, Fluent UI, permission governance, external sharing review, migration readiness, CSV reporting
```

---

## Blog Post Angle

Suggested blog title:

```text
Building a SharePoint Permission Visualizer with SPFx
```

Suggested hook:

```text
SharePoint permission problems usually do not happen overnight. They build up slowly through broken inheritance, direct user access, external sharing, and unclear group ownership.
```

Suggested sections:

1. Why SharePoint permissions become hard to manage
2. Why broken inheritance matters
3. Why direct user permissions are risky
4. How external users complicate governance
5. How an SPFx dashboard can help admins review access
6. What I built in the open-source project
7. Lessons learned
8. GitHub link and next steps

---

## LinkedIn Launch Post Angle

When publishing the project, create a LinkedIn post focused on a real problem.

Suggested hook:

```text
SharePoint permission cleanup is one of those tasks that looks simple until you actually open the site.
```

Mention:

- Broken inheritance
- Direct user access
- External users
- Admin visibility
- Migration readiness
- Open-source project

Include:

- GitHub link
- Website project link
- Blog link, if available
- Hashtags
- Infographic

---

## Security and Safety Notes

This tool should be read-only.

Do not include permission modification features in version 1.

Avoid:

- Removing users
- Breaking/reinheriting permissions automatically
- Changing group membership
- Granting access
- Revoking access

Version 1 should only scan, visualize, and report.

This makes the project safer for open-source use.

---

## Future Enhancements

After version 1, consider:

1. Tenant-wide permission scanning using Graph and admin APIs
2. Sensitivity label detection
3. Sharing link detection
4. Anonymous link detection
5. PDF report generation
6. Scheduled scan history
7. Compare permission changes over time
8. Integration with Microsoft Lists for governance review tracking
9. Export to Excel
10. Viva Connections Adaptive Card Extension
11. Teams tab version
12. Permission cleanup workflow suggestions
13. Power Automate integration for review approvals

---

## Definition of Done

The project is considered working when:

- The SPFx web part builds successfully.
- The web part can be deployed to SharePoint Online.
- A site owner can run a permission scan.
- The scan returns site-level permissions.
- The scan returns lists/libraries.
- The tool detects broken inheritance.
- The tool detects external users.
- The tool detects direct user assignments.
- SharePoint groups and members are visible.
- Risk scores are calculated.
- Findings and recommendations are shown.
- CSV export works.
- Mock/demo mode works.
- README explains setup and usage.
- Screenshots are included.
- The solution is read-only and does not modify permissions.

---

## Suggested Initial Version Scope

To avoid overbuilding, version 1 should include:

- Current site scan only
- Site permissions
- Lists/libraries
- Optional folders
- No tenant-wide scanning
- No automatic cleanup
- No write actions
- Mock mode
- CSV export
- Risk scoring
- Findings panel

Save tenant-wide scanning for version 2.

---

## Important Instruction for AI Coding Agent

Build this as a real working SPFx project, not just a static mockup.

The UI can use mock mode, but the real mode must call SharePoint using PnPjs and return actual permissions from the current site.

Prioritize this order:

1. Working SPFx project
2. Real SharePoint permission scan
3. Clean typed architecture
4. Good UI
5. CSV export
6. Documentation

Do not add automatic permission cleanup in version 1.

Keep the solution read-only.

---

## Suggested Commit Plan

```text
commit 1: scaffold SPFx React web part
commit 2: add PnPjs setup and service structure
commit 3: add mock scan result and dashboard UI
commit 4: implement site permission scan
commit 5: implement SharePoint group viewer
commit 6: implement lists/libraries scan
commit 7: add risk scoring and findings
commit 8: add tree view and details panel
commit 9: add filters and search
commit 10: add CSV export
commit 11: add README and screenshots
```

---

## Suggested GitHub Topics

Add these topics to the GitHub repository:

```text
spfx
sharepoint
sharepoint-online
microsoft-365
m365
pnpjs
typescript
react
fluent-ui
permissions
governance
security
migration
open-source
```

---

## Suggested Package Metadata

In `package-solution.json`, use a clear solution name:

```json
{
  "solution": {
    "name": "spfx-permission-visualizer-client-side-solution"
  }
}
```

Suggested web part manifest description:

```json
{
  "description": "Visualize SharePoint permission inheritance, external users, direct assignments, SharePoint groups, and permission risk."
}
```

---

## Final Product Summary

The final project should feel like an admin-focused SharePoint permission review tool.

It should help a SharePoint admin quickly understand:

- What objects have unique permissions
- Which users are external
- Where direct access is assigned
- Which SharePoint groups exist
- Which objects need review
- What cleanup actions are recommended

This project should be strong enough to feature on:

- Open-source page
- Portfolio homepage
- Blog article
- LinkedIn post
- Resume project section
- Job interview discussion
