import { ActionTypes } from "../constants/action-types";

const initialState = {
    products: []
};

export const productReducer = (state = initialState, action) => {
    const {type, payload} = action;

    switch(type) {
        case ActionTypes.SET_PRODUCTS: {
            return {...state, products: payload}
        }
        case ActionTypes.FETCH_PRODUCTS: {
            return {...state, products: payload}
        }
        
        default: return state;
    }
};

export const selectedProductReducer = (state = {}, action) => {
    const {type, payload} = action;

    switch(type) {
        case ActionTypes.SELECTED_PRODUCT: {
            return {...state, ...payload};
        }

        case ActionTypes.REMOVE_SELECTED_PRODUCT: {
            return {};
        }

        default: return state;
    }
};

export const buyNowProuctReducer = (state = {}, action) => {
    const {type, payload} = action;

    switch(type) {
        case ActionTypes.BUY_NOW_PRODUCT: {
            return {...state, ...payload};
        }

        case ActionTypes.REMOVE_BUY_NOW_PRODUCT: {
            return {}
        }
        
        default: return state;
    }
};