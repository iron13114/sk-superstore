import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar } from '../features/navigation/components/Navbar'
import { Footer } from '../features/footer/Footer'
import { Homepage } from '../features/homepage/components/Homepage'
import { resetAddressStatus, selectAddressStatus } from '../features/address/AddressSlice'

export const HomePage = () => {
    const dispatch = useDispatch()
    const addressStatus = useSelector(selectAddressStatus)

    useEffect(() => {
        if (addressStatus === 'fulfilled') {
            dispatch(resetAddressStatus())
        }
    }, [addressStatus, dispatch])

    return (
        <>
            <Navbar isProductList={true} />
            <Homepage />
            <Footer />
        </>
    )
}