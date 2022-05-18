import React from 'react';
import { Link } from 'react-router-dom';
import "./ProductCard.css";
 
const ProductCard = ({props}) => {
    const {id, title, image} = props;

    return (
       <Link to={`/product-details/${id}`} >
        <div className='productcard'>
            <div className='productcard--imagecontainer'>
             <img src={image} alt={title} className="productcard--image rounded-lg"/>
            </div>
            <div className="productcard--text">
                <h2>{title}</h2>
            </div>
        </div>
        </Link>
    );
}

export default ProductCard;