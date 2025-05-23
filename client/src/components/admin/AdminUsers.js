import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert, Chip, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await adminAPI.getAllUsers();
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await adminAPI.updateUser(id, { status });
      setUsers((prev) => prev.map(u => u._id === id ? { ...u, status } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await adminAPI.updateUser(id, { role });
      setUsers((prev) => prev.map(u => u._id === id ? { ...u, role } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await adminAPI.deleteUser(deleteUserId);
      setUsers((prev) => prev.filter(u => u._id !== deleteUserId));
      setConfirmOpen(false);
      setDeleteUserId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Admin: Manage Users</Typography>
      <TextField
        label="Search users"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredUsers.length === 0 ? (
        <Alert severity="info">No users found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Change Role</TableCell>
                <TableCell>Change Status</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} color={user.role === 'admin' ? 'primary' : user.role === 'organizer' ? 'secondary' : 'default'} />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.status} color={user.status === 'active' ? 'success' : 'error'} />
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={user.role}
                        label="Role"
                        onChange={e => handleRoleChange(user._id, e.target.value)}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="organizer">Organizer</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={user.status}
                        label="Status"
                        onChange={e => handleStatusChange(user._id, e.target.value)}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="blocked">Blocked</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button color="error" variant="outlined" onClick={() => { setDeleteUserId(user._id); setConfirmOpen(true); }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteUser}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUsers;