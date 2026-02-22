import React, { useState, useRef, useEffect, useContext } from 'react'
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiHeart, FiShuffle, FiRepeat } from 'react-icons/fi'
import { contextAPI } from './Context'
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { __DB } from '../Backend/Firebase'
import toast from 'react-hot-toast'

const MusicPlayer = ({ currentSong }) => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isFavorite, setIsFavorite] = useState(false)
  // Song ID fallback: use songUrl if no id
  const songId = currentSong?.id || currentSong?.audioUrl?.replace(/[^a-zA-Z0-9]/g, '')
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  
  const { allAlbums, setSelectedSong, authUserData } = useContext(contextAPI)

  // Find current album and song index for next/prev
  const getCurrentAlbumAndIndex = () => {
    for (let album of allAlbums) {
      const songIndex = album.allSongsData?.findIndex(
        song => song.songUrl === currentSong.audioUrl
      )
      if (songIndex !== -1) {
        return { album, songIndex, songs: album.allSongsData }
      }
    }
    return null
  }

  // Load and play new song when currentSong changes
  useEffect(() => {
    if (currentSong?.audioUrl && audioRef.current) {
      console.log('🎵 Loading song:', currentSong.title, 'URL:', currentSong.audioUrl)
      audioRef.current.src = currentSong.audioUrl
      audioRef.current.load()
      audioRef.current.play().then(() => {
        console.log('✅ Playing successfully')
        setIsPlaying(true)
        trackRecentlyPlayed() // Track play
        checkIfFavorite() // Check favorite status
      }).catch(err => {
        console.error('❌ Playback error:', err)
        toast.error('Failed to play audio. Check if URL is valid.')
        setIsPlaying(false)
      })
    }
  }, [currentSong?.audioUrl])

  // Track recently played (user subcollection, deterministic ID, update timestamp)
  const trackRecentlyPlayed = async () => {
    if (!authUserData?.uid || !currentSong) return
    const recentRef = doc(__DB, 'recentlyPlayed', authUserData.uid, 'songs', songId)
    try {
      await setDoc(recentRef, {
        id: songId,
        title: currentSong.title || currentSong.songName || '',
        image: currentSong.thumbnail || currentSong.image || currentSong.songImage || '',
        duration: currentSong.duration || currentSong.songDuration || '',
        artist: currentSong.artist || currentSong.artistName || '',
        audio: currentSong.audioUrl || currentSong.audio || '',
        playedAt: serverTimestamp()
      }, { merge: true })
    } catch (error) {
      console.error('Error tracking play:', error)
    }
  }

  // Check if song is favorited (user subcollection)
  const checkIfFavorite = async () => {
    if (!authUserData?.uid || !currentSong) return
    try {
      const favRef = doc(__DB, 'favorites', authUserData.uid, 'songs', songId)
      const favSnap = await getDoc(favRef)
      setIsFavorite(favSnap.exists())
    } catch (error) {
      console.error('Favorite check error:', error)
    }
  }

  // Toggle favorite (user subcollection, deterministic ID)
  const toggleFavorite = async () => {
    if (!authUserData?.uid || !currentSong) {
      toast.error('Login required');
      return;
    }
    const favRef = doc(__DB, 'favorites', authUserData.uid, 'songs', songId)
    try {
      const existing = await getDoc(favRef)
      if (existing.exists()) {
        await deleteDoc(favRef)
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await setDoc(favRef, {
          id: songId,
          title: currentSong.title || currentSong.songName || '',
          image: currentSong.thumbnail || currentSong.image || currentSong.songImage || '',
          duration: currentSong.duration || currentSong.songDuration || '',
          artist: currentSong.artist || currentSong.artistName || '',
          audio: currentSong.audioUrl || currentSong.audio || '',
          addedAt: serverTimestamp()
        })
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      console.error('Favorite Error:', error)
      toast.error('Failed to update favorite')
    }
  }

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Play/Pause toggle
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Update progress
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const total = audioRef.current.duration
      setCurrentTime(current)
      setDuration(total)
      setProgress((current / total) * 100 || 0)
    }
  }

  // Seek to position
  const handleProgressChange = (e) => {
    const newProgress = e.target.value
    setProgress(newProgress)
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (newProgress / 100) * duration
    }
  }

  // Next song
  const handleNext = () => {
    const albumData = getCurrentAlbumAndIndex()
    if (!albumData) return

    let nextIndex
    if (shuffle) {
      // Random song
      nextIndex = Math.floor(Math.random() * albumData.songs.length)
    } else {
      nextIndex = albumData.songIndex + 1
      if (nextIndex >= albumData.songs.length) {
        if (repeat) nextIndex = 0
        else return
      }
    }

    const nextSong = albumData.songs[nextIndex]
    setSelectedSong({
      title: nextSong.songName,
      artist: albumData.album.artistName,
      thumbnail: nextSong.songImage || albumData.album.albumImage,
      audioUrl: nextSong.songUrl
    })
  }

  // Previous song
  const handlePrev = () => {
    const albumData = getCurrentAlbumAndIndex()
    if (albumData && albumData.songIndex > 0) {
      const prevSong = albumData.songs[albumData.songIndex - 1]
      setSelectedSong({
        title: prevSong.songName,
        artist: albumData.album.artistName,
        thumbnail: prevSong.songImage || albumData.album.albumImage,
        audioUrl: prevSong.songUrl
      })
    }
  }

  // Auto play next song when current ends
  const handleEnded = () => {
    if (repeat) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    } else {
      handleNext()
    }
  }

  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!currentSong) return null

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
        onError={(e) => {
          console.error('❌ Audio error:', e.target.error)
          toast.error('Audio file cannot be played. Check format or URL.')
          setIsPlaying(false)
        }}
      />

      <div className='fixed bottom-0 left-0 right-0 z-50 animate-slide-up' style={{ background: 'rgba(21, 21, 29, 0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(122, 16, 35, 0.2)', boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.5)' }}>
        <div className='px-6 py-4'>
          {/* Progress Bar */}
          <div className='mb-3'>
            <div className='relative'>
              <div className='w-full h-1 rounded-full overflow-hidden' style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                <div 
                  className='h-full transition-all duration-300'
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7A1023, #E63946)' }}
                ></div>
              </div>
              <input
                type='range'
                min='0'
                max='100'
                value={progress}
                onChange={handleProgressChange}
                className='absolute inset-0 w-full h-1 opacity-0 cursor-pointer'
              />
            </div>
            <div className='flex justify-between text-xs mt-1' style={{ color: '#B3B3B3' }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            {/* Song Info */}
            <div className='flex items-center gap-4 flex-1'>
              <div className='w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden' style={{ background: 'linear-gradient(135deg, rgba(122, 16, 35, 0.3), rgba(230, 57, 70, 0.2))' }}>
                {currentSong.thumbnail ? (
                  <img src={currentSong.thumbnail} alt={currentSong.title} className='w-full h-full object-cover' />
                ) : (
                  <FiPlay style={{ color: '#E63946', fontSize: '20px' }} />
                )}
              </div>
              <div className='hidden sm:block'>
                <h4 className='font-semibold text-sm truncate max-w-xs' style={{ color: '#FFFFFF' }}>{currentSong.title}</h4>
                <p className='text-xs truncate max-w-xs' style={{ color: '#B3B3B3' }}>{currentSong.artist}</p>
              </div>
              <button 
                onClick={toggleFavorite}
                className='hidden md:block transition-colors'
                style={{ color: isFavorite ? '#E63946' : '#B3B3B3' }}
              >
                <FiHeart className={`text-lg transition-all ${
                  isFavorite ? 'scale-110' : ''
                }`} style={{ fill: isFavorite ? '#E63946' : 'none' }} />
              </button>
            </div>

            {/* Player Controls */}
            <div className='flex items-center gap-4'>
              <button 
                onClick={() => setShuffle(!shuffle)}
                className='transition-all hover:scale-110'
                style={{ color: shuffle ? '#E63946' : '#B3B3B3' }}
              >
                <FiShuffle className='text-lg' />
              </button>

              <button 
                onClick={handlePrev}
                className='transition-all hover:scale-110'
                style={{ color: '#B3B3B3' }}
              >
                <FiSkipBack className='text-xl' />
              </button>
              
              <button 
                onClick={togglePlay}
                className='rounded-full p-3 transition-all hover:scale-105'
                style={{ background: 'linear-gradient(135deg, #7A1023, #9B1B30)', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(122, 16, 35, 0.4)' }}
              >
                {isPlaying ? <FiPause className='text-xl' /> : <FiPlay className='text-xl ml-0.5' />}
              </button>
              
              <button 
                onClick={handleNext}
                className='transition-all hover:scale-110'
                style={{ color: '#B3B3B3' }}
              >
                <FiSkipForward className='text-xl' />
              </button>

              <button 
                onClick={() => setRepeat(!repeat)}
                className='transition-all hover:scale-110'
                style={{ color: repeat ? '#E63946' : '#B3B3B3' }}
              >
                <FiRepeat className='text-lg' />
              </button>
            </div>

            {/* Volume Control */}
            <div className='hidden lg:flex items-center gap-3 flex-1 justify-end'>
              <FiVolume2 className='text-lg' style={{ color: '#B3B3B3' }} />
              <div className='relative w-24'>
                <div className='w-full h-1 rounded-full overflow-hidden' style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                  <div 
                    className='h-full'
                    style={{ width: `${volume}%`, background: 'linear-gradient(90deg, #7A1023, #E63946)' }}
                  ></div>
                </div>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className='absolute inset-0 w-full h-1 opacity-0 cursor-pointer'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MusicPlayer