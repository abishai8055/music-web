import React, { useState } from 'react'
import { FiPlay, FiMusic, FiHeart } from 'react-icons/fi'

const SongCard = ({ song, onPlay, onFavorite, index = 0, showFavorite = false }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className='card-container cursor-pointer group stagger-item p-3'
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(song)}
    >
      <div className='relative mb-3 overflow-hidden rounded-lg'>
        {song.image || song.songImage || song.thumbnail ? (
          <img 
            src={song.image || song.songImage || song.thumbnail} 
            alt={song.title || song.songName} 
            className='w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='w-full aspect-square bg-gradient-to-br from-accent/20 to-burgundy/10 flex items-center justify-center'>
            <FiMusic className='text-3xl text-accent/50' />
          </div>
        )}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button className='bg-accent text-white rounded-full p-2 transform transition-all duration-300 hover:scale-110 shadow-lg'>
            <FiPlay className='text-lg ml-0.5' />
          </button>
        </div>
        {showFavorite && onFavorite && (
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onFavorite(song)
            }}
            className='absolute top-2 right-2 p-2 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity'
          >
            <FiHeart className='text-sm' />
          </button>
        )}
      </div>
      <h3 className='font-semibold text-white text-xs truncate'>
        {song.title || song.songName}
      </h3>
      <p className='text-xs text-gray-400 truncate'>{song.artistName || song.artist || song.songSingers || song.albumInfo?.artistName || 'Unknown'}</p>
    </div>
  )
}

export default SongCard
