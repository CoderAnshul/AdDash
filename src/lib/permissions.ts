// Role-based permissions configuration
import { RolePermissions, ModulePermission } from './types';

export type Role = 'SuperAdmin' | 'Support' | 'Finance' | 'Compliance';

export interface Permission {
  dashboard: boolean;
  userManagement: boolean;
  listenerManagement: boolean;
  sessionManagement: boolean;
  compliance: boolean;
  walletPayments: boolean;
  supportTicketing: boolean;
  notifications: boolean;
  reports: boolean;
  settings: boolean;
  adminManagement: boolean;
  rolesPermissions: boolean;
  systemHealth: boolean;
}

// Helper function to create full CRUD permissions
const fullAccess = (): ModulePermission => ({
  view: true,
  create: true,
  edit: true,
  delete: true,
  export: true,
});

const readOnly = (): ModulePermission => ({
  view: true,
  create: false,
  edit: false,
  delete: false,
  export: false,
});

const viewAndEdit = (): ModulePermission => ({
  view: true,
  create: false,
  edit: true,
  delete: false,
  export: false,
});

const noAccess = (): ModulePermission => ({
  view: false,
  create: false,
  edit: false,
  delete: false,
  export: false,
});

// Granular permissions for predefined roles
export const granularRolePermissions: Record<Role, RolePermissions> = {
  SuperAdmin: {
    dashboard: { view: true },
    userManagement: fullAccess(),
    listenerManagement: fullAccess(),
    sessionManagement: { ...fullAccess(), endSession: true },
    compliance: { ...fullAccess(), viewMessages: true, flagContent: true },
    walletPayments: { ...fullAccess(), processRefund: true, approveWithdrawal: true, manualAdjustment: true },
    supportTicketing: { ...fullAccess(), assignTickets: true, closeTickets: true },
    notifications: { ...fullAccess(), sendPush: true, sendEmail: true },
    reports: { view: true, export: true, accessFinancial: true },
    settings: { ...fullAccess(), modifyRazorpay: true, modifyCommission: true },
    adminManagement: fullAccess(),
    rolesPermissions: fullAccess(),
    systemHealth: { view: true },
  },
  Support: {
    dashboard: { view: true },
    userManagement: viewAndEdit(),
    listenerManagement: readOnly(),
    sessionManagement: { ...viewAndEdit(), endSession: false },
    compliance: { ...readOnly(), viewMessages: false, flagContent: false },
    walletPayments: { ...noAccess(), processRefund: false, approveWithdrawal: false, manualAdjustment: false },
    supportTicketing: { ...fullAccess(), assignTickets: true, closeTickets: true },
    notifications: { ...fullAccess(), sendPush: true, sendEmail: true },
    reports: { view: false, export: false, accessFinancial: false },
    settings: { ...noAccess(), modifyRazorpay: false, modifyCommission: false },
    adminManagement: noAccess(),
    rolesPermissions: noAccess(),
    systemHealth: { view: false },
  },
  Finance: {
    dashboard: { view: true },
    userManagement: readOnly(),
    listenerManagement: viewAndEdit(),
    sessionManagement: { ...readOnly(), endSession: false },
    compliance: { ...noAccess(), viewMessages: false, flagContent: false },
    walletPayments: { ...fullAccess(), processRefund: true, approveWithdrawal: true, manualAdjustment: true },
    supportTicketing: { ...readOnly(), assignTickets: false, closeTickets: false },
    notifications: { ...noAccess(), sendPush: false, sendEmail: false },
    reports: { view: true, export: true, accessFinancial: true },
    settings: { ...readOnly(), modifyRazorpay: true, modifyCommission: true },
    adminManagement: noAccess(),
    rolesPermissions: noAccess(),
    systemHealth: { view: false },
  },
  Compliance: {
    dashboard: { view: true },
    userManagement: viewAndEdit(),
    listenerManagement: viewAndEdit(),
    sessionManagement: { ...fullAccess(), endSession: true },
    compliance: { ...fullAccess(), viewMessages: true, flagContent: true },
    walletPayments: { ...readOnly(), processRefund: false, approveWithdrawal: false, manualAdjustment: false },
    supportTicketing: { ...fullAccess(), assignTickets: true, closeTickets: true },
    notifications: { ...readOnly(), sendPush: false, sendEmail: false },
    reports: { view: true, export: true, accessFinancial: false },
    settings: { ...readOnly(), modifyRazorpay: false, modifyCommission: false },
    adminManagement: noAccess(),
    rolesPermissions: noAccess(),
    systemHealth: { view: false },
  },
};

// Simple module access permissions (backward compatibility)
export const rolePermissions: Record<Role, Permission> = {
  SuperAdmin: {
    dashboard: true,
    userManagement: true,
    listenerManagement: true,
    sessionManagement: true,
    compliance: true,
    walletPayments: true,
    supportTicketing: true,
    notifications: true,
    reports: true,
    settings: true,
    adminManagement: true,
    rolesPermissions: true,
    systemHealth: true,
  },
  Support: {
    dashboard: true,
    userManagement: true,
    listenerManagement: false,
    sessionManagement: true,
    compliance: false,
    walletPayments: false,
    supportTicketing: true,
    notifications: true,
    reports: false,
    settings: false,
    adminManagement: false,
    rolesPermissions: false,
    systemHealth: false,
  },
  Finance: {
    dashboard: true,
    userManagement: false,
    listenerManagement: true,
    sessionManagement: true,
    compliance: false,
    walletPayments: true,
    supportTicketing: false,
    notifications: false,
    reports: true,
    settings: false,
    adminManagement: false,
    rolesPermissions: false,
    systemHealth: false,
  },
  Compliance: {
    dashboard: true,
    userManagement: true,
    listenerManagement: true,
    sessionManagement: true,
    compliance: true,
    walletPayments: false,
    supportTicketing: true,
    notifications: false,
    reports: true,
    settings: false,
    adminManagement: false,
    rolesPermissions: false,
    systemHealth: false,
  },
};

export const hasPermission = (role: Role, module: keyof Permission): boolean => {
  return rolePermissions[role][module];
};

// Helper to get granular permissions
export const getGranularPermissions = (role: Role): RolePermissions => {
  return granularRolePermissions[role];
};

// Helper to check specific action permission
export const hasActionPermission = (
  permissions: RolePermissions,
  module: keyof RolePermissions,
  action: string
): boolean => {
  const modulePerms = permissions[module] as any;
  if (!modulePerms) return false;
  
  // Handle simple view permission
  if (action === 'view' && 'view' in modulePerms) {
    return modulePerms.view;
  }
  
  // Handle specific actions
  return modulePerms[action] || false;
};
