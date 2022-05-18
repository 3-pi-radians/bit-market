import backendApi from "../../apis/backendApi";
import { ActionTypes } from "../constants/action-types";

export const addProductToCart = (product) => {
    return {
        type: ActionTypes.ADD_TO_CART,
        payload: product
    }
};

export const removeProductFromCart = (id) => {
    return {
        type: ActionTypes.REMOVE_FROM_CART,
        payload: id
    }
};

export const emptyCart = () => {
    return {
        type: ActionTypes.EMPTY_CART
    }
};

export const increaseCartCount = (id) => {
    return {
        type: ActionTypes.INCREASE_CART_COUNT,
        payload: id
    }
};

export const decreaseCartCount = (id) => {
    return {
        type: ActionTypes.DECREASE_CART_COUNT,
        payload: id
    }
};

export const syncCart = (cartItems) => {
    return {
        type: ActionTypes.SYNC_CART,
        payload: cartItems
    }
}