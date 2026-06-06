import React from 'react'
import { Route, Routes } from 'react-router-dom'
import OwnerLayout from '../../Layout/OwnerLayout'
import OwnerDashboard from "../../pages/Frontened/Owner/dashboard"
import StockMangement from './Owner/StockMangement'
import ProtectedRoute from '../../components/projectedRoute'
import Billing from './Owner/Billing'
import Cart from './Owner/Cart'
import ExpensiveMangement from './Owner/ExpensiveMangement'

const Frontened = () => {
    return (
        <Routes>
            <Route
                path='/owner' element={
                    <ProtectedRoute role="owner">
                        <OwnerLayout />
                    </ProtectedRoute>
                } >

                <Route index element={<OwnerDashboard />} />
                <Route path='stockMangement' element={<StockMangement />} />
                <Route path='billing' element={<Billing />} />
                <Route path='cart' element={<Cart />} />
                <Route path='expensiveMangement' element={<ExpensiveMangement />} />

            </Route>

        </Routes>
    )
}

export default Frontened
