import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Plus, Edit2, Trash2, X, MapPin, Phone, Clock } from 'lucide-react';

function Branches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [error, setError] = useState(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm();

  const { 
    register: registerEdit, 
    handleSubmit: handleSubmitEdit, 
    formState: { errors: errorsEdit }, 
    reset: resetEdit,
    setValue: setValueEdit
  } = useForm();

  // Fetch branches from API
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/branches');
      if (!response.ok) {
        throw new Error('Error al cargar las sucursales');
      }
      const data = await response.json();
      setBranches(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching branches:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new branch
  const createBranch = async (formData) => {
    try {
      const response = await fetch('http://localhost:4000/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear la sucursal');
      }

      // Refresh the list
      await fetchBranches();
      setShowModal(false);
      reset();
    } catch (err) {
      setError(err.message);
      console.error('Error creating branch:', err);
    }
  };

  // Update branch
  const updateBranch = async (formData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/branches/${editingBranch._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la sucursal');
      }

      // Refresh the list
      await fetchBranches();
      setShowEditModal(false);
      setEditingBranch(null);
      resetEdit();
    } catch (err) {
      setError(err.message);
      console.error('Error updating branch:', err);
    }
  };

  // Open edit modal
  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setValueEdit('name', branch.name);
    setValueEdit('address', branch.address);
    setValueEdit('telephone', branch.telephone);
    setValueEdit('schedule', branch.schedule);
    setShowEditModal(true);
  };

  // Delete branch
  const deleteBranch = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta sucursal?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/branches/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la sucursal');
      }

      await fetchBranches();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting branch:', err);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const filteredBranches = branches.filter(branch => 
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-slate-800 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Gestión de Sucursales</h1>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar sucursales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Add Button */}
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Sucursal
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sucursales...</p>
        </div>
      ) : (
        /* Branches Grid */
        <div className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {filteredBranches.map(branch => (
              <div key={branch._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Branch Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🏢</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Branch Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{branch.telephone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{branch.schedule}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(branch)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button 
                    onClick={() => deleteBranch(branch._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredBranches.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron sucursales</h3>
              <p className="text-gray-500">Intenta ajustar los filtros de búsqueda o agrega una nueva sucursal</p>
            </div>
          )}
        </div>
      )}

      {/* Modal for Adding Branch */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Agregar Nueva Sucursal</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  reset();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(createBranch)} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Sucursal
                </label>
                <input
                  {...register('name', {
                    required: 'El nombre es requerido',
                    minLength: {
                      value: 3,
                      message: 'El nombre debe tener al menos 3 caracteres'
                    }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa el nombre de la sucursal"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  {...register('address', {
                    required: 'La dirección es requerida',
                    minLength: {
                      value: 10,
                      message: 'La dirección debe tener al menos 10 caracteres'
                    }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa la dirección completa"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* Telephone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  {...register('telephone', {
                    required: 'El teléfono es requerido',
                    minLength: {
                      value: 8,
                      message: 'El teléfono debe tener al menos 8 caracteres'
                    }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.telephone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa el número de teléfono"
                />
                {errors.telephone && (
                  <p className="text-red-500 text-sm mt-1">{errors.telephone.message}</p>
                )}
              </div>

              {/* Schedule Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario
                </label>
                <input
                  {...register('schedule', {
                    required: 'El horario es requerido',
                    minLength: {
                      value: 5,
                      message: 'El horario debe tener al menos 5 caracteres'
                    }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.schedule ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Lunes a Viernes 9:00 - 18:00"
                />
                {errors.schedule && (
                  <p className="text-red-500 text-sm mt-1">{errors.schedule.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    reset();
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Crear Sucursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Branch */}
      {showEditModal && editingBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Editar Sucursal</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingBranch(null);
                  resetEdit();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit(updateBranch)} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Sucursal
                </label>
                <input
                  {...registerEdit('name', {
                    required: 'El nombre es requerido',
                    minLength: {
                      value: 3,
                      message: 'El nombre debe tener al menos 3 caracteres'
                    }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errorsEdit.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa el nombre de la sucursal"
                />
                {errorsEdit.name && (
                  <p className="text-red-500 text-sm mt-1">{errorsEdit.name.message}</p>
                )}
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  {...registerEdit('address', {
                    required: 'La dirección es requerida',
                    minLength: {
                      value: 10,
                      message: 'La dirección debe tener al menos 10 caracteres'
                    }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errorsEdit.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa la dirección completa"
                />
                {errorsEdit.address && (
                  <p className="text-red-500 text-sm mt-1">{errorsEdit.address.message}</p>
                )}
              </div>

              {/* Telephone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  {...registerEdit('telephone', {
                    required: 'El teléfono es requerido',
                    minLength: {
                      value: 8,
                      message: 'El teléfono debe tener al menos 8 caracteres'
                    }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errorsEdit.telephone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa el número de teléfono"
                />
                {errorsEdit.telephone && (
                  <p className="text-red-500 text-sm mt-1">{errorsEdit.telephone.message}</p>
                )}
              </div>

              {/* Schedule Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario
                </label>
                <input
                  {...registerEdit('schedule', {
                    required: 'El horario es requerido',
                    minLength: {
                      value: 5,
                      message: 'El horario debe tener al menos 5 caracteres'
                    }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errorsEdit.schedule ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Lunes a Viernes 9:00 - 18:00"
                />
                {errorsEdit.schedule && (
                  <p className="text-red-500 text-sm mt-1">{errorsEdit.schedule.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBranch(null);
                    resetEdit();
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Actualizar Sucursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Branches;