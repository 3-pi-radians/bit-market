import { ActionTypes } from "../constants/action-types";

const initialState = {
    cartItems: []
};


export const cartReducder = (state = initialState, action) => {
    const {type, payload} = action;

    switch(type) {
        case ActionTypes.ADD_TO_CART: {
            return {...state, cartItems: [...state.cartItems, {
                item: payload,
                itemCount: 1
            }]};
        }

        case ActionTypes.REMOVE_FROM_CART: {
            const cartItems = state.cartItems.filter(product => product.item.id !== payload);
            return {...state, cartItems}
        }

        case ActionTypes.INCREASE_CART_COUNT: {
            const items = state.cartItems;
            items.forEach(product => {
                if (product.item.id === payload) {
                    product.itemCount++;
                }
            })
            
            return {...state, items}
        }

        case ActionTypes.DECREASE_CART_COUNT: {
            let items = [...state.cartItems];
            items = items.map(cartitem => {
                if(cartitem.item.id === payload && cartitem.itemCount > 1) {
                    cartitem.itemCount = cartitem.itemCount - 1;
                }

                return cartitem;
            })
            return {
                ...state, 
                cartItems: [...items]
            }
        }

        case ActionTypes.SYNC_CART: {
            return {
                ...state, cartItems: [...payload]
            }
        }

        case ActionTypes.EMPTY_CART: {
            return {
                cartItems: []
            };
        }

        default: return state;
    }
};