import React, { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true); // Ensure loading shows when filter changes
      const role = filter === 'all' ? null : filter;
      const response = await usersAPI.getAll(role);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

 

  const handleApprove = async (userId) => {
    try {
      await usersAPI.approve(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, is_approved: true } : u));
      setMessage({ type: 'success', text: 'User approved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to approve user' });
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await usersAPI.delete(userId);
      setUsers(users.filter(u => u.id !== userId));
      setMessage({ type: 'success', text: 'User deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete user' });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <h1>User Management</h1>
      <p className="page-subtitle">Manage all users in the system</p>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`tab ${filter === 'alumni' ? 'active' : ''}`}
            onClick={() => setFilter('alumni')}
          >
            Alumni
          </button>
          <button
            className={`tab ${filter === 'student' ? 'active' : ''}`}
            onClick={() => setFilter('student')}
          >
            Students
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge badge-${user.role}`}>{user.role}</span>
                </td>
                <td>
                  {user.role === 'alumni' ? (
                    <span className={`badge ${user.is_approved ? 'badge-success' : 'badge-warning'}`}>
                      {user.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  ) : (
                    <span className="badge badge-success">Active</span>
                  )}
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons-inline">
                    {user.role === 'alumni' && !user.is_approved && (
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="btn btn-success btn-sm"
                      >
                        Approve
                      </button>
                    )}
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <p>No users found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
