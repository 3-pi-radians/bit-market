import React from 'react';
import { PaymentElement, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const PaymentCard = () => {
    const handlePayment = (e) => {
        
    }
    return (
        <div>
            <form className=''>
                <CardElement />
                <button onClick={handlePayment}>Pay</button>
            </form>
        </div>
    )
}
export default PaymentCard; 