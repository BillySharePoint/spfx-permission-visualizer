# SPFx Permission Visualizer

An open-source SharePoint Framework solution that helps SharePoint admins visualize permission inheritance, external users, direct assignments, SharePoint groups, and risky access patterns.

![SPFx 1.20.0](https://img.shields.io/badge/SPFx-1.20.0-green.svg)
![React](https://img.shields.io/badge/React-17-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.7-blue.svg)
![PnPjs](https://img.shields.io/badge/PnPjs-4.x-orange.svg)

## Features

- **Site permission summary** — Overview of all permission assignments at the site level  
- **List and library permission scanning** — Detect which lists/libraries have unique permissions  
- **Broken inheritance detection** — Find objects that don't inherit permissions from their parent  
- **External user detection** — Identify external/guest users with access to site content  
- **Direct user assignment detection** — Flag users assigned directly instead of through groups  
- **SharePoint group/member viewer** — View all site groups and their membership  
- **Risk scoring** — Automatic risk score calculation based on permission patterns  
- **Findings and recommendations** — Actionable insights for permission cleanup  
- **Permission tree view** — Hierarchical visualization of site permission structure  
- **CSV export** — Export all scan results to CSV files  
- **Demo/mock mode** — Built-in demo data for testing and screenshots  
- **Responsive design** — Works on different screen sizes  

## Screenshots

*Add screenshots here after deployment.*

## Why I Built This

SharePoint permissions often become difficult to manage over time. Broken inheritance, direct user access, and external sharing can create governance and migration risks. This tool helps admins quickly identify where to review permissions without modifying anything — it's completely read-only.

## Requirements

- SharePoint Online  
- SPFx-compatible Node.js version (Node.js 18.x recommended for SPFx 1.20)  
- Site Owner or equivalent permission recommended for full results  
- Users with lower permissions may see partial results  

## Setup

```bash
# Clone the repository
git clone https://github.com/BillySharePoint/spfx-permission-visualizer.git
cd spfx-permission-visualizer

# Install dependencies
npm install

# Serve locally (requires SharePoint workbench)
gulp serve
```

## Package & Deploy

```bash
# Bundle for production
gulp bundle --ship

# Create the package
gulp package-solution --ship
```

Upload the `.sppkg` file from `./sharepoint/solution/` to your tenant app catalog.

## Usage

1. Add the **SharePoint Permission Visualizer** web part to any SharePoint page  
2. Configure scan options (toggles for folders, items, external users, etc.)  
3. Click **Start Scan** to analyze the current site  
4. Review the dashboard, tree view, findings, and tables  
5. Export results to CSV as needed  

### Demo Mode

Toggle **Use demo data** in the scan options to see the web part with sample data. This is useful for:
- Local development without a SharePoint environment  
- Screenshots and portfolio demos  
- Testing UI changes  

## Architecture

```
src/webparts/permissionVisualizer/
├── PermissionVisualizerWebPart.ts    # Web part entry point
├── components/
│   ├── PermissionVisualizer.tsx      # Main container component
│   ├── common/                       # Shared UI components
│   ├── dashboard/                    # Summary cards and charts
│   ├── scanner/                      # Scan controls and progress
│   ├── tree/                         # Permission tree view
│   ├── findings/                     # Findings and recommendations
│   ├── groups/                       # SharePoint groups panel
│   ├── tables/                       # Data tables
│   └── export/                       # CSV export actions
├── models/                           # TypeScript interfaces
├── services/                         # Business logic and API calls
├── utils/                            # Utility functions
└── constants/                        # Configuration constants
```

## Risk Scoring

Objects are scored based on their permission state:

| Condition | Points |
|-----------|--------|
| Unique permissions (broken inheritance) | +30 |
| External users present | +25 |
| Direct user assignments | +20 |
| Anonymous/anyone link | +20 |
| No owner detected | +15 |
| Full Control outside Owners group | +10 |
| Too many owners (>10) | +10 |
| Edit/Contribute assigned broadly | +5 |

**Risk Levels:**
- **Low:** 0–24 points  
- **Medium:** 25–59 points  
- **High:** 60+ points  

## Permissions Required

This web part uses SharePoint REST API via PnPjs against the current site. No Microsoft Graph permissions are required for version 1.

| Scenario | Required Permission |
|----------|-------------------|
| Basic scan | Site Member or above |
| Full scan with all role assignments | Site Owner recommended |
| Admin-level visibility | SharePoint Administrator |

## Security

This tool is **read-only**. It does not:
- Remove users  
- Break or reinherit permissions  
- Change group membership  
- Grant or revoke access  

Version 1 only scans, visualizes, and reports.

## Tech Stack

- SharePoint Framework (SPFx) 1.20.0  
- React 17  
- TypeScript 4.7  
- Fluent UI React 8  
- PnPjs 4.x  
- SharePoint REST API  

## Roadmap

- [ ] Microsoft Graph enrichment for M365 group details  
- [ ] Tenant-wide permission scanning  
- [ ] PDF report generation  
- [ ] Sensitivity label awareness  
- [ ] Sharing link detection  
- [ ] Permission change comparison over time  
- [ ] Viva Connections Adaptive Card Extension  
- [ ] Power Automate integration for review workflows  

## Contributing

Contributions are welcome! Please open an issue first to discuss proposed changes.

## License

MIT
