import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { Typography, Box, Modal } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';

import axios from '../../apis/backendApi';
import { removeSelectedProduct, fetchProduct, buyNowProduct } from '../../redux/actions/product-actions';
import { addProductToCart } from '../../redux/actions/cart-actions';

import ProductCard from '../../components/PorductCard/ProductCard';
import "./ProductDetails.css";
import { toast, ToastContainer } from 'react-toastify';
import ProcessLoader from '../../components/ProcessLoader/ProcessLoader';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate=useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { cartItems } = useSelector((state) => state.cart);
    const product = useSelector((state) => state.product);
    const productsList = useSelector((state) => state.productsList);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPresentInCart, setIsPresentInCart] = useState(false);
    const [openModal, setOpenModal] = useState(false);
     
    const { title, price, category, description, rating, image} = product;

    const style = {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#000',
        boxShadow: 24,
        p: 4,
        outline: "none"
      };

    useEffect(() => {     
       if(id && id !== "") {
            dispatch(fetchProduct(id));
            
            cartItems.forEach(prod => {
                if (prod.item.id == id) setIsPresentInCart(true);
            })
       }
       
       return () => {
           dispatch(removeSelectedProduct());
       }
    }, [id]);

    useEffect(() => {
        setCategoryProducts(productsList?.products.filter(product => product.category === category && product.image!=image));
    }, [product])

    const addToCart = async () => {
        try {
            setIsProcessing(true);
            if (user.isLoggedIn) {
                let response = await axios({
                    method: "post",
                    url: "/user/cart/add-item",
                    data: {
                        userId: user.id,
                        item: product
                    }
                });
                
                if (response.data.status === "ok") {
                    setIsProcessing(false);
                    if(!isPresentInCart) dispatch(addProductToCart(product));
                    navigate("/cart")     
                } else if (response.data.status ===  "error") {
                    setIsProcessing(false);
                    toast.error(response.data.message);
                }
            } else {
                setIsProcessing(false);
                if(!isPresentInCart) dispatch(addProductToCart(product));
                navigate("/cart")
            }
        } catch (error) {
            toast.error(error.message);
            setIsProcessing(false);
        }
    }

    const buyNow = () => {
        dispatch(buyNowProduct(product));

        if (user.isLoggedIn) navigate('/checkout');
        else navigate('/login');
    }

    const enableEnlargedImageContainer = () => {
        // console.log("hoverrrrrrrr")
        // let element = document.getElementById("productdetails--enlarged-image");
        // element.style.display="block";
    }
    const disableEnlargedImageContainer = () => {
        // let element = document.getElementById("productdetails--enlarged-image");
        // element.style.display="none";
    }

    return (
        <div className='productdetails'>
            {
                product?.id ? 
                <div className="productdetails--top-cont">
                <div className='productdetails--left'>
                    <div className="">
                    {/* <ReactImageMagnify {...{
                        enlargedImagePortalId: "productdetails--enlarged-image",
                        smallImage: {
                            alt: title,
                            isFluidWidth: true,
                            src: image,
                        },
                        largeImage: {
                            src: image,
                            width: 1500,
                            height: 1500
                        },
                        isHintEnabled: true
                    }}/> */}
                    </div>

                    <img className="productdetails--left-display" src={image} alt="product_image" />
                </div>
                <div className='productdetails--right'>
                    <div ></div>
                    <div className='productdetails--right-info'>
                        <h1 className='font-semibold sm:text-xl md:text-2xl lg:text-4xl mb-1.5'>{title}</h1>
                        <div className='flex align-center justify-start'>{rating?.rate && <Rating name="read-only" value={rating?.rate} size="medium" readOnly />}
                        <p className='text-lg'>{rating?.count} Ratings</p>
                        </div>
                        <hr></hr>
                        <p className='productdetails--right-price mt-2 sm:text-xl md:text-2xl lg:text-3xl font-bold'>${price}</p>
                        <p className='text-xl mt-2'>Category In <span className='text-emerald-600'>{category}</span></p>
                        <div className='mt-4'>
                            <Button onClick={() => setOpenModal(true)} sx={{
                                border: "1px solid #3498DB",
                                mt: "10"
                            }}>
                                View Description
                            </Button>
                                <Modal
                                open={openModal}
                                onClose={() => setOpenModal(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                >
                                <Box sx={style}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                       <p className='text-4xl tex-center text-[#3498DB] font-semibold'>Description</p>
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        <p className='text-[#fff] text-2xl'>{description}</p>
                                    </Typography>
                                </Box>
                                </Modal>
                        </div>
                    </div>
                    <div className='productdetails--right-btns md:flex justify-start mt-4 align-center'>
                        <button className='productdetails--addcart' disabled={isProcessing} onClick={addToCart}>{
                            isPresentInCart ? "GO TO CART" : "ADD TO CART"
                        }</button>
                        <button className='productdetails--buynow' onClick={buyNow}>BUY NOW</button>
                    </div>
                    <hr />
                </div>
                </div>
                : <div className='productdetails--top-cont productdetails--loader'>
                    <CircularProgress color="secondary" />
                    Fetching Product Details...
                </div>
            }
            <div className=''>
                <br></br>
               <h1 className='text-3xl mt-4 mb-4 font-bold text-center'>{categoryProducts.length ? "You May also like these Products" : ""}</h1>
               <div className='productdetails--others-list grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
               {
                   categoryProducts?.map((product, idx) => <ProductCard props={product} key={idx}/>)
               }
               </div>
            </div>
            <ProcessLoader isProcessing={isProcessing} />
            <ToastContainer />
        </div>
    );
}

export default ProductDetails;