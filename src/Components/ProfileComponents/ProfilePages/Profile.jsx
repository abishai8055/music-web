import React, { useContext } from 'react'
import { FaEdit } from "react-icons/fa";
import { contextAPI } from '../../Context';
import { TbPhotoEdit } from "react-icons/tb";
import { NavLink, useNavigate } from 'react-router-dom';
import { __AUTH } from '../../../Backend/Firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { FiLogOut } from 'react-icons/fi';

const Profile = () => {
  let {authUserData, authProfileData} = useContext(contextAPI)
  let navigate = useNavigate()
  
  let handleLogOut = () => {
    signOut(__AUTH)
    navigate('/')
    toast.success('Logged out successfully')
  }

  return (
    <div className='profile-layout'>
      <div className='profile-left-col'>
        <div className='profile-header-card'>
          <img src={authUserData?.photoURL} alt="user profile" className='profile-avatar' />
          <h2 className='profile-name'>{authUserData?.displayName}</h2>
          <p className='profile-email'>{authUserData?.email}</p>
        </div>
        
        <div className='profile-actions-card'>
          <NavLink to='/profile/updateProfile' className='profile-action-btn'>
            <FaEdit />
            Update Profile
          </NavLink>
          <NavLink to='/profile/updateProfilePhoto' className='profile-action-btn'>
            <TbPhotoEdit />
            Update Photo
          </NavLink>
          <NavLink to='/profile/updatePassword' className='profile-action-btn'>
            Update Password
          </NavLink>
          <button 
            onClick={handleLogOut}
            className='profile-action-btn w-full text-left'
            style={{ background: 'rgba(230, 57, 70, 0.1)', borderColor: 'rgba(230, 57, 70, 0.3)' }}
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      <div className='profile-right-col'>
        {
          authProfileData ?
          <div className='profile-info-grid'>
            <div className='profile-info-card'>
              <p className='profile-info-label'>Full Name</p>
              <p className='profile-info-value'>{authProfileData?.fullName}</p>
            </div>

            <div className='profile-info-card'>
              <p className='profile-info-label'>Age</p>
              <p className='profile-info-value'>{authProfileData?.age} years old</p>
            </div>

            <div className='profile-info-card'>
              <p className='profile-info-label'>DOB</p>
              <p className='profile-info-value'>{authProfileData?.dob}</p>
            </div>

            <div className='profile-info-card'>
              <p className='profile-info-label'>City</p>
              <p className='profile-info-value'>{authProfileData?.city}</p>
            </div>

            <div className='profile-info-card'>
              <p className='profile-info-label'>State</p>
              <p className='profile-info-value'>{authProfileData?.state}</p>
            </div>

            <div className='profile-info-card'>
              <p className='profile-info-label'>Language</p>
              <p className='profile-info-value'>{authProfileData?.language}</p>
            </div>
          </div> 
          :
          <div className='profile-empty-state'>
            <img src={'https://res.cloudinary.com/dyfbqdp0o/image/upload/v1743492059/Profile404_fh5qpj.png'} alt='Profile not found' className='profile-empty-img' />
            <p className='profile-empty-text'>Profile data not found</p>
          </div>
        }
      </div>
    </div>
  )
}

export default Profile