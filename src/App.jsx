import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Home from './pages/home/Home';
import Order from './pages/order/Order';
import Cart from './pages/cart/Cart';
import Dashboard from './pages/admin/dashboard/Dashboard';
import NoPage from './pages/nopage/NoPage';
import MyState from './context/data/myState';
import Login from './pages/registration/Login';
import Signup from './pages/registration/Signup';
import ProductInfo from './pages/productInfo/ProductInfo';
import AddProduct from './pages/admin/page/AddProduct';
import Profile from './pages/Profile/Profile';
import Allproducts from './pages/allproducts/AllProducts';
import UpdateProduct from './pages/admin/page/UpdateProduct';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import Contact from './pages/contact/Contact';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './pages/ResetPassword/ResetPassword';

function App() {
  return (
    <MyState>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allproducts" element={<Allproducts />} />
          <Route path="/order" element={
           <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={
            <ProtectedRouteForAdmin><Dashboard /></ProtectedRouteForAdmin>
          } />
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path="/productinfo/:id" element={<ProductInfo />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/addproduct" element={
            <ProtectedRouteForAdmin><AddProduct /></ProtectedRouteForAdmin>} />
          <Route path="/updateproduct" element={
            <ProtectedRouteForAdmin><UpdateProduct /></ProtectedRouteForAdmin>} />
          <Route path="/*" element={<NoPage />} />
        </Routes>
        <ToastContainer />
      </Router>
    </MyState>
  )
}

export default App

//user
export const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user')
  if (user) {
    return children
  }
  else {
    return <Navigate to={'/login'} />
  }
}

//admin
export const ProtectedRouteForAdmin = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem('user'))
 console.log(admin.email)
  if (admin.email === 'mr.shaktiranjansethy@gmail.com') {
    return children
  }
  else {
    return <Navigate to={'/login'} />
  }
}