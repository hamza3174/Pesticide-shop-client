import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Card,
    Input,
    InputNumber,
    Button,
    Tag,
    Statistic,
    message,
} from "antd";

import {
    FaMoneyBillWave,
    FaArrowTrendUp,
    FaArrowTrendDown,
    FaPlus,
    FaReceipt,
} from "react-icons/fa6";

const Expense = () => {

    // ================= STATES =================

    const [title, setTitle] = useState("");

    const [amount, setAmount] = useState("");

    const [category, setCategory] = useState("");

    const [expenses, setExpenses] = useState([]);

    const [loading, setLoading] = useState(false);

    const [dashboardStats, setDashboardStats] =
        useState({});

    // ================= TOKEN =================

    const token = localStorage.getItem("token");

    // ================= GET EXPENSES =================

    const getExpenses = async () => {

        try {

            const response = await axios.get(
                `${window.api}/expenses`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setExpenses(response.data);

        } catch (error) {

            console.log(error);

            message.error("Failed to load expenses");

        }
    };

    // ================= GET DASHBOARD STATS =================

    const getDashboardStats = async () => {

        try {

            const response = await axios.get(
                `${window.api}/dashboard-stats`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDashboardStats(response.data);

        } catch (error) {

            console.log(error);

            message.error("Failed to load sales");

        }
    };

    // ================= ADD EXPENSE =================

    const addExpense = async () => {

        if (!title || !amount || !category) {

            return message.warning(
                "Please fill all fields"
            );
        }

        try {

            setLoading(true);

            await axios.post(
                `${window.api}/expenses`,
                {
                    title,
                    amount,
                    category,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            message.success("Expense Added");

            setTitle("");
            setAmount("");
            setCategory("");

            getExpenses();

            // REFRESH DASHBOARD
            getDashboardStats();

        } catch (error) {

            console.log(error);

            message.error("Failed to add expense");

        } finally {

            setLoading(false);

        }
    };

    // ================= DELETE EXPENSE =================

    const deleteExpense = async (id) => {

        try {

            await axios.delete(
                `${window.api}/expenses/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            message.success("Expense Deleted");

            getExpenses();

            // REFRESH DASHBOARD
            getDashboardStats();

        } catch (error) {

            console.log(error);

            message.error("Delete failed");

        }
    };

    // ================= USE EFFECT =================

    useEffect(() => {

        getExpenses();

        getDashboardStats();

    }, []);

    // ================= CALCULATIONS =================

    const totalExpenses = expenses.reduce(
        (acc, item) => acc + item.amount,
        0
    );

    // ================= IMPORTANT =================
    // This now comes from checkout discounted price
    // because backend sends totalSales correctly

    const totalSales =
        dashboardStats.yearProfit || 0;

    const netProfit =
        totalSales - totalExpenses;

    return (

        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen text-slate-800">

            <div className="max-w-6xl mx-auto space-y-6">

                {/* ================= HEADER ================= */}

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 justify-between">

                    <div>

                        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                            Expense & Profit Overview
                        </h1>

                        <p className="text-slate-400 text-sm mt-0.5">
                            Track business expenses and profit performance
                        </p>

                    </div>

                    <Tag
                        color={
                            netProfit > 0
                                ? "success"
                                : "error"
                        }
                        className="font-bold px-4 py-1 rounded-lg"
                    >
                        {netProfit > 0
                            ? "📈 In Profit"
                            : "📉 In Loss"}
                    </Tag>

                </div>

                {/* ================= TOP CARDS ================= */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* SALES */}

                    <Card className="rounded-2xl shadow-sm">

                        <div className="flex items-center gap-4">

                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <FaMoneyBillWave size={22} />
                            </div>

                            <Statistic
                                title="Total Sales"
                                value={totalSales}
                                formatter={(value) =>
                                    `Rs. ${Number(value).toLocaleString()}`
                                }
                            />

                        </div>

                    </Card>

                    {/* EXPENSE */}

                    <Card className="rounded-2xl shadow-sm">

                        <div className="flex items-center gap-4">

                            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                                <FaArrowTrendDown size={22} />
                            </div>

                            <Statistic
                                title="Total Expenses"
                                value={totalExpenses}
                                formatter={(value) =>
                                    `Rs. ${Number(value).toLocaleString()}`
                                }
                            />

                        </div>

                    </Card>

                    {/* PROFIT */}

                    <Card className="rounded-2xl shadow-sm bg-emerald-50">

                        <div className="flex items-center gap-4">

                            <div className="p-3 bg-emerald-500 text-white rounded-xl">
                                <FaArrowTrendUp size={22} />
                            </div>

                            <Statistic
                                title="Net Profit"
                                value={netProfit}
                                formatter={(value) =>
                                    `Rs. ${Number(value).toLocaleString()}`
                                }
                                valueStyle={{
                                    color:
                                        netProfit > 0
                                            ? "#059669"
                                            : "#dc2626",
                                }}
                            />

                        </div>

                    </Card>

                </div>

                {/* ================= ADD EXPENSE ================= */}

                <Card
                    className="rounded-2xl shadow-sm"
                    title={

                        <div className="flex items-center gap-2">

                            <FaReceipt className="text-indigo-500" />

                            <span className="font-bold">
                                Add Expense
                            </span>

                        </div>
                    }
                >

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        {/* TITLE */}

                        <Input
                            size="large"
                            placeholder="Expense Title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            className="rounded-xl"
                        />

                        {/* AMOUNT */}

                        <InputNumber
                            size="large"
                            placeholder="Amount"
                            value={amount}
                            onChange={(value) =>
                                setAmount(value)
                            }
                            style={{ width: "100%" }}
                            className="rounded-xl"
                        />

                        {/* CATEGORY */}

                        <Input
                            size="large"
                            placeholder="Category"
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                            className="rounded-xl"
                        />

                        {/* BUTTON */}

                        <Button
                            type="primary"
                            size="large"
                            loading={loading}
                            icon={<FaPlus />}
                            onClick={addExpense}
                            className="rounded-xl bg-indigo-600"
                        >
                            Add Expense
                        </Button>

                    </div>

                </Card>

                {/* ================= TABLE ================= */}

                <Card
                    className="rounded-3xl shadow-lg overflow-hidden"
                    bodyStyle={{ padding: 0 }}
                >

                    {/* HEADER */}

                    <div className="px-6 py-5 border-b bg-slate-50">

                        <h2 className="text-xl font-black text-slate-800">
                            Expense Records
                        </h2>

                        <p className="text-sm text-slate-400 mt-1">
                            All operational expenses
                        </p>

                    </div>

                    {/* TABLE */}

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-100">

                                <tr>

                                    <th className="text-left px-6 py-4">
                                        Expense
                                    </th>

                                    <th className="text-left px-6 py-4">
                                        Category
                                    </th>

                                    <th className="text-right px-6 py-4">
                                        Amount
                                    </th>

                                    <th className="text-center px-6 py-4">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {expenses.map((item) => (

                                    <tr
                                        key={item._id}
                                        className="border-b hover:bg-slate-50"
                                    >

                                        {/* TITLE */}

                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-4">

                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                                    ₹
                                                </div>

                                                <div>

                                                    <h3 className="font-bold text-slate-800">
                                                        {item.title}
                                                    </h3>

                                                    <p className="text-xs text-slate-400">
                                                        Expense recorded
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        {/* CATEGORY */}

                                        <td className="px-6 py-5">

                                            <Tag
                                                color="blue"
                                                className="px-3 py-1 rounded-full"
                                            >
                                                {item.category}
                                            </Tag>

                                        </td>

                                        {/* AMOUNT */}

                                        <td className="px-6 py-5 text-right font-bold">

                                            Rs. {item.amount}

                                        </td>

                                        {/* ACTION */}

                                        <td className="px-6 py-5 text-center">

                                            <Button
                                                danger
                                                onClick={() =>
                                                    deleteExpense(item._id)
                                                }
                                            >
                                                Delete
                                            </Button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                    {/* FOOTER */}

                    <div className="flex justify-between items-center px-6 py-5 bg-slate-50">

                        <div>

                            <p className="text-sm text-slate-500">
                                Total Expenses
                            </p>

                            <h3 className="text-2xl font-black text-slate-800">
                                Rs. {totalExpenses.toLocaleString()}
                            </h3>

                        </div>

                    </div>

                </Card>

            </div>

        </div>
    );
};

export default Expense;