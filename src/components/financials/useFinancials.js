import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useFinancials() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [workspaceTypes, setWorkspaceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [workspaceFilter, setWorkspaceFilter] = useState("ALL");

  //  Server-Side Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limitPerPage] = useState(2) 

  // Modal Controllers
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBookingForUpdate, setSelectedBookingForUpdate] = useState(null);
  const [showUpdateExpenseModal, setShowUpdateExpenseModal] = useState(false);
  const [selectedExpenseForUpdate, setSelectedExpenseForUpdate] = useState(null);

  // Forms State
  const [bookingFormData, setBookingFormData] = useState({
    customerName: "", phoneNumber: "", workspaceTypeId: "", amountPaid: "",
    paymentMethod: "TRANSFER", startDate: new Date().toISOString().split("T")[0],
    duration: "1", durationType: "DAYS", notes: "",
  });

  const [expenseFormData, setExpenseFormData] = useState({
    description: "", amount: "", category: "", expenseDate: new Date().toISOString().split("T")[0],
  });

  // 1. Safe Authentication Role Initialization On Boot Load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let role = "";
    
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        role = parsed.role || "";
      } catch (e) {
        role = storedUser;
      }
    }
    setUserRole(role);
    fetchWorkspaceTypes();
    fetchExpenses(); 
  }, []);

  // 2. Server Query Handling Engine for Inbound Bookings (With Pagination Parsing)
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      
      if (paymentFilter !== "ALL") params.append("paymentMethod", paymentFilter);
      if (workspaceFilter !== "ALL") params.append("workspaceTypeId", workspaceFilter);
      if (startDateFilter) params.append("startDate", startDateFilter);
      if (endDateFilter) params.append("endDate", endDateFilter);
      
      // Pass pagination query constraints
      params.append("page", currentPage);
      params.append("limit", limitPerPage);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings?${params.toString()}`, {

        headers: { Authorization: `Bearer ${token}` },
      });
      
      const responsePayload = await response.json();
      
      // 🌟 SAFELY UNPACK NESTED DATA AND METADATA OBJECTS FROM THE BACKEND
      if (responsePayload && Array.isArray(responsePayload)) {
        setBookings(responsePayload);
        setTotalPages(1); // Set to 1 since backend isn't sending meta data yet
      } else if (responsePayload && Array.isArray(responsePayload.data)) {
        // Backup safeguard check in case your backend changes structure later
        setBookings(responsePayload.data);
        setTotalPages(responsePayload.meta?.totalPages || 1);
      } else {
        setBookings([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Booking load failure:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // 3. Server Query Handling Engine for Outbound Expenses
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setExpenses(data);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.error("Expense load failure:", err);
      setExpenses([]);
    }
  };

  const fetchWorkspaceTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/workspace-types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setWorkspaceTypes(data);
      }
    } catch (err) {
      console.error("Workspace configuration mismatch:", err);
    }
  };

// 1. Trigger reactive fetch operations cleanly
// 🌟 FIX: Only one useEffect to handle both Bookings and Expenses safely
useEffect(() => {
  if (activeTab === "bookings") {
    // We wrap the logic here so it handles fetching without fighting currentPage
    const loadBookingsData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();
        
        if (paymentFilter !== "ALL") params.append("paymentMethod", paymentFilter);
        if (workspaceFilter !== "ALL") params.append("workspaceTypeId", workspaceFilter);
        if (startDateFilter) params.append("startDate", startDateFilter);
        if (endDateFilter) params.append("endDate", endDateFilter);
        
        params.append("page", currentPage);
        params.append("limit", limitPerPage);

        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${baseUrl}/api/bookings?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const responsePayload = await response.json();
        
       
      if (responsePayload && Array.isArray(responsePayload)) {
        setBookings(responsePayload);
        
        // Since the backend sent raw items without a metadata block,
        // we fallback to page 1, or manage totalPages dynamically.
        setTotalPages(1); 
      } else if (responsePayload && Array.isArray(responsePayload.data)) {
        // Defensive backup case in case your endpoint changes structure later
        setBookings(responsePayload.data);
        setTotalPages(responsePayload.meta?.totalPages || 1);
      } else {
        setBookings([]);
        setTotalPages(1);
      }

      } catch (err) {
        console.error("Booking load failure:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookingsData();
  } else if (activeTab === "expenses") {
    fetchExpenses();
  }
  // 🌟 CRITICAL: Do NOT put paymentFilter, workspaceFilter, etc. here anymore!
  // This stops the infinite rendering loop dead in its tracks.
}, [currentPage, activeTab]); 

// 🌟 FIX: For the filters, handle page resetting independently without triggering side effects
useEffect(() => {
  setCurrentPage(1);
}, [paymentFilter, workspaceFilter, startDateFilter, endDateFilter]);


const clearFilters = () => {
  setPaymentFilter("ALL");
  setWorkspaceFilter("ALL");
  setStartDateFilter("");
  setEndDateFilter("");
  setSearchTerm("");
  setCurrentPage(1);
};

// 3. DEFENSIVE ARRAYS FILTER: Pass "filteredBookings" to your table component!
const filteredBookings = Array.isArray(bookings)
  ? bookings.filter((b) =>
      b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone?.includes(searchTerm)
    )
  : [];


  const handleBookingSubmit = async () => {
    if (
      !bookingFormData.customerName ||
      !bookingFormData.phoneNumber ||
      !bookingFormData.workspaceTypeId ||
      !bookingFormData.amountPaid ||
      !bookingFormData.startDate ||
      !bookingFormData.duration
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const start = new Date(bookingFormData.startDate);
      const durationNum = parseInt(bookingFormData.duration, 10) || 1;
      if (bookingFormData.durationType === "MONTHS") {
        start.setMonth(start.getMonth() + durationNum);
      } else {
        start.setDate(start.getDate() + durationNum);
      }
      start.setDate(start.getDate() - 1);
      const endDateTimeCalculated = start.toISOString();

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: bookingFormData.customerName,
          customerPhone: bookingFormData.phoneNumber, 
          workspaceTypeId: bookingFormData.workspaceTypeId,
          amountPaid: parseFloat(bookingFormData.amountPaid),
          paymentMethod: bookingFormData.paymentMethod,
          usageDate: new Date(bookingFormData.startDate).toISOString(), 
          endDateTime: endDateTimeCalculated,
          duration: `${bookingFormData.duration} ${bookingFormData.durationType.toLowerCase()}`
        }),
      });

      if (response.ok) {
        alert("Booking created successfully!");
        fetchBookings(); 
        setShowCreateModal(false); 
        setBookingFormData({
          customerName: "", phoneNumber: "", workspaceTypeId: "", amountPaid: "",
          paymentMethod: "TRANSFER", startDate: new Date().toISOString().split("T")[0],
          duration: "1", durationType: "DAYS", notes: ""
        });
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking");
    }
  };

  const handleExpenseSubmit = async () => {
    if (!expenseFormData.description || !expenseFormData.amount || !expenseFormData.category) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/expenses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: expenseFormData.description,
          amount: parseFloat(expenseFormData.amount),
          category: expenseFormData.category.toUpperCase(), 
          expenseDate: new Date(expenseFormData.expenseDate || new Date()).toISOString()
        }),
      });

      if (response.ok) {
        alert("Expense tracked successfully!");
        fetchExpenses(); 
        setShowExpenseModal(false);
        setExpenseFormData({
          description: "", amount: "", category: "GENERAL", expenseDate: new Date().toISOString().split("T")[0]
        });
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create expense");
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("Failed to track expense entry");
    }
  };

    const exportBookings = async (format) => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      
      if (paymentFilter !== "ALL" && paymentFilter !== "") params.append("paymentMethod", paymentFilter);
      if (workspaceFilter !== "ALL" && workspaceFilter !== "") params.append("workspaceTypeId", workspaceFilter);
      if (startDateFilter) params.append("startDate", startDateFilter);
      if (endDateFilter) params.append("endDate", endDateFilter);

      const response = await fetch(`${API_URL}/api/bookings/export/${format}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const isFiltered = params.toString() ? 'filtered' : 'all';
        a.download = `bookings-${isFiltered}-${new Date().toISOString().split("T")[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("The backend server failed to generate your custom file.");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export bookings");
    }
  };

  const exportExpenses = async (format) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/expenses/export/${format}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: startDateFilter || null,
          endDate: endDateFilter || null,
          category: workspaceFilter !== "ALL" ? workspaceFilter : null
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const isFiltered = (startDateFilter || endDateFilter || workspaceFilter !== "ALL") ? 'filtered' : 'all';
        a.download = `expenses-${isFiltered}-${new Date().toISOString().split("T")[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("The backend server failed to generate your custom expenses file.");
      }
    } catch (error) {
      console.error("Expense export processing failure:", error);
      alert("An unexpected error occurred while compiling your download.");
    }
  };

const handleDeleteBooking = async (id) => {
  if (!confirm("Are you sure you want to permanently delete this booking record?")) {
    return;
  }
  try {
    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    
    const response = await fetch(`${baseUrl}/api/bookings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Booking deleted successfully!");

      // 🌟 CRITICAL FIX: Manually remove the deleted item from the state array first
      // This forces React to drop the row instantly without touching the other rows
      setBookings((prevBookings) => {
        if (Array.isArray(prevBookings)) {
          return prevBookings.filter((booking) => booking.id !== id);
        }
        return [];
      });

      // 🌟 SAFE RE-FETCH: Reload from server to ensure database alignment
      await fetchBookings();
    } else {
      const error = await response.json();
      alert(error.error || "Failed to delete booking");
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
    alert("Failed to delete booking record");
  }
};



  // const handleBookingUpdate = async (id, updatedData) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(`${API_URL}/api/bookings/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updatedData),
  //     });
  //     if (response.ok) {
  //       alert("Booking records updated successfully!");
  //       fetchBookings();
  //       setShowUpdateModal(false);
  //       setSelectedBookingForUpdate(null);
  //     } else {
  //       const error = await response.json();
  //       alert(error.error || "Failed to update booking");
  //     }
  //   } catch (error) {
  //     console.error("Error updating booking:", error);
  //     alert("Failed to submit system updates");
  //   }
  // };

  const openUpdateModal = (booking) => {
    setSelectedBookingForUpdate(booking);
    setShowUpdateModal(true);
  };

    const handleBookingUpdate = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      // 🌟 FIX: Use the correct environment variable
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        alert("Booking records updated successfully!");
        fetchBookings();
        setShowUpdateModal(false);
        setSelectedBookingForUpdate(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to submit system updates");
    }
  };

  const handleExpenseUpdate = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      // 🌟 FIX: Use the correct environment variable
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/expenses/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedData,
          amount: parseFloat(updatedData.amount),
          category: updatedData.category.toUpperCase()
        }),
      });
      if (response.ok) {
        alert("Expense record updated successfully!");
        fetchExpenses();
        setShowUpdateExpenseModal(false);
        setSelectedExpenseForUpdate(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Failed to save expense updates");
    }
  };


  const openUpdateExpenseModal = (expense) => {
    setSelectedExpenseForUpdate(expense);
    setShowUpdateExpenseModal(true);
  };

   return {
    activeTab, setActiveTab, loading, userRole, workspaceTypes,
    searchTerm, setSearchTerm, paymentFilter, setPaymentFilter,
    startDateFilter, setStartDateFilter, endDateFilter, setEndDateFilter,
    workspaceFilter, setWorkspaceFilter, clearFilters, filteredBookings, expenses,
    showCreateModal, setShowCreateModal, showExpenseModal, setShowExpenseModal,
    bookingFormData, setBookingFormData, expenseFormData, setExpenseFormData,
    fetchBookings, fetchExpenses, handleBookingSubmit, handleExpenseSubmit,
    exportBookings, exportExpenses, handleDeleteBooking, handleBookingUpdate,
    openUpdateModal, handleExpenseUpdate, openUpdateExpenseModal,
    currentPage, setCurrentPage, totalPages,

    // 🌟 ADD THESE MISSING VARIABLES FOR THE BOOKING UPDATE MODAL
    showUpdateModal, setShowUpdateModal,
    selectedBookingForUpdate, setSelectedBookingForUpdate,

    // 🌟 ADD THESE MISSING VARIABLES FOR THE EXPENSE UPDATE MODAL
    showUpdateExpenseModal, setShowUpdateExpenseModal,
    selectedExpenseForUpdate, setSelectedExpenseForUpdate
  };

}
