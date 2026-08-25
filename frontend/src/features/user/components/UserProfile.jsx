import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserInfo } from '../UserSlice'
import { 
    addAddressAsync, 
    resetAddressAddStatus, 
    resetAddressDeleteStatus, 
    resetAddressUpdateStatus, 
    selectAddressAddStatus, 
    selectAddressDeleteStatus, 
    selectAddressStatus, 
    selectAddressUpdateStatus, 
    selectAddresses 
} from '../../address/AddressSlice'
import { Address } from '../../address/components/Address'
import { useForm } from 'react-hook-form'
import { showToast } from '../../../utils/toast'

export const UserProfile = () => {
    const dispatch = useDispatch()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const status = useSelector(selectAddressStatus)
    const userInfo = useSelector(selectUserInfo)
    const addresses = useSelector(selectAddresses)
    const [addAddress, setAddAddress] = useState(false)

    const addressAddStatus = useSelector(selectAddressAddStatus)
    const addressUpdateStatus = useSelector(selectAddressUpdateStatus)
    const addressDeleteStatus = useSelector(selectAddressDeleteStatus)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        if (addressAddStatus === 'fulfilled') {
            showToast.success("Address added")
        } else if (addressAddStatus === 'rejected') {
            showToast.error("Error adding address, please try again later")
        }
    }, [addressAddStatus])

    useEffect(() => {
        if (addressUpdateStatus === 'fulfilled') {
            showToast.success("Address updated")
        } else if (addressUpdateStatus === 'rejected') {
            showToast.error("Error updating address, please try again later")
        }
    }, [addressUpdateStatus])

    useEffect(() => {
        if (addressDeleteStatus === 'fulfilled') {
            showToast.success("Address deleted")
        } else if (addressDeleteStatus === 'rejected') {
            showToast.error("Error deleting address, please try again later")
        }
    }, [addressDeleteStatus])

    useEffect(() => {
        return () => {
            dispatch(resetAddressAddStatus())
            dispatch(resetAddressUpdateStatus())
            dispatch(resetAddressDeleteStatus())
        }
    }, [dispatch])

    const handleAddAddress = (data) => {
        const address = { ...data, user: userInfo._id }
        dispatch(addAddressAsync(address))
        setAddAddress(false)
        reset()
    }

    const inputBase = "w-full px-3.5 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
    const labelCls = "block text-sm font-medium text-gray-700 mb-1"

    return (
        <div className="min-h-[calc(100vh-4rem)] flex justify-center items-start bg-gray-50 py-6 px-4">
            <div className="w-full max-w-2xl bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6">

                {/* User Info Header */}
                <div className="bg-blue-50 text-blue-900 p-5 rounded-lg flex flex-col items-center justify-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold uppercase shadow-sm">
                        {userInfo?.name ? userInfo.name.charAt(0) : 'U'}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{userInfo?.name}</h2>
                    <p className="text-sm text-gray-600">{userInfo?.email}</p>
                </div>

                {/* Address Section */}
                <div className="flex flex-col items-center gap-6">

                    {/* Header + Add Address Toggle */}
                    <div className="flex items-center justify-between w-full">
                        <h3 className="text-lg font-medium text-gray-900">Manage addresses</h3>
                        <button
                            type="button"
                            onClick={() => setAddAddress(true)}
                            className="px-4 py-1.5 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors"
                        >
                            Add
                        </button>
                    </div>

                    {/* Add Address Form */}
                    {addAddress && (
                        <form
                            noValidate
                            onSubmit={handleSubmit(handleAddAddress)}
                            className="w-full bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200 flex flex-col gap-4"
                        >
                            <div>
                                <label className={labelCls}>Type</label>
                                <input
                                    placeholder="Eg. Home, Business"
                                    {...register("type", { required: true })}
                                    className={inputBase}
                                />
                            </div>

                            <div>
                                <label className={labelCls}>Street</label>
                                <input
                                    {...register("street", { required: true })}
                                    className={inputBase}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>City</label>
                                    <input
                                        {...register("city", { required: true })}
                                        className={inputBase}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>State</label>
                                    <input
                                        {...register("state", { required: true })}
                                        className={inputBase}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Postal Code</label>
                                    <input
                                        type="number"
                                        {...register("postalCode", { required: true })}
                                        className={inputBase}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Country</label>
                                    <input
                                        {...register("country", { required: true })}
                                        className={inputBase}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelCls}>Phone Number</label>
                                <input
                                    type="tel"
                                    {...register("phoneNumber", { required: true })}
                                    className={inputBase}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={status === 'pending'}
                                    className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center min-w-[70px]"
                                >
                                    {status === 'pending' ? (
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        'Add'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAddAddress(false)}
                                    className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Address List */}
                    <div className="w-full flex flex-col gap-3">
                        {addresses.length > 0 ? (
                            addresses.map((address) => (
                                <Address
                                    key={address._id}
                                    id={address._id}
                                    city={address.city}
                                    country={address.country}
                                    phoneNumber={address.phoneNumber}
                                    postalCode={address.postalCode}
                                    state={address.state}
                                    street={address.street}
                                    type={address.type}
                                />
                            ))
                        ) : (
                            <p className="text-center text-sm text-gray-500 py-4">You have no added addresses</p>
                        )}
                    </div>

                </div>

            </div>
        </div>
    )
}