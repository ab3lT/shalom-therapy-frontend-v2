// import React, { useState, useEffect, createContext, useContext, useReducer } from 'react';
// import { 
//   BrowserRouter as Router, 
//   Routes, 
//   Route, 
//   Navigate, 
//   Link, 
//   useNavigate,
//   useLocation 
// } from 'react-router-dom';
// import { 
//   User, 
//   Calendar, 
//   Settings, 
//   Award, 
//   Users, 
//   Building, 
//   CreditCard,
//   BookOpen,
//   LogOut,
//   Menu,
//   X,
//   Plus,
//   Edit,
//   Trash2,
//   Search,
//   Filter,
//   Eye,
//   Star,
//   MapPin,
//   Phone,
//   Mail,
//   Clock,
//   DollarSign,
//   Gift,
//   CheckCircle,
//   AlertCircle,
//   XCircle,
//   Moon,
//   Sun
// } from 'lucide-react';

// // Context for Authentication
// const AuthContext = createContext();

// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN':
//       localStorage.setItem('token', action.payload.token);
//       localStorage.setItem('user', JSON.stringify(action.payload.user));
//       return {
//         ...state,
//         isAuthenticated: true,
//         token: action.payload.token,
//         user: action.payload.user,
//         loading: false
//       };

// // Employees Component
// const Employees = () => {
//   const [employees, setEmployees] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingEmployee, setEditingEmployee] = useState(null);
//   const [notification, setNotification] = useState(null);

//   const [formData, setFormData] = useState({
//     first_name: '',
//     middle_name: '',
//     last_name: '',
//     gender: '',
//     profession: '',
//     branch_id: ''
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [employeeData, branchData] = await Promise.all([
//         api.getEmployees(),
//         api.getBranches()
//       ]);
//       setEmployees(employeeData || []);
//       setBranches(branchData || []);
//     } catch (error) {
//       showNotification('Error loading data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, type = 'info') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingEmployee) {
//         await api.updateEmployee({ ...formData, employee_id: editingEmployee.employee_id });
//         showNotification('Employee updated successfully', 'success');
//       } else {
//         await api.addEmployee(formData);
//         showNotification('Employee added successfully', 'success');
//       }
//       setShowModal(false);
//       setFormData({
//         first_name: '', middle_name: '', last_name: '', gender: '', profession: '', branch_id: ''
//       });
//       setEditingEmployee(null);
//       loadData();
//     } catch (error) {
//       showNotification('Error saving employee', 'error');
//     }
//   };

//   const handleEdit = (employee) => {
//     setEditingEmployee(employee);
//     setFormData(employee);
//     setShowModal(true);
//   };

//   const getBranchName = (branchId) => {
//     const branch = branches.find(b => b.branch_id === branchId);
//     return branch ? branch.name : 'Unknown Branch';
//   };

//   const columns = [
//     { 
//       key: 'full_name', 
//       label: 'Name',
//       render: (_, row) => `${row.first_name} ${row.middle_name || ''} ${row.last_name}`.trim()
//     },
//     { key: 'gender', label: 'Gender' },
//     { key: 'profession', label: 'Profession' },
//     { 
//       key: 'branch_id', 
//       label: 'Branch',
//       render: (value) => getBranchName(value)
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
//         <Button onClick={() => setShowModal(true)}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Employee
//         </Button>
//       </div>

//       <Card>
//         <Table
//           columns={columns}
//           data={employees}
//           onEdit={handleEdit}
//         />
//       </Card>

//       <Modal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setEditingEmployee(null);
//           setFormData({
//             first_name: '', middle_name: '', last_name: '', gender: '', profession: '', branch_id: ''
//           });
//         }}
//         title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
//       >
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               label="First Name"
//               required
//               value={formData.first_name}
//               onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
//             />
//             <Input
//               label="Middle Name"
//               value={formData.middle_name}
//               onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
//             />
//             <Input
//               label="Last Name"
//               required
//               value={formData.last_name}
//               onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
//             />
//             <Select
//               label="Gender"
//               required
//               value={formData.gender}
//               onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
//               options={[
//                 { value: 'M', label: 'Male' },
//                 { value: 'F', label: 'Female' }
//               ]}
//             />
//             <Input
//               label="Profession"
//               required
//               value={formData.profession}
//               onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
//             />
//             <Select
//               label="Branch"
//               required
//               value={formData.branch_id}
//               onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
//               options={branches.map(branch => ({
//                 value: branch.branch_id,
//                 label: branch.name
//               }))}
//             />
//           </div>
//           <div className="flex justify-end space-x-3 mt-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setShowModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit">
//               {editingEmployee ? 'Update' : 'Add'} Employee
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//         />
//       )}
//     </div>
//   );
// };

// // Bookings Component
// const Bookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [services, setServices] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingBooking, setEditingBooking] = useState(null);
//   const [notification, setNotification] = useState(null);
//   const [viewType, setViewType] = useState('all');

//   const [formData, setFormData] = useState({
//     customer_id: '',
//     branch_id: '',
//     service_id: '',
//     employee_id: '',
//     booked_date: '',
//     estimated_start_time: '',
//     start_time: '',
//     end_time: '',
//     employee_rate: '',
//     is_paid: false,
//     status: 'Pending',
//     remark: ''
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [bookingData, customerData, serviceData, branchData, employeeData] = await Promise.all([
//         viewType === 'today' ? api.getTodayBookings() : api.getAllBookings(),
//         api.getCustomers(),
//         api.getServices(),
//         api.getBranches(),
//         api.getEmployees()
//       ]);
      
//       setBookings(bookingData || []);
//       setCustomers(customerData || []);
//       setServices(serviceData || []);
//       setBranches(branchData || []);
//       setEmployees(employeeData || []);
//     } catch (error) {
//       showNotification('Error loading data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     loadData();
//   }, [viewType]);

//   const showNotification = (message, type = 'info') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingBooking) {
//         await api.updateBooking({ ...formData, book_id: editingBooking.book_id });
//         showNotification('Booking updated successfully', 'success');
//       } else {
//         await api.bookService(formData);
//         showNotification('Booking created successfully', 'success');
//       }
//       setShowModal(false);
//       setFormData({
//         customer_id: '', branch_id: '', service_id: '', employee_id: '',
//         booked_date: '', estimated_start_time: '', start_time: '', end_time: '',
//         employee_rate: '', is_paid: false, status: 'Pending', remark: ''
//       });
//       setEditingBooking(null);
//       loadData();
//     } catch (error) {
//       showNotification('Error saving booking', 'error');
//     }
//   };

//   const handleEdit = (booking) => {
//     setEditingBooking(booking);
//     setFormData(booking);
//     setShowModal(true);
//   };

//   const getCustomerName = (customerId) => {
//     const customer = customers.find(c => c.customer_id === customerId);
//     return customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown Customer';
//   };

//   const getServiceName = (serviceId) => {
//     const service = services.find(s => s.service_id === serviceId);
//     return service ? service.name : 'Unknown Service';
//   };

//   const getBranchName = (branchId) => {
//     const branch = branches.find(b => b.branch_id === branchId);
//     return branch ? branch.name : 'Unknown Branch';
//   };

//   const getEmployeeName = (employeeId) => {
//     const employee = employees.find(e => e.employee_id === employeeId);
//     return employee ? `${employee.first_name} ${employee.last_name}` : 'Unassigned';
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       'Pending': 'bg-yellow-100 text-yellow-800',
//       'Confirmed': 'bg-blue-100 text-blue-800',
//       'In Progress': 'bg-orange-100 text-orange-800',
//       'Completed': 'bg-green-100 text-green-800',
//       'Cancelled': 'bg-red-100 text-red-800'
//     };

//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
//         {status}
//       </span>
//     );
//   };

//   const columns = [
//     { 
//       key: 'customer_id', 
//       label: 'Customer',
//       render: (value) => getCustomerName(value)
//     },
//     { 
//       key: 'service_id', 
//       label: 'Service',
//       render: (value) => getServiceName(value)
//     },
//     { 
//       key: 'branch_id', 
//       label: 'Branch',
//       render: (value) => getBranchName(value)
//     },
//     { key: 'booked_date', label: 'Date' },
//     { key: 'estimated_start_time', label: 'Est. Time' },
//     { 
//       key: 'status', 
//       label: 'Status',
//       render: (value) => getStatusBadge(value)
//     },
//     { 
//       key: 'is_paid', 
//       label: 'Payment',
//       render: (value) => (
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//         }`}>
//           {value ? 'Paid' : 'Unpaid'}
//         </span>
//       )
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center space-x-4">
//           <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
//           <div className="flex space-x-2">
//             <Button
//               variant={viewType === 'all' ? 'primary' : 'outline'}
//               size="sm"
//               onClick={() => setViewType('all')}
//             >
//               All Bookings
//             </Button>
//             <Button
//               variant={viewType === 'today' ? 'primary' : 'outline'}
//               size="sm"
//               onClick={() => setViewType('today')}
//             >
//               Today's Bookings
//             </Button>
//           </div>
//         </div>
//         <Button onClick={() => setShowModal(true)}>
//           <Plus className="w-4 h-4 mr-2" />
//           New Booking
//         </Button>
//       </div>

//       <Card>
//         <Table
//           columns={columns}
//           data={bookings}
//           onEdit={handleEdit}
//         />
//       </Card>

//       <Modal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setEditingBooking(null);
//           setFormData({
//             customer_id: '', branch_id: '', service_id: '', employee_id: '',
//             booked_date: '', estimated_start_time: '', start_time: '', end_time: '',
//             employee_rate: '', is_paid: false, status: 'Pending', remark: ''
//           });
//         }}
//         title={editingBooking ? 'Edit Booking' : 'New Booking'}
//       >
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Select
//               label="Customer"
//               required
//               value={formData.customer_id}
//               onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
//               options={customers.map(customer => ({
//                 value: customer.customer_id,
//                 label: `${customer.first_name} ${customer.last_name}`
//               }))}
//             />
//             <Select
//               label="Branch"
//               required
//               value={formData.branch_id}
//               onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
//               options={branches.map(branch => ({
//                 value: branch.branch_id,
//                 label: branch.name
//               }))}
//             />
//             <Select
//               label="Service"
//               required
//               value={formData.service_id}
//               onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
//               options={services.map(service => ({
//                 value: service.service_id,
//                 label: service.name
//               }))}
//             />
//             <Select
//               label="Employee"
//               value={formData.employee_id}
//               onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
//               options={employees.map(employee => ({
//                 value: employee.employee_id,
//                 label: `${employee.first_name} ${employee.last_name}`
//               }))}
//             />
//             <Input
//               label="Date"
//               type="date"
//               required
//               value={formData.booked_date}
//               onChange={(e) => setFormData({ ...formData, booked_date: e.target.value })}
//             />
//             <Input
//               label="Estimated Start Time"
//               type="time"
//               value={formData.estimated_start_time}
//               onChange={(e) => setFormData({ ...formData, estimated_start_time: e.target.value })}
//             />
//             {editingBooking && (
//               <>
//                 <Input
//                   label="Actual Start Time"
//                   type="time"
//                   value={formData.start_time}
//                   onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
//                 />
//                 <Input
//                   label="End Time"
//                   type="time"
//                   value={formData.end_time}
//                   onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
//                 />
//                 <Input
//                   label="Employee Rating (1-5)"
//                   type="number"
//                   min="1"
//                   max="5"
//                   step="0.1"
//                   value={formData.employee_rate}
//                   onChange={(e) => setFormData({ ...formData, employee_rate: e.target.value })}
//                 />
//                 <Select
//                   label="Status"
//                   value={formData.status}
//                   onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                   options={[
//                     { value: 'Pending', label: 'Pending' },
//                     { value: 'Confirmed', label: 'Confirmed' },
//                     { value: 'In Progress', label: 'In Progress' },
//                     { value: 'Completed', label: 'Completed' },
//                     { value: 'Cancelled', label: 'Cancelled' }
//                   ]}
//                 />
//                 <div className="md:col-span-2">
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={formData.is_paid}
//                       onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
//                       className="mr-2"
//                     />
//                     <span className="text-sm font-medium text-gray-700">Payment Completed</span>
//                   </label>
//                 </div>
//               </>
//             )}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
//               <textarea
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 rows="3"
//                 value={formData.remark}
//                 onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
//               />
//             </div>
//           </div>
//           <div className="flex justify-end space-x-3 mt-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setShowModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit">
//               {editingBooking ? 'Update' : 'Create'} Booking
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//         />
//       )}
//     </div>
//   );
// };

// // Awards Component
// const Awards = () => {
//   const [awards, setAwards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingAward, setEditingAward] = useState(null);
//   const [notification, setNotification] = useState(null);

//   const [formData, setFormData] = useState({
//     award_name: '',
//     award_description: '',
//     point: ''
//   });

//   useEffect(() => {
//     loadAwards();
//   }, []);

//   const loadAwards = async () => {
//     try {
//       const data = await api.getAwards();
//       setAwards(data || []);
//     } catch (error) {
//       showNotification('Error loading awards', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, type = 'info') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingAward) {
//         await api.updateAward(editingAward.award_id, formData);
//         showNotification('Award updated successfully', 'success');
//       } else {
//         await api.addAward(formData);
//         showNotification('Award added successfully', 'success');
//       }
//       setShowModal(false);
//       setFormData({ award_name: '', award_description: '', point: '' });
//       setEditingAward(null);
//       loadAwards();
//     } catch (error) {
//       showNotification('Error saving award', 'error');
//     }
//   };

//   const handleEdit = (award) => {
//     setEditingAward(award);
//     setFormData(award);
//     setShowModal(true);
//   };

//   const handleDelete = async (award) => {
//     if (window.confirm('Are you sure you want to delete this award?')) {
//       try {
//         await api.deleteAward(award.award_id);
//         showNotification('Award deleted successfully', 'success');
//         loadAwards();
//       } catch (error) {
//         showNotification('Error deleting award', 'error');
//       }
//     }
//   };

//   const columns = [
//     { key: 'award_name', label: 'Award Name' },
//     { key: 'award_description', label: 'Description' },
//     { 
//       key: 'point', 
//       label: 'Points Required',
//       render: (value) => (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//           {value} points
//         </span>
//       )
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Awards</h1>
//         <Button onClick={() => setShowModal(true)}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Award
//         </Button>
//       </div>

//       <Card>
//         <Table
//           columns={columns}
//           data={awards}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//         />
//       </Card>

//       <Modal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setEditingAward(null);
//           setFormData({ award_name: '', award_description: '', point: '' });
//         }}
//         title={editingAward ? 'Edit Award' : 'Add Award'}
//       >
//         <form onSubmit={handleSubmit}>
//           <Input
//             label="Award Name"
//             required
//             value={formData.award_name}
//             onChange={(e) => setFormData({ ...formData, award_name: e.target.value })}
//           />
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               rows="3"
//               required
//               value={formData.award_description}
//               onChange={(e) => setFormData({ ...formData, award_description: e.target.value })}
//             />
//           </div>
//           <Input
//             label="Points Required"
//             type="number"
//             required
//             value={formData.point}
//             onChange={(e) => setFormData({ ...formData, point: e.target.value })}
//           />
//           <div className="flex justify-end space-x-3 mt-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setShowModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit">
//               {editingAward ? 'Update' : 'Add'} Award
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//         />
//       )}
//     </div>
//   );
// };

// // Gift Cards Component
// const GiftCards = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showValidateModal, setShowValidateModal] = useState(false);
//   const [showUseModal, setShowUseModal] = useState(false);
//   const [notification, setNotification] = useState(null);
//   const [giftCard, setGiftCard] = useState(null);

//   const [createForm, setCreateForm] = useState({
//     customer_id: '',
//     description: '',
//     balance: ''
//   });

//   const [validateForm, setValidateForm] = useState({
//     secret_code: ''
//   });

//   const [useForm, setUseForm] = useState({
//     secret_code: '',
//     service_id: [],
//     branch_id: ''
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const customerData = await api.getCustomers();
//       setCustomers(customerData || []);
//     } catch (error) {
//       showNotification('Error loading data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, type = 'info') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleCreateGiftCard = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.createGiftCard(createForm);
//       showNotification('Gift card created successfully', 'success');
//       setShowCreateModal(false);
//       setCreateForm({ customer_id: '', description: '', balance: '' });
//     } catch (error) {
//       showNotification('Error creating gift card', 'error');
//     }
//   };

//   const handleValidateGiftCard = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.validateGiftCard(validateForm.secret_code);
//       const cardData = await api.viewGiftCard(validateForm.secret_code);
//       setGiftCard(cardData);
//       showNotification('Gift card is valid', 'success');
//     } catch (error) {
//       showNotification('Invalid gift card code', 'error');
//     }
//   };

//   const handleUseGiftCard = async (e) => {
//     e.preventDefault();
//     try {
//       await api.useGiftCard(useForm);
//       showNotification('Gift card used successfully', 'success');
//       setShowUseModal(false);
//       setUseForm({ secret_code: '', service_id: [], branch_id: '' });
//     } catch (error) {
//       showNotification('Error using gift card', 'error');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Gift Cards</h1>
//         <div className="flex space-x-2">
//           <Button onClick={() => setShowCreateModal(true)}>
//             <Plus className="w-4 h-4 mr-2" />
//             Create Gift Card
//           </Button>
//           <Button variant="outline" onClick={() => setShowValidateModal(true)}>
//             <Eye className="w-4 h-4 mr-2" />
//             Validate Card
//           </Button>
//           <Button variant="secondary" onClick={() => setShowUseModal(true)}>
//             <Gift className="w-4 h-4 mr-2" />
//             Use Gift Card
//           </Button>
//         </div>
//       </div>

//       {/* Gift Card Information Display */}
//       {giftCard && (
//         <Card className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//           <div className="text-center">
//             <h3 className="text-xl font-bold mb-2">Gift Card Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//               <div>
//                 <p className="text-purple-100">Balance</p>
//                 <p className="text-2xl font-bold">${giftCard.balance || 0}</p>
//               </div>
//               <div>
//                 <p className="text-purple-100">Status</p>
//                 <p className="text-xl font-semibold">
//                   {giftCard.is_used ? 'Used' : 'Active'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-purple-100">Code</p>
//                 <p className="text-xl font-mono">{validateForm.secret_code}</p>
//               </div>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card>
//           <div className="text-center">
//             <Gift className="w-12 h-12 text-purple-600 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">Create Gift Card</h3>
//             <p className="text-gray-600 mb-4">Generate a new gift card for customers</p>
//             <Button onClick={() => setShowCreateModal(true)} className="w-full">
//               Create New
//             </Button>
//           </div>
//         </Card>

//         <Card>
//           <div className="text-center">
//             <Eye className="w-12 h-12 text-blue-600 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">Validate Gift Card</h3>
//             <p className="text-gray-600 mb-4">Check gift card balance and status</p>
//             <Button variant="outline" onClick={() => setShowValidateModal(true)} className="w-full">
//               Validate Card
//             </Button>
//           </div>
//         </Card>

//         <Card>
//           <div className="text-center">
//             <CreditCard className="w-12 h-12 text-green-600 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">Redeem Gift Card</h3>
//             <p className="text-gray-600 mb-4">Use gift card for service payments</p>
//             <Button variant="secondary" onClick={() => setShowUseModal(true)} className="w-full">
//               Use Card
//             </Button>
//           </div>
//         </Card>
//       </div>

//       {/* Create Gift Card Modal */}
//       <Modal
//         isOpen={showCreateModal}
//         onClose={() => {
//           setShowCreateModal(false);
//           setCreateForm({ customer_id: '', description: '', balance: '' });
//         }}
//         title="Create Gift Card"
//       >
//         <form onSubmit={handleCreateGiftCard}>
//           <Select
//             label="Customer"
//             required
//             value={createForm.customer_id}
//             onChange={(e) => setCreateForm({ ...createForm, customer_id: e.target.value })}
//             options={customers.map(customer => ({
//               value: customer.customer_id,
//               label: `${customer.first_name} ${customer.last_name}`
//             }))}
//           />
//           <Input
//             label="Balance"
//             type="number"
//             required
//             value={createForm.balance}
//             onChange={(e) => setCreateForm({ ...createForm, balance: e.target.value })}
//             placeholder="Enter gift card amount"
//           />
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               rows="3"
//               value={createForm.description}
//               onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
//               placeholder="Gift card description (optional)"
//             />
//           </div>
//           <div className="flex justify-end space-x-3 mt-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setShowCreateModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit">
//               Create Gift Card
//             </Button>
//           </div>
//         </form>
      
//     case 'LOGOUT':
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       return {
//         ...state,
//         isAuthenticated: false,
//         token: null,
//         user: null,
//         loading: false
//       };
//     case 'SET_LOADING':
//       return { ...state, loading: action.payload };
//     case 'INIT_AUTH':
//       const token = localStorage.getItem('token');
//       const user = localStorage.getItem('user');
//       return {
//         ...state,
//         isAuthenticated: !!token,
//         token: token,
//         user: user ? JSON.parse(user) : null,
//         loading: false
//       };
//     default:
//       return state;
//   }
// };

// // Context for Theme
// const ThemeContext = createContext();

// // API Service
// class ApiService {
//   constructor() {
//     this.baseURL = 'http://localhost:8080/api/v1/shalom';
//     this.authURL = 'http://localhost:8003/api/v1/shalom/auth';
//   }

//   getHeaders() {
//     const token = localStorage.getItem('token');
//     return {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` })
//     };
//   }

//   async request(url, options = {}) {
//     try {
//       const response = await fetch(url, {
//         ...options,
//         headers: { ...this.getHeaders(), ...options.headers }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('API Request failed:', error);
//       throw error;
//     }
//   }

//   // Auth endpoints
//   async login(credentials) {
//     return this.request(`${this.authURL}/login`, {
//       method: 'POST',
//       body: JSON.stringify(credentials)
//     });
//   }

//   async changePassword(data) {
//     return this.request(`${this.authURL}/changePassword`, {
//       method: 'POST',
//       body: JSON.stringify(data)
//     });
//   }

//   // Branch endpoints
//   async getBranches() {
//     return this.request(`${this.baseURL}/branch`);
//   }

//   async addBranch(branch) {
//     return this.request(`${this.baseURL}/branch`, {
//       method: 'POST',
//       body: JSON.stringify(branch)
//     });
//   }

//   async updateBranch(branch) {
//     return this.request(`${this.baseURL}/branch`, {
//       method: 'PUT',
//       body: JSON.stringify(branch)
//     });
//   }

//   async deleteBranch(id) {
//     return this.request(`${this.baseURL}/branch/${id}`, {
//       method: 'DELETE'
//     });
//   }

//   // Customer endpoints
//   async getCustomers() {
//     return this.request(`${this.baseURL}/customer`);
//   }

//   async addCustomer(customer) {
//     return this.request(`${this.baseURL}/customer`, {
//       method: 'POST',
//       body: JSON.stringify(customer)
//     });
//   }

//   async updateCustomer(id, customer) {
//     return this.request(`${this.baseURL}/customer/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(customer)
//     });
//   }

//   async deleteCustomer(id) {
//     return this.request(`${this.baseURL}/customer/${id}`, {
//       method: 'DELETE'
//     });
//   }

//   async searchCustomerByFirstName(firstName) {
//     return this.request(`${this.baseURL}/customer/searchByFirstName`, {
//       method: 'GET',
//       body: JSON.stringify({ first_name: firstName })
//     });
//   }

//   async searchCustomerByPhoneNumber(phoneNumber) {
//     return this.request(`${this.baseURL}/customer/searchByPhoneNumber`, {
//       method: 'GET',
//       body: JSON.stringify({ phone_number: phoneNumber })
//     });
//   }

//   // Service endpoints
//   async getServices() {
//     return this.request(`${this.baseURL}/service`);
//   }

//   async addService(service) {
//     return this.request(`${this.baseURL}/service`, {
//       method: 'POST',
//       body: JSON.stringify(service)
//     });
//   }

//   async updateService(id, service) {
//     return this.request(`${this.baseURL}/service/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(service)
//     });
//   }

//   async deleteService(id) {
//     return this.request(`${this.baseURL}/service/${id}`, {
//       method: 'DELETE'
//     });
//   }

//   // Employee endpoints
//   async getEmployees() {
//     return this.request(`${this.baseURL}/employee`);
//   }

//   async addEmployee(employee) {
//     return this.request(`${this.baseURL}/employee`, {
//       method: 'POST',
//       body: JSON.stringify(employee)
//     });
//   }

//   async updateEmployee(employee) {
//     return this.request(`${this.baseURL}/employee`, {
//       method: 'PUT',
//       body: JSON.stringify(employee)
//     });
//   }

//   // Award endpoints
//   async getAwards() {
//     return this.request(`${this.baseURL}/award`);
//   }

//   async addAward(award) {
//     return this.request(`${this.baseURL}/award`, {
//       method: 'POST',
//       body: JSON.stringify(award)
//     });
//   }

//   async updateAward(id, award) {
//     return this.request(`${this.baseURL}/award/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(award)
//     });
//   }

//   async deleteAward(id) {
//     return this.request(`${this.baseURL}/award/${id}`, {
//       method: 'DELETE'
//     });
//   }

//   // Gift Card endpoints
//   async createGiftCard(data) {
//     return this.request(`${this.baseURL}/gift_card/create`, {
//       method: 'POST',
//       body: JSON.stringify(data)
//     });
//   }

//   async validateGiftCard(secretCode) {
//     return this.request(`${this.baseURL}/gift_card/validate`, {
//       method: 'GET',
//       body: JSON.stringify({ secret_code: secretCode })
//     });
//   }

//   async viewGiftCard(secretCode) {
//     return this.request(`${this.baseURL}/gift_card/view`, {
//       method: 'GET',
//       body: JSON.stringify({ secret_code: secretCode })
//     });
//   }

//   async updateGiftCard(data) {
//     return this.request(`${this.baseURL}/gift_card/update`, {
//       method: 'PUT',
//       body: JSON.stringify(data)
//     });
//   }

//   async useGiftCard(data) {
//     return this.request(`${this.baseURL}/gift_card/use_gift_card`, {
//       method: 'POST',
//       body: JSON.stringify(data)
//     });
//   }

//   // Booking endpoints
//   async bookService(booking) {
//     return this.request(`${this.baseURL}/book/bookService`, {
//       method: 'POST',
//       body: JSON.stringify(booking)
//     });
//   }

//   async getAllBookings() {
//     return this.request(`${this.baseURL}/book/getAll`);
//   }

//   async getTodayBookings() {
//     return this.request(`${this.baseURL}/book/getToday`);
//   }

//   async getTodayBookingsByBranch(branchId) {
//     return this.request(`${this.baseURL}/book/getTodayBookedServicesByBranch`, {
//       method: 'GET',
//       body: JSON.stringify({ branch_id: branchId })
//     });
//   }

//   async getBookingsByBranch(branchId) {
//     return this.request(`${this.baseURL}/book/getByBranchId`, {
//       method: 'GET',
//       body: JSON.stringify({ branch_id: branchId })
//     });
//   }

//   async updateBooking(booking) {
//     return this.request(`${this.baseURL}/book/update`, {
//       method: 'PUT',
//       body: JSON.stringify(booking)
//     });
//   }
// }

// const api = new ApiService();

// // Reusable Components
// const Button = ({ 
//   children, 
//   variant = 'primary', 
//   size = 'md', 
//   onClick, 
//   disabled, 
//   className = '', 
//   type = 'button',
//   ...props 
// }) => {
//   const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
//   const variants = {
//     primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
//     secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
//     success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
//     danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
//     warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
//     outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500'
//   };

//   const sizes = {
//     sm: 'px-3 py-1.5 text-sm',
//     md: 'px-4 py-2 text-sm',
//     lg: 'px-6 py-3 text-base'
//   };

//   const disabledClasses = 'opacity-50 cursor-not-allowed';

//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled}
//       className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? disabledClasses : ''} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };


// const Modal = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-medium text-gray-900">{title}</h3>
//               <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Input = ({ 
//   label, 
//   error, 
//   className = '', 
//   required = false,
//   ...props 
// }) => {
//   return (
//     <div className={`mb-4 ${className}`}>
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
//       <input
//         className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : ''}`}
//         {...props}
//       />
//       {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//     </div>
//   );
// };

// const Select = ({ 
//   label, 
//   options, 
//   value, 
//   onChange, 
//   error, 
//   className = '', 
//   required = false,
//   placeholder = 'Select an option',
//   ...props 
// }) => {
//   return (
//     <div className={`mb-4 ${className}`}>
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
//       <select
//         value={value}
//         onChange={onChange}
//         className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : ''}`}
//         {...props}
//       >
//         <option value="">{placeholder}</option>
//         {options.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//       {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//     </div>
//   );
// };

// const Card = ({ title, children, className = '' }) => {
//   return (
//     <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
//       {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
//       {children}
//     </div>
//   );
// };

// const Table = ({ columns, data, onEdit, onDelete, onView }) => {
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white border border-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             {columns.map((column) => (
//               <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {column.label}
//               </th>
//             ))}
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200">
//           {data.map((row, index) => (
//             <tr key={index} className="hover:bg-gray-50">
//               {columns.map((column) => (
//                 <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {column.render ? column.render(row[column.key], row) : row[column.key]}
//                 </td>
//               ))}
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                 <div className="flex space-x-2">
//                   {onView && (
//                     <button onClick={() => onView(row)} className="text-blue-600 hover:text-blue-900">
//                       <Eye className="w-4 h-4" />
//                     </button>
//                   )}
//                   {onEdit && (
//                     <button onClick={() => onEdit(row)} className="text-indigo-600 hover:text-indigo-900">
//                       <Edit className="w-4 h-4" />
//                     </button>
//                   )}
//                   {onDelete && (
//                     <button onClick={() => onDelete(row)} className="text-red-600 hover:text-red-900">
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const Notification = ({ message, type = 'info', onClose }) => {
//   const icons = {
//     success: <CheckCircle className="w-5 h-5" />,
//     error: <XCircle className="w-5 h-5" />,
//     warning: <AlertCircle className="w-5 h-5" />,
//     info: <AlertCircle className="w-5 h-5" />
//   };

//   const colors = {
//     success: 'bg-green-50 text-green-800 border-green-200',
//     error: 'bg-red-50 text-red-800 border-red-200',
//     warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
//     info: 'bg-blue-50 text-blue-800 border-blue-200'
//   };

//   return (
//     <div className={`fixed top-4 right-4 max-w-sm p-4 border rounded-lg shadow-lg z-50 ${colors[type]}`}>
//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           {icons[type]}
//           <span className="ml-2 text-sm font-medium">{message}</span>
//         </div>
//         <button onClick={onClose} className="ml-4">
//           <X className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// };

// // Auth Provider
// const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, {
//     isAuthenticated: false,
//     token: null,
//     user: null,
//     loading: true
//   });

//   useEffect(() => {
//     dispatch({ type: 'INIT_AUTH' });
//   }, []);

//   const login = async (credentials) => {
//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       const response = await api.login(credentials);
      
//       // Assuming the API returns token and user info
//       const user = { username: credentials.userName, role: 'ADMIN' }; // Mock user data
//       dispatch({ 
//         type: 'LOGIN', 
//         payload: { 
//           token: response.token || 'mock-token', 
//           user 
//         } 
//       });
//       return { success: true };
//     } catch (error) {
//       dispatch({ type: 'SET_LOADING', payload: false });
//       return { success: false, error: error.message };
//     }
//   };

//   const logout = () => {
//     dispatch({ type: 'LOGOUT' });
//   };

//   return (
//     <AuthContext.Provider value={{ ...state, login, logout, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Theme Provider
// const ThemeProvider = ({ children }) => {
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     return localStorage.getItem('darkMode') === 'true';
//   });

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//     localStorage.setItem('darkMode', (!isDarkMode).toString());
//   };

//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [isDarkMode]);

//   return (
//     <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// // Protected Route Component
// const ProtectedRoute = ({ children, requiredRoles = [] }) => {
//   const { isAuthenticated, user, loading } = useContext(AuthContext);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// // Sidebar Component
// const Sidebar = ({ isOpen, onClose }) => {
//   const { user, logout } = useContext(AuthContext);
//   const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const menuItems = [
//     { path: '/dashboard', icon: <User className="w-5 h-5" />, label: 'Dashboard' },
//     { path: '/branches', icon: <Building className="w-5 h-5" />, label: 'Branches' },
//     { path: '/customers', icon: <Users className="w-5 h-5" />, label: 'Customers' },
//     { path: '/services', icon: <Settings className="w-5 h-5" />, label: 'Services' },
//     { path: '/employees', icon: <User className="w-5 h-5" />, label: 'Employees' },
//     { path: '/bookings', icon: <Calendar className="w-5 h-5" />, label: 'Bookings' },
//     { path: '/awards', icon: <Award className="w-5 h-5" />, label: 'Awards' },
//     { path: '/gift-cards', icon: <CreditCard className="w-5 h-5" />, label: 'Gift Cards' }
//   ];

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
//           onClick={onClose}
//         ></div>
//       )}

//       {/* Sidebar */}
//       <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
//         <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
//           <h1 className="text-xl font-bold">Shalom Therapy</h1>
//           <button 
//             onClick={onClose}
//             className="lg:hidden text-gray-300 hover:text-white"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <nav className="mt-8">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
//                 location.pathname === item.path
//                   ? 'bg-gray-700 text-white border-r-4 border-blue-500'
//                   : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//               }`}
//               onClick={() => window.innerWidth < 1024 && onClose()}
//             >
//               {item.icon}
//               <span className="ml-3">{item.label}</span>
//             </Link>
//           ))}
//         </nav>

//         <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
//           <div className="flex items-center justify-between mb-4">
//             <span className="text-sm text-gray-300">Welcome, {user?.username}</span>
//             <button
//               onClick={toggleDarkMode}
//               className="text-gray-300 hover:text-white"
//             >
//               {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//             </button>
//           </div>
//           <Button 
//             variant="danger" 
//             size="sm" 
//             onClick={handleLogout}
//             className="w-full"
//           >
//             <LogOut className="w-4 h-4 mr-2" />
//             Logout
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// };

// // Header Component
// const Header = ({ onMenuClick }) => {
//   const { user } = useContext(AuthContext);

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200 lg:ml-64">
//       <div className="px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center">
//             <button
//               onClick={onMenuClick}
//               className="lg:hidden text-gray-500 hover:text-gray-700"
//             >
//               <Menu className="w-6 h-6" />
//             </button>
//             <h2 className="ml-4 text-xl font-semibold text-gray-900 lg:ml-0">
//               Therapy Management System
//             </h2>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                 <User className="w-4 h-4 text-white" />
//               </div>
//               <span className="text-sm font-medium text-gray-700">
//                 {user?.username}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// // Login Component
// const Login = () => {
//   const [credentials, setCredentials] = useState({ userName: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     const result = await login(credentials);
    
//     if (result.success) {
//       navigate('/dashboard');
//     } else {
//       setError(result.error || 'Login failed');
//     }
    
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="text-center">
//           <h2 className="mt-6 text-3xl font-bold text-gray-900">
//             Shalom Therapy
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Sign in to your account
//           </p>
//         </div>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <Card>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//                 {error}
//               </div>
//             )}
            
//             <Input
//               label="Username"
//               type="text"
//               value={credentials.userName}
//               onChange={(e) => setCredentials({ ...credentials, userName: e.target.value })}
//               required
//               placeholder="Enter your username"
//             />

//             <Input
//               label="Password"
//               type="password"
//               value={credentials.password}
//               onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//               required
//               placeholder="Enter your password"
//             />

//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full"
//             >
//               {loading ? 'Signing in...' : 'Sign in'}
//             </Button>
//           </form>
//         </Card>
//       </div>
//     </div>
//   );
// };

// // Dashboard Component
// const Dashboard = () => {
//   const { user } = useContext(AuthContext);
//   const [stats, setStats] = useState({
//     totalCustomers: 0,
//     totalBookings: 0,
//     totalBranches: 0,
//     todayBookings: 0
//   });

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       // Load dashboard statistics
//       const [customers, bookings, branches, todayBookings] = await Promise.all([
//         api.getCustomers(),
//         api.getAllBookings(),
//         api.getBranches(),
//         api.getTodayBookings()
//       ]);

//       setStats({
//         totalCustomers: customers?.length || 0,
//         totalBookings: bookings?.length || 0,
//         totalBranches: branches?.length || 0,
//         todayBookings: todayBookings?.length || 0
//       });
//     } catch (error) {
//       console.error('Error loading dashboard data:', error);
//     }
//   };

//   const statsCards = [
//     {
//       title: 'Total Customers',
//       value: stats.totalCustomers,
//       icon: <Users className="w-8 h-8 text-blue-600" />,
//       bgColor: 'bg-blue-50'
//     },
//     {
//       title: 'Total Bookings',
//       value: stats.totalBookings,
//       icon: <Calendar className="w-8 h-8 text-green-600" />,
//       bgColor: 'bg-green-50'
//     },
//     {
//       title: 'Total Branches',
//       value: stats.totalBranches,
//       icon: <Building className="w-8 h-8 text-purple-600" />,
//       bgColor: 'bg-purple-50'
//     },
//     {
//       title: "Today's Bookings",
//       value: stats.todayBookings,
//       icon: <Clock className="w-8 h-8 text-orange-600" />,
//       bgColor: 'bg-orange-50'
//     }
//   ];

//   return (
//     <div className="p-6">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 mb-2">
//           Welcome back, {user?.username}!
//         </h1>
//         <p className="text-gray-600">Here's what's happening at Shalom Therapy today.</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {statsCards.map((stat, index) => (
//           <Card key={index} className={`${stat.bgColor} border-l-4 border-l-blue-500`}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                 <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
//               </div>
//               {stat.icon}
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card title="Quick Actions">
//           <div className="grid grid-cols-2 gap-4">
//             <Link
//               to="/bookings"
//               className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
//             >
//               <Calendar className="w-8 h-8 text-blue-600 mb-2" />
//               <span className="text-sm font-medium text-blue-600">New Booking</span>
//             </Link>
//             <Link
//               to="/customers"
//               className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
//             >
//               <Users className="w-8 h-8 text-green-600 mb-2" />
//               <span className="text-sm font-medium text-green-600">Add Customer</span>
//             </Link>
//             <Link
//               to="/services"
//               className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
//             >
//               <Settings className="w-8 h-8 text-purple-600 mb-2" />
//               <span className="text-sm font-medium text-purple-600">Manage Services</span>
//             </Link>
//             <Link
//               to="/gift-cards"
//               className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
//             >
//               <Gift className="w-8 h-8 text-orange-600 mb-2" />
//               <span className="text-sm font-medium text-orange-600">Gift Cards</span>
//             </Link>
//           </div>
//         </Card>

//         <Card title="Recent Activity">
//           <div className="space-y-4">
//             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <CheckCircle className="w-5 h-5 text-green-500" />
//               <div>
//                 <p className="text-sm font-medium">New customer registered</p>
//                 <p className="text-xs text-gray-500">2 minutes ago</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <Calendar className="w-5 h-5 text-blue-500" />
//               <div>
//                 <p className="text-sm font-medium">Booking scheduled</p>
//                 <p className="text-xs text-gray-500">5 minutes ago</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <Gift className="w-5 h-5 text-purple-500" />
//               <div>
//                 <p className="text-sm font-medium">Gift card purchased</p>
//                 <p className="text-xs text-gray-500">1 hour ago</p>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// // Branches Component
// const Branches = () => {
//   const [branches, setBranches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingBranch, setEditingBranch] = useState(null);
//   const [notification, setNotification] = useState(null);

//   const [formData, setFormData] = useState({
//     name: '',
//     location: '',
//     building_name: '',
//     description: '',
//     floor_number: '',
//     office_number: '',
//     phone_number: '',
//     email: ''
//   });

//   useEffect(() => {
//     loadBranches();
//   }, []);

//   const loadBranches = async () => {
//     try {
//       const data = await api.getBranches();
//       setBranches(data || []);
//     } catch (error) {
//       showNotification('Error loading branches', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, type = 'info') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingBranch) {
//         await api.updateBranch({ ...formData, branch_id: editingBranch.branch_id });
//         showNotification('Branch updated successfully', 'success');
//       } else {
//         await api.addBranch(formData);
//         showNotification('Branch added successfully', 'success');
//       }
//       setShowModal(false);
//       setFormData({
//         name: '', location: '', building_name: '', description: '',
//         floor_number: '', office_number: '', phone_number: '', email: ''
//       });
//       setEditingBranch(null);
//       loadBranches();
//     } catch (error) {
//       showNotification('Error saving branch', 'error');
//     }
//   };

//   const handleEdit = (branch) => {
//     setEditingBranch(branch);
//     setFormData(branch);
//     setShowModal(true);
//   };

//   const handleDelete = async (branch) => {
//     if (window.confirm('Are you sure you want to delete this branch?')) {
//       try {
//         await api.deleteBranch(branch.branch_id);
//         showNotification('Branch deleted successfully', 'success');
//         loadBranches();
//       } catch (error) {
//         showNotification('Error deleting branch', 'error');
//       }
//     }
//   };

//   const columns = [
//     { key: 'name', label: 'Name' },
//     { key: 'location', label: 'Location' },
//     { key: 'building_name', label: 'Building' },
//     { key: 'phone_number', label: 'Phone', render: (value) => value || 'N/A' },
//     { key: 'email', label: 'Email', render: (value) => value || 'N/A' }
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
//         <Button onClick={() => setShowModal(true)}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Branch
//         </Button>
//       </div>

//       <Card>
//         <Table
//           columns={columns}
//           data={branches}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//         />
//       </Card>

//       <Modal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setEditingBranch(null);
//           setFormData({
//             name: '', location: '', building_name: '', description: '',
//             floor_number: '', office_number: '', phone_number: '', email: ''
//           });
//         }}
//         title={editingBranch ? 'Edit Branch' : 'Add Branch'}
//       >
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               label="Branch Name"
//               required
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             />
//             <Input
//               label="Location"
//               required
//               value={formData.location}
//               onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//             />
//             <Input
//               label="Building Name"
//               value={formData.building_name}
//               onChange={(e) => setFormData({ ...formData, building_name: e.target.value })}
//             />
//             <Input
//               label="Floor Number"
//               value={formData.floor_number}
//               onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
//             />
//             <Input
//               label="Office Number"
//               value={formData.office_number}
//               onChange={(e) => setFormData({ ...formData, office_number: e.target.value })}
//             />
//             <Input
//               label="Phone Number"
//               type="tel"
//               value={formData.phone_number}
//               onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
//             />
//             <Input
//               label="Email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               className="md:col-span-2"
//             />
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 rows="3"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               />
//             </div>
//           </div>
//           <div className="flex justify-end space-x-3 mt-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setShowModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit">
//               {editingBranch ? 'Update' : 'Add'} Branch
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//         />
//       )}
//     </div>
//   );
// };

// // Customers Component
// const Customers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState(null);
//   const [notification, setNotification] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchType, setSearchType] = useState('name');

//   const [formData, setFormData] = useState({
//     first_name: '',
//     middle_name: '',
//     last_name: '',
//     gender: '',
//     age: '',
//     phone_number: '',
//     email: ''
//   });

//   useEffect(() => {
//     loadCustomers();
//   }, []);

//   const loadCustomers = async () => {
//     try {
//       const data = await api.getCustomers();
//       setCustomers(data || []);
//     } catch (error) {
//       showNotification('Error loading customers', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, type = 'info') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingCustomer) {
//         await api.updateCustomer(editingCustomer.customer_id, formData);
//         showNotification('Customer updated successfully', 'success');
//       } else {
//         await api.addCustomer(formData);
//         showNotification('Customer added successfully', 'success');
//       }
//       setShowModal(false);
//       setFormData({
//         first_name: '', middle_name: '', last_name: '', gender: '',
//         age: '', phone_number: '', email: ''
//       });
//       setEditingCustomer(null);
//       loadCustomers();
//     } catch (error) {
//       showNotification('Error saving customer', 'error');
//     }
//   };

//   const handleEdit = (customer) => {
//     setEditingCustomer(customer);
//     setFormData(customer);
//     setShowModal(true);
//   };

//   const handleDelete = async (customer) => {
//     if (window.confirm('Are you sure you want to delete this customer?')) {
//       try {
//         await api.deleteCustomer(customer.customer_id);
//         showNotification('Customer deleted successfully', 'success');
//         loadCustomers();
//       } catch (error) {
//         showNotification('Error deleting customer', 'error');
//       }
//     }
//   };

//   const handleSearch = async () => {
//     if (!searchTerm.trim()) {
//       loadCustomers();
//       return;
//     }

//     try {
//       let results;
//       if (searchType === 'name') {
//         results = await api.searchCustomerByFirstName(searchTerm);
//       } else {
//         results = await api.searchCustomerByPhoneNumber(searchTerm);
//       }
//       setCustomers(results || []);
//     } catch (error) {
//       showNotification('Error searching customers', 'error');
//     }
//   };

//   const columns = [
//     { 
//       key: 'full_name', 
//       label: 'Name',
//       render: (_, row) => `${row.first_name} ${row.middle_name || ''} ${row.last_name}`.trim()
//     },
//     { key: 'gender', label: 'Gender' },
//     { key: 'age', label: 'Age' },
//     { key: 'phone_number', label: 'Phone', render: (value) => value || 'N/A' },
//     { key: 'email', label: 'Email', render: (value) => value || 'N/A' },
//     { key: 'point', label: 'Points', render: (value) => value || 0 }
//   ];

//   const ageOptions = [
//     { value: '18-25', label: '18-25' },
//     { value: '26-35', label: '26-35' },
//     { value: '36-45', label: '36-45' },
//     { value: '46-55', label: '46-55' },
//     { value: '56-65', label: '56-65' },
//     { value: '65+', label: '65+' }
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
//         <Button onClick={() => setShowModal(true)}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Customer
//         </Button>
//       </div>

//       {/* Search */}
//       <Card className="mb-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1">
//             <Input
//               placeholder="Search customers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <Select
//             value={searchType}
//             onChange={(e) => setSearchType(e.target.value)}
//             options={[
//               { value: 'name', label: 'By Name' },
//               { value: 'phone', label: 'By Phone' }
//             ]}
//             className="sm:w-40"
//           />
//           <Button onClick={handleSearch}>
//             <Search className="w-4 h-4 mr-2" />
//             Search
//           </Button>
//           <Button variant="outline" onClick={loadCustomers}>
//             Clear
//           </Button>
//         </div>
//       </Card>

//       <Card>
//         <Table
//           columns={columns}
//           data={customers}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//         />
//       </Card>

//       <Modal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setEditingCustomer(null);
//           setFormData({
//             first_name: '', middle_name: '', last_name: '', gender: '',
//             age: '', phone_number: '', email: ''
//           });
//         }}
//         title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
//       >
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               label="First Name"
//               required
//               value={formData.first_name}
//               onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
//             />
//             <Input
//               label="Middle Name"
//               value={formData.middle_name}
//               onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
//             />
//             <Input
//               label="Last Name"
//               required
//               value={formData.last_name}
//               onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
//             />
//             <Select
//               label="Gender"
//               required
//               value={formData.gender}
//               onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
//               options={[
//                 { value: 'M', label: 'Male' },
//                 { value: 'F', label: 'Female' }
//               ]}
//             />
//             <Select
//               label="Age Range"
//               value={formData.age}
//               onChange={(e) => setFormData({ ...formData, age: e.target.value })}
//               options={ageOptions}
//             />
//             <Input
//               label="Phone Number"
//               type="tel"
//               value={formData.phone_number}
//               onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
//             />
//             <Input
//               label="Email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               className="md:col-span-2"
//             />
//           </div>
//           <div className="flex justify-end space-x-3 mt-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setShowModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit">
//               {editingCustomer ? 'Update' : 'Add'} Customer
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//         />
//       )}
//     </div>
//   );
// };

// // Services Component
// const Services = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingService, setEditingService] = useState(null);
//   const [notification, setNotification] = useState(null);

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     duration_time: '',
//     service_fee: '',
//     point: ''
//   });

//   useEffect(() => {
//     loadServices();
//   }, []);

//   const loadServices = async () => {
//     try {
//       const data = await api.getServices();
//       setServices(data || []);
//     } catch (error) {
//       showNotification('Error loading services', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message, type = 'info') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingService) {
//         await api.updateService(editingService.service_id, formData);
//         showNotification('Service updated successfully', 'success');
//       } else {
//         await api.addService(formData);
//         showNotification('Service added successfully', 'success');
//       }
//       setShowModal(false);
//       setFormData({ name: '', description: '', duration_time: '', service_fee: '', point: '' });
//       setEditingService(null);
//       loadServices();
//     } catch (error) {
//       showNotification('Error saving service', 'error');
//     }
//   };

//   const handleEdit = (service) => {
//     setEditingService(service);
//     setFormData(service);
//     setShowModal(true);
//   };

//   const handleDelete = async (service) => {
//     if (window.confirm('Are you sure you want to delete this service?')) {
//       try {
//         await api.deleteService(service.service_id);
//         showNotification('Service deleted successfully', 'success');
//         loadServices();
//       } catch (error) {
//         showNotification('Error deleting service', 'error');
//       }
//     }
//   };

//   const columns = [
//     { key: 'name', label: 'Service Name' },
//     { key: 'description', label: 'Description' },
//     { 
//       key: 'duration_time', 
//       label: 'Duration',
//       render: (value) => value || 'N/A'
//     },
//     { 
//       key: 'service_fee', 
//       label: 'Price',
//       render: (value) => `${value || 0}`
//     },
//     { 
//       key: 'point', 
//       label: 'Points',
//       render: (value) => value || 0
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Services</h1>
//         <Button onClick={() => setShowModal(true)}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Service
//         </Button>
//       </div>

//       <Card>
//         <Table
//           columns={columns}
//           data={services}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//         />
//       </Card>

//       <Modal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setEditingService(null);
//           setFormData({ name: '', description: '', duration_time: '', service_fee: '', point: '' });
//         }}
//         title={editingService ? 'Edit Service' : 'Add Service'}
//       >
//         <form onSubmit={handleSubmit}>
//           <Input
//             label="Service Name"
//             required
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           />
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               rows="3"
//               required
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//             />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Input
//               label="Duration (HH:MM:SS)"
//               placeholder="e.g., 1:30:00"
//               value={formData.duration_time}
//               onChange={(e) => setFormData({ ...formData, duration_time: e.target.value })}
//             />
//             <Input
//               label="Service Fee"
//               type="number"
//               required
//               value={formData.service_fee}
//               onChange={(e) => setFormData({ ...formData, service_fee: e.target.value })}
//             />
//             <Input
//               label="Points"
//               type="number"
//               value={formData.point}
//               onChange={(e) => setFormData({ ...formData, point: e.target.value })}
//             />
//           </div>
//           <div className="flex justify-end space-x-3 mt-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setShowModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit">
//               {editingService ? 'Update' : 'Add'} Service
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//         />
//       )}
//     </div>
//   );
// };