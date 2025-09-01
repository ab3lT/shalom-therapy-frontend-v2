import React, { useState, useEffect } from 'react';
import { Plus, Edit, Calendar, Clock, User, DollarSign } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Notification from '../common/Notification';
import Table from '../common/Table';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [notification, setNotification] = useState(null);
  const [viewType, setViewType] = useState('all');

  const [formData, setFormData] = useState({
    customer_id: '',
    branch_id: '',
    service_id: '',
    employee_id: '',
    booked_date: '',
    estimated_start_time: '',
    start_time: '',
    end_time: '',
    employee_rate: '',
    is_paid: false,
    status: 'Pending',
    remark: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingData, customerData, serviceData, branchData, employeeData] = await Promise.all([
        viewType === 'today' ? api.getTodayBookings() : api.getAllBookings(),
        api.getCustomers(),
        api.getServices(),
        api.getBranches(),
        api.getEmployees()
      ]);
      
      setBookings(bookingData || []);
      setCustomers(customerData || []);
      setServices(serviceData || []);
      setBranches(branchData || []);
      setEmployees(employeeData || []);
    } catch (error) {
      showNotification('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [viewType]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBooking) {
        await api.updateBooking({ ...formData, book_id: editingBooking.book_id });
        showNotification('Booking updated successfully', 'success');
      } else {
        await api.bookService(formData);
        showNotification('Booking created successfully', 'success');
      }
      setShowModal(false);
      setFormData({
        customer_id: '', branch_id: '', service_id: '', employee_id: '',
        booked_date: '', estimated_start_time: '', start_time: '', end_time: '',
        employee_rate: '', is_paid: false, status: 'Pending', remark: ''
      });
      setEditingBooking(null);
      loadData();
    } catch (error) {
      showNotification('Error saving booking', 'error');
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormData(booking);
    setShowModal(true);
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.customer_id === customerId);
    return customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown Customer';
  };

  const getServiceName = (serviceId) => {
    const service = services.find(s => s.service_id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.branch_id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.employee_id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'Unassigned';
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-orange-100 text-orange-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const columns = [
    { 
      key: 'customer_id', 
      label: 'Customer',
      render: (value) => (
        <div className="flex items-center">
          <User className="w-4 h-4 text-blue-600 mr-1" />
          <span>{getCustomerName(value)}</span>
        </div>
      )
    },
    { 
      key: 'service_id', 
      label: 'Service',
      render: (value) => getServiceName(value)
    },
    { 
      key: 'branch_id', 
      label: 'Branch',
      render: (value) => getBranchName(value)
    },
    { 
      key: 'booked_date', 
      label: 'Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'estimated_start_time', 
      label: 'Time',
      render: (value) => (
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-blue-600 mr-1" />
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => getStatusBadge(value)
    },
    { 
      key: 'is_paid', 
      label: 'Payment',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Paid' : 'Unpaid'}
        </span>
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
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Bookings</h1>
            <p className="text-blue-700">Manage appointments and scheduling</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={viewType === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewType('all')}
            >
              All Bookings
            </Button>
            <Button
              variant={viewType === 'today' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewType('today')}
            >
              Today's Bookings
            </Button>
          </div>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      <Card className="backdrop-blur-sm bg-white/70">
        <Table
          columns={columns}
          data={bookings}
          onEdit={handleEdit}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBooking(null);
          setFormData({
            customer_id: '', branch_id: '', service_id: '', employee_id: '',
            booked_date: '', estimated_start_time: '', start_time: '', end_time: '',
            employee_rate: '', is_paid: false, status: 'Pending', remark: ''
          });
        }}
        title={editingBooking ? 'Edit Booking' : 'New Booking'}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Customer"
              required
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              options={customers.map(customer => ({
                value: customer.customer_id,
                label: `${customer.first_name} ${customer.last_name}`
              }))}
            />
            <Select
              label="Branch"
              required
              value={formData.branch_id}
              onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
              options={branches.map(branch => ({
                value: branch.branch_id,
                label: branch.name
              }))}
            />
            <Select
              label="Service"
              required
              value={formData.service_id}
              onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
              options={services.map(service => ({
                value: service.service_id,
                label: service.name
              }))}
            />
            <Select
              label="Employee"
              value={formData.employee_id}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              options={employees.map(employee => ({
                value: employee.employee_id,
                label: `${employee.first_name} ${employee.last_name}`
              }))}
            />
            <Input
              label="Date"
              type="date"
              required
              value={formData.booked_date}
              onChange={(e) => setFormData({ ...formData, booked_date: e.target.value })}
            />
            <Input
              label="Estimated Start Time"
              type="time"
              value={formData.estimated_start_time}
              onChange={(e) => setFormData({ ...formData, estimated_start_time: e.target.value })}
            />
            {editingBooking && (
              <>
                <Input
                  label="Actual Start Time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
                <Input
                  label="End Time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
                <Input
                  label="Employee Rating (1-5)"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.employee_rate}
                  onChange={(e) => setFormData({ ...formData, employee_rate: e.target.value })}
                />
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  options={[
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Confirmed', label: 'Confirmed' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'Cancelled', label: 'Cancelled' }
                  ]}
                />
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_paid}
                      onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-blue-700">Payment Completed</span>
                  </label>
                </div>
              </>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-700 mb-1">Remarks</label>
              <textarea
                className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
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
              {editingBooking ? 'Update' : 'Create'} Booking
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

export default Bookings;