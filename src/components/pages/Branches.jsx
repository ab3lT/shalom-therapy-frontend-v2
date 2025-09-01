import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Phone, Mail, Building } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Notification from '../common/Notification';
import Table from '../common/Table';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    building_name: '',
    description: '',
    floor_number: '',
    office_number: '',
    phone_number: '',
    email: ''
  });

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const data = await api.getBranches();
      setBranches(data || []);
    } catch (error) {
      showNotification('Error loading branches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await api.updateBranch({ ...formData, branch_id: editingBranch.branch_id });
        showNotification('Branch updated successfully', 'success');
      } else {
        await api.addBranch(formData);
        showNotification('Branch added successfully', 'success');
      }
      setShowModal(false);
      setFormData({
        name: '', location: '', building_name: '', description: '',
        floor_number: '', office_number: '', phone_number: '', email: ''
      });
      setEditingBranch(null);
      loadBranches();
    } catch (error) {
      showNotification('Error saving branch', 'error');
    }
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData(branch);
    setShowModal(true);
  };

  const handleDelete = async (branch) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await api.deleteBranch(branch.branch_id);
        showNotification('Branch deleted successfully', 'success');
        loadBranches();
      } catch (error) {
        showNotification('Error deleting branch', 'error');
      }
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Name',
      render: (value, row) => (
        <div className="flex items-center">
          <Building className="w-5 h-5 text-blue-600 mr-2" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    { 
      key: 'location', 
      label: 'Location',
      render: (value) => (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-blue-500 mr-1" />
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: 'building_name', 
      label: 'Building',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'phone_number', 
      label: 'Phone',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'email', 
      label: 'Email',
      render: (value) => value || 'N/A'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Branches</h1>
          <p className="text-blue-700">Manage your therapy branches and locations</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </Button>
      </div>

      <Card className="backdrop-blur-sm bg-white/70">
        <Table
          columns={columns}
          data={branches}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBranch(null);
          setFormData({
            name: '', location: '', building_name: '', description: '',
            floor_number: '', office_number: '', phone_number: '', email: ''
          });
        }}
        title={editingBranch ? 'Edit Branch' : 'Add Branch'}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Branch Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Building Name"
              value={formData.building_name}
              onChange={(e) => setFormData({ ...formData, building_name: e.target.value })}
            />
            <Input
              label="Floor Number"
              value={formData.floor_number}
              onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
            />
            <Input
              label="Office Number"
              value={formData.office_number}
              onChange={(e) => setFormData({ ...formData, office_number: e.target.value })}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="md:col-span-2"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-700 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingBranch ? 'Update' : 'Add'} Branch
            </Button>
          </div>
        </form>
      </Modal>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Branches;