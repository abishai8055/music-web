import React, { useState } from 'react'
import { FiPlay, FiHeart } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'

const SongCard = ({ image, title, artist, duration, onPlay, onFavorite, isFavorite }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className='card-container cursor-pointer group relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className='relative w-full aspect-square mb-3 rounded-xl overflow-hidden'>
        <img 
          src={image || 'https://via.placeholder.com/300'} 
          alt={title}
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
        />
        
        {/* Play Button Overlay */}
        {isHovered && (
          <div 
            className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center'
            onClick={onPlay}
          >
            <button className='w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110' style={{ background: 'linear-gradient(135deg, #7A1023, #E63946)' }}>
              <FiPlay className='text-white text-2xl ml-1' />
            </button>
          </div>
        )}

        {/* Heart Icon */}
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onFavorite()
          }}
          className='absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110'
          style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)' }}
        >
          {isFavorite ? (
            <FaHeart className='text-accent text-sm' />
          ) : (
            <FiHeart className='text-white text-sm' />
          )}
        </button>
      </div>

      {/* Song Info */}
      <div className='px-2'>
        <h3 className='text-white font-semibold text-sm mb-1 truncate'>{title}</h3>
        <p className='text-gray-400 text-xs truncate'>{artist}</p>
        {duration && <p className='text-gray-500 text-xs mt-1'>{duration}</p>}
      </div>
    </div>
  )
}

export default SongCard
