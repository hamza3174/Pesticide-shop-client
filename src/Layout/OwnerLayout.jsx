import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaHome, FaBoxOpen, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoMdPerson as IoPersonIcon } from "react-icons/io"; // Kept matching your exact import logic
import { FaCartShopping } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import logo from "../../assets/Logo-removebg-preview.png";

const OwnerLayout = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const linkStyle =
        "flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 font-medium tracking-wide text-[14px]";

    const menuItems = [
        { name: "Dashboard", path: "/owner", icon: <FaHome className="text-lg" /> },
        { name: "Stock Management", path: "/owner/stockMangement", icon: <FaBoxOpen className="text-lg" /> },
        { name: "Sales/Billing", path: "/owner/billing", icon: <MdOutlineShoppingCart className="text-lg" /> },
        { name: "Cart", path: "/owner/cart", icon: <FaCartShopping className="text-lg" /> },
        { name: "Expensive Mangement", path: "/owner/ExpensiveMangement", icon: <GiExpense className="text-lg" /> },
    ];

    // Sidebar Content Separated for Reuse in Desktop & Mobile Drawer
    const SidebarContent = () => (
        <>
            {/* LOGO BRANDING */}
            <div className="px-6 py-6 border-b border-white/5 flex items-center gap-3 bg-black/10">
                <div className="p-1.5 bg-white/10 rounded-xl backdrop-blur-sm">
                    <img src={logo} className="w-8 h-8 object-contain" alt="Smart Agro Logo" />
                </div>
                <div>
                    <h1 className="font-black text-lg tracking-tight text-white m-0">Smart Agro</h1>
                    <span className="text-[10px] text-emerald-400/80 font-bold tracking-widest uppercase block">Management Portal</span>
                </div>
            </div>

            {/* NAVIGATION MENU */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        end={item.path === "/owner"}
                        onClick={() => setIsMobileOpen(false)}
                        className={({ isActive }) =>
                            `${linkStyle} ${isActive
                                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-bold shadow-lg shadow-green-500/20 translate-x-1"
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* FOOTER METRIC BRAND */}
            <div className="p-4 border-t border-white/5 bg-black/5 text-center">
                <p className="text-[11px] text-slate-500 font-medium m-0">Smart Agro v2.4.0</p>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800 antialiased">

            {/* ===== DESKTOP SIDEBAR ===== */}
            <aside className="w-64 bg-[#012E1F] text-white hidden lg:flex flex-col shadow-2xl z-20 border-r border-emerald-950">
                <SidebarContent />
            </aside>

            {/* ===== MOBILE DRAWER OVERLAY ===== */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* ===== MOBILE SIDEBAR SLIDEOUT ===== */}
            <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-[#012E1F] text-white flex flex-col z-50 lg:hidden shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <SidebarContent />
            </aside>

            {/* ===== MAIN APPLICATION AREA ===== */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">

                {/* ===== RESPONSIVE MOBILE TOP BAR ===== */}
                <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between lg:hidden shadow-sm z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
                        >
                            {isMobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                        </button>
                        <div className="flex items-center gap-2">
                            <img src={logo} className="w-6 h-6 object-contain" alt="Logo" />
                            <span className="font-bold text-slate-900 tracking-tight text-sm">Smart Agro</span>
                        </div>
                    </div>

                    {/* Visual Placeholder Badge for mobile app status */}
                    <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] tracking-wider uppercase">
                        Owner Panel
                    </div>
                </header>

                {/* ===== CHANGING INTERACTIVE ROUTE VIEWPORT ===== */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-50/50">
                    <div className="max-w-7xl mx-auto h-full">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
};

export default OwnerLayout;