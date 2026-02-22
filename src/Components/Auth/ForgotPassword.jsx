import { sendPasswordResetEmail } from 'firebase/auth'
import React, { useState } from 'react'
import { __AUTH } from '../../Backend/Firebase'
import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'


const ForgotPassword = () => {
    let [email, setEmail] = useState('')

    let handleChange = (event) => {
        setEmail(event.target.value)
    }

    let navigate = useNavigate()

    let handleSubmit =async (event) => {
        event.preventDefault()
        console.log(email)
        await sendPasswordResetEmail(__AUTH, email)
        toast.success('Password reset link sent to your email')
        navigate('/login')

    }
  return (
    <section className='w-full h-[90vh] flex justify-center items-center bg-slate-900'>
        <form onSubmit={handleSubmit} className=' px-12 py-12 rounded-md bg-secondary shadow-blackAndGray flex flex-col gap-6'>
            <h2 className='text-center text-2xl font-bold'>
                Congrats you have memory of a gold fish!☺️
            </h2>
            <article className='flex flex-col gap-4'>
                <label htmlFor='email'>Registered Email</label>
                <input type='email' id='email' name='email' value={email} onChange={handleChange} className='border-1 py-2 pl-1 rounded-md bg-white text-black' />
                <NavLink to={'/login'} className={'hover:underline hover:underline-offset-2'} >Continue with login</NavLink>
            </article>

            

            <button className='bg-accent rounded-md py-2'>Submit</button>
        </form>
    </section>
  )
}

export default ForgotPassword

// border-1 py-2 rounded-md hover:bg-slate-500