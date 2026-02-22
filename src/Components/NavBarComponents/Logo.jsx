import React from 'react'
import logo from '../../assets/logo1.png'

const Logo = ({ scrolled }) => {
  return (
    <section className='transition-all duration-300'>
        <img src = {logo} alt = 'Practice' width={scrolled ? '120px' : '150px'} className='transition-all duration-300'/>
    </section>
  )
}

export default Logo