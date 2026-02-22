import React, { useContext, useState, useEffect } from 'react'
import { contextAPI } from '../Context'
import { FiMusic } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { deleteDoc, doc, collection, getDocs, addDoc, query, where } from 'firebase/firestore'
import { __DB } from '../../Backend/Firebase'
import toast from 'react-hot-toast'
import LoadingSkeleton from '../LoadingSkeleton'
import SongCard from '../SongCard'

const Home = () => {
  let { allAlbums, userRole, fetchAllAlbums, authUserData, setSelectedSong } = useContext(contextAPI)
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [recentlyPlayedSongs, setRecentlyPlayedSongs] = useState([])
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [allAlbums])

  // Fetch recently played
  useEffect(() => {
    if (authUserData?.uid) {
      fetchRecentlyPlayed()
      fetchFavorites()
    }
  }, [authUserData])

  const fetchFavorites = async () => {
    try {
      const favRef = collection(__DB, 'favorites', authUserData.uid, 'songs')
      const snapshot = await getDocs(favRef)
      const favIds = snapshot.docs.map(doc => doc.data().songName || doc.data().title)
      setFavorites(favIds)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const fetchRecentlyPlayed = async () => {
    try {
      const userSongsRef = collection(__DB, 'recentlyPlayed', authUserData.uid, 'songs')
      const snapshot = await getDocs(userSongsRef)
      const songs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 6)
      setRecentlyPlayedSongs(songs)
    } catch (error) {
      console.error('Error fetching recently played:', error)
    }
  }

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`)
  }

  const handleDelete = async (albumId, albumName) => {
    if (!window.confirm(`Delete "${albumName}"? This cannot be undone.`)) return
    setDeleting(albumId)
    try {
      await deleteDoc(doc(__DB, 'albumData', albumId))
      toast.success('Album deleted successfully')
      fetchAllAlbums()
    } catch (error) {
      toast.error(error.message || 'Failed to delete album')
    } finally {
      setDeleting(null)
    }
  }

  const handleSongPlay = (song) => {
    setSelectedSong({
      title: song.title || song.songName,
      artist: song.artist || song.artistName || song.albumInfo?.artistName,
      thumbnail: song.image || song.songImage || song.albumInfo?.albumImage,
      audioUrl: song.audio || song.audioUrl || song.songUrl
    })
  }

  const handleFavorite = async (song) => {
    const songTitle = song.title || song.songName
    const isFav = favorites.includes(songTitle)
    try {
      if (isFav) {
        const favRef = collection(__DB, 'favorites', authUserData.uid, 'songs')
        const q = query(favRef, where('title', '==', songTitle))
        const snapshot = await getDocs(q)
        snapshot.docs.forEach(async (d) => {
          await deleteDoc(doc(__DB, 'favorites', authUserData.uid, 'songs', d.id))
        })
        setFavorites(favorites.filter(f => f !== songTitle))
        toast.success('Removed from favorites')
      } else {
        await addDoc(collection(__DB, 'favorites', authUserData.uid, 'songs'), {
          title: songTitle,
          songName: songTitle,
          artist: song.artist || song.artistName || song.albumInfo?.artistName,
          artistName: song.artist || song.artistName || song.albumInfo?.artistName,
          image: song.image || song.songImage || song.albumInfo?.albumImage,
          songImage: song.image || song.songImage || song.albumInfo?.albumImage,
          audio: song.audio || song.audioUrl || song.songUrl,
          songUrl: song.audio || song.audioUrl || song.songUrl,
          duration: song.duration
        })
        setFavorites([...favorites, songTitle])
        toast.success('Added to favorites')
      }
    } catch (error) {
      toast.error('Failed to update favorites')
    }
  }

  const getRecommendedSongs = () => {
    const songs = []
    allAlbums.forEach(album => {
      if (album.allSongsData?.length > 0) {
        album.allSongsData.forEach(song => {
          songs.push({ 
            ...song, 
            albumInfo: album,
            artistName: song.songSingers || album.artistName
          })
        })
      }
    })
    return songs.slice(0, 8)
  }

  const getTrendingSongs = () => {
    const songs = []
    allAlbums.forEach(album => {
      if (album.allSongsData?.length > 0) {
        const randomIndex = Math.floor(Math.random() * album.allSongsData.length)
        songs.push({ ...album.allSongsData[randomIndex], albumInfo: album })
      }
    })
    return songs.slice(0, 8)
  }

  return (
    <section className='min-h-screen p-8 content-container' style={{ background: '#0B0B0F' }}>
      {/* Hero Section */}
      <div className='fade-in mb-12 text-center py-12 md:py-20'>
        <h1 className='hero-quote text-5xl md:text-6xl font-light mb-4' style={{
          background: 'linear-gradient(135deg, #FFFFFF, #E63946)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'fadeUp 1s ease'
        }}>
          Feel the Music
        </h1>
        <p className='text-lg md:text-xl' style={{ color: '#B3B3B3', animation: 'fadeUp 1.2s ease' }}>
          Discover your soundtrack
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : allAlbums.length === 0 ? (
        <div className='text-center py-20'>
          <div className='text-6xl mb-6'>🎵</div>
          <h2 className='text-2xl font-bold text-white mb-3'>No albums yet</h2>
          <p className='text-gray-400 mb-6'>Start building your music library</p>
          {userRole === 'admin' && (
            <button 
              onClick={() => navigate('/addAlbum')}
              className='btn-burgundy px-6 py-3 rounded-xl font-semibold'
            >
              Upload First Album
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Continue Listening */}
          {authUserData && recentlyPlayedSongs.length > 0 && (
            <div className='page-section'>
              <div className='mb-6'>
                <h2 className='text-2xl md:text-3xl font-bold text-white mb-2'>Continue Listening</h2>
                <p className='text-gray-400'>Pick up where you left off</p>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {recentlyPlayedSongs.map((song) => (
                  <SongCard
                    key={song.id}
                    image={song.image || song.thumbnail || song.songImage}
                    title={song.title || song.songName}
                    artist={song.artist || song.artistName}
                    duration={song.duration}
                    onPlay={() => handleSongPlay(song)}
                    onFavorite={() => handleFavorite(song)}
                    isFavorite={favorites.includes(song.title || song.songName)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Albums */}
          <div className='page-section'>
            <div className='mb-6'>
              <h2 className='text-2xl md:text-3xl font-bold text-white mb-2'>All Albums</h2>
              <p className='text-gray-400'>Complete collection</p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4'>
              {allAlbums.map((album) => (
                <div 
                  key={album.id}
                  onClick={() => handleAlbumClick(album.id)}
                  className='card-container cursor-pointer group p-4'
                >
                  <div className='relative mb-3 overflow-hidden rounded-lg'>
                    {album.albumImage ? (
                      <img src={album.albumImage} alt={album.albumName} className='w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300' />
                    ) : (
                      <div className='w-full aspect-square bg-gradient-to-br from-accent/20 to-burgundy/10 flex items-center justify-center'>
                        <FiMusic className='text-4xl text-accent/50' />
                      </div>
                    )}
                  </div>
                  <h3 className='font-semibold text-white text-sm truncate'>{album.albumName}</h3>
                  <p className='text-xs text-gray-400 truncate'>{album.artistName}</p>
                  {userRole === 'admin' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(album.id, album.albumName)
                      }}
                      disabled={deleting === album.id}
                      className='mt-2 w-full text-xs py-1 rounded-lg transition-all'
                      style={{ background: 'rgba(230, 57, 70, 0.2)', color: '#E63946' }}
                    >
                      {deleting === album.id ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Songs */}
          <div className='page-section'>
            <div className='mb-6'>
              <h2 className='text-2xl md:text-3xl font-bold text-white mb-2'>Recommended Songs</h2>
              <p className='text-gray-400'>Handpicked for you</p>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {getRecommendedSongs().map((song, index) => (
                <SongCard
                  key={`rec-${index}`}
                  image={song.songImage || song.albumInfo?.albumImage}
                  title={song.songName}
                  artist={song.artistName || song.albumInfo?.artistName}
                  duration={song.duration}
                  onPlay={() => handleSongPlay(song)}
                  onFavorite={() => handleFavorite(song)}
                  isFavorite={favorites.includes(song.songName)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default Home