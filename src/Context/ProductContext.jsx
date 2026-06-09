import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const ProductContext = createContext();



const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem("token");

            // No token => clear products
            if (!token) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${window.api}/products`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("PRODUCT CONTEXT API:", response.data);

                setProducts(response.data);
            } catch (error) {
                console.log(
                    "Error fetching products:",
                    error.response?.data || error.message
                );

                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider
            value={{
                products,
                setProducts,
                loading,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;

export const UseProductContext = () => useContext(ProductContext);