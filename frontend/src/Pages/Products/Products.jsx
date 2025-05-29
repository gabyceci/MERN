import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Plus, Edit2, Trash2, X, Tag, ClipboardList, DollarSign, Package } from 'lucide-react';

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    reset: resetUpdate,
    setValue
  } = useForm();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://mern-s77u.onrender.com/api/products');
      if (!response.ok) throw new Error('Error al cargar los productos');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (formData) => {
    try {
      const response = await fetch('https://mern-s77u.onrender.com/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al crear el producto');
      await fetchProducts();
      setShowModal(false);
      reset();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateProduct = async (formData) => {
    console.log('Datos a enviar:', formData); // <-- Agrega esto
    console.log('ID del producto:', selectedProduct._id); // <-- Y esto

    try {
      const response = await fetch(`https://mern-s77u.onrender.com/api/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Respuesta del servidor:', response); // <-- Y esto

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar el producto: ${errorText}`);
      }

      const data = await response.json();
      console.log('Producto actualizado:', data); // <-- Y esto

      await fetchProducts();
      setShowUpdateModal(false);
      setSelectedProduct(null);
      resetUpdate();
      setError(null);

    } catch (err) {
      console.error('Error en updateProduct:', err); // <-- Y esto
      setError(err.message);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const response = await fetch(`https://mern-s77u.onrender.com/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el producto');
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProduct = (product) => {
    console.log('Producto seleccionado:', product); // <-- Agrega esto
    setSelectedProduct(product);
    setValue('name', product.name);
    setValue('description', product.description);
    setValue('price', product.price);
    setValue('stock', product.stock);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-slate-800 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
      </div>

      <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Producto
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      ) : (
        <div className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {filteredProducts.map(product => (
              <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Tag className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <ClipboardList className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>{product.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>${product.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>{product.stock} en stock</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500">Intenta ajustar la búsqueda o agrega un nuevo producto</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de Crear Producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Agregar Nuevo Producto</h2>
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

            <form onSubmit={handleSubmit(createProduct)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  {...register('name', {
                    required: 'El nombre es requerido',
                    minLength: {
                      value: 3,
                      message: 'El nombre debe tener al menos 3 caracteres'
                    },
                    pattern: {
                      value: /^[A-Za-zÀ-ÿ\s]+$/,
                      message: 'El nombre solo puede contener letras y espacios'
                    }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Nombre del producto"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  {...register('description', {
                    required: 'La descripción es requerida',
                    minLength: {
                      value: 10,
                      message: 'La descripción debe tener al menos 10 caracteres'
                    }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Descripción del producto"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input
                  {...register('price', {
                    required: 'El precio es requerido',
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'El precio debe ser un número válido (ej: 10.50)'
                    },
                    min: {
                      value: 0.01,
                      message: 'El precio debe ser mayor a 0'
                    }
                  })}
                  type="number"
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Precio"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  {...register('stock', {
                    required: 'El stock es requerido',
                    pattern: {
                      value: /^\d+$/,
                      message: 'El stock debe ser un número entero'
                    },
                    min: {
                      value: 0,
                      message: 'El stock no puede ser negativo'
                    }
                  })}
                  type="number"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Stock disponible"
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
              </div>

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
                  Crear Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Actualizar Producto */}
      {showUpdateModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Editar Producto</h2>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedProduct(null);
                  resetUpdate();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitUpdate(updateProduct)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  {...registerUpdate('name', {
                    required: 'El nombre es requerido',
                    minLength: {
                      value: 3,
                      message: 'El nombre debe tener al menos 3 caracteres'
                    },
                    pattern: {
                      value: /^[A-Za-zÀ-ÿ\s]+$/,
                      message: 'El nombre solo puede contener letras y espacios'
                    }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errorsUpdate.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Nombre del producto"
                />
                {errorsUpdate.name && <p className="text-red-500 text-sm mt-1">{errorsUpdate.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  {...registerUpdate('description', {
                    required: 'La descripción es requerida',
                    minLength: {
                      value: 10,
                      message: 'La descripción debe tener al menos 10 caracteres'
                    }
                  })}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errorsUpdate.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Descripción del producto"
                />
                {errorsUpdate.description && <p className="text-red-500 text-sm mt-1">{errorsUpdate.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input
                  {...registerUpdate('price', {
                    required: 'El precio es requerido',
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'El precio debe ser un número válido (ej: 10.50)'
                    },
                    min: {
                      value: 0.01,
                      message: 'El precio debe ser mayor a 0'
                    }
                  })}
                  type="number"
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errorsUpdate.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Precio"
                />
                {errorsUpdate.price && <p className="text-red-500 text-sm mt-1">{errorsUpdate.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  {...registerUpdate('stock', {
                    required: 'El stock es requerido',
                    pattern: {
                      value: /^\d+$/,
                      message: 'El stock debe ser un número entero'
                    },
                    min: {
                      value: 0,
                      message: 'El stock no puede ser negativo'
                    }
                  })}
                  type="number"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errorsUpdate.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Stock disponible"
                />
                {errorsUpdate.stock && <p className="text-red-500 text-sm mt-1">{errorsUpdate.stock.message}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedProduct(null);
                    resetUpdate();
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmitUpdate(updateProduct)();
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Actualizar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;