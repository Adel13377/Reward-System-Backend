import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from "./Componants/Dashboard"
import Register from "./Componants/Register"
import Login from "./Componants/Login"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <>
      <div className="flex bg-white h-lvh items-center justify-center font-[Roboto, sans-serif]">
      <ToastContainer></ToastContainer>
        <BrowserRouter>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
