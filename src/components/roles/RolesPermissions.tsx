import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Users, 
  Search,
  Copy,
  Eye,
  Check,
  X,
  HelpCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { CustomRole, RolePermissions } from '../../lib/types';
import { mockCustomRoles, mockAdmins } from '../../lib/mockData';

export function RolesPermissions() {
  const [roles, setRoles] = useState<CustomRole[]>(mockCustomRoles);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [activeTab, setActiveTab] = useState('roles');

  // Form state for creating/editing roles
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: createDefaultPermissions(),
  });

  function createDefaultPermissions(): RolePermissions {
    return {
      dashboard: { view: false },
      userManagement: { view: false, create: false, edit: false, delete: false, export: false },
      listenerManagement: { view: false, create: false, edit: false, delete: false, export: false },
      sessionManagement: { view: false, create: false, edit: false, delete: false, export: false, endSession: false },
      compliance: { view: false, create: false, edit: false, delete: false, export: false, viewMessages: false, flagContent: false },
      walletPayments: { view: false, create: false, edit: false, delete: false, export: false, processRefund: false, approveWithdrawal: false, manualAdjustment: false },
      supportTicketing: { view: false, create: false, edit: false, delete: false, export: false, assignTickets: false, closeTickets: false },
      notifications: { view: false, create: false, edit: false, delete: false, export: false, sendPush: false, sendEmail: false },
      reports: { view: false, export: false, accessFinancial: false },
      settings: { view: false, create: false, edit: false, delete: false, export: false, modifyRazorpay: false, modifyCommission: false },
      adminManagement: { view: false, create: false, edit: false, delete: false, export: false },
      rolesPermissions: { view: false, create: false, edit: false, delete: false, export: false },
      systemHealth: { view: false },
    };
  }

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRole = () => {
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    const newRole: CustomRole = {
      id: `role-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      isSystem: false,
      permissions: formData.permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-admin-id',
      assignedTo: 0,
    };

    setRoles([...roles, newRole]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success(`Role "${formData.name}" created successfully`);
  };

  const handleEditRole = () => {
    if (!selectedRole || !formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    const updatedRoles = roles.map(role =>
      role.id === selectedRole.id
        ? {
            ...role,
            name: formData.name,
            description: formData.description,
            permissions: formData.permissions,
            updatedAt: new Date().toISOString(),
          }
        : role
    );

    setRoles(updatedRoles);
    setIsEditDialogOpen(false);
    setSelectedRole(null);
    resetForm();
    toast.success('Role updated successfully');
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;

    if (selectedRole.isSystem) {
      toast.error('Cannot delete system roles');
      return;
    }

    if (selectedRole.assignedTo > 0) {
      toast.error('Cannot delete role that is assigned to users');
      return;
    }

    setRoles(roles.filter(role => role.id !== selectedRole.id));
    setIsDeleteDialogOpen(false);
    setSelectedRole(null);
    toast.success('Role deleted successfully');
  };

  const handleDuplicateRole = (role: CustomRole) => {
    const duplicatedRole: CustomRole = {
      ...role,
      id: `role-${Date.now()}`,
      name: `${role.name} (Copy)`,
      isSystem: false,
      assignedTo: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-admin-id',
    };

    setRoles([...roles, duplicatedRole]);
    toast.success(`Role "${role.name}" duplicated successfully`);
  };

  const openEditDialog = (role: CustomRole) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (role: CustomRole) => {
    setSelectedRole(role);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (role: CustomRole) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: createDefaultPermissions(),
    });
  };

  const updatePermission = (module: keyof RolePermissions, action: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [action]: value,
        },
      },
    }));
  };

  const toggleAllModulePermissions = (module: keyof RolePermissions, enabled: boolean) => {
    const modulePerms = formData.permissions[module] as any;
    const updatedPerms: any = {};
    
    Object.keys(modulePerms).forEach(key => {
      updatedPerms[key] = enabled;
    });

    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: updatedPerms,
      },
    }));
  };

  const renderPermissionMatrix = () => {
    const modules = [
      { key: 'dashboard', label: 'Dashboard', actions: ['view'] },
      { key: 'userManagement', label: 'User Management', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { key: 'listenerManagement', label: 'Listener Management', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { key: 'sessionManagement', label: 'Session Management', actions: ['view', 'create', 'edit', 'delete', 'export', 'endSession'] },
      { key: 'compliance', label: 'Compliance', actions: ['view', 'create', 'edit', 'delete', 'export', 'viewMessages', 'flagContent'] },
      { key: 'walletPayments', label: 'Wallet & Payments', actions: ['view', 'create', 'edit', 'delete', 'export', 'processRefund', 'approveWithdrawal', 'manualAdjustment'] },
      { key: 'supportTicketing', label: 'Support Tickets', actions: ['view', 'create', 'edit', 'delete', 'export', 'assignTickets', 'closeTickets'] },
      { key: 'notifications', label: 'Notifications', actions: ['view', 'create', 'edit', 'delete', 'export', 'sendPush', 'sendEmail'] },
      { key: 'reports', label: 'Reports & Analytics', actions: ['view', 'export', 'accessFinancial'] },
      { key: 'settings', label: 'Settings', actions: ['view', 'create', 'edit', 'delete', 'export', 'modifyRazorpay', 'modifyCommission'] },
      { key: 'adminManagement', label: 'Admin Management', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { key: 'rolesPermissions', label: 'Roles & Permissions', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { key: 'systemHealth', label: 'System Health', actions: ['view'] },
    ];

    return (
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6">
          {modules.map(module => {
            const modulePerms = formData.permissions[module.key as keyof RolePermissions] as any;
            const allEnabled = module.actions.every(action => modulePerms[action]);

            return (
              <Card key={module.key}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{module.label}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAllModulePermissions(module.key as keyof RolePermissions, !allEnabled)}
                    >
                      {allEnabled ? 'Disable All' : 'Enable All'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {module.actions.map(action => (
                      <div key={action} className="flex items-center space-x-2">
                        <Switch
                          id={`${module.key}-${action}`}
                          checked={modulePerms[action] || false}
                          onCheckedChange={(checked) =>
                            updatePermission(module.key as keyof RolePermissions, action, checked)
                          }
                        />
                        <Label
                          htmlFor={`${module.key}-${action}`}
                          className="text-sm cursor-pointer capitalize"
                        >
                          {action.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  const renderViewPermissions = (permissions: RolePermissions) => {
    const modules = [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'userManagement', label: 'User Management' },
      { key: 'listenerManagement', label: 'Listener Management' },
      { key: 'sessionManagement', label: 'Session Management' },
      { key: 'compliance', label: 'Compliance' },
      { key: 'walletPayments', label: 'Wallet & Payments' },
      { key: 'supportTicketing', label: 'Support Tickets' },
      { key: 'notifications', label: 'Notifications' },
      { key: 'reports', label: 'Reports & Analytics' },
      { key: 'settings', label: 'Settings' },
      { key: 'adminManagement', label: 'Admin Management' },
      { key: 'rolesPermissions', label: 'Roles & Permissions' },
      { key: 'systemHealth', label: 'System Health' },
    ];

    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {modules.map(module => {
            const modulePerms = permissions[module.key as keyof RolePermissions] as any;
            const enabledPerms = Object.entries(modulePerms)
              .filter(([_, value]) => value === true)
              .map(([key]) => key);

            if (enabledPerms.length === 0) return null;

            return (
              <div key={module.key} className="border rounded-lg p-4">
                <h4 className="mb-2">{module.label}</h4>
                <div className="flex flex-wrap gap-2">
                  {enabledPerms.map(perm => (
                    <Badge key={perm} variant="secondary">
                      {(perm as string).replace(/([A-Z])/g, ' $1').trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl">Roles & Permissions</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHelpDialogOpen(true)}
            >
              <HelpCircle className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
          <p className="text-gray-500 mt-1">
            Manage roles and assign granular permissions to control admin access
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="roles">
            <Shield className="h-4 w-4 mr-2" />
            Roles ({roles.length})
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <Users className="h-4 w-4 mr-2" />
            Role Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Roles</CardTitle>
                  <CardDescription>View and manage system and custom roles</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map(role => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <span>{role.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {role.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.isSystem ? 'default' : 'secondary'}>
                          {role.isSystem ? 'System' : 'Custom'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{role.assignedTo} admins</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(role.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewDialog(role)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateRole(role)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(role)}
                            disabled={role.isSystem}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(role)}
                            disabled={role.isSystem || role.assignedTo > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Assignments</CardTitle>
              <CardDescription>View which admins have which roles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAdmins.map(admin => {
                    const role = roles.find(r => 
                      r.name === admin.role || r.id === admin.customRoleId
                    );
                    return (
                      <TableRow key={admin.id}>
                        <TableCell>{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <Badge>{role?.name || admin.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role with custom permissions for your admin team
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  placeholder="e.g., Content Moderator"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role-desc">Description</Label>
                <Input
                  id="role-desc"
                  placeholder="Brief description of the role"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Permissions</Label>
              {renderPermissionMatrix()}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Role: {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Modify permissions for this role
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-role-name">Role Name</Label>
                <Input
                  id="edit-role-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-role-desc">Description</Label>
                <Input
                  id="edit-role-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Permissions</Label>
              {renderPermissionMatrix()}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setSelectedRole(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditRole}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Role Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedRole?.name}</DialogTitle>
            <DialogDescription>{selectedRole?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Type</p>
                <Badge variant={selectedRole?.isSystem ? 'default' : 'secondary'}>
                  {selectedRole?.isSystem ? 'System Role' : 'Custom Role'}
                </Badge>
              </div>
              <div>
                <p className="text-gray-500">Assigned To</p>
                <p>{selectedRole?.assignedTo} admins</p>
              </div>
              <div>
                <p className="text-gray-500">Created</p>
                <p>{selectedRole && new Date(selectedRole.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Modified</p>
                <p>{selectedRole && new Date(selectedRole.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h4 className="mb-3">Permissions</h4>
              {selectedRole && renderViewPermissions(selectedRole.permissions)}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsViewDialogOpen(false);
              setSelectedRole(null);
            }}>
              Close
            </Button>
            {selectedRole && !selectedRole.isSystem && (
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                openEditDialog(selectedRole);
              }}>
                Edit Role
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false);
              setSelectedRole(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-red-600 hover:bg-red-700">
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Help Dialog */}
      <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              How to Use Roles & Permissions
            </DialogTitle>
            <DialogDescription>
              Learn how to create custom roles and manage granular permissions
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              <div>
                <h4 className="mb-2">🎯 Overview</h4>
                <p className="text-sm text-gray-600">
                  The Roles & Permissions module allows you to create custom roles with specific permissions for your admin team. 
                  This enables you to control exactly what each admin can access and modify in the system.
                </p>
              </div>

              <div>
                <h4 className="mb-2">📋 System Roles vs Custom Roles</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>System Roles</strong> (SuperAdmin, Support, Finance, Compliance) are predefined and cannot be deleted or renamed. You can duplicate them to create custom variations.</p>
                  <p><strong>Custom Roles</strong> are created by you and can be fully customized, edited, and deleted (if not assigned to any admin).</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2">➕ Creating a Custom Role</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Click the "Create Role" button</li>
                  <li>Enter a role name (e.g., "Content Moderator")</li>
                  <li>Add a description explaining the role's purpose</li>
                  <li>Configure permissions for each module using the permission matrix</li>
                  <li>Click "Create Role" to save</li>
                </ol>
              </div>

              <div>
                <h4 className="mb-2">🔐 Understanding Permissions</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>View:</strong> Can see the module and view data</p>
                  <p><strong>Create:</strong> Can add new records</p>
                  <p><strong>Edit:</strong> Can modify existing records</p>
                  <p><strong>Delete:</strong> Can remove records</p>
                  <p><strong>Export:</strong> Can export data to CSV/PDF</p>
                  <p><strong>Module-specific actions:</strong> Special permissions like "Process Refund" or "Flag Content"</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2">✏️ Example: Creating a Content Moderator Role</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 text-sm">
                  <p><strong>Name:</strong> Content Moderator</p>
                  <p><strong>Description:</strong> Reviews chat/call content for policy violations</p>
                  <p><strong>Key Permissions:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                    <li>Compliance: View, Edit, View Messages, Flag Content</li>
                    <li>User Management: View, Edit</li>
                    <li>Listener Management: View, Edit</li>
                    <li>Support Tickets: View, Create, Edit</li>
                    <li>Dashboard: View</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="mb-2">👥 Assigning Roles to Admins</h4>
                <p className="text-sm text-gray-600">
                  To assign a custom role to an admin user, go to the <strong>Admin Management</strong> module, 
                  edit an admin, and select the role from the dropdown. You can also view all role assignments 
                  in the "Role Assignments" tab.
                </p>
              </div>

              <div>
                <h4 className="mb-2">💡 Best Practices</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Follow the principle of least privilege - only grant permissions that are necessary</li>
                  <li>Use descriptive role names that clearly indicate the role's purpose</li>
                  <li>Document what each custom role is for in the description field</li>
                  <li>Regularly review role assignments to ensure they're still appropriate</li>
                  <li>Duplicate existing roles as a starting point when creating similar roles</li>
                  <li>Test new roles with a test admin account before assigning to production admins</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2">⚠️ Important Notes</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>System roles cannot be deleted or renamed</li>
                  <li>Custom roles cannot be deleted if they're assigned to any admin</li>
                  <li>Permission changes take effect immediately for all admins with that role</li>
                  <li>Only SuperAdmins can access the Roles & Permissions module</li>
                </ul>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button onClick={() => setIsHelpDialogOpen(false)}>
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
