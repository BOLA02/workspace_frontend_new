const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
})

export const getBookings = async () =>
  fetch(`${API_URL}/api/bookings`, { headers: authHeaders() }).then(r => r.json())

export const getExpenses = async () =>
  fetch(`${API_URL}/api/expenses`, { headers: authHeaders() }).then(r => r.json())

export const getWorkspaceTypes = async () =>
  fetch(`${API_URL}/api/workspace-types`, { headers: authHeaders() }).then(r => r.json())

export const createBooking = async (data) =>
  fetch(`${API_URL}/api/bookings`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

export const createExpense = async (data) =>
  fetch(`${API_URL}/api/expenses`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

export const deleteExpense = async (id) =>
  fetch(`${API_URL}/api/expenses/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })

export const exportBookings = async (format) =>
  fetch(`${API_URL}/api/bookings/export/${format}`, {
    headers: authHeaders(),
  })
