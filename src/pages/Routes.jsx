import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from '../Auth'
import Frontened from './Frontened'

const index = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to="/auth/login" />} />
            <Route path='/auth/*' element={<Auth />} />
            <Route path='/*' element={<Frontened />} />

        </Routes>
    )
}

export default index
