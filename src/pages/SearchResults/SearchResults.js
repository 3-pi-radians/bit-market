import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchProductCard from '../../components/SearchPageCard/SearchPageCard';
import "./SearchResults.css";

const SearchResults = () => {
    const { searchtext } = useParams();
    const { products } = useSelector((state) => state.productsList);
    const [matchedProducts, setMatchedProducts] = useState([]);

    useEffect(() => {
      let results = products.filter(product =>{
            if (
                product.title.toLowerCase().includes(searchtext.toLowerCase()) 
                || 
                product.category.toLowerCase().includes(searchtext.toLowerCase())
            ) return product;
        });

        setMatchedProducts(results);
    }, []);

    return (
        <div className='searchresults'>
            <h1 className='text-3xl font-semibold p-3 mb-2'>
                Showing {matchedProducts.length} results for your search "{searchtext}"
            </h1>
            <hr></hr>
            <div className=''>
                {
                    matchedProducts.map(product => {
                        return (
                            <React.Fragment key={product.id}>
                                <SearchProductCard props={product}/>
                                <hr/>
                            </React.Fragment>
                        )
                        
                    })
                }
            </div>
        </div>
    );
}

export default SearchResults;