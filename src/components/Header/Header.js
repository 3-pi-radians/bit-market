import React, { useState, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { IconButton } from "@mui/material";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import axios from '../../apis/backendApi';
import { syncCart } from '../../redux/actions/cart-actions';
import './Header.css';
import { removeUser } from "../../redux/actions/user-actions";
import { toast, ToastContainer } from "react-toastify";

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 10,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));

const Header = () => {
    const { user } = useSelector(state => state.user);
    const { cartItems } = useSelector((state) => state.cart);
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const firstName = user.name?.split(" ")[0];


  useEffect(() => {
    const syncUserCart = async () => {
      console.log("Syncing user cart");
      try {
        let response = await axios({
          method: "post",
          url: "/user/cart/sync-cartitems",
          data: {
            userId: user.id,
            cartItems
          }
        });
        if (response.data.status === "ok") {
          
          dispatch(syncCart(response.data.payload));
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (user.isLoggedIn && user.id !== "") syncUserCart();

  }, [user.isLoggedIn]);

  const triggerSearch = () => {
    navigate(`/search/${searchInput}`);
  }

  const logoutUser = () => {
    dispatch(removeUser());
  }
    
    return (
        <div className="header sticky top-0 bg-white  z-50 shadow-md">
           <Link to="/">
                <div className="header--title-logo">
                    BitMarket
                </div>
           </Link>
            <div className="header--search pl-2 pr-2 md:border-2">
                <input type="text" placeholder="search your items"
                  value = {searchInput}
                  onChange = {e => setSearchInput(e.target.value)}
                  onKeyPress = {e => (e.key === 'Enter' && searchInput != "") && triggerSearch()}
                  className="outline-none flex-grow sm:text-lg md:text-xl xl:text-2xl mx-5  lg:text-gray-600 placeholder-gray-400"/>
                <SearchIcon
                   onClick={searchInput != "" ? () =>  triggerSearch() : null}
                   className="header--searchicon h-8 rounded-full text-white p-2 cursor-pointer md:inline-flex"
                />
            </div>
            <div className="header--right space-x-4  text-gray-500 cursor-pointer">
               {user.isLoggedIn && <div className="header--right-logout-icon" onClick={logoutUser}>
                           <PowerSettingsNewIcon />
                         <p className="header--right-icontext font-semibold">Logoff</p>
                    </div>}
                <Link to={user.isLoggedIn ? "/profile" : "/login"}>
                    <AccountBoxIcon />
                    <p className="header--right-icontext">{user.isLoggedIn ? firstName : "Login"}</p>
                </Link>
                <Link to="/cart">
                <IconButton aria-label="cart">
                <StyledBadge badgeContent={cartItems.length} color="secondary">
                    <div className="header--right-cart">
                         <ShoppingCartIcon/>
                         <p className="header--right-icontext">Cart</p>
                    </div>
                </StyledBadge>
                </IconButton>
                </Link>
            </div>
            <ToastContainer />
        </div>
    )
};

export default Header;