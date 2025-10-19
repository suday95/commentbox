import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AppHome from "./pages/AppHome";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/signin" />;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/signin' element={<SignIn/>}/>
                <Route path='/signup' element={<SignUp/>}/>
                <Route path='/' element={
                    <PrivateRoute>
                        <AppHome/>
                    </PrivateRoute>
                }/>
            </Routes>
        </Router>
    );
}

export default App 