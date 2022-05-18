import { configureStore } from '@reduxjs/toolkit';
import { productReducer, selectedProductReducer, buyNowProuctReducer } from './reducers/productReducer';
import { userReducer } from './reducers/userReducer';
import { cartReducder } from './reducers/cartReducer';

export const store = configureStore({
    reducer: {
        productsList: productReducer,
        user: userReducer,
        product: selectedProductReducer,
        cart: cartReducder,
        buyNowProduct: buyNowProuctReducer
    }
}); 