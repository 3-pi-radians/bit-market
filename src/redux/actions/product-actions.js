import fakeStoreApi  from "../../apis/fakeStoreApi";
import { ActionTypes } from "../constants/action-types";

export const fetchProductsList =  () => async (dispatch) => {
    const response = await fakeStoreApi.get("/products");

    dispatch({
        type: ActionTypes.SET_PRODUCTS,
        payload: response.data
    });
}

export const fetchProduct = (id) => async (dispatch) => {
    const response = await fakeStoreApi.get(`/products/${id}`);

    dispatch({
        type: ActionTypes.SELECTED_PRODUCT,
        payload: response.data
    });
};

export const setProducts = (products) => {
    return {
        type: ActionTypes.SET_PRODUCTS,
        payload: products
    }
};

export const removeSelectedProduct = () => {
    return {
        type: ActionTypes.REMOVE_SELECTED_PRODUCT
    }
};

export const buyNowProduct = (product) => {
    return {
        type: ActionTypes.BUY_NOW_PRODUCT,
        payload: product
    }
}

export const removeBuyNowProduct = () => {
    return {
        type: ActionTypes.REMOVE_BUY_NOW_PRODUCT
    }
}