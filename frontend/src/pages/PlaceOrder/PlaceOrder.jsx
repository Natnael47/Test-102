import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import CartTotal from '../../components/CartTotal';
import Title from '../../components/Title';
import { StoreContext } from '../../context/StoreContext';
import './PlaceOrder.css';


const PlaceOrder = () => {

    const { getTotalCartAmount, token, food_list, cartItems, url, backendUrl, setCartItems } = useContext(StoreContext);

    const navigate = useNavigate();

    const [method, setMethod] = useState('cod');

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
        try {
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

            switch (method) {
                //API call for COD
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/placeorder/place', orderData, { headers: { token } });
                    console.log(response.data);

                    if (response.data.success) {
                        setCartItems({})
                        navigate('/myorders')
                    } else {
                        toast.error(response.data.message);
                    }
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }

        // try {
        //     let response = await axios.post(`${url}/api/placeorder/place`, orderData, { headers: { token } });
        //     if (response.data.success) {
        //         const { session_url } = response.data;
        //         window.location.replace(session_url);
        //     } else {
        //         alert("Error placing order");
        //     }
        // } catch (error) {
        //     console.error("Error placing order:", error);
        //     alert("Error placing order");
        // }
    };

    useEffect(() => {
        if (!token) {
            navigate("/cart");
        } else if (getTotalCartAmount() === 0) {
            navigate("/cart");
        }
    }, [token, getTotalCartAmount, navigate]);// Ensure navigate and getTotalCartAmount are in dependencies


    return (
        <form className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t' onSubmit={placeOrder}>
            {/*-----------left side ------------ */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' required />
                    <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' required />
                </div>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' required />
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' required />
                <div className='flex gap-3'>
                    <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' required />
                    <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' required />
                </div>
                <div className='flex gap-3'>
                    <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="number" placeholder='Zip code' required />
                    <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' required />
                </div>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' required />
            </div>
            {/*-----------Right side ------------ */}
            <div className='mt-8'>
                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    {/*-----------payment method selection------------*/}
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-500' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-500' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-500' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-primary text-white px-16 py-3 text-sm border rounded hover:bg-black hover:text-white transition-all'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;