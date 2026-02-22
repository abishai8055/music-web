import React, { useState } from 'react'
import { FiPlay, FiMusic, FiTrash2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const AlbumCard = ({ album, onDelete, isAdmin, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <div 
      className='card-container cursor-pointer group stagger-item p-4'
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/album/${album.id}`)}
    >
      <div className='relative mb-3 overflow-hidden rounded-lg'>
        {album.albumImage ? (
          <img 
            src={album.albumImage} 
            alt={album.albumName} 
            className='w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='w-full aspect-square bg-gradient-to-br from-accent/20 to-burgundy/10 flex items-center justify-center'>
            <FiMusic className='text-4xl text-accent/50' />
          </div>
        )}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button 
            className='bg-accent text-white rounded-full p-3 transform transition-all duration-300 hover:scale-110 shadow-lg'
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/album/${album.id}`)
            }}
          >
            <FiPlay className='text-xl ml-0.5' />
          </button>
        </div>
        {isAdmin && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(album.id, album.albumName)
            }}
            className='absolute top-2 right-2 p-2 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80'
          >
            <FiTrash2 className='text-sm' />
          </button>
        )}
      </div>
      <h3 className='font-semibold text-white text-sm truncate group-hover:text-accent transition-colors'>
        {album.albumName}
      </h3>
      <p className='text-xs text-gray-400 truncate'>{album.artistName || 'Unknown Artist'}</p>
    </div>
  )
}

export default AlbumCard
