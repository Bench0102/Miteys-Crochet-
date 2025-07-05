import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { firebaseService } from '../../services/firebaseService';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldCheck,
  Ban,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// Extended User interface for admin management
interface AdminUser extends User {
  status: 'active' | 'inactive' | 'banned';
  orderCount: number;
  totalSpent: number;
}

// Mock users data
const mockUsers: AdminUser[] = [
  {
    id: 'user1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'user',
    phone: '+1 (555) 123-4567',
    addresses: [{
      id: 'addr1',
      type: 'home',
      name: 'Home Address',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      isDefault: true
    }],
    preferences: {
      petTypes: ['dog'],
      favoriteCategories: ['food'],
      newsletter: true,
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    },
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    orderCount: 5,
    totalSpent: 249.95,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'user',
    phone: '+1 (555) 987-6543',
    addresses: [{
      id: 'addr2',
      type: 'home',
      name: 'Home Address',
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
      isDefault: true
    }],
    preferences: {
      petTypes: ['cat'],
      favoriteCategories: ['toys'],
      newsletter: false,
      notifications: {
        email: true,
        sms: true,
        push: false
      }
    },
    status: 'active',
    lastLogin: '2024-01-14T15:45:00Z',
    orderCount: 3,
    totalSpent: 129.97,
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'admin1',
    email: 'admin@petstore.com',
    name: 'Admin User',
    role: 'admin',
    phone: '+1 (555) 000-0000',
    addresses: [{
      id: 'addr3',
      type: 'work',
      name: 'Office Address',
      street: '789 Admin St',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
      isDefault: true
    }],
    preferences: {
      petTypes: ['all'],
      favoriteCategories: ['food', 'toys'],
      newsletter: true,
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    },
    status: 'active',
    lastLogin: '2024-01-15T12:00:00Z',
    orderCount: 0,
    totalSpent: 0,
    createdAt: '2023-12-01T00:00:00Z'
  }
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await firebaseService.getUsers();
        
        // Transform users to AdminUser format
        const adminUsers: AdminUser[] = fetchedUsers.map((user: User) => ({
          ...user,
          status: 'active' as const, // Default status, you may want to add this field to Firebase
          orderCount: 0, // You'll need to calculate this from orders
          totalSpent: 0 // You'll need to calculate this from orders
        }));
        
        setUsers(adminUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusUpdate = async (userId: string, newStatus: 'active' | 'inactive' | 'banned') => {
    try {
      // Update user status in Firebase
      await firebaseService.updateUser(userId, { status: newStatus });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await firebaseService.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <Shield className="w-4 h-4 text-yellow-500" />;
      case 'banned':
        return <Ban className="w-4 h-4 text-red-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? 
      <ShieldCheck className="w-4 h-4 text-blue-500" /> : 
      <Users className="w-4 h-4 text-gray-500" />;
  };

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'user', label: 'Users' },
    { value: 'admin', label: 'Admins' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'banned', label: 'Banned' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">{users.length} total users</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Active Users: {users.filter(u => u.status === 'active').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {roleOptions.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Mail className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="truncate max-w-[150px]">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 mr-1" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRoleIcon(user.role)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1 capitalize">{user.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{user.orderCount} orders</div>
                        <div className="text-gray-500">${user.totalSpent.toFixed(2)} spent</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusUpdate(user.id, e.target.value as 'active' | 'inactive' | 'banned')}
                          className="text-xs border border-gray-300 rounded px-1 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="banned">Banned</option>
                        </select>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRole('all');
                setSelectedStatus('all');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Personal Information</h3>
                    <p className="text-sm text-gray-600">Name: {selectedUser.name}</p>
                    <p className="text-sm text-gray-600">Email: {selectedUser.email}</p>
                    <p className="text-sm text-gray-600">Phone: {selectedUser.phone || 'Not provided'}</p>
                    <p className="text-sm text-gray-600">Role: {selectedUser.role}</p>
                    <p className="text-sm text-gray-600">Status: {selectedUser.status}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Address</h3>
                    {selectedUser.addresses.length > 0 ? (
                      <>
                        <p className="text-sm text-gray-600">{selectedUser.addresses[0].street}</p>
                        <p className="text-sm text-gray-600">
                          {selectedUser.addresses[0].city}, {selectedUser.addresses[0].state} {selectedUser.addresses[0].zipCode}
                        </p>
                        <p className="text-sm text-gray-600">{selectedUser.addresses[0].country}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">No address provided</p>
                    )}
                  </div>
                </div>

                {/* Activity Stats */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Activity Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedUser.orderCount}</div>
                      <div className="text-sm text-blue-600">Total Orders</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">${selectedUser.totalSpent.toFixed(2)}</div>
                      <div className="text-sm text-green-600">Total Spent</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedUser.orderCount > 0 ? (selectedUser.totalSpent / selectedUser.orderCount).toFixed(2) : '0.00'}
                      </div>
                      <div className="text-sm text-purple-600">Avg Order Value</div>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Account Details</h3>
                  <p className="text-sm text-gray-600">Member since: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Last login: {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;