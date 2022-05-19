import React, { useState, useEffect }from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNavigate, Link } from 'react-router-dom';

import "./Cart.css";
import axios from "../../apis/backendApi";
import { decreaseCartCount, emptyCart, increaseCartCount, removeProductFromCart } from '../../redux/actions/cart-actions';
import { toast, ToastContainer } from 'react-toastify';
import ProcessLoader from '../../components/ProcessLoader/ProcessLoader';

const noCartImg="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90";

const Cart = () => {
    const [totalAmount, setTotalAmount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const { cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        let price = 0;
        cartItems.forEach(product => {
            price += product.itemCount * product.item.price;
        });

        setTotalAmount(price);
    }, []);

    const changeProductCount = async(id, price, action) => {
        try {
            setIsProcessing(true);
            const changeBy = (action === "INCREASE") ? 1 : -1;
            let response = await axios({
                method: "put",
                url: "/user/cart/change-itemcount",
                data: {
                    userId: user.id,
                    productId: id,
                    changeBy
                }
            });

            if (response.data.status === "ok") {
                setIsProcessing(false);
                setTotalAmount(totalAmount + (price * changeBy));
                action === "DECREASE" 
                    ? dispatch(decreaseCartCount(id)) 
                    : dispatch(increaseCartCount(id));
            } else {
                setIsProcessing(false);
                toast.error(response.data.message);
            }
        } catch (error) {
            //toast.error(error.message);
            console.log(error);
        }
    };

    const decreaseProductCount = (id) => {
        let canChangeCount = true;
        let price = 0;
        cartItems.forEach(product => {
            if (product.item.id === id) {
                price = product.item.price;
                if (product.itemCount <= 1) {
                    canChangeCount = false;
                }
            }
        });

        if (canChangeCount) {
            changeProductCount(id, price, "DECREASE")
        }
    };

    const increaseProductCount = (id) => {
        let canChangeCount = true;
        let price = 0;
        cartItems.forEach(product => {
            if (product.item.id === id) {
                price = product.item.price;
                if (product.itemCount >= 10) {
                    canChangeCount = false;
                }
            }
        });
        if(canChangeCount) {
            changeProductCount(id, price, "INCREASE");
        }   
    }

    const removeFromCart = async (id) => {
        try {
            setIsProcessing(true);
            setIsProcessing(true);
            let response = await axios({
                method: "post",
                url: "/user/cart/remove-item",
                data: {
                    userId: user.id,
                    productId: id,
                }
            });

            if (response.data.status === "ok") {
                dispatch(removeProductFromCart(id));
                let amount = 0;
                cartItems.forEach(product => {
                    if (product.item.id === id) amount = product.itemCount * product.item.price;
                });
                setTotalAmount(totalAmount-amount);
            } else {
                setIsProcessing(false);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            setIsProcessing(false);
        }
    }

    const removeAllItems = async () => {
        try {
            let response = await axios({
                method: "post",
                url: "/user/cart/empty-cart",
                data: {userId: user.id}
            });
            if (response.data.status === "ok") {
                setTotalAmount(0);
                dispatch(emptyCart());
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const goToCheckout = () => {
        navigate("/checkout");
    }

    return (
        <div className="cart">
            {
                cartItems.length > 0 ? <div className='flex'>
            <div className='cart--left bg-white'>
                <div className='cart--left-head'>
                    <p className='sm:text-xl md:text-2xl lg:text-3xl'>My Shopping Cart</p>
                    <p 
                      onClick={removeAllItems} 
                      className='sm:text-sm md:text-lg lg:text-xl md:pt-1 lg:pt-2 hover:underline cursor-pointer text-[#007185] hover:text-[#EC7063]'>
                          Remove All Items
                    </p>
                </div>
                <hr></hr>
                <div className='cart--left-list'>
                    {
                        cartItems.map(product => {
                            const {id, image , title, category, price} = product.item;
                            const itemCount = product.itemCount;

                            return (
                               <React.Fragment key={id}>
                                <div className='cart--left-item flex'>
                                    <div className='cart--items-imgcontainer'>
                                        <img src={image} className=""/>
                                        <div className='cart--items-imagecontainer-btns'>
                                            <RemoveCircleIcon onClick={() => decreaseProductCount(id)} />
                                            <span className=''>{itemCount} </span>
                                            <AddCircleIcon onClick={() => increaseProductCount(id)}/>
                                           
                                        </div>
                                    </div>
                                    <div className='cart--left-item-detail'>
                                        <p className='cart--left-item-title'>{title}</p>
                                        <p className='cart--left-item-category text-[#196F3D] sm:text-base md:text-lg md:mt-3 lg:text-xl lg:mt-4'>In {category}</p>
                                        <div className='cart--left-item-price'>${price.toFixed(2)}</div>
                                        <p className='font-bold md:mt-1 lg:mt-2 text-gray-500 sm:text-base md:text-lg lg:text-xl'>Eligible for FREE Shipping</p>
                                        <button disabled={isProcessing}
                                            className='sm:text-base md:text-xl lg:text-2xl font-semibold sm:mt-1 md:mt-2 lg:mt-3 mb-1 hover:underline cursor-pointer text-[#007185] hover:text-[#EC7063] w-10'
                                            onClick={() => removeFromCart(id)}>
                                                REMOVE
                                        </button>
                                    </div>
                                    <div className='font-bold mt-4 text-[#000] sm:text-lg md:text-xl lg:text-2xl'>${(itemCount * price).toFixed(2)}</div>
                                </div>
                                <div className='cart--left-item-divider'></div>
                                </React.Fragment>
                            );
                        })
                    }
                </div>
            </div>
            <div className='cart--right bg-white'>
                <p className='sm:text-xl md:text-2xl lg:text-3xl font-500 text-gray-500 pb-3'>Cart Summary</p><hr />
                <div className='clart--right-details'>
                    <div className='flex justify-between p-4 m-2'>
                        <p className='md:text-xl lg:text-2xl   font-medium'>Items</p>
                        <p className='md:text-xl lg:text-2xl   font-bold'> {cartItems.length}</p>
                    </div>
                    <div className='lg:flex lg:justify-between p-4 m-2'>
                        <p className='md:text-xl lg:text-2xl font-meduim'>Amount &nbsp;</p>
                        <p className='md:text-xl lg:text-2xl font-bold'>${(totalAmount).toFixed(2)}</p>
                    </div>
                    <div>
                        <button className='cart--right-orderbtn' onClick={goToCheckout}>
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
                </div> : <div className='cart--noitems'>
                    <h1 className='cart--noitems-text sm:text-xl md:text-2xl lg:text-3xl font-semibold m-8'>Oops.. No items in your Cart!</h1>
                    <div className='cart--noitems-image'>
                        <img src={noCartImg} alt="no Items" />
                    </div>
                    {
                        user.isLoggedIn ? <div className='sm:text-xl text-purple-900 md:text-2xl lg:text-3xl m-8 font-semibold hover:underline cursor-pointer'><Link to="/">Lets find something to buy</Link></div> 
                        : <div className='flex items-center m-8'>
                               <h1 className='sm:text-xl md:text-2xl lg:text-2xl mr-2'> Login to see your items</h1>
                               <Link to="/login">
                               <    button className='cart--noitems-button ml-4'>Login</button>
                               </Link>
                            
                            </div>
                    }
                </div>
            }
            <ProcessLoader isProcessing={isProcessing} />
            <ToastContainer/>
        </div>
    );
}

export default Cart;