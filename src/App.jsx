import React, { useContext } from 'react'
import NavBarContainer from './Components/NavBarComponents/NavBarContainer'
import MusicPlayer from './Components/MusicPlayer'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { contextAPI } from './Components/Context'

const App = () => {
  const location = useLocation()
  const { authUserData, selectedSong } = useContext(contextAPI)
  
  // Hide navbar and player on auth pages and admin page
  const isAuthPage = ['/login', '/register', '/forgotPassword'].includes(location.pathname)
  const shouldShowPlayer = !isAuthPage && authUserData && selectedSong
  
  return (
    <div className="app-layout w-full min-h-screen" style={{ background: '#0B0B0F' }}>
      <Toaster
        position='top-center'
        toastOptions={{
          style: {
            background: '#15151D',
            color: '#FFFFFF',
            border: '1px solid rgba(122, 16, 35, 0.3)',
            boxShadow: '0 8px 20px rgba(122, 16, 35, 0.4)',
          },
        }}
      />
      {!isAuthPage && <NavBarContainer />}
      <main className="app-content" style={{ paddingTop: !isAuthPage ? '90px' : 0, minHeight: '100vh' }}>
        <Outlet />
      </main>
      {shouldShowPlayer && <MusicPlayer currentSong={selectedSong} />}
    </div>
  )
}

export default App
