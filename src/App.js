import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Header from './components/Header/Header';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Profile from './pages/Profile/Profile';
import SearchResults from './pages/SearchResults/SearchResults';
import Orders from './pages/Orders/Orders';
import Footer from './components/Footer/Footer';

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
          <Route path="/checkout" element={ <Checkout /> } />
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