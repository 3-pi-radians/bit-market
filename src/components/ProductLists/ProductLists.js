import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import {fetchProductsList } from '../../redux/actions/product-actions';
import ProductCard from '../PorductCard/ProductCard';

import "./ProductLists.css"
const ProductList = () => {
    const { productsList } = useSelector((state) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProductsList());
    }, []);
    return (
        <div>
            {
                productsList?.products.length ? <div className='productlists grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
                {
                    productsList?.products.map(product => {
                        return (
                            <div key = {product.id} className="productlists--card">
                                <ProductCard props={product}/>
                                <div className='productlists--card-row-seperate'/>
                            </div>
                        )
                    }) 
                }
                </div>  : <div className='productlists--loader'>
                      <CircularProgress color="secondary" />
                       Please wait...
                    </div>
            }
 
        </div>

    )
}

export default ProductList;