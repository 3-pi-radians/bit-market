import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import "./SearchPageCard.css";

const SearchProductCard = ({props, quantity=1}) => {
    const navigate = useNavigate();
    const navigateToProductDetails = () => {
        navigate(`/product-details/${props.id}`);
    }
    return (
        <div className='searchpagecard' onClick={navigateToProductDetails}>
            <div className='searcpagecard--image-container'>
                <img src={props.image} alt="image" />
            </div>
            <div className='searchpagecard--discription'>
                <div className='sm:text-xl md:text-2xl lg:text-3xl font-semibold cursor-pointer mt-4 text-[#0f1111] hover:text-[#e88640]'>{props.title}</div>
                <div>
                    <p className="sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#f37012]">${props.price.toFixed(2) * quantity} (qty: {quantity})</p>
                    <p className='font-bold md:mt-1 lg:mt-2 text-gray-500 sm:text-base md:text-lg lg:text-xl'>Special discount on HDFC bank Credit Cards</p>
                </div>
                <div className='mb-4'>
                    <p className='font-bold md:mt-1 lg:mt-2 text-gray-800 sm:text-base md:text-lg lg:text-xl'>Get It within 3 Business Days!!</p>
                    <p className='font-bold md:mt-1 lg:mt-2 text-gray-800 sm:text-base md:text-lg lg:text-xl'>Free Dilevery</p>
                </div>
            </div>
        </div>
    );
}

export default SearchProductCard;