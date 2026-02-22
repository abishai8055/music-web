import React, { useContext, useState } from 'react'
import { contextAPI } from '../../Context'
import { updatePassword } from 'firebase/auth'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const UpdatePassword = () => {
    let [newPassword, setNewPassword] = useState('')
    let { authUserData } = useContext(contextAPI)
    let navigate= useNavigate()
    let handleSubmit = async (e) => {
        e.preventDefault()
        if( newPassword.trim()){
            try{
               await updatePassword( authUserData, newPassword)
               setNewPassword('')
               navigate('/profile')
                    toast.success ('Password is updated successfully')
            } catch (error) {
                    toast.error('enter valid password')
            }
        }
    }


  return (
    <section className='flex justify-center items-center h-[90vh] w-full text-light'>
        <form onSubmit={ handleSubmit } className='w-[30vw]  bg-secondary flex flex-col gap-6 items-center justify-center px-10 py-8 rounded-xl' >
        <h2 className='font-bold text-2xl mb-4'> Update your Password</h2>
                <input name={"password"} value={newPassword} type={"password"} onChange={(e) => setNewPassword(e.target.value)} className='border rounded-md pl-1 py-1 w-[80%]'></input>
                <button className=' px-8 py-2 bg-accent text-primary font-bold rounded-xl'>Update</button>
        </form>
    </section>
  )
}

export default UpdatePassword