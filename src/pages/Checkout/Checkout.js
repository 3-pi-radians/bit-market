import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import { ToastContainer, toast } from 'react-toastify';
import { FormControl, RadioGroup, FormControlLabel, FormLabel, Radio } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import AddressCard from '../../components/AddressCard/AddressCard';
import NewAddressForm from '../../components/NewAddressForm/NewAddressForm';
import SearchProductCard from '../../components/SearchPageCard/SearchPageCard';
import axios from '../../apis/backendApi';
import "./Checkout.css";
import { removeBuyNowProduct } from '../../redux/actions/product-actions';
import { emptyCart } from '../../redux/actions/cart-actions';
import ProcessLoader from '../../components/ProcessLoader/ProcessLoader';

const steps = [
    'Sign In',
    'Choose Dilevery Address',
    'Confirm Order',
];

const Checkout = () => {
    let BUYNOW = false;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.user);
    const  buyNowProduct  = useSelector(state => state.buyNowProduct);
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutProducts, setCheckoutProducts] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [deliveryAddress, setDeliveryAddress] = useState({});
    const [openAddressForm, setOpenNewAddressFrom] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("CARD")
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [upi, setUpi] = useState('');

    if (buyNowProduct && buyNowProduct.id) BUYNOW=true;

    useEffect(() => {
        if (!user.isLoggedIn) {
            navigate("/login");
        } else {
            console.log(buyNowProduct);
            if (buyNowProduct && buyNowProduct.id) {
                // checkout for buyNowProduct
                setCheckoutProducts([...checkoutProducts, {
                    item: buyNowProduct,
                    itemCount: 1
                }]);
            } else {
                // checkout for regular cart items
                setCheckoutProducts([...cartItems]);
            }
        }

        return () => {
            console.log("removing buy now")
           if (buyNowProduct && buyNowProduct.id) dispatch(removeBuyNowProduct());
           //setCheckoutProducts([]);
        }
    },[]);

    useEffect(() => {
        let selectedAddressPresent = false;
        user.addresses.forEach(address => {
            if(address.id === deliveryAddress.id ) {
                selectedAddressPresent = true;
            }   
        });

        if (!selectedAddressPresent) setDeliveryAddress({});
    }, [user.addresses.length]);

    const getCheckoutPrice = () => {
        let price = 0;
        checkoutProducts.forEach(product => {
            price += product.itemCount * product.item.price;
        });

        return price;
    }

    const toggleNewAddressForm = (value) => {
        setOpenNewAddressFrom(value);
    }

    const removeAllItems = async () => {
        if (BUYNOW) return true;
        try {
            setIsProcessing(true);
            let response = await axios({
                method: "post",
                url: "/user/cart/empty-cart",
                data: {userId: user.id}
            });
            if (response.data.status === "ok") {
                setIsProcessing(false);
                dispatch(emptyCart());
                return true;
            } else {
                toast.error(response.data.message);
                setIsProcessing(false);
                return false;
            }
        } catch (error) {
           toast.error(error.message);
            setIsProcessing(false);
            return false;
        }
    }
    const nextCheckoutStep = () => {
        if (currentStep === 2) {
            if ((paymentMethod === 'CARD' && cvv.length === 3 && cardNumber.length === 16)) {
                const res = removeAllItems();
                if (res) {
                    setCurrentStep(currentStep+1);
                    toast.success("Order Placed Successfully")   
                }
            } else if (paymentMethod === 'UPI' && upi !== "") {
                const upiregex=/[a-zA-Z0-9.\-_]@[a-zA-Z]/;
                if (!upiregex.test(upi)) {
                    toast.error("Enter valid UPI details!!")
                    return;
                }
                const res = removeAllItems();
                if (res) {
                    setCurrentStep(currentStep+1);
                    toast.success("Order Placed Successfully")   
                }
            } else if (paymentMethod === "CASH_ON_DILEVERY") {
                const res = removeAllItems();
                if (res) {
                    setCurrentStep(currentStep+1);
                    toast.success("Order Placed Successfully")   
                }
            } else {
                toast.error("Enter Valid Payment Details")
            }
        } else if (currentStep === 3) { 
            navigate("/");
            setIsProcessing(false);
        } else {
            setCurrentStep(currentStep+1);
        }
    }
    const choosePaymentMethod = (e) => {
        setPaymentMethod(e.target.value)
    }

    const isNumberValue = (e, type) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            if (type==="card") setCardNumber(e.target.value);
            if (type==="cvv") setCvv(e.target.value);
        }
    }

    return (
        <div className='checkout'>
            <div className='checkout--stepper'>
                <Stepper activeStep={currentStep} alternativeLabel>
                        {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                        ))}
                    </Stepper>
            </div>
            {
                currentStep === 1 && <div>
                    <h1 className={`checkout--choose-address text-3xl font-semibold ${!openAddressForm ? "block" : "hidden" }`}>Choose Dilevery Address</h1>
                    <div className='checkout--address-list'>
                    <div className={`grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${!openAddressForm ? "block" : "hidden" }`}>
                        {
                           user?.addresses.length > 0  
                            ? user.addresses.map(address => <div key={address.id} className='checkout--address-delivercard'>
                               <AddressCard props={address}/>
                               <button className={`checkout--address-save ${address.id === deliveryAddress.id && 'checkout--address-save-selected'}`} 
                                   onClick={() => setDeliveryAddress(address)}>
                                   {address.id !== deliveryAddress.id ? "Deliver Here" : "Selected"}
                                </button>
                            </div>): <div className='checkout--noaddress-msg'><FmdBadIcon/> No Saved Address Found</div>
                        }
                    </div>
                    </div>
                    {
                        openAddressForm ? <NewAddressForm toggleNewAddressForm={toggleNewAddressForm} /> 
                        : 
                        <div 
                            className='checkout--new-address text-3xl font-semibold' 
                            onClick={() => toggleNewAddressForm(true)}> 
                            + Add new Address
                        </div>
                    }
                </div>
            }
            {
                currentStep === 2 && <div className='checkout--payments-section'>
                    <div className='checkout--order-summary'>
                        <h1 className='checkout--choose-address text-3xl font-semibold'>Order Summary</h1>
                        <div className='checkout--order-summary-container'>
                        <p className='font-bold text-3xl xl:mb-4 lg:mb-8'>Amount Payble: ${getCheckoutPrice().toFixed(2)}</p>
                {
                    checkoutProducts.map(product => {
                        const quantity=product.itemCount;
                        <hr/>
                        return (
                            <React.Fragment key={product.item.id}>
                                <SearchProductCard props={product.item} quantity={quantity}/>
                                <hr/>
                            </React.Fragment>
                        )
                        
                    })
                }
            </div>
            </div>
            <div className='checkout--payment-details'>
                    <h1 className='checkout--choose-address text-3xl font-semibold'>Payment</h1>
                    <div className='checkout--payment-details-container'>
                        <FormControl>
                        <FormLabel 
                            id="demo-radio-buttons-group-label">Choose a payment Option</FormLabel>
                        <RadioGroup  
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="CARD"
                            value={paymentMethod}
                            onChange={choosePaymentMethod}
                            name="radio-buttons-group"
                        >
                            <FormControlLabel sx={{
                                '& .MuiSvgIcon-root': {
                                  fontSize: 20,
                                }}} value="CARD" control={<Radio />} label="Card" />
                            {
                                paymentMethod === "CARD" && 
                                    <div className='checkout--payment-method-container'>
                                        <label className='font-semibold sm:text-lg md:text-xl lg:text-2xl sm:ml-2 lg:ml-4'>Card Number</label>
                                        <input type="text" value={cardNumber} onChange={(e) => isNumberValue(e, "card")}
                                            className="checkout--card-payment-input sm:text-lg md:text-xl lg:text-2xl mb-4" 
                                            placeholder='xxxx xxxx xxxx xxxx' maxLength={16} minLength={16} />
                                        <br />
                                        <label className='font-semibold sm:text-lg md:text-xl lg:text-2xl ml-4'>CVV</label>
                                        <input type="password" placeholder='xxx'
                                            value={cvv} onChange={(e) => isNumberValue(e, "cvv")}
                                            className='checkout--cvv-payment-input sm:text-lg md:text-xl lg:text-2xl' 
                                            maxLength={3} minLength={3}/>
                                    </div>
                            }
                            <FormControlLabel
                            sx={{
                                '& .MuiSvgIcon-root': {
                                  fontSize: 20,
                                }}}
                             value="UPI" control={<Radio />} label="UPI" />
                            {
                                paymentMethod === "UPI" && <div>
                                    <div className='checkout--payment-method-container'>
                                        <label  className='font-semibold sm:text-lg md:text-xl lg:text-2xl ml-4'>UPI ID</label>
                                        <input value={upi} onChange={(e) => setUpi(e.target.value)}
                                            className="checkout--card-payment-input sm:text-lg md:text-xl lg:text-2xl" 
                                         type="text" placeholder='Your upi id'></input>
                                    </div>
                                </div>
                            }
                            <FormControlLabel  sx={{
                                '& .MuiSvgIcon-root': {
                                  fontSize: 20,
                                }}} value="CASH_ON_DILEVERY" control={<Radio />} label="Cash On Dilevery" />
                        </RadioGroup>
                        </FormControl>
                    </div>
            </div>
            </div>
            }
            {
                currentStep === 3 && <div className='font-bold m-14 text-center text-[#27AE60] sm:text-lg md:text-xl lg:text-2xl'>
                      Your Order is Placed Successfully.
                       Continue Shopping
                    </div>
            }
            <div className='checkout--nav-btns'>
                {/* <button className='checkout-nav-button bg-[#F39C12]'>Back</button> */}
               {
                !openAddressForm &&  <button 
                    className={`checkout-nav-button bg-[#8E44AD] 
                        ${(deliveryAddress.id === undefined) ? "cursor-not-allowed": "cursor-pointer"}`} 
                    disabled={(deliveryAddress.id === undefined ? true : false) || isProcessing} 
                    onClick={nextCheckoutStep}>
                        {currentStep === 2 ? "Checkout" : currentStep === 3 ? "Home" : "Next"}
                </button>
               } 
            </div>
            <ToastContainer />
            <ProcessLoader isProcessing={isProcessing} /> 
        </div>
    );
};

export default Checkout;