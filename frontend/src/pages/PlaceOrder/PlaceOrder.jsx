import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './PlaceOrder.css';


const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((data) => ({ ...data, [name]: value }));
    };

    const placeOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item, quantity: cartItems[item._id] }; // Properly clone item with quantity
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 2, // Correct calculation of amount
        };

        try {
            let response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            } else {
                alert("Error placing order");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Error placing order");
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/cart");
        } else if (getTotalCartAmount() === 0) {
            navigate("/cart");
        }
    }, [token, getTotalCartAmount, navigate]);// Ensure navigate and getTotalCartAmount are in dependencies


    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>User Information</p>
                <div className="multi-fields">
                    <input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' required />
                    <input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' required />
                </div>
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' required />
                <input name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' required />
                <div className="multi-fields">
                    <input name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' required />
                    <input name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' required />
                </div>
                <div className="multi-fields">
                    <input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' required />
                    <input name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' required />
                </div>
                <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' required />
            </div>

            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                        </div>
                    </div>
                    <button type='submit'>PROCEED TO PAYMENT</button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;