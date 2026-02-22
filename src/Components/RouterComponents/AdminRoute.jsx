import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { contextAPI } from '../Context'
import { FiShield } from 'react-icons/fi'

const AdminRoute = ({ children }) => {
  const { authUserData, userRole } = useContext(contextAPI)

  if (!authUserData) {
    return <Navigate to='/login' />
  }

  if (userRole !== 'admin') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='glass-dark rounded-2xl p-12 text-center max-w-md shadow-elegant'>
          <FiShield className='text-6xl text-accent mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-white mb-3'>Access Denied</h2>
          <p className='text-gray-400 mb-6'>
            You need admin privileges to access this page.
          </p>
          <button 
            onClick={() => window.history.back()}
            className='btn-burgundy px-6 py-2 rounded-lg'
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default AdminRoute
