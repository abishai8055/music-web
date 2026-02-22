import React from 'react'
import AdminSideBar from './AdminSideBar'
import AddAlbum from './AddAlbum'
import AddSongs from './AddSongs'

const AdminContainer = () => {
  return (
    <section className='w-full min-h-screen flex' style={{ background: '#0B0B0F' }}>
        <section className='flex-1 min-h-screen overflow-y-scroll flex flex-col items-center py-12 gap-12' style={{scrollbarWidth: 'thin', scrollbarColor: '#7A1023 #0B0B0F'}}>
            <div className='w-[90%] fade-in'>
                <h1 className='text-4xl font-bold gradient-burgundy mb-2'>Album Management</h1>
                <p className='text-gray-400'>Upload and manage your music collection</p>
            </div>
            <AddSongs />
            <AddAlbum />
        </section>
    </section>
  )
}

export default AdminContainer