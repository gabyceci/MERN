import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Plus, Edit2, Trash2, X, MapPin, Phone, Calendar, CheckCircle, User, Mail, Lock, CreditCard, Hash, Building } from 'lucide-react';

function Employees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      name: '',
      lastName: '',
      birthday: '',
      email: '',
      address: '',
      hireDate: '',
      password: '',
      telephone: '',
      dui: '',
      isssNumber: '',
      isVerified: false
    }
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/api/employees');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      setError('Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (data) => {
    try {
      const res = await fetch('http://localhost:4000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error();
      await fetchEmployees();
      setShowModal(false);
      reset();
    } catch {
      setError('Error al crear empleado');
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm('¿Eliminar este empleado?')) return;
    try {
      await fetch(`http://localhost:4000/api/employees/${id}`, { method: 'DELETE' });
      await fetchEmployees();
    } catch {
      setError('Error al eliminar empleado');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-slate-800 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Gestión de Empleados</h1>
      </div>

      <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Agregar Empleado
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600">Cargando empleados...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {filtered.map(emp => (
            <div key={emp._id} className="border rounded-lg p-4 bg-white hover:shadow">
              <div className="mb-2">
                <h3 className="font-semibold text-gray-900 text-lg">{emp.name} {emp.lastName}</h3>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {emp.address}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {emp.telephone}</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Contratado: {new Date(emp.hireDate).toLocaleDateString()}</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {emp.isVerified ? 'Verificado' : 'No verificado'}</div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
                <button
                  onClick={() => deleteEmployee(emp._id)}
                  className="bg-red-50 text-red-600 p-2 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Agregar Nuevo Empleado</h2>
                  <p className="text-blue-100 text-sm">Complete la información del empleado</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              {/* Información Personal */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Nombre *
                    </label>
                    <input
                      {...register('name', {
                        required: 'El nombre es requerido',
                        minLength: {
                          value: 2,
                          message: 'El nombre debe tener al menos 2 caracteres'
                        },
                        pattern: {
                          value: /^[A-Za-zÀ-ÿ\s]+$/,
                          message: 'El nombre solo debe contener letras'
                        }
                      })}
                      type="text"
                      placeholder="Ingrese el nombre"
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {errors.name.message}
                    </p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Apellido *
                    </label>
                    <input
                      {...register('lastName', {
                        required: 'El apellido es requerido',
                        minLength: {
                          value: 2,
                          message: 'El apellido debe tener al menos 2 caracteres'
                        },
                        pattern: {
                          value: /^[A-Za-zÀ-ÿ\s]+$/,
                          message: 'El apellido solo debe contener letras'
                        }
                      })}
                      type="text"
                      placeholder="Ingrese el apellido"
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {errors.lastName.message}
                    </p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha de Nacimiento *
                    </label>
                    <input
                      {...register('birthday', {
                        required: 'La fecha de nacimiento es requerida',
                        validate: (value) => {
                          const today = new Date();
                          const birthDate = new Date(value);
                          const age = today.getFullYear() - birthDate.getFullYear();

                          if (birthDate > today) {
                            return 'La fecha de nacimiento no puede ser futura';
                          }
                          if (age < 18) {
                            return 'El empleado debe ser mayor de 18 años';
                          }
                          if (age > 65) {
                            return 'La edad no puede ser mayor a 65 años';
                          }
                          return true;
                        }
                      })}
                      type="date"
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.birthday ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.birthday && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {errors.birthday.message}
                    </p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CreditCard className="w-4 h-4 inline mr-1" />
                      DUI *
                    </label>
                    <input
                      {...register('dui', {
                        required: 'El DUI es requerido'

                      })}
                      type="text"
                      placeholder="00000000-0"
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dui ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.dui && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {errors.dui.message}
                    </p>}
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Correo Electrónico *
                    </label>
                    <input
                      {...register('email', {
                        required: 'El correo electrónico es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Ingrese un correo electrónico válido'
                        }
                      })}
                      type="email"
                      placeholder="ejemplo@correo.com"
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {errors.email.message}
                    </p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Teléfono *
                    </label>
                    <input
                      {...register('telephone', {
                        required: 'El teléfono es requerido'
                      })}
                      type="text"
                      placeholder="0000-0000"
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.telephone && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {errors.telephone.message}
                    </p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Dirección *
                    </label>
                    <textarea
                      {...register('address', {
                        required: 'La dirección es requerida',
                        minLength: {
                          value: 10,
                          message: 'La dirección debe tener al menos 10 caracteres'
                        },
                        maxLength: {
                          value: 200,
                          message: 'La dirección no puede exceder los 200 caracteres'
                        }
                      })}
                      rows="3"
                      placeholder="Ingrese la dirección completa"
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {errors.address.message}
                    </p>}
                  </div>
                </div>
              </div>

              {/* Información Laboral */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  Información Laboral
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha de Contratación *
                    </label>
                    <input
                      {...register('hireDate', {
                        required: 'La fecha de contratación es requerida',
                        validate: (value) => {
                          const today = new Date();
                          const hireDate = new Date(value);

                          if (hireDate > today) {
                            return 'La fecha de contratación no puede ser futura';
                          }
                          return true;
                        }
                      })}
                      type="date"
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.hireDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.hireDate && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {errors.hireDate.message}
                    </p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Hash className="w-4 h-4 inline mr-1" />
                      Número ISSS *
                    </label>
                    <input
                      {...register('isssNumber', {
                        required: 'El número de ISSS es requerido',
                        pattern: {
                          value: /^\d{9}$/,
                          message: 'El número de ISSS debe tener 9 dígitos'
                        }
                      })}
                      type="text"
                      placeholder="000000000"
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.isssNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.isssNumber && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {errors.isssNumber.message}
                    </p>}
                  </div>
                </div>
              </div>

              {/* Información de Acceso */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-600" />
                  Información de Acceso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Contraseña *
                    </label>
                    <input
                      {...register('password', {
                        required: 'La contraseña es requerida',
                        minLength: {
                          value: 8,
                          message: 'La contraseña debe tener al menos 8 caracteres'
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
                          message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
                        }
                      })}
                      type="password"
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {errors.password.message}
                    </p>}
                  </div>

                  <div className="flex items-end">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
                      <input
                        {...register('isVerified')}
                        type="checkbox"
                        id="isVerified"
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="isVerified" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        ¿Empleado verificado?
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit(createEmployee)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Crear Empleado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;