import React, { useState, useEffect, useContext, useRef } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { contextAPI } from '../Context'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ songs: [], albums: [], artists: [] })
  const [showResults, setShowResults] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef(null)
  const { allAlbums, setSelectedSong } = useContext(contextAPI)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ songs: [], albums: [], artists: [] })
      setShowResults(false)
      return
    }

    const searchQuery = query.toLowerCase()
    const songs = []
    const albums = []
    const artistSet = new Set()

    allAlbums.forEach(album => {
      if (album.albumName?.toLowerCase().includes(searchQuery)) {
        albums.push(album)
      }
      if (album.artistName?.toLowerCase().includes(searchQuery)) {
        artistSet.add(album.artistName)
      }
      album.allSongsData?.forEach(song => {
        if (song.songName?.toLowerCase().includes(searchQuery) || 
            song.songSingers?.toLowerCase().includes(searchQuery)) {
          songs.push({ ...song, albumInfo: album })
        }
      })
    })

    setResults({
      songs: songs.slice(0, 5),
      albums: albums.slice(0, 5),
      artists: Array.from(artistSet).slice(0, 5)
    })
    setShowResults(true)
  }, [query, allAlbums])

  const handleSongClick = (song) => {
    setSelectedSong({
      title: song.songName,
      artist: song.albumInfo.artistName,
      thumbnail: song.songImage || song.albumInfo.albumImage,
      audioUrl: song.songUrl
    })
    setQuery('')
    setShowResults(false)
  }

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`)
    setQuery('')
    setShowResults(false)
  }

  const clearSearch = () => {
    setQuery('')
    setShowResults(false)
  }

  const totalResults = results.songs.length + results.albums.length + results.artists.length

  return (
    <div ref={searchRef} className='relative w-full md:w-96'>
      <div 
        className={`flex items-center rounded-full px-5 py-2.5 transition-all duration-300 ${
          isFocused ? 'search-bar-focused' : ''
        }`}
        style={{ 
          background: 'rgba(21, 21, 29, 0.8)', 
          border: `1px solid ${isFocused ? 'rgba(230, 57, 70, 0.5)' : 'rgba(122, 16, 35, 0.3)'}`,
          boxShadow: isFocused ? '0 0 20px rgba(230, 57, 70, 0.3)' : 'none'
        }}
      >
        <FiSearch className='text-lg mr-3' style={{ color: isFocused ? '#E63946' : '#B3B3B3' }} />
        <input 
          type='text'
          placeholder='Search songs, artists, albums...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className='bg-transparent outline-none w-full text-sm'
          style={{ color: '#FFFFFF' }}
        />
        {query && (
          <button onClick={clearSearch} className='ml-2 text-gray-400 hover:text-white transition-colors'>
            <FiX className='text-lg' />
          </button>
        )}
      </div>

      {showResults && totalResults > 0 && (
        <div 
          className='absolute top-full mt-2 w-full rounded-xl overflow-hidden shadow-2xl'
          style={{ 
            background: 'rgba(21, 21, 29, 0.98)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(122, 16, 35, 0.3)',
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          {results.albums.length > 0 && (
            <div className='p-3 border-b border-burgundy/20'>
              <p className='text-xs font-semibold text-gray-400 mb-2 px-2'>ALBUMS</p>
              {results.albums.map(album => (
                <div 
                  key={album.id}
                  onClick={() => handleAlbumClick(album.id)}
                  className='flex items-center gap-3 p-2 rounded-lg hover:bg-burgundy/10 cursor-pointer transition-colors'
                >
                  <img 
                    src={album.albumImage} 
                    alt={album.albumName}
                    className='w-10 h-10 rounded object-cover'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-white truncate'>{album.albumName}</p>
                    <p className='text-xs text-gray-400 truncate'>{album.artistName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.songs.length > 0 && (
            <div className='p-3 border-b border-burgundy/20'>
              <p className='text-xs font-semibold text-gray-400 mb-2 px-2'>SONGS</p>
              {results.songs.map((song, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSongClick(song)}
                  className='flex items-center gap-3 p-2 rounded-lg hover:bg-burgundy/10 cursor-pointer transition-colors'
                >
                  <img 
                    src={song.songImage || song.albumInfo.albumImage} 
                    alt={song.songName}
                    className='w-10 h-10 rounded object-cover'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-white truncate'>{song.songName}</p>
                    <p className='text-xs text-gray-400 truncate'>{song.songSingers || song.albumInfo.artistName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.artists.length > 0 && (
            <div className='p-3'>
              <p className='text-xs font-semibold text-gray-400 mb-2 px-2'>ARTISTS</p>
              {results.artists.map((artist, idx) => (
                <div 
                  key={idx}
                  className='flex items-center gap-3 p-2 rounded-lg hover:bg-burgundy/10 cursor-pointer transition-colors'
                >
                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-burgundy/10 flex items-center justify-center'>
                    <span className='text-accent font-bold'>{artist[0]}</span>
                  </div>
                  <p className='text-sm text-white'>{artist}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
