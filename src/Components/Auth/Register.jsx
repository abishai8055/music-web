import React from 'react'
import { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { __AUTH } from '../../Backend/Firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  let initialRegisteredUserDetails = {
    username:'',
    email:'',
    password:'',
    confirmPassword:''
  }
  // ! Step - 02 : create a state
  let [registerFormData, setRegisterFormData] = useState(initialRegisteredUserDetails)
  let [loading, setLoading] = useState(false)
  let [eyeIconVisibilty, setEyeIconVisibility] = useState(false)

  //! destructuring
  let {username, email, password, confirmPassword} = registerFormData

  // ! step - 03 : link input with state{add the value attribute in the input field with the same keyname of the registerFormData} and provide name attribute in the input fields with the same keyname of the registerFormData as a value of the name of attribute

  // ! attach the onchange function with the input fields & make handlechange function

  // ? event.target is an input object that targets and gets values from the <input/>
  // ? {name, value} - holds the destructured values from the <input/> from the event
  // ? setRegisterFormData is used to update or expand the state using (...) spread operator
  
  let handlechange = (event) => {
    let {name, value} = event.target
    setRegisterFormData({...registerFormData, [name]:value})
  }

  // ! onSubmit attach and create

  // ? preventDefault is used to prevent the page from reloading when the form is submitted

  let navigate = useNavigate()

  let handleSubmit = async (event) => {
    event.preventDefault()
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    
    try {
      let userData = await createUserWithEmailAndPassword(__AUTH, email, password)

      await updateProfile(userData.user, {
        displayName : username,
        photoURL : 'https://i.pinimg.com/736x/8d/16/90/8d16902ae35c1e982c2990ff85fa11fb.jpg'
      })

      await sendEmailVerification(userData.user)
      toast.success('Registration Successful')
      toast.success('Verification link sent to your email')
      setRegisterFormData(initialRegisteredUserDetails)
      navigate('/login')
    } catch (error) {
      setLoading(false)
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Please log in or use a different email.')
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address')
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Use at least 6 characters')
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Registration is currently disabled. Please try again later')
      } else {
        toast.error(error.message || 'Registration failed')
      }
    }
  }

  // ! password visibility
  let handleEyeIconVisibilty = (event) => {
    setEyeIconVisibility(!eyeIconVisibilty)
  }
  return (
    <section className='w-full min-h-screen flex justify-center items-center p-4'>
      <form onSubmit={handleSubmit} className='glass-auth shadow-elegant px-12 py-12 rounded-2xl flex flex-col gap-5 w-full max-w-md fade-in'>

        <div className='text-center mb-4'>
          <h2 className='text-4xl font-bold gradient-burgundy mb-2'>Create Account</h2>
          <p className='text-gray-400 text-sm'>Join us and start your journey</p>
        </div>

        <article className='flex flex-col gap-2'>
          <label htmlFor='username' className='text-sm font-medium text-gray-300'>Username</label>
          <input 
            id='username' 
            type='text' 
            name='username' 
            value={username} 
            className='bg-secondary/50 border border-burgundy/30 py-3 px-4 rounded-xl text-white placeholder-gray-500 input-focus transition-all leading-normal' 
            placeholder='Choose a username'
            onChange={handlechange}
            required
          />
        </article>

        <article className='flex flex-col gap-2'>
          <label htmlFor='email' className='text-sm font-medium text-gray-300'>Email Address</label>
          <input 
            id='email' 
            type='email' 
            name='email' 
            value={email} 
            className='bg-secondary/50 border border-burgundy/30 py-3 px-4 rounded-xl text-white placeholder-gray-500 input-focus transition-all leading-normal' 
            placeholder='Enter your email'
            onChange={handlechange}
            required
          />
        </article>

        <article className='flex flex-col gap-2'>
          <label htmlFor='password' className='text-sm font-medium text-gray-300'>Password</label>
          <section className='bg-secondary/50 border border-burgundy/30 flex items-center gap-3 rounded-xl px-4 focus-within:border-accent transition-all'>
            <input 
              id='password' 
              type={eyeIconVisibilty ? 'text' : 'password'} 
              name='password' 
              value={password} 
              className='outline-none py-3 w-full bg-transparent text-white placeholder-gray-500 leading-normal' 
              placeholder='Create a password'
              onChange={handlechange}
              required
            />
            <button
              type='button'
              onClick={handleEyeIconVisibilty}
              className='text-lg text-gray-400 hover:text-accent transition-colors flex-shrink-0'
            >
              {eyeIconVisibilty ? <FaEye /> : <FaEyeSlash />}
            </button>
          </section>
        </article>
        
        <article className='flex flex-col gap-2'>
          <label htmlFor='confirmPassword' className='text-sm font-medium text-gray-300'>Confirm Password</label>
          <input 
            id='confirmPassword' 
            type='password' 
            name='confirmPassword' 
            value={confirmPassword} 
            className='bg-secondary/50 border border-burgundy/30 py-3 px-4 rounded-xl text-white placeholder-gray-500 input-focus transition-all leading-normal' 
            placeholder='Confirm your password'
            onChange={handlechange}
            required
          />
        </article>

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
              Creating Account...
            </span>
          ) : 'Create Account'}
        </button>
        
        <p className='text-center text-gray-400 text-sm mt-2'>
          Already have an account? <NavLink to='/login' className='text-accent hover:text-accent-hover font-semibold transition-colors'>Sign In</NavLink>
        </p>
        
      </form>
    </section>
  )
}

export default Register

//pl-1 in line 10 is used to give space into the input