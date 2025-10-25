import { api, handleApiResponse, handleApiError } from '../api-client';
import { ApiResponse } from '../api-types';

// ============================================================================
// SUPER ADMIN SERVICE TYPES
// ============================================================================

export interface SuperAdminUser {
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  admins: number;
  inactiveUsers: number;
  superAdmins: number;
  totalClubs: number;
  totalEvents: number;
  totalBookings: number;
}

export interface RoleManagementRequest {
  username: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
}

export interface UserStatusRequest {
  username: string;
}

// ============================================================================
// SUPER ADMIN SERVICE
// ============================================================================

/**
 * SuperAdmin Service
 * Handles all super administrative operations
 * These endpoints require SUPERADMIN role
 */
export class SuperAdminService {

  // ============================================================================
  // DASHBOARD & STATISTICS
  // ============================================================================

  /**
   * Get admin dashboard statistics
   * GET /admin/stats
   */
  static async getAdminStats(): Promise<AdminStats> {
    try {
      const response = await api.get<ApiResponse<AdminStats>>('/admin/stats');
      const result = handleApiResponse(response);
      return result.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================

  /**
   * Get all users with pagination
   * GET /admin/users
   */
  static async getAllUsers(page: number = 0, size: number = 10): Promise<{
    users: SuperAdminUser[];
    pagination: {
      total: number;
      page: number;
      size: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await api.get<ApiResponse<SuperAdminUser[]>>('/admin/users', {
        params: { page, size }
      });
      const result = handleApiResponse(response);
      
      return {
        users: result.data,
        pagination: {
          total: result.pagination?.total || result.data.length,
          page: result.pagination?.page || page,
          size: result.pagination?.limit || size,
          totalPages: result.pagination?.totalPages || Math.ceil(result.data.length / size)
        }
      };
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get user by username
   * GET /admin/users/{username}
   */
  static async getUserByUsername(username: string): Promise<SuperAdminUser> {
    try {
      const response = await api.get<ApiResponse<SuperAdminUser>>(`/admin/users/${username}`);
      const result = handleApiResponse(response);
      return result.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete user
   * DELETE /admin/users/{username}
   */
  static async deleteUser(username: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<ApiResponse<{ message: string }>>(`/admin/users/${username}`);
      const result = handleApiResponse(response);
      return result.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  // ============================================================================
  // USER STATUS MANAGEMENT
  // ============================================================================

  /**
   * Activate user
   * POST /admin/users/{username}/activate
   */
  static async activateUser(username: string): Promise<{ message: string }> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/admin/users/${username}/activate`
      );
      const result = handleApiResponse(response);
      return result.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Deactivate user
   * POST /admin/users/{username}/deactivate
   */
  static async deactivateUser(username: string): Promise<{ message: string }> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/admin/users/${username}/deactivate`
      );
      const result = handleApiResponse(response);
      return result.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  // ============================================================================
  // ROLE MANAGEMENT
  // ============================================================================

  /**
   * Get user roles
   * GET /admin/users/{username}/roles
   */
  static async getUserRoles(username: string): Promise<string[]> {
    try {
      const response = await api.get<ApiResponse<string[]>>(`/admin/users/${username}/roles`);
      const result = handleApiResponse(response);
      return result.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Add role to user
   * POST /admin/users/{username}/roles/{role}
   */
  static async addRoleToUser(username: string, role: string): Promise<{ message: string }> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/admin/users/${username}/roles/${role}`
      );
      const result = handleApiResponse(response);
      return result.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Remove role from user
   * DELETE /admin/users/{username}/roles/{role}
   */
  static async removeRoleFromUser(username: string, role: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<ApiResponse<{ message: string }>>(
        `/admin/users/${username}/roles/${role}`
      );
      const result = handleApiResponse(response);
      return result.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Bulk activate users
   */
  static async bulkActivateUsers(usernames: string[]): Promise<{ 
    successful: string[];
    failed: { username: string; error: string }[];
  }> {
    const results = {
      successful: [] as string[],
      failed: [] as { username: string; error: string }[]
    };

    for (const username of usernames) {
      try {
        await this.activateUser(username);
        results.successful.push(username);
      } catch (error) {
        results.failed.push({
          username,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Bulk deactivate users
   */
  static async bulkDeactivateUsers(usernames: string[]): Promise<{ 
    successful: string[];
    failed: { username: string; error: string }[];
  }> {
    const results = {
      successful: [] as string[],
      failed: [] as { username: string; error: string }[]
    };

    for (const username of usernames) {
      try {
        await this.deactivateUser(username);
        results.successful.push(username);
      } catch (error) {
        results.failed.push({
          username,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Bulk delete users
   */
  static async bulkDeleteUsers(usernames: string[]): Promise<{ 
    successful: string[];
    failed: { username: string; error: string }[];
  }> {
    const results = {
      successful: [] as string[],
      failed: [] as { username: string; error: string }[]
    };

    for (const username of usernames) {
      try {
        await this.deleteUser(username);
        results.successful.push(username);
      } catch (error) {
        results.failed.push({
          username,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  // ============================================================================
  // NEW ROLE MANAGEMENT ENDPOINTS (from API screenshots)
  // ============================================================================

  /**
   * Add role to user (Alternative endpoint)
   * POST /admin/users/{username}/roles/{role}
   */
  static async addRole(username: string, role: 'USER' | 'ADMIN' | 'SUPERADMIN'): Promise<{ message: string }> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/admin/users/${username}/roles/${role}`,
        { username, role }
      );
      const result = handleApiResponse(response);
      return result.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Remove role from user (Alternative endpoint)
   * POST /auth/roles/{username}/remove/{role}
   */
  static async removeRole(username: string, role: 'USER' | 'ADMIN' | 'SUPERADMIN'): Promise<{ message: string }> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/auth/roles/${username}/remove/${role}`,
        { username, role }
      );
      const result = handleApiResponse(response);
      return result.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Add role to user (Alternative endpoint)
   * POST /auth/roles/{username}/add/{role}
   */
  static async addRoleToUserAlt(username: string, role: 'USER' | 'ADMIN' | 'SUPERADMIN'): Promise<{ message: string }> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/auth/roles/${username}/add/${role}`,
        { username, role }
      );
      const result = handleApiResponse(response);
      return result.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }  
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Check if current user has super admin access
   */
  static async hasSupeAdminAccess(): Promise<boolean> {
    try {
      // Try to access admin stats to verify permissions
      await this.getAdminStats();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available roles
   */
  static getAvailableRoles(): Array<{ value: string; label: string }> {
    return [
      { value: 'USER', label: 'User' },
      { value: 'ADMIN', label: 'Admin' },
      { value: 'SUPERADMIN', label: 'Super Admin' }
    ];
  }

  /**
   * Validate role
   */
  static isValidRole(role: string): boolean {
    const validRoles = ['USER', 'ADMIN', 'SUPERADMIN'];
    return validRoles.includes(role.toUpperCase());
  }

  /**
   * Format user display name
   */
  static formatUserDisplayName(user: SuperAdminUser): string {
    return user.fullName || user.username || user.email;
  }

  /**
   * Get user status color
   */
  static getUserStatusColor(user: SuperAdminUser): string {
    return user.isActive ? 'text-green-500' : 'text-red-500';
  }

  /**
   * Get role badge color
   */
  static getRoleBadgeColor(role: string): string {
    switch (role.toUpperCase()) {
      case 'SUPERADMIN':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'ADMIN':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'USER':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  }
}