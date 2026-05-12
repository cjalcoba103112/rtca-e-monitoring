import type { SidebarRoleMapping } from "./SidebarRoleMapping";

export type Role = {
	roleId?: number;
	roleName?: string;
	indexPath?: string;
	isSuperAdmin?: boolean;
	sidebarRoleMappings?: SidebarRoleMapping[];
};