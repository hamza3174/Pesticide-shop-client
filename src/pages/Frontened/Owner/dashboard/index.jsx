import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Statistic, Table, Tag, Spin, Empty, Tooltip } from "antd";
import {
    FaMoneyBillWave,
    FaShoppingCart,
    FaChartLine,
    FaBoxes,
    FaArrowUp,
    FaSignOutAlt,
    FaCircle
} from "react-icons/fa";
import { useAuthContext } from "../../../../Context/AuthContext";

const Dashboard = () => {
    // ================= STATE =================
    const [stats, setStats] = useState({
        todaySales: 0,
        todayProfit: 0,
        yearProfit: 0,
        totalProducts: 0
    });
    const [recentSales, setRecentSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout, logoutLoading } = useAuthContext();

    // ================= FETCH DASHBOARD =================
    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `${window.api}/dashboard-stats`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            setStats({
                todaySales: res.data.todaySales || 0,
                todayProfit: res.data.todayProfit || 0,
                yearProfit: res.data.yearProfit || 0,
                totalProducts: res.data.totalProducts || 0
            });
            setRecentSales(res.data.recentSales || []);
        } catch (error) {
            console.error("DASHBOARD ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    // ================= DATA CONFIGS =================
    const cardConfigs = [
        {
            title: "Today's Profit",
            value: stats.todayProfit,
            prefix: "Rs. ",
            suffix: "",
            change: "+14.2%",
            icon: <FaMoneyBillWave />,
            colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100",
            accent: "border-emerald-500",
        },
        {
            title: "Today's Sales",
            value: stats.todaySales,
            prefix: "",
            suffix: " Orders",
            change: "+8.4%",
            icon: <FaShoppingCart />,
            colorClass: "text-blue-600 bg-blue-50 border-blue-100",
            accent: "border-blue-500",
        },
        {
            title: "Year Profit",
            value: stats.yearProfit,
            prefix: "Rs. ",
            suffix: "",
            change: "+23.1%",
            icon: <FaChartLine />,
            colorClass: "text-amber-600 bg-amber-50 border-amber-100",
            accent: "border-amber-500",
        },
        {
            title: "Total Products",
            value: stats.totalProducts,
            prefix: "",
            suffix: " Items",
            change: "Stable",
            icon: <FaBoxes />,
            colorClass: "text-purple-600 bg-purple-50 border-purple-100",
            accent: "border-purple-500",
        },
    ];

    const columns = [
        {
            title: "PRODUCT",
            dataIndex: "productName",
            key: "productName",
            render: (text) => <span className="font-semibold text-slate-800">{text}</span>,
        },
        {
            title: "QUANTITY",
            dataIndex: "qty",
            key: "qty",
            render: (qty) => <span className="text-slate-600">{qty}</span>,
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            key: "amount",
            align: "right",
            render: (amount) => <span className="font-bold text-slate-900">Rs. {amount}</span>,
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            align: "right",
            render: () => (
                <Tag color="success" className="rounded-full px-3 py-0.5 font-medium border-emerald-200">
                    Completed
                </Tag>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans antialiased">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

                {/* ================= HEADER ================= */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Pesticide Shop Dashboard
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">
                            Welcome back, Admin <span className="animate-pulse ml-0.5">👋</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3 sm:self-center self-start">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                            <FaCircle className="w-2 h-2 text-emerald-500 animate-ping" />
                            Live Operations
                        </span>
                        <Button
                            type="primary"
                            danger
                            className="h-10 rounded-xl px-5 font-semibold flex items-center gap-2 shadow-sm"
                            loading={logoutLoading}
                            onClick={logout}
                            icon={<FaSignOutAlt />}
                        >
                            Log Out
                        </Button>
                    </div>
                </div>

                {/* ================= STATS CARDS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {cardConfigs.map((card, index) => (
                        <Card
                            key={index}
                            loading={loading}
                            bordered={false}
                            className={`bg-white rounded-2xl border-l-4 ${card.accent} shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
                            bodyStyle={{ padding: "24px" }}
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                                        {card.title}
                                    </span>
                                    <Statistic
                                        value={card.value}
                                        prefix={card.prefix}
                                        suffix={card.suffix}
                                        valueStyle={{ fontWeight: 900, color: "#1e293b", fontSize: "1.5rem", tracking: "-0.025em" }}
                                    />
                                    <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500 mt-1">
                                        {card.change !== "Stable" && <FaArrowUp className="text-emerald-500 mr-1 text-[10px]" />}
                                        {card.change}
                                    </span>
                                </div>
                                <div className={`p-3.5 rounded-xl text-xl shadow-sm border ${card.colorClass}`}>
                                    {card.icon}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* ================= MAIN SECTION ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                    {/* ================= RECENT SALES ================= */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 lg:col-span-3 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Recent Transactions
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Latest shop checkout activity records
                                    </p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="py-12 flex justify-center items-center">
                                    <Spin size="large" />
                                </div>
                            ) : recentSales.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table
                                        columns={columns}
                                        dataSource={recentSales.map((item, idx) => ({ ...item, key: idx }))}
                                        pagination={false}
                                        className="custom-table"
                                        size="middle"
                                    />
                                </div>
                            ) : (
                                <div className="py-8">
                                    <Empty description="No recent transactions found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                </div>
                            )}
                        </div>

                        {recentSales.length > 0 && (
                            <div className="pt-4 border-t border-slate-100 mt-4">
                                <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors tracking-wide uppercase">
                                    View All Transactions
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;