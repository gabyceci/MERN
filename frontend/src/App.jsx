import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Components/NavBar';
import Branches from './Pages/Branches/Branches';
import Employees from './Pages/Employees/Employees';
import Products from './Pages/Products/Products';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Ruta por defecto - redirige a marcas */}
            <Route path="/" element={<Navigate to="/marcas" replace />} />
            
            {/* Rutas principales */}
            <Route path="/marcas" element={<Branches />} />
            <Route path="/empleados" element={<Employees />} />
            <Route path="/productos" element={<Products />} />
            
            <Route path="*" element={
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-700 mb-4">404</h1>
                <p className="text-gray-500">Página no encontrada</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;