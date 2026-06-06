import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const cartContext = createContext();

const CartProvider = ({ children }) => {

    const [cart, setCart] = useState([]);

    const token = localStorage.getItem("token");

    // ✅ FETCH CART FROM BACKEND
    const fetchCart = async () => {
        try {
            const res = await axios.get(
                `${window.api}/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            setCart(res.data?.items || []);
        } catch (error) {
            console.log("Cart Fetch Error:", error.response?.data || error.message);
        }
    };

    // ✅ LOAD CART ON START
    useEffect(() => {
        if (token) {
            fetchCart();
        }
    }, []);

    // ✅ ADD TO CART (BACKEND)
    const addToCart = async (productId) => {
        try {
            await axios.post(
                `${window.api}/cart/add`,
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchCart(); // refresh cart
        } catch (error) {
            console.log("Add Cart Error:", error.response?.data || error.message);
        }
    };

    // ✅ CLEAR CART (BACKEND)
    const clearCart = async () => {
        try {
            await axios.delete(
                `${window.api}/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            setCart([]);
        } catch (error) {
            console.log("Clear Cart Error:", error.response?.data || error.message);
        }
    };

    const updateCart = async (productId, action) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.put(
                `${window.api}/cart/update`,
                { productId, action },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCart(res.data.items);

        } catch (error) {
            console.log("Update Cart Error:", error.response?.data || error.message);
        }
    };

    return (
        <cartContext.Provider value={{
            cart,
            setCart,
            fetchCart,
            addToCart,
            clearCart,
            updateCart
        }}>
            {children}
        </cartContext.Provider>
    );
};

export default CartProvider;

export const useCartContext = () => useContext(cartContext);