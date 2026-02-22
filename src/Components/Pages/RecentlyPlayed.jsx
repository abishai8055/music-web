import React, { useContext, useState, useEffect } from 'react'
import { contextAPI } from '../Context'
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore'
import { __DB } from '../../Backend/Firebase'
import { FiMusic, FiHeart } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import LoadingSkeleton from '../LoadingSkeleton'

const RecentlyPlayed = () => {
  const { authUserData, allAlbums, setSelectedSong } = useContext(contextAPI)
  const [recentSongs, setRecentSongs] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
      const userSongsRef = collection(__DB, 'recentlyPlayed', authUserData.uid, 'songs');
      const snapshot = await getDocs(userSongsRef);
      const songs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentSongs(songs);
    } catch (error) {
      console.error('Error fetching recently played:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePlay = (song) => {
    setSelectedSong({
      title: song.title || song.songName,
      artist: song.artist || song.artistName,
      thumbnail: song.image || song.songImage,
      audioUrl: song.audio || song.audioUrl || song.songUrl
    })
  }

  const handleFavorite = async (song) => {
    const isFav = favorites.includes(song.title || song.songName)
    try {
      if (isFav) {
        const favRef = collection(__DB, 'favorites', authUserData.uid, 'songs')
        const q = query(favRef, where('title', '==', song.title || song.songName))
        const snapshot = await getDocs(q)
        snapshot.docs.forEach(async (d) => {
          await deleteDoc(doc(__DB, 'favorites', authUserData.uid, 'songs', d.id))
        })
        setFavorites(favorites.filter(f => f !== (song.title || song.songName)))
        toast.success('Removed from favorites')
      } else {
        await addDoc(collection(__DB, 'favorites', authUserData.uid, 'songs'), {
          title: song.title || song.songName,
          artist: song.artist || song.artistName,
          image: song.image || song.songImage,
          audio: song.audio || song.audioUrl || song.songUrl,
          duration: song.duration,
          album: song.album
        })
        setFavorites([...favorites, song.title || song.songName])
        toast.success('Added to favorites')
      }
    } catch (error) {
      toast.error('Failed to update favorites')
    }
  }

  if (loading) {
    return (
      <div style={{ background: '#0B0B0F', minHeight: '100vh' }}>
        <div className='content-container' style={{ paddingTop: '32px' }}>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold gradient-burgundy mb-2'>Recently Played</h1>
            <p className='text-gray-400'>Your listening history</p>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0B0B0F', minHeight: '100vh' }}>
      <div className='content-container' style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Header */}
        <div className='mb-8 fade-in'>
          <h1 className='text-3xl font-bold gradient-burgundy mb-2'>Recently Played</h1>
          <p className='text-gray-400'>{recentSongs.length} tracks</p>
        </div>

      {recentSongs.length === 0 ? (
        <>
          {/* Empty State */}
          <div className='card-container text-center py-16 mb-8'>
            <div className='text-6xl mb-4'>🎵</div>
            <h3 className='text-2xl font-bold text-white mb-2'>No listening history</h3>
            <p className='text-gray-400 mb-6'>Start playing music to see your history</p>
            <button 
              onClick={() => navigate('/')}
              className='btn-burgundy px-6 py-3 rounded-xl font-semibold'
            >
              Browse Music
            </button>
          </div>

          {/* Suggested Albums */}
          {allAlbums.length > 0 && (
            <div>
              <h2 className='text-2xl font-bold text-white mb-6'>Start Listening</h2>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                {allAlbums.slice(0, 5).map((album) => (
                  <div 
                    key={album.id}
                    onClick={() => navigate(`/album/${album.id}`)}
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className='card-container'>
          <div className='space-y-2'>
            {recentSongs.map((song, index) => (
              <div
                key={song.id}
                className='grid gap-4 p-4 rounded-lg cursor-pointer transition-all hover:bg-white/5'
                style={{ gridTemplateColumns: '60px 2fr 1fr 80px' }}
                onClick={() => handlePlay(song)}
              >
                <img 
                  src={song.image || song.songImage || 'https://via.placeholder.com/60'} 
                  alt={song.title || song.songName}
                  className='w-[60px] h-[60px] object-cover rounded-lg'
                  onError={(e) => e.target.src = 'https://via.placeholder.com/60'}
                />

                <div className='flex flex-col justify-center min-w-0'>
                  <span className='font-semibold text-white text-sm truncate'>{song.title || song.songName}</span>
                  <span className='text-xs text-gray-400 truncate'>{song.artist || song.artistName}</span>
                </div>

                <div className='flex items-center'>
                  <span className='text-sm text-gray-400'>{song.artist || song.artistName}</span>
                </div>

                <div className='flex items-center justify-end gap-4'>
                  <span className='text-sm text-gray-400'>{song.duration || '--:--'}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFavorite(song)
                    }}
                    className='transition-colors'
                  >
                    {favorites.includes(song.title || song.songName) ? (
                      <FaHeart className='text-accent text-lg' />
                    ) : (
                      <FiHeart className='text-gray-400 hover:text-accent text-lg' />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default RecentlyPlayed