import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Users } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Notification from '../common/Notification';
import Table from '../common/Table';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    profession: '',
    branch_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [employeeData, branchData] = await Promise.all([
        api.getEmployees(),
        api.getBranches()
      ]);
      setEmployees(employeeData || []);
      setBranches(branchData || []);
    } catch (error) {
      showNotification('Error loading data', 'error');
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
      if (editingEmployee) {
        await api.updateEmployee({ ...formData, employee_id: editingEmployee.employee_id });
        showNotification('Employee updated successfully', 'success');
      } else {
        await api.addEmployee(formData);
        showNotification('Employee added successfully', 'success');
      }
      setShowModal(false);
      setFormData({
        first_name: '', middle_name: '', last_name: '', gender: '', profession: '', branch_id: ''
      });
      setEditingEmployee(null);
      loadData();
    } catch (error) {
      showNotification('Error saving employee', 'error');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
    setShowModal(true);
  };

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.branch_id === branchId);
    return branch ? branch.name : 'Unknown Branch';
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
    { key: 'gender', label: 'Gender' },
    { key: 'profession', label: 'Profession' },
    { 
      key: 'branch_id', 
      label: 'Branch',
      render: (value) => getBranchName(value)
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
          <h1 className="text-2xl font-bold text-blue-900">Employees</h1>
          <p className="text-blue-700">Manage your therapy staff and professionals</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <Card className="backdrop-blur-sm bg-white/70">
        <Table
          columns={columns}
          data={employees}
          onEdit={handleEdit}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEmployee(null);
          setFormData({
            first_name: '', middle_name: '', last_name: '', gender: '', profession: '', branch_id: ''
          });
        }}
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
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
            <Input
              label="Profession"
              required
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
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
              {editingEmployee ? 'Update' : 'Add'} Employee
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

export default Employees;