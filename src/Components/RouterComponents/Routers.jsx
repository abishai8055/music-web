import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../../App'
import Home from '../Pages/Home'
import Login from '../Auth/Login'
import Register from '../Auth/Register'
import ForgotPassword from '../Auth/ForgotPassword'
import PublicRouters from './PublicRouters'
import ProfileContainer from '../ProfileComponents/ProfileContainer'
import Profile from '../ProfileComponents/ProfilePages/Profile'
import UpdateProfile from '../ProfileComponents/ProfilePages/UpdateProfile'
import PrivateRouters from './PrivateRouters'
import UpdateProfilePhoto from '../ProfileComponents/ProfilePages/UpdateProfilePhoto'
import AdminContainer from '../AdminComponents/AdminContainer'
import UpdatePassword from '../ProfileComponents/ProfilePages/UpdatePassword'
import DeleteAccount from '../ProfileComponents/ProfilePages/DeleteAccount'
import AlbumDetails from '../Pages/AlbumComponents/AlbumDetails'
import AdminRoute from './AdminRoute'
import Search from '../Pages/Search'
import Favorites from '../Pages/Favorites'
import RecentlyPlayed from '../Pages/RecentlyPlayed'
import AdminDashboard from '../AdminComponents/AdminDashboard'
import UserDashboard from '../ProfileComponents/ProfilePages/UserDashboard'


const allRouters = createBrowserRouter([
    {
        path: '/',
        element: <App />,

        children : [
          {
            path : '/', //same path as parent is given because we want this to be the landing or the default page
            element : 
            <PrivateRouters>
              <Home/>
            </PrivateRouters>
          },
          {
            path : '/album/:albumId',
            element : 
            <PrivateRouters>
              <AlbumDetails/>
            </PrivateRouters>
          },
          {
            path : '/search',
            element : 
            <PrivateRouters>
              <Search/>
            </PrivateRouters>
          },
          {
            path : '/favorites',
            element : 
            <PrivateRouters>
              <Favorites/>
            </PrivateRouters>
          },
          {
            path : '/recent',
            element : 
            <PrivateRouters>
              <RecentlyPlayed/>
            </PrivateRouters>
          },
          {
            path : '/login',
            element : 
            <PublicRouters>
              <Login/>
            </PublicRouters>
          },
          {
            path : '/register',
            element : <Register/>
          },
          {
            path : '/addAlbum',
            element : 
            <AdminRoute>
              <AdminContainer/>
            </AdminRoute>
          },
          {
            path : '/admin/dashboard',
            element : 
            <AdminRoute>
              <AdminDashboard/>
            </AdminRoute>
          },
          {
            path : '/forgotPassword',
            element : <ForgotPassword/>
          },
          {
            path : '/profile',
            element : 
            <PrivateRouters>
              <ProfileContainer />
            </PrivateRouters>,
            children : [{
              path : '/profile',
              element : <Profile/>
            },
          {
            path : 'dashboard',
            element : <UserDashboard/>
          },
          {
            path : 'updateProfile',
            element : <UpdateProfile/>
          },
          {
            path : 'updateProfilePhoto',
            element : <UpdateProfilePhoto/>
          },
          {
            path : 'updatePassword',
            element : <UpdatePassword/>
          },
          {
            path : 'deleteAccount',
            element : <DeleteAccount/>
          }
        ]
          }
        ]
    }
])

const Routers = () => {
  return (
    <RouterProvider router={allRouters} />
  )
}

export default Routers

// ! /updateProfile is not given because we need parent path so, 
// ! we can use it like this /profile/updateProfile : profile is the parent here