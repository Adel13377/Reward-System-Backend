import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from "./Componants/Dashboard"
import Login from "./Componants/Login"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./Componants/ProtectedRoute";
import './App.css';
function App() {

  return (
    <>
      <div className="flex bg-white h-lvh items-center justify-center font-[Roboto, sans-serif]">
      <ToastContainer></ToastContainer>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <ProtectedRoute>
                                                  <Dashboard />
                                              </ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
