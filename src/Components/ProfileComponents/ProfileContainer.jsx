import React from 'react'
import ProfileSideBar from './ProfileSideBar'
import { Outlet } from 'react-router-dom'

const ProfileContainer = () => {
  return (
    <section className='w-full flex' style={{ minHeight: 'calc(100vh - 70px)' }}>
        <ProfileSideBar />
        <article className='profile-main-wrapper'>
            <Outlet />
        </article>
    </section>
  )
}

export default ProfileContainer