import React, { useState, useEffect } from 'react'
import Logo from './Logo'
import Menu from './Menu'
import SearchBar from '../Shared/SearchBar'

const NavBarContainer = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`} style={{ background: 'rgba(21, 21, 29, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(122, 16, 35, 0.2)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)' }}>
      <div className='flex justify-between items-center gap-4 px-4 md:px-8 w-full'>
        <Logo scrolled={scrolled} />
        <div className='flex-1 max-w-2xl hidden md:block'>
          <SearchBar />
        </div>
        <Menu/>
      </div>
      <div className='md:hidden px-4 pb-2'>
        <SearchBar />
      </div>
    </header>
  )
}

export default NavBarContainer