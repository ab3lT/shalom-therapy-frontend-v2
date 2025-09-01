import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Phone, Mail, Search, Filter, Award } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Notification from '../common/Notification';
import Table from '../common/Table';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    age: '',
    phone_number: '',
    email: '',
    point: 0
  });

  const ageOptions = [
    { value: '18-25', label: '18-25' },
    { value: '26-35', label: '26-35' },
    { value: '36-45', label: '36-45' },
    { value: '46-55', label: '46-55' },
    { value: '56-65', label: '56-65' },
    { value: '65+', label: '65+' }
  ];

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const loadCustomers = async () => {
    try {
      const data = await api.getCustomers();
      setCustomers(data || []);
      setFilteredCustomers(data || []);
    } catch (error) {
      showNotification('Error loading customers', 'error');
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
      if (editingCustomer) {
        await api.updateCustomer(editingCustomer.customer_id, formData);
        showNotification('Customer updated successfully', 'success');
      } else {
        await api.addCustomer(formData);
        showNotification('Customer added successfully', 'success');
      }
      setShowModal(false);
      resetForm();
      loadCustomers();
    } catch (error) {
      showNotification('Error saving customer', 'error');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setShowModal(true);
  };

  const handleDelete = async (customer) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.deleteCustomer(customer.customer_id);
        showNotification('Customer deleted successfully', 'success');
        loadCustomers();
      } catch (error) {
        showNotification('Error deleting customer', 'error');
      }
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    try {
      let results;
      if (searchType === 'name') {
        results = await api.searchCustomerByFirstName(searchTerm);
      } else {
        results = await api.searchCustomerByPhoneNumber(searchTerm);
      }
      setFilteredCustomers(results || []);
    } catch (error) {
      showNotification('Error searching customers', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '', middle_name: '', last_name: '', gender: '',
      age: '', phone_number: '', email: '', point: 0
    });
    setEditingCustomer(null);
  };

  const columns = [
    { 
      key: 'full_name', 
      label: 'Name',
      render: (_, row) => (
        <div className="flex items-center">
          <User className="w-5 h-5 text-blue-600 mr-2" />
          <span>{`${row.first_name} ${row.middle_name || ''} ${row.last_name}`.trim()}</span>
        </div>
      )
    },
    { 
      key: 'gender', 
      label: 'Gender',
      render: (value) => (
        <span className="capitalize">{value}</span>
      )
    },
    { 
      key: 'age', 
      label: 'Age Range',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'phone_number', 
      label: 'Phone',
      render: (value) => (
        <div className="flex items-center">
          <Phone className="w-4 h-4 text-blue-500 mr-1" />
          <span>{value || 'N/A'}</span>
        </div>
      )
    },
    { 
      key: 'email', 
      label: 'Email',
      render: (value) => (
        <div className="flex items-center">
          <Mail className="w-4 h-4 text-blue-500 mr-1" />
          <span>{value || 'N/A'}</span>
        </div>
      )
    },
    { 
      key: 'point', 
      label: 'Points',
      render: (value) => (
        <div className="flex items-center">
          <Award className="w-4 h-4 text-yellow-500 mr-1" />
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
    <div className="p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Customers</h1>
          <p className="text-blue-700">Manage your therapy customers and their information</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-6 backdrop-blur-sm bg-white/70">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
            </div>
          </div>
          <Select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            options={[
              { value: 'name', label: 'By Name' },
              { value: 'phone', label: 'By Phone' }
            ]}
            className="sm:w-40"
          />
          <Button onClick={handleSearch}>
            <Filter className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" onClick={loadCustomers}>
            Clear
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-l-4 border-l-blue-500 backdrop-blur-sm bg-white/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Customers</p>
              <p className="text-2xl font-bold text-blue-900">{customers.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="bg-blue-50 border-l-4 border-l-blue-500 backdrop-blur-sm bg-white/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Loyalty Points</p>
              <p className="text-2xl font-bold text-blue-900">
                {customers.reduce((sum, customer) => sum + (parseInt(customer.point) || 0), 0)}
              </p>
            </div>
            <Award className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="bg-blue-50 border-l-4 border-l-blue-500 backdrop-blur-sm bg-white/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Active Members</p>
              <p className="text-2xl font-bold text-blue-900">
                {customers.filter(c => (parseInt(c.point) || 0) > 0).length}
              </p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="bg-blue-50 border-l-4 border-l-blue-500 backdrop-blur-sm bg-white/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">New This Month</p>
              <p className="text-2xl font-bold text-blue-900">
                {Math.floor(Math.random() * 10) + 1} {/* Placeholder - replace with actual data */}
              </p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
      </div>

      <Card className="backdrop-blur-sm bg-white/70">
        <Table
          columns={columns}
          data={filteredCustomers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
            <Input
              label="Middle Name"
              value={formData.middle_name}
              onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
            />
            <Input
              label="Last Name"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
            <Select
              label="Gender"
              required
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: 'M', label: 'Male' },
                { value: 'F', label: 'Female' }
              ]}
            />
            <Select
              label="Age Range"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              options={ageOptions}
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
            <Input
              label="Loyalty Points"
              type="number"
              min="0"
              value={formData.point}
              onChange={(e) => setFormData({ ...formData, point: e.target.value })}
            />
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
              {editingCustomer ? 'Update' : 'Add'} Customer
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

export default Customers;