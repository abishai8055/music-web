import React, { useContext } from 'react'
import { contextAPI } from '../../Context'


const DeleteAccount = () => {
    let {authUserData} = useContext(contextAPI)
    let handelDelete = async (e) => {
        if(authUserData) {
            await deleteUser(authUserData)
            toast.success("Account deleted successfully")
        }
    }
  return (
    <section className='w-[30vw] py-16 rouunded-2xl bg-secondary flex flex-col gap-4 items-center'>
        <p>Do you really want to delete your account?</p>
    </section>
  )
}

export default DeleteAccount