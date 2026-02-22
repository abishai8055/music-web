import React, { useContext } from 'react'
import { useState } from 'react'
import { contextAPI } from '../../Context'
import { doc, setDoc } from 'firebase/firestore'
import { __DB } from '../../../Backend/Firebase'
import toast from 'react-hot-toast'

const UpdateProfile = () => {
  let initialProfileData = {
    fullName : '',
    dob : '',
    age : '',
    city : '',
    state : '',
    language : ''
  }
  
  let [ profileData, setProfileData ] = useState(initialProfileData)
  let { fullName, age, dob, city, state, language } = profileData

  let { authUserData } = useContext(contextAPI)
  let { displayName, email, uid, photoURL } = authUserData || " " ;

  let handleChange = (event) => {
    let {name, value} = event.target
    setProfileData({...profileData, [name]:value})
  }

  let handleSubmit = async (event) => {
    event.preventDefault()
    console.log(profileData);

    // ! we want to send the values in the db
    // ? creates a doc in the db in the name of user_Profile
    // ? payload is used to store entire data

    let payload = { displayName, email, photoURL, ...profileData }
    await setDoc(doc(__DB, "user_Profile", uid), payload)
    console.log('yes i am dancing');
    setProfileData(initialProfileData)
    toast.success('Profile Updated Successfully')
  }
  
  return (
    <section className='w-[50vw] h-[70vh] bg-secondary rounded-2xl shadow-blackAndGray px-8 pt-8'>
      <h2 className='text-2xl font-semibold text-accent'>Update your profile details</h2>

      <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-x-16 gap-y-10 pt-8'>

      {/* full name */}
        <article className='flex flex-col gap-2 text-lg'>
          <label htmlFor='fname'>Full Name:</label>
          <input id='fname' name='fullName' value={fullName} type='text' onChange={handleChange} className='border focus:border-accent border-white rounded-md outline-0 py-1' />
        </article>
        
      {/* age */}
        <article className='flex flex-col gap-2 text-lg'>
          <label htmlFor='age'>Age:</label>
          <input id='age' name='age' value={age} type='tel' onChange={handleChange} className='border focus:border-accent border-white rounded-md outline-0 py-1' />
        </article>

      {/* dob */}
        <article className='flex flex-col gap-2 text-lg'>
          <label htmlFor='dob'>DOB:</label>
          <input id='dob' name='dob' value={dob} type='date' onChange={handleChange} className='border focus:border-accent border-white rounded-md outline-0 py-1' />
        </article>

      {/* city */}
        <article className='flex flex-col gap-2 text-lg'>
          <label htmlFor='city'>City:</label>
          <input id='city' name='city' value={city} type='text' onChange={handleChange} className='border focus:border-accent border-white rounded-md outline-0 py-1' />
        </article>

      {/* state */}
        <article className='flex flex-col gap-2 text-lg'>
          <label htmlFor='state'>State:</label>
          <input id='state' name='state' value={state} type='text' onChange={handleChange} className='border focus:border-accent border-white rounded-md outline-0 py-1' />
        </article>

      {/* language */}
        <article className='flex flex-col gap-2 text-lg'>
          <label htmlFor='lang'>Language:</label>
          <input id='lang' name='language' value={language} type='text' onChange={handleChange} className='border focus:border-accent border-white rounded-md outline-0 py-1' />
        </article>

        <button className='border focus:border-accent py-2 col-span-2 rounded-lg hover:bg-accent hover:text-primary font-bold tracking-wider cursor-pointer mt-4'>Update</button>
      </form> 
    </section>
  )
}

export default UpdateProfile

// ? grid layout is same as flex but more optimised and consized