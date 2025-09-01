import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, DollarSign, Award } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Notification from '../common/Notification';
import Table from '../common/Table';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [notification, setNotification] = useState(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_time: '',
    service_fee: '',
    point: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await api.getServices();
      setServices(data || []);
    } catch (error) {
      showNotification('Error loading services', 'error');
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
      if (editingService) {
        await api.updateService(editingService.service_id, formData);
        showNotification('Service updated successfully', 'success');
      } else {
        await api.addService(formData);
        showNotification('Service added successfully', 'success');
      }
      setShowModal(false);
      resetForm();
      loadServices();
    } catch (error) {
      showNotification('Error saving service', 'error');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData(service);
    setShowModal(true);
  };

  const handleDelete = async (service) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.deleteService(service.service_id);
        showNotification('Service deleted successfully', 'success');
        loadServices();
      } catch (error) {
        showNotification('Error deleting service', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration_time: '',
      service_fee: '',
      point: ''
    });
    setEditingService(null);
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    
    // Handle HH:MM:SS format
    const parts = duration.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    }
    
    return duration;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Service Name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
        </div>
      )
    },
    { 
      key: 'duration_time', 
      label: 'Duration',
      render: (value) => (
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1 text-gray-400" />
          <span>{formatDuration(value)}</span>
        </div>
      )
    },
    { 
      key: 'service_fee', 
      label: 'Price',
      render: (value) => (
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
          <span className="font-medium">{formatCurrency(value)}</span>
        </div>
      )
    },
    { 
      key: 'point', 
      label: 'Points',
      render: (value) => (
        <div className="flex items-center">
          <Award className="w-4 h-4 mr-1 text-gray-400" />
          <span className="font-medium">{value || 0}</span>
        </div>
      )
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage your therapy services and pricing</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">Total Services</h3>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">Average Price</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  services.reduce((sum, service) => sum + (parseFloat(service.service_fee) || 0), 0) / 
                  (services.length || 1)
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">Total Points</h3>
              <p className="text-2xl font-bold text-gray-900">
                {services.reduce((sum, service) => sum + (parseInt(service.point) || 0), 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <Table
          columns={columns}
          data={services}
          onEdit={user?.role === 'ADMIN' ? handleEdit : null}
          onDelete={user?.role === 'ADMIN' ? handleDelete : null}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingService ? 'Edit Service' : 'Add Service'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Service Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Deep Tissue Massage"
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the service in detail"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Duration (HH:MM:SS)"
              placeholder="1:30:00"
              value={formData.duration_time}
              onChange={(e) => setFormData({ ...formData, duration_time: e.target.value })}
              helperText="Format: hours:minutes:seconds"
            />
            
            <Input
              label="Service Fee ($)"
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.service_fee}
              onChange={(e) => setFormData({ ...formData, service_fee: e.target.value })}
              placeholder="0.00"
            />
            
            <Input
              label="Reward Points"
              type="number"
              min="0"
              value={formData.point}
              onChange={(e) => setFormData({ ...formData, point: e.target.value })}
              placeholder="0"
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingService ? 'Update' : 'Add'} Service
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

export default Services;