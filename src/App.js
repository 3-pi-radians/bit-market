import './App.css';
import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from './components/Header/Header';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Profile from './pages/Profile/Profile';
import SearchResults from './pages/SearchResults/SearchResults';
import Navbar from './components/Navbar/Navbar';
import PaymentCard from './components/PaymentCard/PaymentCard';
import Orders from './pages/Orders/Orders';
import Footer from './components/Footer/Footer';

const stripePromise = loadStripe(
  "pk_test_51KvmVfSDXGLXV0xHt1TPDC7mgnqlwuMt2j8753iXEdH4KDDD4DklDKoBH6yPizno18Bratnbd3MUkfPW3rDSmYsy00QUI3FDKw"
);
function App() {
  return (
    <div className=''>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/checkout" element={<Login />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/checkout" element={
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
            } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search/:searchtext" element={<SearchResults />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;