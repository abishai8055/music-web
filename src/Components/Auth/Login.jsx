import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { __AUTH } from '../../Backend/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  let initialLoginFormData = {
    email: '',
    password: '',
  }
  // ! step - 02 : create a state
  let [loginFormData, setLoginFormData] = useState(initialLoginFormData)
  let [loading, setLoading] = useState(false)
  let [eyeIconVisibility, setEyeIconVisibility] = useState(false)

  let handleEyeIconVisibility = (event) => {
    setEyeIconVisibility(!eyeIconVisibility)
  }


  // ! destructuring
  let {email, password } = loginFormData

  // ! step - 03 : link input with state { add the value attribute in the input field with the same keyname of the loginFormData } and provide name attribute in the input fields with the same keyname of the loginFormData as a value of the name of attribute

  // ! attach the onChange function in all the input fields  && make a handleChange function


  let handleChange = (event) => {
    let { name, value } = event.target
    setLoginFormData({ ...loginFormData, [name]: value })
  }

  let navigate = useNavigate()

  // ! handleSubmit attach and create
  let handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    
    try {
      await signInWithEmailAndPassword(__AUTH, email, password)
      toast.success('Login Successful')
      setLoginFormData(initialLoginFormData)
      // Navigation will happen automatically via PublicRouters when authUserData updates
    } catch (error) {
      setLoading(false)
      console.error('Login error:', error)
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        toast.error('Invalid email or password')
      } else if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email')
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed attempts. Try again later')
      } else {
        toast.error('Login failed. Please try again')
      }
    }
  }

  return (
    <section className='w-full min-h-screen flex justify-center items-center p-4'>
      <form onSubmit={handleSubmit}
        className='glass-auth shadow-elegant px-12 rounded-2xl flex flex-col w-full max-w-md gap-5 py-12 fade-in'>

        <div className='text-center mb-4'>
          <h2 className='text-4xl font-bold gradient-burgundy mb-2'>Welcome Back</h2>
          <p className='text-gray-400 text-sm'>Sign in to continue</p>
        </div>

        <article className='flex flex-col gap-2'>
          <label htmlFor='email' className='text-sm font-medium text-gray-300'>Email Address</label>
          <input 
            id='email' 
            type='email' 
            name='email' 
            value={email} 
            className='bg-secondary/50 border border-burgundy/30 py-3 px-4 rounded-xl text-white placeholder-gray-500 input-focus transition-all leading-normal' 
            placeholder='Enter your email'
            onChange={handleChange} 
            required
          />
        </article>

        <article className='flex flex-col gap-2'>
          <label htmlFor='password' className='text-sm font-medium text-gray-300'>Password</label>
          <section className='bg-secondary/50 border border-burgundy/30 flex items-center gap-3 rounded-xl px-4 focus-within:border-accent transition-all'>
            <input 
              id='password'
              type={eyeIconVisibility ? 'text' : 'password'}
              name='password' 
              value={password}
              placeholder='Enter your password'
              className='outline-none py-3 w-full bg-transparent text-white placeholder-gray-500 leading-normal' 
              onChange={handleChange} 
              required
            />
            <button
              type='button'
              onClick={handleEyeIconVisibility}
              className='text-lg text-gray-400 hover:text-accent transition-colors flex-shrink-0'
            >
              {eyeIconVisibility ? <FaEye /> : <FaEyeSlash />}
            </button>
          </section>
        </article>

        <NavLink 
          to='/forgotPassword' 
          className='text-accent hover:text-accent-hover text-sm transition-colors self-end font-medium'
        >
          Forgot Password?
        </NavLink>

        <button 
          disabled={loading}
          className='btn-burgundy py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed mt-2'
        >
          {loading ? (
            <span className='flex items-center justify-center gap-2'>
              <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none'/>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'/>
              </svg>
              Signing in...
            </span>
          ) : 'Sign In'}
        </button>
        
        <p className='text-center text-gray-400 text-sm mt-2'>
          Don't have an account? <NavLink to='/register' className='text-accent hover:text-accent-hover font-semibold transition-colors'>Create Account</NavLink>
        </p>

      </form>

    </section>
  )
}

export default Login