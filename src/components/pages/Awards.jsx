import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Award, Star } from 'lucide-react';
import { api } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Notification from '../common/Notification';
import Table from '../common/Table';

const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    award_name: '',
    award_description: '',
    point: ''
  });

  useEffect(() => {
    loadAwards();
  }, []);

  const loadAwards = async () => {
    try {
      const data = await api.getAwards();
      setAwards(data || []);
    } catch (error) {
      showNotification('Error loading awards', 'error');
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
      if (editingAward) {
        await api.updateAward(editingAward.award_id, formData);
        showNotification('Award updated successfully', 'success');
      } else {
        await api.addAward(formData);
        showNotification('Award added successfully', 'success');
      }
      setShowModal(false);
      setFormData({ award_name: '', award_description: '', point: '' });
      setEditingAward(null);
      loadAwards();
    } catch (error) {
      showNotification('Error saving award', 'error');
    }
  };

  const handleEdit = (award) => {
    setEditingAward(award);
    setFormData(award);
    setShowModal(true);
  };

  const handleDelete = async (award) => {
    if (window.confirm('Are you sure you want to delete this award?')) {
      try {
        await api.deleteAward(award.award_id);
        showNotification('Award deleted successfully', 'success');
        loadAwards();
      } catch (error) {
        showNotification('Error deleting award', 'error');
      }
    }
  };

  const columns = [
    { 
      key: 'award_name', 
      label: 'Award Name',
      render: (value) => (
        <div className="flex items-center">
          <Award className="w-5 h-5 text-blue-600 mr-2" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    { key: 'award_description', label: 'Description' },
    { 
      key: 'point', 
      label: 'Points Required',
      render: (value) => (
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-500 mr-1" />
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {value} points
          </span>
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
          <h1 className="text-2xl font-bold text-blue-900">Awards</h1>
          <p className="text-blue-700">Manage customer rewards and loyalty programs</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Award
        </Button>
      </div>

      <Card className="backdrop-blur-sm bg-white/70">
        <Table
          columns={columns}
          data={awards}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAward(null);
          setFormData({ award_name: '', award_description: '', point: '' });
        }}
        title={editingAward ? 'Edit Award' : 'Add Award'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Award Name"
            required
            value={formData.award_name}
            onChange={(e) => setFormData({ ...formData, award_name: e.target.value })}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
              value={formData.award_description}
              onChange={(e) => setFormData({ ...formData, award_description: e.target.value })}
            />
          </div>
          <Input
            label="Points Required"
            type="number"
            required
            value={formData.point}
            onChange={(e) => setFormData({ ...formData, point: e.target.value })}
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingAward ? 'Update' : 'Add'} Award
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

export default Awards;