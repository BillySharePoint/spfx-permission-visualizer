import { IPermissionPrincipal } from "./IPermissionPrincipal";

export interface ISharePointGroup {
    id: number;
    title: string;
    description?: string;
    ownerTitle?: string;
    usersCount: number;
    users: IPermissionPrincipal[];
}
