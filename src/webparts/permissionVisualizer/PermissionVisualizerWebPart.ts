import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
    type IPropertyPaneConfiguration,
    PropertyPaneTextField,
    PropertyPaneToggle,
    PropertyPaneSlider
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/security/web";
import "@pnp/sp/security/list";
import "@pnp/sp/security/item";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";

import { PermissionVisualizer, IPermissionVisualizerProps } from "./components/PermissionVisualizer";

export interface IPermissionVisualizerWebPartProps {
    title: string;
    description: string;
    defaultIncludeFolders: boolean;
    defaultIncludeItems: boolean;
    defaultIncludeHiddenLists: boolean;
    maxItemsPerList: number;
    enableMockMode: boolean;
}

export default class PermissionVisualizerWebPart extends BaseClientSideWebPart<IPermissionVisualizerWebPartProps> {
    private sp: ReturnType<typeof spfi> | null = null;

    public async onInit(): Promise<void> {
        await super.onInit();

        try {
            this.sp = spfi().using(SPFx(this.context));
        } catch (err) {
            console.warn("PnPjs initialization failed - mock mode will be available.", err);
            this.sp = null;
        }
    }

    public render(): void {
        const element: React.ReactElement<IPermissionVisualizerProps> = React.createElement(
            PermissionVisualizer,
            {
                sp: this.sp,
                siteUrl: this.context.pageContext.web.absoluteUrl,
                title: this.properties.title,
                description: this.properties.description,
                defaultOptions: {
                    includeFolders: this.properties.defaultIncludeFolders,
                    includeItems: this.properties.defaultIncludeItems,
                    includeHiddenLists: this.properties.defaultIncludeHiddenLists
                },
                enableMockMode: this.properties.enableMockMode
            }
        );

        ReactDom.render(element, this.domElement);
    }

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse("1.0");
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: "Configure the Permission Visualizer web part settings."
                    },
                    groups: [
                        {
                            groupName: "Display Settings",
                            groupFields: [
                                PropertyPaneTextField("title", {
                                    label: "Web Part Title"
                                }),
                                PropertyPaneTextField("description", {
                                    label: "Description",
                                    multiline: true
                                })
                            ]
                        },
                        {
                            groupName: "Scan Defaults",
                            groupFields: [
                                PropertyPaneToggle("defaultIncludeFolders", {
                                    label: "Include folders by default",
                                    onText: "Yes",
                                    offText: "No"
                                }),
                                PropertyPaneToggle("defaultIncludeItems", {
                                    label: "Include items by default",
                                    onText: "Yes",
                                    offText: "No"
                                }),
                                PropertyPaneToggle("defaultIncludeHiddenLists", {
                                    label: "Include hidden lists by default",
                                    onText: "Yes",
                                    offText: "No"
                                }),
                                PropertyPaneSlider("maxItemsPerList", {
                                    label: "Max items per list",
                                    min: 100,
                                    max: 5000,
                                    step: 100
                                })
                            ]
                        },
                        {
                            groupName: "Demo Mode",
                            groupFields: [
                                PropertyPaneToggle("enableMockMode", {
                                    label: "Enable demo/mock mode",
                                    onText: "On",
                                    offText: "Off"
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
