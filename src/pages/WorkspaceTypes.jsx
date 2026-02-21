import { useState, useEffect } from 'react';
import { Briefcase, Plus, Package, Edit2, Trash2, Users, Calendar, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:3000';

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
    if (!formData.name.trim()) {
      alert('Please enter a workspace type name');
      return;
    }

    if (!formData.capacity || formData.capacity < 1) {
      alert('Please enter a valid capacity (minimum 1)');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editMode 
        ? `${API_URL}/api/workspace-types/${selectedWorkspace.id}`
        : `${API_URL}/api/workspace-types`;
      
      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: formData.name,
          capacity: parseInt(formData.capacity)
        })
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
    setFormData({
      name: workspace.name,
      capacity: workspace.capacity.toString()
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (workspace) => {
    if (!confirm(`Are you sure you want to delete "${workspace.name}"?`)) {
      return;
    }

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
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workspace Types</h1>
          <p className="text-gray-600 mt-1">Manage your workspace types and capacity</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-300">
            <Calendar className="w-4 h-4 text-gray-600" />
            <input
              type="date"
              value={checkDate}
              onChange={(e) => setCheckDate(e.target.value)}
              className="border-none focus:outline-none text-sm"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Workspace
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaceTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    type.isFullyBooked ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <Briefcase className={`w-6 h-6 ${
                      type.isFullyBooked ? 'text-red-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{type.name}</h3>
                    <p className="text-xs text-gray-500">ID: {type.id.slice(0, 8)}...</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(type)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(type)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Capacity</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{type.capacity}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Booked</span>
                    <span className="font-semibold text-blue-600">{type.bookedSpaces}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available</span>
                    <span className={`font-semibold ${
                      type.availableSpaces === 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {type.availableSpaces}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        type.isFullyBooked ? 'bg-red-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${(type.bookedSpaces / type.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {type.isFullyBooked && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="text-xs text-red-800 font-medium">Fully Booked</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm text-gray-600">Status</span>
                  <button
                    onClick={() => toggleActive(type)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      type.isActive 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {type.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t mt-4">
                <p className="text-xs text-gray-500">
                  Created: {new Date(type.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {workspaceTypes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No workspace types found</p>
          <p className="text-sm text-gray-400 mb-4">Create your first workspace type to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Workspace Type
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editMode ? 'Edit Workspace Type' : 'Add Workspace Type'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workspace Type Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Hot Desk, Private Office"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter maximum capacity"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of available spaces for this workspace type
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editMode ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}