import React, { useState, useEffect } from 'react'
import { Plus, Eye, Gift, CreditCard } from 'lucide-react'
import { api } from '../../services/api'
import Button from '../common/Button'
import Card from '../common/Card'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import Notification from '../common/Notification'

const GiftCards = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showValidateModal, setShowValidateModal] = useState(false)
  const [showUseModal, setShowUseModal] = useState(false)
  const [notification, setNotification] = useState(null)
  const [giftCard, setGiftCard] = useState(null)

  const [createForm, setCreateForm] = useState({
    customer_id: '',
    description: '',
    balance: ''
  })

  const [validateForm, setValidateForm] = useState({
    secret_code: ''
  })

  const [useForm, setUseForm] = useState({
    secret_code: '',
    service_id: [],
    branch_id: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const customerData = await api.getCustomers()
      setCustomers(customerData || [])
    } catch (error) {
      showNotification('Error loading data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleCreateGiftCard = async (e) => {
    e.preventDefault()
    try {
      const response = await api.createGiftCard(createForm)
      showNotification('Gift card created successfully', 'success')
      setShowCreateModal(false)
      setCreateForm({ customer_id: '', description: '', balance: '' })
    } catch (error) {
      showNotification('Error creating gift card', 'error')
    }
  }

  const handleValidateGiftCard = async (e) => {
    e.preventDefault()
    try {
      const response = await api.validateGiftCard(validateForm.secret_code)
      const cardData = await api.viewGiftCard(validateForm.secret_code)
      setGiftCard(cardData)
      showNotification('Gift card is valid', 'success')
    } catch (error) {
      showNotification('Invalid gift card code', 'error')
    }
  }

  const handleUseGiftCard = async (e) => {
    e.preventDefault()
    try {
      await api.useGiftCard(useForm)
      showNotification('Gift card used successfully', 'success')
      setShowUseModal(false)
      setUseForm({ secret_code: '', service_id: [], branch_id: '' })
    } catch (error) {
      showNotification('Error using gift card', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gift Cards</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Gift Card
          </Button>
          <Button variant="outline" onClick={() => setShowValidateModal(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Validate Card
          </Button>
          <Button variant="secondary" onClick={() => setShowUseModal(true)}>
            <Gift className="w-4 h-4 mr-2" />
            Use Gift Card
          </Button>
        </div>
      </div>

      {/* Gift Card Information Display */}
      {giftCard && (
        <Card className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Gift Card Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-purple-100">Balance</p>
                <p className="text-2xl font-bold">${giftCard.balance || 0}</p>
              </div>
              <div>
                <p className="text-purple-100">Status</p>
                <p className="text-xl font-semibold">
                  {giftCard.is_used ? 'Used' : 'Active'}
                </p>
              </div>
              <div>
                <p className="text-purple-100">Code</p>
                <p className="text-xl font-mono">{validateForm.secret_code}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <Gift className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Create Gift Card</h3>
            <p className="text-gray-600 mb-4">Generate a new gift card for customers</p>
            <Button onClick={() => setShowCreateModal(true)} className="w-full">
              Create New
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Eye className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Validate Gift Card</h3>
            <p className="text-gray-600 mb-4">Check gift card balance and status</p>
            <Button variant="outline" onClick={() => setShowValidateModal(true)} className="w-full">
              Validate Card
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <CreditCard className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Redeem Gift Card</h3>
            <p className="text-gray-600 mb-4">Use gift card for service payments</p>
            <Button variant="secondary" onClick={() => setShowUseModal(true)} className="w-full">
              Use Card
            </Button>
          </div>
        </Card>
      </div>

      {/* Create Gift Card Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setCreateForm({ customer_id: '', description: '', balance: '' })
        }}
        title="Create Gift Card"
      >
        <form onSubmit={handleCreateGiftCard}>
          <Select
            label="Customer"
            required
            value={createForm.customer_id}
            onChange={(e) => setCreateForm({ ...createForm, customer_id: e.target.value })}
            options={customers.map(customer => ({
              value: customer.customer_id,
              label: `${customer.first_name} ${customer.last_name}`
            }))}
          />
          <Input
            label="Balance"
            type="number"
            required
            value={createForm.balance}
            onChange={(e) => setCreateForm({ ...createForm, balance: e.target.value })}
            placeholder="Enter gift card amount"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Gift card description (optional)"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Gift Card
            </Button>
          </div>
        </form>
      </Modal>

      {/* Validate Gift Card Modal */}
      <Modal
        isOpen={showValidateModal}
        onClose={() => {
          setShowValidateModal(false)
          setValidateForm({ secret_code: '' })
          setGiftCard(null)
        }}
        title="Validate Gift Card"
      >
        <form onSubmit={handleValidateGiftCard}>
          <Input
            label="Secret Code"
            required
            value={validateForm.secret_code}
            onChange={(e) => setValidateForm({ secret_code: e.target.value })}
            placeholder="Enter gift card secret code"
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowValidateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Validate
            </Button>
          </div>
        </form>
      </Modal>

      {/* Use Gift Card Modal */}
      <Modal
        isOpen={showUseModal}
        onClose={() => {
          setShowUseModal(false)
          setUseForm({ secret_code: '', service_id: [], branch_id: '' })
        }}
        title="Use Gift Card"
      >
        <form onSubmit={handleUseGiftCard}>
          <Input
            label="Secret Code"
            required
            value={useForm.secret_code}
            onChange={(e) => setUseForm({ ...useForm, secret_code: e.target.value })}
            placeholder="Enter gift card secret code"
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUseModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Use Gift Card
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
  )
}

export default GiftCards