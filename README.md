# Instalar node.js para ejecutar la terminal [nodejs.org](https://nodejs.org/es)

Codigos de ejecucion en la terminal para el funcionamiento de el proyecto
cosas que solo me pasan a mi con el npm
```
Set-Alias npm "C:\Program Files\nodejs\npm.cmd"
```

## Parte backend --------------------
```
cd backend
```
```
npm init -y
```
```
npm install cors express
```
```
npm install mongoose
```
```
npm install dotenv
```
### Instalamos ayuda para hacer los registros

1. Sirve para Encriptar
```
npm install bcryptjs
```
2. Sirve para generar tokens
```
npm install jsonwebtoken
```
3. Sirve para generar cookies
```
npm install cookie-parser
```
4. Para enviar un correo
```
npm install nodemailer
```
5. Para generar un codigo
```
npm install crypto
```
6. Para ejecutar con npm run dev
```
npm install nodemon -D
```
7. Para guardar imagenes y videos
```
npm install multer-storage-cloudinary
```
```
npm install multer
```
```
npm install cloudinary
```
### Ejecucion del backend
 poner el atajo para ejecutar nodemon en ```packaje.json``` en script como ```"dev" : "nodemon index.js"``` y tambien poner ```"type": "module"``` luego
 Puedes usar cualquiera de los 2 comandos de abajo para ejecutar el codigo backend solo que el primero lo corre y se actualiza constantemente y el segundo hay que reiniciarlo al hacer algun cambio
 ```
 npm run dev
```
```
node index.js
```

## Parte frontend-------------------
```
npm create vite@latest
```
-seleccionamos react y el "javaScript"  el amarillito
nos vamos a la carpeta del proyecto que se creo y hacemos
```
cd frontend
```
```
npm i
```


### Configurar React Router.
1. Abre el archivo ```main.jsx```.
2. Importa BrowserRouter desde react-router-dom y envuelve tu componente raíz con él:
   
```ruby
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```
### Crear las rutas
1. Abre el archivo ```App.jsx```.
2. Importa Routes y Route desde react-router-dom y define tus rutas:
```ruby
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
```
### Ejecucion del frontend
```
npm run dev
```
```
npm install react-router-dom
```
```
npm install react-hot-toast
```
sirve para crear rutas hacia otras paginas
en ```App.jsx``` puedes eliminar el contenido de la funcion y se eliminara la plantilla que viene default
quedaria algo asi:

```ruby
import './App.css'

function App() {

  return (
    <>
      
    </>
  )
}

export default App
```

vamos a boostrap y vamos a download buscamos CDN via jsDelivr 
copiamos y pegamos en el ```index.html``` arriba de title

```ruby
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
```
