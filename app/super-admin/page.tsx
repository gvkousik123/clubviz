'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Users, 
    Shield, 
    BarChart3, 
    Settings, 
    UserCheck, 
    UserX, 
    Crown,
    Search,
    Filter,
    MoreVertical,
    Trash2,
    UserPlus,
    Eye,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { AuthService } from '@/lib/services/auth.service';
import { useToast } from '@/hooks/use-toast';

interface User {
    username: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    roles: string[];
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
}

interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    admins: number;
    inactiveUsers: number;
}

export default function SuperAdminPage() {
    const router = useRouter();
    const { toast } = useToast();
    
    // State management
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'roles' | 'stats'>('dashboard');
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        activeUsers: 0,
        admins: 0,
        inactiveUsers: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [expandedUser, setExpandedUser] = useState<string | null>(null);

    // Mock data for demonstration (replace with actual API calls)
    const mockUsers: User[] = [
        {
            username: 'kousik123',
            email: 'kousik123@gmail.com',
            fullName: 'Ganta Venkata Kousik',
            phoneNumber: '+919608524',
            roles: ['USER', 'ADMIN'],
            isActive: true,
            createdAt: '2024-01-15',
            lastLogin: '2025-10-25'
        },
        {
            username: 'amin',
            email: 'amin@gmail.com',
            fullName: 'Amin Khan',
            phoneNumber: '+919876543210',
            roles: ['USER'],
            isActive: true,
            createdAt: '2024-02-20',
            lastLogin: '2025-10-24'
        },
        {
            username: 'testuser',
            email: 'test@example.com',
            fullName: 'Test User',
            phoneNumber: '+919123456789',
            roles: ['USER'],
            isActive: false,
            createdAt: '2024-03-10',
            lastLogin: '2025-09-15'
        }
    ];

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            // Mock API call - replace with actual implementation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setUsers(mockUsers);
            setStats({
                totalUsers: mockUsers.length,
                activeUsers: mockUsers.filter(u => u.isActive).length,
                admins: mockUsers.filter(u => u.roles.includes('ADMIN')).length,
                inactiveUsers: mockUsers.filter(u => !u.isActive).length
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load dashboard data",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRole = async (username: string, role: string) => {
        setIsLoading(true);
        try {
            await AuthService.addRoleToUser(username, role);
            toast({
                title: "Success",
                description: `Role ${role} added to ${username}`,
            });
            loadDashboardData();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to add role",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveRole = async (username: string, role: string) => {
        setIsLoading(true);
        try {
            await AuthService.removeRoleFromUser(username, role);
            toast({
                title: "Success",
                description: `Role ${role} removed from ${username}`,
            });
            loadDashboardData();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to remove role",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivateUser = async (username: string) => {
        setIsLoading(true);
        try {
            // Mock API call - implement actual endpoint
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setUsers(prev => prev.map(user => 
                user.username === username ? { ...user, isActive: true } : user
            ));
            
            toast({
                title: "Success",
                description: `User ${username} activated`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to activate user",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeactivateUser = async (username: string) => {
        setIsLoading(true);
        try {
            // Mock API call - implement actual endpoint
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setUsers(prev => prev.map(user => 
                user.username === username ? { ...user, isActive: false } : user
            ));
            
            toast({
                title: "Success",
                description: `User ${username} deactivated`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to deactivate user",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (username: string) => {
        if (!confirm(`Are you sure you want to delete user ${username}? This action cannot be undone.`)) {
            return;
        }

        setIsLoading(true);
        try {
            // Mock API call - implement actual endpoint
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setUsers(prev => prev.filter(user => user.username !== username));
            
            toast({
                title: "Success",
                description: `User ${username} deleted`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesRole = selectedRole === 'all' || user.roles.includes(selectedRole.toUpperCase());
        
        return matchesSearch && matchesRole;
    });

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0D1F1F] rounded-[15px] p-4 border border-[#14FFEC]/20">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="w-6 h-6 text-[#14FFEC]" />
                        <span className="text-2xl font-bold text-white">{stats.totalUsers}</span>
                    </div>
                    <p className="text-[#14FFEC] text-sm">Total Users</p>
                </div>

                <div className="bg-[#0D1F1F] rounded-[15px] p-4 border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <UserCheck className="w-6 h-6 text-green-500" />
                        <span className="text-2xl font-bold text-white">{stats.activeUsers}</span>
                    </div>
                    <p className="text-green-500 text-sm">Active Users</p>
                </div>

                <div className="bg-[#0D1F1F] rounded-[15px] p-4 border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <Crown className="w-6 h-6 text-yellow-500" />
                        <span className="text-2xl font-bold text-white">{stats.admins}</span>
                    </div>
                    <p className="text-yellow-500 text-sm">Admins</p>
                </div>

                <div className="bg-[#0D1F1F] rounded-[15px] p-4 border border-red-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <UserX className="w-6 h-6 text-red-500" />
                        <span className="text-2xl font-bold text-white">{stats.inactiveUsers}</span>
                    </div>
                    <p className="text-red-500 text-sm">Inactive Users</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#0D1F1F] rounded-[15px] p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setActiveTab('users')}
                        className="bg-[#14FFEC] text-black font-semibold py-3 rounded-[12px] flex items-center justify-center gap-2"
                    >
                        <Users className="w-4 h-4" />
                        Manage Users
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className="bg-[#222831] text-white font-semibold py-3 rounded-[12px] border border-[#14FFEC]/30 flex items-center justify-center gap-2"
                    >
                        <Shield className="w-4 h-4" />
                        Manage Roles
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#0D1F1F] rounded-[15px] p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-[#021313] rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <div className="flex-1">
                            <p className="text-white text-sm">User kousik123 logged in</p>
                            <p className="text-gray-400 text-xs">2 minutes ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-[#021313] rounded-lg">
                        <UserPlus className="w-4 h-4 text-[#14FFEC]" />
                        <div className="flex-1">
                            <p className="text-white text-sm">New user registered: amin</p>
                            <p className="text-gray-400 text-xs">1 hour ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-[#021313] rounded-lg">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <div className="flex-1">
                            <p className="text-white text-sm">Admin role added to kousik123</p>
                            <p className="text-gray-400 text-xs">3 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#0D1F1F] rounded-[12px] text-white placeholder-gray-400 border border-[#14FFEC]/20 focus:outline-none focus:border-[#14FFEC]"
                    />
                </div>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-3 bg-[#0D1F1F] rounded-[12px] text-white border border-[#14FFEC]/20 focus:outline-none focus:border-[#14FFEC]"
                >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            {/* Users List */}
            <div className="space-y-3">
                {filteredUsers.map((user) => (
                    <div key={user.username} className="bg-[#0D1F1F] rounded-[15px] p-4 border border-[#14FFEC]/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    user.isActive ? 'bg-green-500/20' : 'bg-red-500/20'
                                }`}>
                                    <Users className={`w-5 h-5 ${
                                        user.isActive ? 'text-green-500' : 'text-red-500'
                                    }`} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold">{user.fullName}</h4>
                                    <p className="text-gray-400 text-sm">@{user.username}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setExpandedUser(expandedUser === user.username ? null : user.username)}
                                className="p-2 hover:bg-[#021313] rounded-lg transition-colors"
                            >
                                {expandedUser === user.username ? 
                                    <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                }
                            </button>
                        </div>

                        {expandedUser === user.username && (
                            <div className="mt-4 pt-4 border-t border-[#14FFEC]/10">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-gray-400 text-xs">Email</p>
                                        <p className="text-white text-sm">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">Phone</p>
                                        <p className="text-white text-sm">{user.phoneNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">Roles</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {user.roles.map(role => (
                                                <span key={role} className={`px-2 py-1 rounded-full text-xs ${
                                                    role === 'ADMIN' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-[#14FFEC]/20 text-[#14FFEC]'
                                                }`}>
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">Status</p>
                                        <span className={`inline-flex items-center gap-1 text-sm ${
                                            user.isActive ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                            {user.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                {/* User Actions */}
                                <div className="flex flex-wrap gap-2">
                                    {user.isActive ? (
                                        <button
                                            onClick={() => handleDeactivateUser(user.username)}
                                            disabled={isLoading}
                                            className="px-3 py-1 bg-red-500/20 text-red-500 rounded-lg text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                        >
                                            <UserX className="w-3 h-3 inline mr-1" />
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleActivateUser(user.username)}
                                            disabled={isLoading}
                                            className="px-3 py-1 bg-green-500/20 text-green-500 rounded-lg text-sm hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                        >
                                            <UserCheck className="w-3 h-3 inline mr-1" />
                                            Activate
                                        </button>
                                    )}

                                    {!user.roles.includes('ADMIN') && (
                                        <button
                                            onClick={() => handleAddRole(user.username, 'ADMIN')}
                                            disabled={isLoading}
                                            className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
                                        >
                                            <Crown className="w-3 h-3 inline mr-1" />
                                            Make Admin
                                        </button>
                                    )}

                                    {user.roles.includes('ADMIN') && user.roles.length > 1 && (
                                        <button
                                            onClick={() => handleRemoveRole(user.username, 'ADMIN')}
                                            disabled={isLoading}
                                            className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-lg text-sm hover:bg-orange-500/30 transition-colors disabled:opacity-50"
                                        >
                                            <Shield className="w-3 h-3 inline mr-1" />
                                            Remove Admin
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDeleteUser(user.username)}
                                        disabled={isLoading}
                                        className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="w-3 h-3 inline mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No users found</p>
                </div>
            )}
        </div>
    );

    const renderRoles = () => (
        <div className="space-y-4">
            <div className="bg-[#0D1F1F] rounded-[15px] p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Role Management</h3>
                <p className="text-gray-400 text-sm mb-4">
                    Manage user roles and permissions. Available roles: USER, ADMIN
                </p>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#021313] rounded-lg">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-[#14FFEC]" />
                            <div>
                                <h4 className="text-white font-medium">USER</h4>
                                <p className="text-gray-400 text-sm">Standard user access</p>
                            </div>
                        </div>
                        <span className="text-[#14FFEC] text-sm">
                            {users.filter(u => u.roles.includes('USER')).length} users
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#021313] rounded-lg">
                        <div className="flex items-center gap-3">
                            <Crown className="w-5 h-5 text-yellow-500" />
                            <div>
                                <h4 className="text-white font-medium">ADMIN</h4>
                                <p className="text-gray-400 text-sm">Administrative access</p>
                            </div>
                        </div>
                        <span className="text-yellow-500 text-sm">
                            {users.filter(u => u.roles.includes('ADMIN')).length} users
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStats = () => (
        <div className="space-y-4">
            <div className="bg-[#0D1F1F] rounded-[15px] p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Admin Statistics</h3>
                    <button
                        onClick={loadDashboardData}
                        disabled={isLoading}
                        className="p-2 hover:bg-[#021313] rounded-lg transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 text-[#14FFEC] ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-[#021313] rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400">User Distribution</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-white">Active Users</span>
                                    <span className="text-green-500">{stats.activeUsers}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white">Inactive Users</span>
                                    <span className="text-red-500">{stats.inactiveUsers}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white">Admin Users</span>
                                    <span className="text-yellow-500">{stats.admins}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-[#021313] rounded-lg">
                        <h4 className="text-white font-medium mb-3">System Health</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-white text-sm">Authentication Service</span>
                                <span className="text-green-500 text-sm">Online</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-white text-sm">User Management</span>
                                <span className="text-green-500 text-sm">Online</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-white text-sm">Role Management</span>
                                <span className="text-green-500 text-sm">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-30 flex flex-col pt-8 bg-gradient-to-b from-[#11B9AB] to-[#222831] h-[140px] w-full">
                <div className="px-6">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="w-[35px] h-[35px] bg-white/20 overflow-hidden rounded-[18px] flex items-center justify-center"
                        >
                            <span className="text-white text-lg font-bold">&lt;</span>
                        </button>
                        {isLoading && (
                            <div className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-white animate-spin" />
                                <span className="text-white text-sm">Loading...</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-center px-6 flex-1 flex flex-col justify-center">
                    <div className="text-white text-xl font-['Manrope'] font-bold leading-6 tracking-[0.50px]">
                        SUPER ADMIN
                    </div>
                    <div className="text-white/70 text-sm mt-1">
                        System Administration
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pt-[160px] pb-6">
                {/* Tab Navigation */}
                <div className="mb-6">
                    <div className="flex bg-[#0D1F1F] rounded-[20px] p-1">
                        {[
                            { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                            { key: 'users', label: 'Users', icon: Users },
                            { key: 'roles', label: 'Roles', icon: Shield },
                            { key: 'stats', label: 'Stats', icon: Settings }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-[16px] text-sm font-medium transition-all ${
                                    activeTab === key
                                        ? 'bg-[#14FFEC] text-black'
                                        : 'text-white/70 hover:text-white'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[60vh]">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'users' && renderUsers()}
                    {activeTab === 'roles' && renderRoles()}
                    {activeTab === 'stats' && renderStats()}
                </div>
            </div>
        </div>
    );
}