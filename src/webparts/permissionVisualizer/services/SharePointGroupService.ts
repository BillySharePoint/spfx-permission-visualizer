import { SPFI } from "@pnp/sp";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/site-users/web";

import { ISharePointGroup, IPermissionPrincipal } from "../models";
import { mapPrincipal } from "../utils/permissionUtils";

export class SharePointGroupService {
    private sp: SPFI;

    constructor(sp: SPFI) {
        this.sp = sp;
    }

    public async getSiteGroups(): Promise<ISharePointGroup[]> {
        const rawGroups = await this.sp.web.siteGroups
            .select("Id", "Title", "Description", "OwnerTitle")();

        const groups: ISharePointGroup[] = [];

        for (const group of rawGroups) {
            try {
                const users = await this.getGroupUsers(group.Id);
                groups.push({
                    id: group.Id,
                    title: group.Title,
                    description: group.Description || undefined,
                    ownerTitle: group.OwnerTitle || undefined,
                    usersCount: users.length,
                    users
                });
            } catch {
                groups.push({
                    id: group.Id,
                    title: group.Title,
                    description: group.Description || undefined,
                    ownerTitle: group.OwnerTitle || undefined,
                    usersCount: 0,
                    users: []
                });
            }
        }

        return groups;
    }

    public async getGroupUsers(groupId: number): Promise<IPermissionPrincipal[]> {
        const rawUsers = await this.sp.web.siteGroups
            .getById(groupId)
            .users.select("Id", "Title", "LoginName", "Email", "PrincipalType")();

        return rawUsers.map((u: {
            Id: number;
            Title: string;
            LoginName: string;
            Email?: string;
            PrincipalType: number;
        }) => mapPrincipal(u));
    }
}
