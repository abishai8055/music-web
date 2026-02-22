import React, { useContext, useState } from 'react'
import { contextAPI } from '../../Context'
import { updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'


const UpdateProfilePhoto = () => {
    let [ photo, setPhoto] = useState('')

    let[photoPreview, setPhotoPreview] = useState(null)

    let { authUserData } = useContext(contextAPI)

    let handleChange = (e) => {
        const file = e.target.files[0]
        setPhoto(file)
        const previewUrl = URL.createObjectURL(file)
        setPhotoPreview(previewUrl)
        toast.success('Go on, take a peek. You know you can’t resist! 😏')
    }

    let navigate = useNavigate()

    let handleSubmit = async (e) => {
        e.preventDefault()
        

        let formData = new FormData(); //way to send data to the cloudianry
        formData.append('file', photo)
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
        formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)
        toast.success('Stay put. You will wait', { icon : '😈', })
        
        try {
            let cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`, 
            {
                method : 'POST',
                body : formData
            })
            let cloudinaryData = await cloudinaryResponse.json()
            await updateProfile(authUserData, {
                photoURL : cloudinaryData.secure_url
            })
            setPhoto('')
            setPhotoPreview(null)
	        navigate('/profile')

        } catch (error) {
            console.log(error);
        }

        toast.success('Pic changed. The world isn’t ready 😏')

    }
    
  return (
    <article className='flex flex-col gap-6 items-center'>
        <>
           {
            photoPreview !== null ?
            <img src = {photoPreview} alt='wait' className='w-40 h-40 rounded-full object-cover object-top' /> 
            :
            <img src = {authUserData?.photoURL} alt='wait' className='w-40 h-40 rounded-full object-cover object-top' />
           }
            <p className='text-center text-xl font-semibold tracking-wider'>Preview : Current</p>
        </>
    
    <form onSubmit={handleSubmit} className='w-[35vw] h-[35vh] bg-secondary rounded-xl flex flex-col gap-4 justify-center items-center shadow-blackAndGray'>
        <h2>Update Profile Photo</h2>

        <label htmlFor='photo'>Choose Your Photo</label>
        <input type='file' className='border rounded-md pl-1 py-1' onChange={handleChange} />

        <button className='border py-2 mt-4 px-7 rounded-md hover:bg-bye'>Update Photo</button>
    </form>
    </article>
  )
}

export default UpdateProfilePhoto
