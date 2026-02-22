import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiUser, FiEdit, FiCamera, FiLock, FiTrash2 } from 'react-icons/fi'

const ProfileSideBar = () => {
  return (
    <section className='profile-sidebar'>
        <NavLink end to={'/profile'} className='profile-sidebar-link'>
          <FiUser />
          <span>Profile</span>
        </NavLink>
        <NavLink to={'updateProfile'} className='profile-sidebar-link'>
          <FiEdit />
          <span>Update Profile</span>
        </NavLink>
        <NavLink to={'updateProfilePhoto'} className='profile-sidebar-link'>
          <FiCamera />
          <span>Update Photo</span>
        </NavLink>
        <NavLink to={'updatePassword'} className='profile-sidebar-link'>
          <FiLock />
          <span>Update Password</span>
        </NavLink>
        <NavLink to={'deleteAccount'} className='profile-sidebar-link'>
          <FiTrash2 />
          <span>Delete Account</span>
        </NavLink>
    </section>
  )
}

export default ProfileSideBar