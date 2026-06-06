import React, { useEffect, useState } from 'react';
import { FaCube, FaRegBell, FaTruck, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { UseProductContext } from '../../../../Context/ProductContext';
import { Table, Tag, Badge, Button, Card, Spin } from 'antd';
import { useCartContext } from '../../../../Context/CartContext';
import axios from 'axios';

const Billing = () => {
    const { products } = UseProductContext();
    const { cart, setCart } = useCartContext();
    const [loading, setLoading] = useState(false);

    // ✅ FETCH CART (Logic completely untouched)
    const fetchCart = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setLoading(true);
            const res = await axios.get(
                `${window.api}/cart`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
            setCart(res.data?.items || []);
        } catch (error) {
            console.log("CART ERROR:", error.response?.status);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/auth/login";
            }
        } finally {
            setLoading(false);
        }
    };

    // ✅ LOAD CART WHEN COMPONENT MOUNTS (Logic completely untouched)
    useEffect(() => {
        fetchCart();
    }, []);

    // ✅ ADD TO CART (Logic completely untouched)
    const addtoCart = async (product) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await axios.post(
                `${window.api}/cart/add`,
                { productId: product._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCart();
        } catch (error) {
            console.log("ADD CART ERROR:", error.response?.status);
        }
    };

    // 🎨 DYNAMIC CATEGORY MAPPING
    const getCategoryTag = (category) => {
        const map = {
            Pesticide: "volcano",
            Fertilizer: "green",
            Seed: "blue"
        };
        return (
            <Tag className="rounded-xl px-3 py-0.5 font-semibold text-xs shadow-sm border border-opacity-50" color={map[category] || "default"}>
                {category}
            </Tag>
        );
    };

    // 📋 TABLE COLUMNS (Enhanced for premium look & scalability)
    const columns = [
        {
            title: "PRODUCT",
            dataIndex: "productName",
            key: "productName",
            fixed: "left",
            render: (text) => <span className="font-bold text-slate-800 tracking-tight">{text}</span>
        },
        {
            title: "CATEGORY",
            dataIndex: "category",
            key: "category",
            render: (category) => getCategoryTag(category)
        },
        {
            title: "PRICE",
            dataIndex: "sellingPrice",
            key: "sellingPrice",
            render: (val) => <span className="font-extrabold text-emerald-600">Rs. {val}</span>
        },
        {
            title: "STOCK STATUS",
            dataIndex: "stockQuantity",
            key: "stockQuantity",
            render: (qty) => (
                <Tag className="rounded-full px-3 py-0.5 font-bold text-xs" color={qty > 0 ? "success" : "error"}>
                    {qty > 0 ? `${qty} Units Available` : "Out of Stock"}
                </Tag>
            )
        },
        {
            title: "ACTION",
            key: "action",
            align: "right",
            render: (_, record) => {
                const isAdded = (cart || []).some(
                    item => item.productId?._id === record._id
                );
                const isOutOfStock = record.stockQuantity <= 0;

                return (
                    <Button
                        type={isAdded ? "default" : "primary"}
                        disabled={isOutOfStock}
                        onClick={() => addtoCart(record)}
                        icon={isAdded ? <FaCheck size={12} className="text-emerald-600" /> : <FaShoppingCart size={12} />}
                        className={`h-9 rounded-xl text-xs font-bold tracking-wide shadow-sm uppercase transition-all duration-200
                            ${isAdded
                                ? "!bg-emerald-50 !text-emerald-700 !border-emerald-200 hover:!bg-emerald-100 cursor-default"
                                : "!bg-indigo-600 hover:!bg-indigo-700 !text-white border-none"
                            }
                            disabled:!bg-slate-100 disabled:!text-slate-400 disabled:!border-slate-200`}
                    >
                        {isAdded ? "Added" : "Add to Cart"}
                    </Button>
                );
            }
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 text-slate-800 font-sans antialiased">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ================= HEADER ================= */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                            Sales / Billings
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">
                            Process outgoing client orders and checkout counter
                        </p>
                    </div>

                    <div className="relative cursor-pointer p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all duration-150 group self-end sm:self-center">
                        <Badge count={3} offset={[2, -2]} color="#f43f5e" className="font-bold scale-90 sm:scale-100">
                            <FaRegBell size={22} className="text-slate-600 group-hover:text-slate-900 transition-colors" />
                        </Badge>
                    </div>
                </div>

                {/* ================= STAT CARDS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    {/* CARD 1: TOTAL PRODUCTS */}
                    <Card
                        bordered={false}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow duration-200"
                        bodyStyle={{ padding: '24px' }}
                    >
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-emerald-500" />
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-105 transition-transform duration-200 border border-emerald-100 shadow-sm">
                                <FaCube size={24} />
                            </div>
                            <div>
                                <span className="text-slate-400 font-bold text-xs block uppercase tracking-widest">
                                    Total Catalog Items
                                </span>
                                <h3 className="text-3xl font-black text-slate-800 mt-1 tracking-tight">
                                    {products?.length || 0}
                                </h3>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ================= PRODUCT LIST SECTION ================= */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                        <FaTruck size={18} className="text-indigo-600" />
                        <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                            Available Store Stock
                        </h3>
                    </div>

                    <div className="p-3 sm:p-6">
                        <Spin spinning={loading} tip="Syncing checkout register...">
                            <Table
                                columns={columns}
                                dataSource={products || []}
                                rowKey="_id"
                                pagination={{
                                    pageSize: 10,
                                    showTotal: (total, range) => (
                                        <span className="text-xs font-semibold text-slate-500">
                                            Displaying {range[0]}-{range[1]} of {total} records
                                        </span>
                                    )
                                }}
                                scroll={{ x: 800 }}
                                className="custom-billing-table"
                                size="middle"
                            />
                        </Spin>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Billing;