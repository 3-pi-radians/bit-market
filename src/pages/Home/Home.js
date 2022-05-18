import React, { useEffect } from 'react';

import ProductList from '../../components/ProductLists/ProductLists';
import HomeBanner from '../../components/HomeBanner/HomeBanner';
import "./Home.css"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const Home = () => {
    const navigate = useNavigate();
    const buyNowProduct = useSelector(state => state.buyNowProduct);

    useEffect(() => {
        if (buyNowProduct && buyNowProduct.id) {
            navigate("/checkout");
        }
    });
    
    return (
        <div className='home'>
            <div className="home-banner">
                <HomeBanner />
            </div>
            <div className="home-productlist">
                 <ProductList />
            </div>
        </div>
    );
}

export default Home;