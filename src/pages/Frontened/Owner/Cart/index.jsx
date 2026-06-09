import React, { useState } from 'react';
import axios from "axios";
import { Card, Button, InputNumber, message, Empty } from 'antd';
import { FaCartShopping, FaTrashCan, FaPercent } from 'react-icons/fa6';
import { useCartContext } from '../../../../Context/CartContext';


const Cart = () => {
    const { cart = [], clearCart, updateCart } = useCartContext();

    // ================= DISCOUNT PRICE STATE =================
    const [customPrices, setCustomPrices] = useState({});
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    // ================= GET FINAL PRICE =================
    const getFinalPrice = (item) => {
        const customPrice = customPrices[item.productId?._id];
        // If custom price is valid, use it; otherwise fallback safely to sellingPrice
        return customPrice !== undefined && customPrice !== null && customPrice > 0
            ? customPrice
            : (item.productId?.sellingPrice ?? 0);
    };

    // ================= HANDLE PRICE CHANGE =================
    const handlePriceChange = (productId, value) => {
        setCustomPrices(prev => ({
            ...prev,
            [productId]: value // Stores the exact user input (handles number or null)
        }));
    };

    // ================= TOTAL AMOUNT =================
    const totalAmount = cart.reduce((acc, item) => {
        return acc + (getFinalPrice(item) * item.qty);
    }, 0);

    // ================= CHECKOUT =================
    const checkout = async () => {
        try {
            setCheckoutLoading(true);

            const token = localStorage.getItem("token");

            const updatedCart = cart.map((item) => ({
                productId: item.productId?._id,
                qty: item.qty,
                sellingPrice: getFinalPrice(item)
            }));

            await axios.post(
                `${window.api}/checkout`,
                { items: updatedCart },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            message.success("Order Completed Successfully");
            setCustomPrices({});
            await clearCart();

        } catch (error) {
            console.error(error);
            message.error("Checkout Failed");

        } finally {
            setCheckoutLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 text-slate-800 font-sans antialiased">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* ================= HEADER ================= */}
                <div className="flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100/50 shadow-sm">
                        <FaCartShopping size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                            Shopping Cart
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">
                            Edit price anytime for discount overrides or custom counter billing
                        </p>
                    </div>
                </div>

                {/* ================= MAIN CONTAINER ================= */}
                <Card
                    className="shadow-sm border border-slate-100 rounded-2xl overflow-hidden bg-white"
                    bodyStyle={{ padding: '24px' }}
                >
                    {/* ================= TOP BAR ================= */}
                    <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
                        <h3 className="text-base font-black text-slate-800 flex items-center gap-2 tracking-tight">
                            🛒 Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                        </h3>
                        {cart.length > 0 && (
                            <Button
                                danger
                                type="text"
                                icon={<FaTrashCan size={12} />}
                                onClick={() => {
                                    clearCart();
                                    setCustomPrices({});
                                }}
                                className="font-bold text-xs flex items-center gap-1.5 rounded-xl hover:!bg-rose-50"
                            >
                                Clear Cart
                            </Button>
                        )}
                    </div>

                    {/* ================= TABLE HEADER (DESKTOP) ================= */}
                    {cart.length > 0 && (
                        <div className="hidden md:grid md:grid-cols-12 font-bold uppercase tracking-widest text-[11px] text-slate-400 pb-3 border-b border-slate-100 px-2">
                            <span className="col-span-4">Product Details</span>
                            <span className="col-span-2 text-center">Quantity</span>
                            <span className="col-span-3 text-center">Override Price</span>
                            <span className="col-span-1 text-right">Original</span>
                            <span className="col-span-2 text-right">Subtotal</span>
                        </div>
                    )}

                    {/* ================= ITEMS CONTAINER ================= */}
                    {cart.length === 0 ? (
                        <div className="py-12 flex justify-center items-center">
                            <Empty description={<span className="text-slate-400 font-bold text-sm">Your cart is empty</span>} />
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {cart.map((item) => {
                                // CRITICAL FIX: Base keys and state targets strictly on the stable unique product ID
                                const pId = item.productId?._id;
                                const finalPrice = getFinalPrice(item);
                                const originalPrice = item.productId?.sellingPrice || 0;
                                const hasDiscount = finalPrice < originalPrice;

                                return (
                                    <div
                                        key={pId || item._id}
                                        className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-2 py-5 items-center px-2 hover:bg-slate-50/80 rounded-xl transition-colors duration-150"
                                    >
                                        {/* PRODUCT DETAILS */}
                                        <div className="w-full text-center md:text-left md:col-span-4">
                                            <h4 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">
                                                {item.productId?.productName || "Unknown Product"}
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                                ID: {pId?.slice(-8) || "N/A"}
                                            </p>
                                        </div>

                                        {/* QUANTITY CONTROLS */}
                                        <div className="flex items-center justify-center gap-2.5 md:col-span-2">
                                            <Button
                                                size="small"
                                                className="h-8 w-8 rounded-lg font-bold flex items-center justify-center bg-white shadow-sm border-slate-200"
                                                onClick={() => updateCart(pId, "decrease")}
                                            >
                                                -
                                            </Button>
                                            <span className="font-extrabold text-slate-800 text-sm w-6 text-center">
                                                {item.qty}
                                            </span>
                                            <Button
                                                size="small"
                                                className="h-8 w-8 rounded-lg font-bold flex items-center justify-center bg-white shadow-sm border-slate-200"
                                                onClick={() => updateCart(pId, "increase")}
                                            >
                                                +
                                            </Button>
                                        </div>

                                        {/* PRICE OVERRIDE INPUT */}
                                        <div className="w-full max-w-[160px] md:max-w-none flex justify-center md:col-span-3">
                                            <div className="relative w-full px-2">
                                                <InputNumber
                                                    min={0}
                                                    placeholder={originalPrice.toString()}
                                                    value={customPrices[pId] !== undefined ? customPrices[pId] : originalPrice}
                                                    onChange={(value) => handlePriceChange(pId, value)}
                                                    className="w-full h-9 rounded-xl font-bold border-slate-200 pr-8 flex items-center"
                                                    controls={false}
                                                />
                                                <FaPercent className="absolute right-5 top-3 text-slate-400 pointer-events-none" size={12} />
                                            </div>
                                        </div>

                                        {/* ORIGINAL PRICE */}
                                        <div className="text-center md:text-right font-bold text-xs text-slate-400 md:col-span-1">
                                            <span className="md:hidden inline-block mr-1 text-[11px] uppercase tracking-wider font-semibold">Original:</span>
                                            Rs. {originalPrice.toLocaleString()}
                                        </div>

                                        {/* SUBTOTAL */}
                                        <div className="text-center md:text-right md:col-span-2 w-full md:w-auto">
                                            {hasDiscount && (
                                                <span className="inline-block text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold mb-1 md:block md:w-max md:ml-auto">
                                                    Discount applied
                                                </span>
                                            )}
                                            <div className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                                                Rs. {(finalPrice * item.qty).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ================= FOOTER / CHECKOUT ================= */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-between items-center mt-8 pt-6 border-t border-slate-100 bg-slate-50/60 -mx-6 -mb-6 p-6">
                        <div className="text-center sm:text-left">
                            <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold block">
                                Final Invoice Amount
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 tracking-tight">
                                Rs. {totalAmount.toLocaleString()}
                            </h2>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            onClick={checkout}
                            loading={checkoutLoading}
                            disabled={cart.length === 0 || checkoutLoading}
                            className="h-12 w-full sm:w-auto rounded-xl px-8 font-extrabold text-sm tracking-wide uppercase shadow-md shadow-indigo-100 !bg-indigo-600 hover:!bg-indigo-700 border-none disabled:!bg-slate-200 disabled:!text-slate-400"
                        >
                            {checkoutLoading ? "Processing..." : "Complete Checkout"}
                        </Button>
                    </div>

                </Card>
            </div>
        </div>
    );
};

export default Cart;