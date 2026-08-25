import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { deleteAddressByIdAsync, selectAddressErrors, selectAddressStatus, updateAddressByIdAsync } from '../AddressSlice'

const useMediaQuery = (query) => {
  const [matches, setMatches] = React.useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    const listener = (e) => setMatches(e.matches)
    media.addEventListener('change', listener)
    setMatches(media.matches)
    return () => media.removeEventListener('change', listener)
  }, [query])
  return matches
}

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

export const Address = ({id,type,street,postalCode,country,phoneNumber,state,city}) => {

    const dispatch = useDispatch()
    const {register, handleSubmit, reset, formState: { errors }} = useForm()
    const [edit,setEdit] = useState(false)
    const status = useSelector(selectAddressStatus)
    const error = useSelector(selectAddressErrors)
    
    const is480 = useMediaQuery('(max-width: 480px)')

    const handleRemoveAddress = () => {
        dispatch(deleteAddressByIdAsync(id))
    }

    const handleUpdateAddress = (data) => {
        const update = {...data, _id: id}
        setEdit(false)
        dispatch(updateAddressByIdAsync(update))
    }

    return (
        <div className={`w-full ${is480 ? 'p-0' : 'p-1'}`}>
                                        
            {/* address type */}
            <div className="bg-black text-white px-2 py-1.5 rounded text-sm font-medium">
                {type?.toUpperCase()}
            </div>

            {/* address details */}
            <div className={`relative flex flex-col gap-1 p-4 ${is480 || edit ? 'static' : ''}`}>
                <form noValidate onSubmit={handleSubmit(handleUpdateAddress)} className="flex flex-col gap-3">

                    {edit ? (
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <input 
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    {...register("type", {required: true, value: type})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                                <input 
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    {...register("street", {required: true, value: street})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input 
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    {...register("postalCode", {required: true, value: postalCode})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <input 
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    {...register("country", {required: true, value: country})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input 
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    {...register("phoneNumber", {required: true, value: phoneNumber})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input 
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    {...register("state", {required: true, value: state})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input 
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    {...register("city", {required: true, value: city})}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 text-sm text-gray-800">
                            <p>Street - {street}</p>
                            <p>Postal Code - {postalCode}</p>
                            <p>Country - {country}</p>
                            <p>Phone Number - {phoneNumber}</p>
                            <p>State - {state}</p>
                            <p>City - {city}</p>
                        </div>
                    )}

                    {/* action buttons */}
                    <div className={`flex flex-row gap-2 self-end mt-4 ${is480 || edit ? '' : 'absolute bottom-4 right-4'}`}>
                        {edit ? (
                            <button 
                                type="submit" 
                                disabled={status === 'pending'}
                                className="flex items-center justify-center gap-2 px-4 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-800 disabled:opacity-60"
                            >
                                {status === 'pending' && <Spinner />}
                                Save Changes
                            </button>
                        ) : (
                            <button 
                                type="button"
                                onClick={() => setEdit(true)}
                                className="px-4 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-800"
                            >
                                Edit
                            </button>
                        )}

                        {edit ? (
                            <button 
                                type="button"
                                onClick={() => {setEdit(false); reset()}}
                                className="px-4 py-1.5 border border-red-500 text-red-500 text-sm rounded hover:bg-red-50"
                            >
                                Cancel
                            </button>
                        ) : (
                            <button 
                                type="button"
                                disabled={status === 'pending'}
                                onClick={handleRemoveAddress}
                                className="flex items-center justify-center gap-2 px-4 py-1.5 border border-red-500 text-red-500 text-sm rounded hover:bg-red-50 disabled:opacity-60"
                            >
                                {status === 'pending' && <Spinner />}
                                Remove
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}