import { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2, Users, Calendar, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function WorkspaceTypes() {
  const [workspaceTypes, setWorkspaceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [formData, setFormData] = useState({ name: '', capacity: '' });
  const [checkDate, setCheckDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchWorkspaceTypes();
  }, [checkDate]);

  const fetchWorkspaceTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/workspace-types?date=${checkDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setWorkspaceTypes(data);
    } catch (error) {
      console.error('Error fetching workspace types:', error);
      alert('Failed to fetch workspace types');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) { alert('Please enter a workspace type name'); return; }
    if (!formData.capacity || formData.capacity < 1) { alert('Please enter a valid capacity (minimum 1)'); return; }

    try {
      const token = localStorage.getItem('token');
      const url = editMode
        ? `${API_URL}/api/workspace-types/${selectedWorkspace.id}`
        : `${API_URL}/api/workspace-types`;

      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, capacity: parseInt(formData.capacity) })
      });

      if (response.ok) {
        alert(`Workspace type ${editMode ? 'updated' : 'created'} successfully!`);
        fetchWorkspaceTypes();
        closeModal();
      } else {
        const error = await response.json();
        alert(error.error || `Failed to ${editMode ? 'update' : 'create'} workspace type`);
      }
    } catch (error) {
      console.error('Error saving workspace type:', error);
      alert(`Failed to ${editMode ? 'update' : 'create'} workspace type`);
    }
  };

  const handleEdit = (workspace) => {
    setSelectedWorkspace(workspace);
    setFormData({ name: workspace.name, capacity: workspace.capacity.toString() });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (workspace) => {
    if (!confirm(`Are you sure you want to delete "${workspace.name}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/workspace-types/${workspace.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Workspace type deleted successfully!');
        fetchWorkspaceTypes();
      } else {
        const error = await response.json();
        if (error.bookingsCount) {
          alert(`Cannot delete: This workspace has ${error.bookingsCount} existing bookings.\n\n${error.suggestion}`);
        } else {
          alert(error.error || 'Failed to delete workspace type');
        }
      }
    } catch (error) {
      console.error('Error deleting workspace type:', error);
      alert('Failed to delete workspace type');
    }
  };

  const toggleActive = async (workspace) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/workspace-types/${workspace.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !workspace.isActive })
      });
      if (response.ok) {
        alert(`Workspace type ${!workspace.isActive ? 'activated' : 'deactivated'} successfully!`);
        fetchWorkspaceTypes();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update workspace type');
      }
    } catch (error) {
      console.error('Error updating workspace type:', error);
      alert('Failed to update workspace type');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedWorkspace(null);
    setFormData({ name: '', capacity: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <div className="w-full px-6 py-6 space-y-6">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
                Workspace Registry
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Workspace Types</h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage workspace types and availability</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Picker */}
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md bg-white hover:border-teal-300 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="date"
                value={checkDate}
                onChange={(e) => setCheckDate(e.target.value)}
                className="border-none focus:outline-none text-xs text-gray-700 bg-transparent"
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 text-xs font-medium rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Workspace
            </button>
          </div>
        </header>

        {/* Cards Grid */}
        {workspaceTypes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaceTypes.map((type) => {
              const occupancyPct = Math.round((type.bookedSpaces / type.capacity) * 100);
              return (
                <div
                  key={type.id}
                  className="border border-gray-100 rounded-lg bg-white hover:border-teal-200 transition-colors overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="px-5 pt-5 pb-4 border-b border-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-md flex items-center justify-center ${
                          type.isFullyBooked ? 'bg-red-50' : 'bg-teal-50'
                        }`}>
                          <Briefcase className={`w-4 h-4 ${
                            type.isFullyBooked ? 'text-red-500' : 'text-teal-500'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{type.name}</h3>
                          <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">
                            {type.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(type)}
                          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(type)}
                          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-5 py-4 space-y-4">

                    {/* Capacity row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[10px] uppercase tracking-widest text-gray-400">Capacity</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{type.capacity}</span>
                    </div>

                    {/* Occupancy bar */}
                    <div className="space-y-1.5">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            type.isFullyBooked ? 'bg-red-400' : 'bg-teal-500'
                          }`}
                          style={{ width: `${occupancyPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-gray-400">{type.bookedSpaces} booked</span>
                        <span className={`text-[10px] font-medium ${
                          type.availableSpaces === 0 ? 'text-red-500' : 'text-teal-600'
                        }`}>
                          {type.availableSpaces} available
                        </span>
                      </div>
                    </div>

                    {/* Fully booked alert */}
                    {type.isFullyBooked && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-md">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="text-[10px] uppercase tracking-wider text-red-500 font-medium">Fully Booked</span>
                      </div>
                    )}

                    {/* Status toggle + created */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                      <p className="text-[10px] text-gray-400">
                        {new Date(type.createdAt || Date.now()).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                      <button
                        onClick={() => toggleActive(type)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider transition-colors ${
                          type.isActive
                            ? 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {type.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-200 rounded-lg">
            <div className="w-10 h-10 rounded-md bg-teal-50 flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5 text-teal-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">No workspace types yet</p>
            <p className="text-xs text-gray-400 mb-4">Create your first workspace type to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 text-xs font-medium rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Workspace Type
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-gray-100 rounded-lg shadow-xl">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
                  {editMode ? 'Edit Workspace Type' : 'Add Workspace Type'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Form */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                  Workspace Type Name <span className="text-teal-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Hot Desk, Private Office"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 placeholder-gray-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1.5">
                  Capacity <span className="text-teal-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="Enter maximum capacity"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-900 placeholder-gray-300 transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1.5">Number of available spaces for this workspace type</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 py-2.5 text-xs font-medium border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-2.5 text-xs font-medium bg-teal-500 text-white rounded-md hover:bg-teal-600 active:bg-teal-700 transition-colors"
              >
                {editMode ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}