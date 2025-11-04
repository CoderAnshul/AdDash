import type { 
  Admin, User, Listener, Session, Transaction, Ticket, 
  Notification, AuditLog, ChatMessage, AppSettings, KPIData, ActivityFeedItem,
  CustomRole
} from './types';
import { granularRolePermissions } from './permissions';

// Mock Custom Roles Data (includes system roles + custom roles)
export const mockCustomRoles: CustomRole[] = [
  {
    id: 'role-system-1',
    name: 'SuperAdmin',
    description: 'Full access to all features and settings',
    isSystem: true,
    permissions: granularRolePermissions.SuperAdmin,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system',
    assignedTo: 1,
  },
  {
    id: 'role-system-2',
    name: 'Support',
    description: 'Handle user tickets, sessions, and basic user management',
    isSystem: true,
    permissions: granularRolePermissions.Support,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system',
    assignedTo: 1,
  },
  {
    id: 'role-system-3',
    name: 'Finance',
    description: 'Manage payments, wallets, withdrawals, and financial reports',
    isSystem: true,
    permissions: granularRolePermissions.Finance,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system',
    assignedTo: 1,
  },
  {
    id: 'role-system-4',
    name: 'Compliance',
    description: 'Monitor compliance, review content, and manage audits',
    isSystem: true,
    permissions: granularRolePermissions.Compliance,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system',
    assignedTo: 1,
  },
  {
    id: 'role-custom-1',
    name: 'Content Moderator',
    description: 'Review and moderate chat/call content for policy violations',
    isSystem: false,
    permissions: {
      dashboard: { view: true },
      userManagement: { view: true, create: false, edit: true, delete: false, export: false },
      listenerManagement: { view: true, create: false, edit: true, delete: false, export: false },
      sessionManagement: { view: true, create: false, edit: false, delete: false, export: false, endSession: false },
      compliance: { view: true, create: true, edit: true, delete: false, export: true, viewMessages: true, flagContent: true },
      walletPayments: { view: false, create: false, edit: false, delete: false, export: false, processRefund: false, approveWithdrawal: false, manualAdjustment: false },
      supportTicketing: { view: true, create: true, edit: true, delete: false, export: false, assignTickets: false, closeTickets: false },
      notifications: { view: false, create: false, edit: false, delete: false, export: false, sendPush: false, sendEmail: false },
      reports: { view: true, export: false, accessFinancial: false },
      settings: { view: false, create: false, edit: false, delete: false, export: false, modifyRazorpay: false, modifyCommission: false },
      adminManagement: { view: false, create: false, edit: false, delete: false, export: false },
      rolesPermissions: { view: false, create: false, edit: false, delete: false, export: false },
      systemHealth: { view: false },
    },
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
    createdBy: 'admin-1',
    assignedTo: 3,
  },
  {
    id: 'role-custom-2',
    name: 'Customer Success Manager',
    description: 'Handle user onboarding, support tickets, and user communications',
    isSystem: false,
    permissions: {
      dashboard: { view: true },
      userManagement: { view: true, create: true, edit: true, delete: false, export: true },
      listenerManagement: { view: true, create: false, edit: false, delete: false, export: false },
      sessionManagement: { view: true, create: false, edit: false, delete: false, export: false, endSession: false },
      compliance: { view: false, create: false, edit: false, delete: false, export: false, viewMessages: false, flagContent: false },
      walletPayments: { view: true, create: false, edit: false, delete: false, export: false, processRefund: false, approveWithdrawal: false, manualAdjustment: false },
      supportTicketing: { view: true, create: true, edit: true, delete: false, export: true, assignTickets: true, closeTickets: true },
      notifications: { view: true, create: true, edit: true, delete: false, export: false, sendPush: true, sendEmail: true },
      reports: { view: true, export: true, accessFinancial: false },
      settings: { view: false, create: false, edit: false, delete: false, export: false, modifyRazorpay: false, modifyCommission: false },
      adminManagement: { view: false, create: false, edit: false, delete: false, export: false },
      rolesPermissions: { view: false, create: false, edit: false, delete: false, export: false },
      systemHealth: { view: false },
    },
    createdAt: '2024-06-01T09:00:00Z',
    updatedAt: '2024-08-10T11:20:00Z',
    createdBy: 'admin-1',
    assignedTo: 2,
  },
  {
    id: 'role-custom-3',
    name: 'Listener Onboarding Specialist',
    description: 'Approve and manage new listener applications',
    isSystem: false,
    permissions: {
      dashboard: { view: true },
      userManagement: { view: true, create: false, edit: false, delete: false, export: false },
      listenerManagement: { view: true, create: true, edit: true, delete: false, export: true },
      sessionManagement: { view: true, create: false, edit: false, delete: false, export: false, endSession: false },
      compliance: { view: true, create: false, edit: false, delete: false, export: false, viewMessages: false, flagContent: false },
      walletPayments: { view: true, create: false, edit: false, delete: false, export: false, processRefund: false, approveWithdrawal: false, manualAdjustment: false },
      supportTicketing: { view: true, create: true, edit: true, delete: false, export: false, assignTickets: false, closeTickets: false },
      notifications: { view: true, create: false, edit: false, delete: false, export: false, sendPush: false, sendEmail: false },
      reports: { view: true, export: false, accessFinancial: false },
      settings: { view: false, create: false, edit: false, delete: false, export: false, modifyRazorpay: false, modifyCommission: false },
      adminManagement: { view: false, create: false, edit: false, delete: false, export: false },
      rolesPermissions: { view: false, create: false, edit: false, delete: false, export: false },
      systemHealth: { view: false },
    },
    createdAt: '2024-07-10T13:30:00Z',
    updatedAt: '2024-09-05T16:45:00Z',
    createdBy: 'admin-1',
    assignedTo: 1,
  },
  {
    id: 'role-custom-4',
    name: 'Read Only Analyst',
    description: 'View-only access to reports and analytics',
    isSystem: false,
    permissions: {
      dashboard: { view: true },
      userManagement: { view: true, create: false, edit: false, delete: false, export: false },
      listenerManagement: { view: true, create: false, edit: false, delete: false, export: false },
      sessionManagement: { view: true, create: false, edit: false, delete: false, export: false, endSession: false },
      compliance: { view: false, create: false, edit: false, delete: false, export: false, viewMessages: false, flagContent: false },
      walletPayments: { view: true, create: false, edit: false, delete: false, export: false, processRefund: false, approveWithdrawal: false, manualAdjustment: false },
      supportTicketing: { view: true, create: false, edit: false, delete: false, export: false, assignTickets: false, closeTickets: false },
      notifications: { view: false, create: false, edit: false, delete: false, export: false, sendPush: false, sendEmail: false },
      reports: { view: true, export: true, accessFinancial: false },
      settings: { view: false, create: false, edit: false, delete: false, export: false, modifyRazorpay: false, modifyCommission: false },
      adminManagement: { view: false, create: false, edit: false, delete: false, export: false },
      rolesPermissions: { view: false, create: false, edit: false, delete: false, export: false },
      systemHealth: { view: true },
    },
    createdAt: '2024-08-20T08:15:00Z',
    updatedAt: '2024-08-20T08:15:00Z',
    createdBy: 'admin-1',
    assignedTo: 0,
  },
];

// Mock Admin Data
export const mockAdmins: Admin[] = [
  {
    id: 'admin-1',
    email: 'superadmin@example.com',
    name: 'John Doe',
    role: 'SuperAdmin',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2025-10-26T10:00:00Z',
    twoFactorEnabled: true,
    permissions: ['*']
  },
  {
    id: 'admin-2',
    email: 'support@example.com',
    name: 'Jane Smith',
    role: 'Support',
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: '2025-10-25T15:30:00Z',
    twoFactorEnabled: false,
    permissions: ['users', 'tickets', 'sessions']
  },
  {
    id: 'admin-3',
    email: 'finance@example.com',
    name: 'Mike Johnson',
    role: 'Finance',
    createdAt: '2024-03-01T00:00:00Z',
    lastLogin: '2025-10-26T09:00:00Z',
    twoFactorEnabled: true,
    permissions: ['wallet', 'transactions', 'reports']
  },
  {
    id: 'admin-4',
    email: 'compliance@example.com',
    name: 'Sarah Williams',
    role: 'Compliance',
    createdAt: '2024-04-01T00:00:00Z',
    lastLogin: '2025-10-24T14:00:00Z',
    twoFactorEnabled: true,
    permissions: ['compliance', 'audit', 'reports']
  }
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: 'user-1',
    alias: 'happyuser123',
    email: 'user1@example.com',
    phone: '+1234567890',
    status: 'active',
    wallet: 450.00,
    registrationDate: '2024-08-15T10:00:00Z',
    lastActive: '2025-10-26T08:30:00Z',
    totalSessions: 28,
    totalSpent: 1240.50
  },
  {
    id: 'user-2',
    alias: 'anonymous_soul',
    email: 'user2@example.com',
    phone: '+1234567891',
    status: 'active',
    wallet: 120.00,
    registrationDate: '2024-09-20T14:30:00Z',
    lastActive: '2025-10-25T20:15:00Z',
    totalSessions: 15,
    totalSpent: 680.00
  },
  {
    id: 'user-3',
    alias: 'seekinghelp',
    email: 'user3@example.com',
    phone: '+1234567892',
    status: 'blocked',
    wallet: 0.00,
    registrationDate: '2024-07-10T09:00:00Z',
    lastActive: '2025-10-20T11:00:00Z',
    totalSessions: 42,
    totalSpent: 2100.00
  },
  {
    id: 'user-4',
    alias: 'newbie2024',
    email: 'user4@example.com',
    phone: '+1234567893',
    status: 'active',
    wallet: 500.00,
    registrationDate: '2025-10-01T12:00:00Z',
    lastActive: '2025-10-26T07:45:00Z',
    totalSessions: 5,
    totalSpent: 250.00
  },
  {
    id: 'user-5',
    alias: 'talkative_one',
    email: 'user5@example.com',
    phone: '+1234567894',
    status: 'active',
    wallet: 800.00,
    registrationDate: '2024-06-05T16:20:00Z',
    lastActive: '2025-10-26T09:00:00Z',
    totalSessions: 67,
    totalSpent: 3450.75
  }
];

// Mock Listeners Data
export const mockListeners: Listener[] = [
  {
    id: 'listener-1',
    name: 'Dr. Emily Carter',
    email: 'emily@example.com',
    expertiseTags: ['Anxiety', 'Relationships', 'Stress Management'],
    experience: 8,
    rating: 4.8,
    verificationStatus: 'approved',
    earnings: 12450.00,
    totalSessions: 234,
    joinedDate: '2024-01-15T00:00:00Z',
    commission: 20
  },
  {
    id: 'listener-2',
    name: 'Michael Brown',
    email: 'michael@example.com',
    expertiseTags: ['Career Counseling', 'Life Coaching'],
    experience: 5,
    rating: 4.6,
    verificationStatus: 'approved',
    earnings: 8900.00,
    totalSessions: 178,
    joinedDate: '2024-03-20T00:00:00Z',
    commission: 20
  },
  {
    id: 'listener-3',
    name: 'Sophia Lee',
    email: 'sophia@example.com',
    expertiseTags: ['Depression', 'Grief', 'Trauma'],
    experience: 12,
    rating: 4.9,
    verificationStatus: 'approved',
    earnings: 15670.00,
    totalSessions: 298,
    joinedDate: '2023-11-10T00:00:00Z',
    commission: 15
  },
  {
    id: 'listener-4',
    name: 'David Martinez',
    email: 'david@example.com',
    expertiseTags: ['Family Issues', 'Parenting'],
    experience: 3,
    rating: 4.5,
    verificationStatus: 'pending',
    earnings: 0,
    totalSessions: 0,
    joinedDate: '2025-10-20T00:00:00Z',
    commission: 20
  },
  {
    id: 'listener-5',
    name: 'Rachel Green',
    email: 'rachel@example.com',
    expertiseTags: ['Addiction', 'Self-esteem'],
    experience: 6,
    rating: 4.7,
    verificationStatus: 'suspended',
    earnings: 9870.00,
    totalSessions: 156,
    joinedDate: '2024-05-12T00:00:00Z',
    commission: 20
  }
];

// Mock Sessions Data
export const mockSessions: Session[] = [
  {
    id: 'session-1',
    userAlias: 'happyuser123',
    userId: 'user-1',
    listenerName: 'Dr. Emily Carter',
    listenerId: 'listener-1',
    type: 'video',
    startTime: '2025-10-26T08:00:00Z',
    endTime: '2025-10-26T08:45:00Z',
    duration: 45,
    status: 'completed',
    paymentStatus: 'completed',
    amount: 50.00
  },
  {
    id: 'session-2',
    userAlias: 'anonymous_soul',
    userId: 'user-2',
    listenerName: 'Michael Brown',
    listenerId: 'listener-2',
    type: 'chat',
    startTime: '2025-10-26T09:30:00Z',
    duration: 0,
    status: 'ongoing',
    paymentStatus: 'pending',
    amount: 30.00
  },
  {
    id: 'session-3',
    userAlias: 'talkative_one',
    userId: 'user-5',
    listenerName: 'Sophia Lee',
    listenerId: 'listener-3',
    type: 'audio',
    startTime: '2025-10-25T15:00:00Z',
    endTime: '2025-10-25T16:00:00Z',
    duration: 60,
    status: 'completed',
    paymentStatus: 'completed',
    amount: 60.00
  },
  {
    id: 'session-4',
    userAlias: 'newbie2024',
    userId: 'user-4',
    listenerName: 'Dr. Emily Carter',
    listenerId: 'listener-1',
    type: 'video',
    startTime: '2025-10-24T10:00:00Z',
    endTime: '2025-10-24T10:30:00Z',
    duration: 30,
    status: 'cancelled',
    paymentStatus: 'refunded',
    amount: 40.00
  },
  {
    id: 'session-5',
    userAlias: 'happyuser123',
    userId: 'user-1',
    listenerName: 'Michael Brown',
    listenerId: 'listener-2',
    type: 'chat',
    startTime: '2025-10-23T14:20:00Z',
    endTime: '2025-10-23T15:00:00Z',
    duration: 40,
    status: 'completed',
    paymentStatus: 'completed',
    amount: 35.00
  }
];

// Mock Transactions Data
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    userId: 'user-1',
    userName: 'happyuser123',
    amount: 100.00,
    type: 'deposit',
    method: 'Razorpay',
    status: 'completed',
    timestamp: '2025-10-25T10:00:00Z',
    razorpayId: 'pay_ABC123XYZ'
  },
  {
    id: 'txn-2',
    userId: 'listener-1',
    userName: 'Dr. Emily Carter',
    amount: 500.00,
    type: 'withdrawal',
    method: 'Bank Transfer',
    status: 'pending',
    timestamp: '2025-10-26T08:00:00Z'
  },
  {
    id: 'txn-3',
    userId: 'user-5',
    userName: 'talkative_one',
    amount: 60.00,
    type: 'session_payment',
    method: 'Wallet',
    status: 'completed',
    timestamp: '2025-10-25T16:00:00Z'
  },
  {
    id: 'txn-4',
    userId: 'user-4',
    userName: 'newbie2024',
    amount: 40.00,
    type: 'refund',
    method: 'Razorpay',
    status: 'completed',
    timestamp: '2025-10-24T11:00:00Z',
    razorpayId: 'rfnd_XYZ789ABC'
  },
  {
    id: 'txn-5',
    userId: 'listener-3',
    userName: 'Sophia Lee',
    amount: 51.00,
    type: 'commission',
    method: 'Auto',
    status: 'completed',
    timestamp: '2025-10-25T16:05:00Z'
  }
];

// Mock Tickets Data
export const mockTickets: Ticket[] = [
  {
    id: 'ticket-1',
    creatorId: 'user-1',
    creatorName: 'happyuser123',
    category: 'Payment Issue',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'admin-2',
    subject: 'Wallet not updated after payment',
    createdAt: '2025-10-25T09:00:00Z',
    updatedAt: '2025-10-26T08:00:00Z',
    replies: [
      {
        id: 'reply-1',
        ticketId: 'ticket-1',
        authorId: 'user-1',
        authorName: 'happyuser123',
        content: 'I made a payment of $100 but my wallet still shows old balance',
        isInternal: false,
        timestamp: '2025-10-25T09:00:00Z'
      },
      {
        id: 'reply-2',
        ticketId: 'ticket-1',
        authorId: 'admin-2',
        authorName: 'Jane Smith',
        content: 'Checking transaction logs now',
        isInternal: true,
        timestamp: '2025-10-25T10:00:00Z'
      }
    ]
  },
  {
    id: 'ticket-2',
    creatorId: 'listener-2',
    creatorName: 'Michael Brown',
    category: 'Account Verification',
    priority: 'medium',
    status: 'open',
    subject: 'Documents submitted for verification',
    createdAt: '2025-10-24T14:00:00Z',
    updatedAt: '2025-10-24T14:00:00Z',
    replies: []
  },
  {
    id: 'ticket-3',
    creatorId: 'user-3',
    creatorName: 'seekinghelp',
    category: 'Account Access',
    priority: 'urgent',
    status: 'resolved',
    assignedTo: 'admin-2',
    subject: 'Cannot login to my account',
    createdAt: '2025-10-20T10:00:00Z',
    updatedAt: '2025-10-21T15:00:00Z',
    replies: []
  }
];

// Mock Notifications Data
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Feature Release',
    body: 'Check out our new video calling feature!',
    target: 'all_users',
    status: 'sent',
    createdAt: '2025-10-20T10:00:00Z',
    sentCount: 1247
  },
  {
    id: 'notif-2',
    title: 'Pending Verification',
    body: 'Your verification documents are under review',
    target: 'specific',
    targetIds: ['listener-4'],
    status: 'sent',
    createdAt: '2025-10-21T09:00:00Z',
    sentCount: 1
  },
  {
    id: 'notif-3',
    title: 'Scheduled Maintenance',
    body: 'Platform will be down for maintenance on Oct 30',
    target: 'all_users',
    status: 'scheduled',
    scheduled: '2025-10-29T10:00:00Z',
    createdAt: '2025-10-26T08:00:00Z'
  }
];

// Mock Audit Logs Data
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    adminId: 'admin-1',
    adminName: 'John Doe',
    action: 'USER_BLOCKED',
    module: 'User Management',
    details: 'Blocked user: seekinghelp (user-3)',
    ip: '192.168.1.100',
    timestamp: '2025-10-20T11:00:00Z'
  },
  {
    id: 'audit-2',
    adminId: 'admin-3',
    adminName: 'Mike Johnson',
    action: 'WITHDRAWAL_APPROVED',
    module: 'Wallet & Payments',
    details: 'Approved withdrawal: txn-2 for Dr. Emily Carter',
    ip: '192.168.1.101',
    timestamp: '2025-10-26T09:00:00Z'
  },
  {
    id: 'audit-3',
    adminId: 'admin-4',
    adminName: 'Sarah Williams',
    action: 'CHAT_VIEWED',
    module: 'Compliance',
    details: 'Viewed chat logs for session: session-1',
    ip: '192.168.1.102',
    timestamp: '2025-10-25T14:00:00Z'
  },
  {
    id: 'audit-4',
    adminId: 'admin-2',
    adminName: 'Jane Smith',
    action: 'TICKET_ASSIGNED',
    module: 'Support',
    details: 'Assigned ticket-1 to self',
    ip: '192.168.1.103',
    timestamp: '2025-10-25T10:00:00Z'
  }
];

// Mock Chat Messages Data
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sessionId: 'session-2',
    senderId: 'user-2',
    senderName: 'anonymous_soul',
    content: 'Hi, I need to talk about my anxiety',
    timestamp: '2025-10-26T09:30:00Z'
  },
  {
    id: 'msg-2',
    sessionId: 'session-2',
    senderId: 'listener-2',
    senderName: 'Michael Brown',
    content: 'Hello! I\'m here to listen. Tell me more about what you\'re experiencing.',
    timestamp: '2025-10-26T09:31:00Z'
  },
  {
    id: 'msg-3',
    sessionId: 'session-2',
    senderId: 'user-2',
    senderName: 'anonymous_soul',
    content: 'I\'ve been feeling really overwhelmed lately with work and personal life',
    timestamp: '2025-10-26T09:32:00Z'
  }
];

// Mock App Settings
export const mockSettings: AppSettings = {
  appName: 'ListenNow',
  appVersion: '2.1.0',
  forceUpdateVersion: '2.0.0',
  razorpayKeyId: 'rzp_test_XXXXXXXXXXXXXXX',
  razorpayKeySecret: '••••••••••••••••',
  commissionRate: 20,
  messageRetentionDays: 7,
  termsAndConditions: 'Terms and Conditions content goes here...',
  privacyPolicy: 'Privacy Policy content goes here...'
};

// Mock KPI Data
export const mockKPIData: KPIData = {
  totalUsers: 12847,
  activeListeners: 234,
  liveSessions: 45,
  monthlyRevenue: 156789.50,
  pendingWithdrawals: 23450.00,
  openTickets: 127
};

// Mock Activity Feed
export const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: 'activity-1',
    type: 'signup',
    message: 'New user registered: newbie2024',
    timestamp: '2025-10-26T09:45:00Z',
    icon: 'UserPlus'
  },
  {
    id: 'activity-2',
    type: 'payment',
    message: 'Payment received: $100 from happyuser123',
    timestamp: '2025-10-26T09:30:00Z',
    icon: 'DollarSign'
  },
  {
    id: 'activity-3',
    type: 'ticket',
    message: 'New ticket created: Wallet not updated',
    timestamp: '2025-10-26T09:15:00Z',
    icon: 'AlertCircle'
  },
  {
    id: 'activity-4',
    type: 'session',
    message: 'Session started: happyuser123 with Dr. Emily Carter',
    timestamp: '2025-10-26T08:00:00Z',
    icon: 'Video'
  },
  {
    id: 'activity-5',
    type: 'payment',
    message: 'Withdrawal requested: $500 by Dr. Emily Carter',
    timestamp: '2025-10-26T08:00:00Z',
    icon: 'ArrowUpCircle'
  }
];

// Chart Data
export const dailyActiveUsersData = [
  { date: 'Oct 20', users: 450, listeners: 45 },
  { date: 'Oct 21', users: 520, listeners: 52 },
  { date: 'Oct 22', users: 480, listeners: 48 },
  { date: 'Oct 23', users: 610, listeners: 61 },
  { date: 'Oct 24', users: 590, listeners: 59 },
  { date: 'Oct 25', users: 680, listeners: 68 },
  { date: 'Oct 26', users: 720, listeners: 72 }
];

export const revenueData = [
  { month: 'May', revenue: 98000 },
  { month: 'Jun', revenue: 112000 },
  { month: 'Jul', revenue: 128000 },
  { month: 'Aug', revenue: 135000 },
  { month: 'Sep', revenue: 145000 },
  { month: 'Oct', revenue: 156789 }
];

export const listenerApprovalData = [
  { status: 'Approved', count: 234 },
  { status: 'Pending', count: 23 },
  { status: 'Rejected', count: 12 },
  { status: 'Suspended', count: 8 }
];
