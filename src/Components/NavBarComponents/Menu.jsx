import React, { useContext } from 'react'
import { NavLink} from 'react-router-dom'
import { contextAPI } from '../Context'
import { FiHome, FiLogIn, FiUserPlus, FiSettings, FiHeart, FiClock, FiBarChart2 } from 'react-icons/fi'

const Menu = () => {
  let  { authUserData, authProfileData, userRole } = useContext(contextAPI)
  
  return (
    <section className='flex items-center gap-2 text-sm'>
        <NavLink 
          to='/' 
          className='flex items-center gap-2 px-4 py-2 rounded-xl transition-all'
          style={({ isActive }) => ({
            background: isActive ? 'rgba(122, 16, 35, 0.2)' : 'transparent',
            color: isActive ? '#E63946' : '#FFFFFF',
            border: `1px solid ${isActive ? 'rgba(122, 16, 35, 0.4)' : 'transparent'}`,
          })}
        >
          <FiHome className='text-base' />
          <span className='hidden lg:inline'>Home</span>
        </NavLink>

        {authUserData && (
          <>
            <NavLink 
              to='/favorites' 
              className='flex items-center gap-2 px-4 py-2 rounded-xl transition-all'
              style={({ isActive }) => ({
                background: isActive ? 'rgba(122, 16, 35, 0.2)' : 'transparent',
                color: isActive ? '#E63946' : '#FFFFFF',
                border: `1px solid ${isActive ? 'rgba(122, 16, 35, 0.4)' : 'transparent'}`,
              })}
            >
              <FiHeart className='text-base' />
              <span className='hidden lg:inline'>Favorites</span>
            </NavLink>

            <NavLink 
              to='/recent' 
              className='flex items-center gap-2 px-4 py-2 rounded-xl transition-all'
              style={({ isActive }) => ({
                background: isActive ? 'rgba(122, 16, 35, 0.2)' : 'transparent',
                color: isActive ? '#E63946' : '#FFFFFF',
                border: `1px solid ${isActive ? 'rgba(122, 16, 35, 0.4)' : 'transparent'}`,
              })}
            >
              <FiClock className='text-base' />
              <span className='hidden lg:inline'>Recent</span>
            </NavLink>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <NavLink 
              to='/admin/dashboard' 
              className='flex items-center gap-2 px-4 py-2 rounded-xl transition-all'
              style={({ isActive }) => ({
                background: isActive ? 'rgba(122, 16, 35, 0.2)' : 'transparent',
                color: isActive ? '#E63946' : '#FFFFFF',
                border: `1px solid ${isActive ? 'rgba(122, 16, 35, 0.4)' : 'transparent'}`,
              })}
            >
              <FiBarChart2 className='text-base' />
              <span className='hidden lg:inline'>Dashboard</span>
            </NavLink>
            <NavLink 
              to='/addAlbum' 
              className='flex items-center gap-2 px-4 py-2 rounded-xl transition-all'
              style={({ isActive }) => ({
                background: isActive ? 'rgba(122, 16, 35, 0.2)' : 'transparent',
                color: isActive ? '#E63946' : '#FFFFFF',
                border: `1px solid ${isActive ? 'rgba(122, 16, 35, 0.4)' : 'transparent'}`,
              })}
            >
              <FiSettings className='text-base' />
              <span className='hidden lg:inline'>Admin</span>
            </NavLink>
          </>
        )}
        
        {
          authUserData === null ?
          <>
            <NavLink 
              to='/login' 
              className='flex items-center gap-2 px-4 py-2 rounded-xl transition-all'
              style={{ color: '#FFFFFF', border: '1px solid transparent' }}
            >
              <FiLogIn className='text-base' />
              <span className='hidden lg:inline'>Login</span>
            </NavLink> 
            <NavLink 
              to='/register' 
              className='flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all'
              style={{ background: 'linear-gradient(135deg, #7A1023, #9B1B30)', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(122, 16, 35, 0.4)' }}
            >
              <FiUserPlus className='text-base' />
              <span className='hidden lg:inline'>Register</span>
            </NavLink>
          </>
          :
          <NavLink 
            to='/profile' 
            className='ml-2'
            style={({ isActive }) => ({
              display: 'block',
              border: `2px solid ${isActive ? '#E63946' : 'rgba(122, 16, 35, 0.3)'}`,
              borderRadius: '50%',
              padding: '2px',
              transition: 'all 0.3s ease'
            })}
          >
            <img 
              src={authUserData?.photoURL || 'https://via.placeholder.com/40'} 
              alt='Profile' 
              className='w-9 h-9 rounded-full object-cover'
            />
          </NavLink>
        }
    </section>
  )
}

export default Menu