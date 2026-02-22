import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminSideBar = () => {
  return (
    <section className='w-[16%] h-full border-r border-r-accent flex justify-center'>
        <NavLink to='/addAlbum' className={'border w-[80%] h-fit py-2 rounded-md text-center text-lg mt-12 font-semibold'} >Add Album</NavLink>
    </section>
  )
}

export default AdminSideBar