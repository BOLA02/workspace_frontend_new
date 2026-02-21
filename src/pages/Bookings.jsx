import { useState, useEffect } from 'react';
import { Calendar, User, DollarSign, Download, Filter, Plus, Search, TrendingUp, TrendingDown, FileText, Trash2, Phone, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function BookingsAndExpenses() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [workspaceTypes, setWorkspaceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [userRole, setUserRole] = useState('');
  
  // Enhanced booking form with duration and phone number
  const [bookingFormData, setBookingFormData] = useState({
    customerName: '',
    phoneNumber: '',
    workspaceTypeId: '',
    amountPaid: '',
    paymentMethod: 'TRANSFER',
    startDate: new Date().toISOString().split('T')[0],
    duration: '1',
    durationType: 'DAYS', // DAYS or MONTHS
    notes: ''
  });

  // Expense form with free-text category
  const [expenseFormData, setExpenseFormData] = useState({
    description: '',
    amount: '',
    category: '',
    expenseDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || '');
    fetchBookings();
    fetchWorkspaceTypes();
    if (user.role === 'ADMIN') {
      fetchExpenses();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/expenses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchWorkspaceTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/workspace-types`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setWorkspaceTypes(data);
    } catch (error) {
      console.error('Error fetching workspace types:', error);
    }
  };

  // Calculate end date based on start date + duration
  const calculateEndDate = (startDate, duration, durationType) => {
    const start = new Date(startDate);
    const durationNum = parseInt(duration) || 1;
    
    if (durationType === 'MONTHS') {
      start.setMonth(start.getMonth() + durationNum);
    } else {
      start.setDate(start.getDate() + durationNum);
    }
    
    // End date is one day before the calculated date (inclusive duration)
    start.setDate(start.getDate() - 1);
    return start.toISOString().split('T')[0];
  };

  const handleBookingSubmit = async () => {
    if (!bookingFormData.customerName || !bookingFormData.phoneNumber || 
        !bookingFormData.workspaceTypeId || !bookingFormData.amountPaid || 
        !bookingFormData.startDate || !bookingFormData.duration) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Calculate end date on client side for validation
      const endDate = calculateEndDate(
        bookingFormData.startDate, 
        bookingFormData.duration, 
        bookingFormData.durationType
      );

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...bookingFormData,
          duration: parseInt(bookingFormData.duration),
          amountPaid: parseFloat(bookingFormData.amountPaid)
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Booking created successfully!\nStart: ${bookingFormData.startDate}\nEnd: ${endDate}\nDuration: ${bookingFormData.duration} ${bookingFormData.durationType.toLowerCase()}`);
        fetchBookings();
        closeBookingModal();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    }
  };

  const handleExpenseSubmit = async () => {
    if (!expenseFormData.description || !expenseFormData.amount || 
        !expenseFormData.category || !expenseFormData.expenseDate) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...expenseFormData,
          amount: parseFloat(expenseFormData.amount)
        })
      });

      if (response.ok) {
        alert('Expense created successfully!');
        fetchExpenses();
        closeExpenseModal();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create expense');
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Failed to create expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Expense deleted successfully!');
        fetchExpenses();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const exportBookings = async (format) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/bookings/export/${format}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-export.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert(`Bookings exported successfully as ${format.toUpperCase()}!`);
      } else {
        alert('Failed to export bookings');
      }
    } catch (error) {
      console.error('Error exporting bookings:', error);
      alert('Failed to export bookings');
    }
  };

  const closeBookingModal = () => {
    setShowCreateModal(false);
    setBookingFormData({
      customerName: '',
      phoneNumber: '',
      workspaceTypeId: '',
      amountPaid: '',
      paymentMethod: 'TRANSFER',
      startDate: new Date().toISOString().split('T')[0],
      duration: '1',
      durationType: 'DAYS',
      notes: ''
    });
  };

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
    setExpenseFormData({
      description: '',
      amount: '',
      category: '',
      expenseDate: new Date().toISOString().split('T')[0]
    });
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.phoneNumber?.includes(searchTerm);
    const matchesPayment = paymentFilter === 'ALL' || booking.paymentMethod === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  // Identify high-value bookings (duration > 30 days or amount > 50000)
  const isHighValue = (booking) => {
    return booking.duration > 30 || booking.amountPaid > 50000;
  };

  const stats = {
    total: bookings.length,
    transfer: bookings.filter(b => b.paymentMethod === 'TRANSFER').length,
    pos: bookings.filter(b => b.paymentMethod === 'POS').length,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0),
    totalExpenses: expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    highValue: bookings.filter(b => isHighValue(b)).length
  };

  stats.netIncome = stats.totalRevenue - stats.totalExpenses;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6"> 
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-1">Track bookings, subscriptions, and expenses</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportBookings('csv')}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => exportBookings('json')}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Download className="w-5 h-5" />
            Export JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High-Value</p>
              <p className="text-2xl font-bold text-amber-600">{stats.highValue}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transfer</p>
              <p className="text-2xl font-bold text-purple-600">{stats.transfer}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">POS</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pos}</p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>

        {userRole === 'ADMIN' && (
          <div className={`bg-gradient-to-br p-6 rounded-lg shadow text-white ${
            stats.netIncome >= 0 ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Net Income</p>
                <p className="text-2xl font-bold">₦{stats.netIncome.toLocaleString()}</p>
              </div>
              {stats.netIncome >= 0 ? (
                <TrendingUp className="w-8 h-8" />
              ) : (
                <TrendingDown className="w-8 h-8" />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'bookings'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bookings (Inflow)
            </button>
            {userRole === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'expenses'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Expenses (Outflow)
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'bookings' ? (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by customer name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ALL">All Payments</option>
                    <option value="TRANSFER">Transfer</option>
                    <option value="POS">POS</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" />
                  New Booking
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workspace</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr 
                        key={booking.id} 
                        className={`hover:bg-gray-50 ${isHighValue(booking) ? 'bg-amber-50' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isHighValue(booking) ? 'bg-amber-100' : 'bg-blue-100'
                            }`}>
                              <User className={`w-5 h-5 ${isHighValue(booking) ? 'text-amber-600' : 'text-blue-600'}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{booking.customerName}</p>
                              {isHighValue(booking) && (
                                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded">High-Value</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-900">{booking.phoneNumber || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{booking.workspaceType?.name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-900">
                              {new Date(booking.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-900">
                              {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-900">
                              {booking.duration} {booking.durationType?.toLowerCase() || 'days'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-green-600">
                            ₦{booking.amountPaid?.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.paymentMethod === 'TRANSFER' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {booking.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{booking.staff?.name}</p>
                          <p className="text-xs text-gray-500">{booking.staff?.email}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredBookings.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No bookings found</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Expense Records</h3>
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <Plus className="w-5 h-5" />
                  Add Expense
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <p className="font-medium text-gray-900">{expense.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-red-600">
                            ₦{expense.amount?.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-900">
                              {new Date(expense.expenseDate).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{expense.createdBy?.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {expenses.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No expenses recorded</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Booking Modal with Duration and Phone */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create New Booking</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={bookingFormData.customerName}
                  onChange={(e) => setBookingFormData({...bookingFormData, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={bookingFormData.phoneNumber}
                  onChange={(e) => setBookingFormData({...bookingFormData, phoneNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workspace Type *
                </label>
                <select
                  required
                  value={bookingFormData.workspaceTypeId}
                  onChange={(e) => setBookingFormData({...bookingFormData, workspaceTypeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select workspace type</option>
                  {workspaceTypes.filter(ws => ws.isActive).map(ws => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name} (Capacity: {ws.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={bookingFormData.startDate}
                  onChange={(e) => setBookingFormData({...bookingFormData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    min="1"
                    value={bookingFormData.duration}
                    onChange={(e) => setBookingFormData({...bookingFormData, duration: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1"
                  />
                  <select
                    value={bookingFormData.durationType}
                    onChange={(e) => setBookingFormData({...bookingFormData, durationType: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="DAYS">Days</option>
                    <option value="MONTHS">Months</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  End Date: {calculateEndDate(bookingFormData.startDate, bookingFormData.duration, bookingFormData.durationType)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid (₦) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={bookingFormData.amountPaid}
                  onChange={(e) => setBookingFormData({...bookingFormData, amountPaid: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5000.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method *
                </label>
                <select
                  required
                  value={bookingFormData.paymentMethod}
                  onChange={(e) => setBookingFormData({...bookingFormData, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="TRANSFER">Transfer</option>
                  <option value="POS">POS</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={bookingFormData.notes}
                  onChange={(e) => setBookingFormData({...bookingFormData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about this booking..."
                  rows="3"
                />
              </div>

              <div className="md:col-span-2 flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBookingSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Expense Modal with Free-text Category */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  value={expenseFormData.description}
                  onChange={(e) => setExpenseFormData({...expenseFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Office rent payment, Electricity bill"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={expenseFormData.category}
                  onChange={(e) => setExpenseFormData({...expenseFormData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Rent, Utilities, Salaries, Maintenance"
                  list="category-suggestions"
                />
                <datalist id="category-suggestions">
                  <option value="Rent" />
                  <option value="Utilities" />
                  <option value="Salaries" />
                  <option value="Maintenance" />
                  <option value="Supplies" />
                  <option value="Marketing" />
                  <option value="Insurance" />
                  <option value="Other" />
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₦) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={expenseFormData.amount}
                  onChange={(e) => setExpenseFormData({...expenseFormData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50000.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expense Date *
                </label>
                <input
                  type="date"
                  required
                  value={expenseFormData.expenseDate}
                  onChange={(e) => setExpenseFormData({...expenseFormData, expenseDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeExpenseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExpenseSubmit}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}