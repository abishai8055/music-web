import React, { useContext, useState, useEffect } from 'react'
import { contextAPI } from '../Context'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { __DB } from '../../Backend/Firebase'
import { FiHeart, FiMusic } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import LoadingSkeleton from '../LoadingSkeleton'

const Favorites = () => {
  const { authUserData, allAlbums, setSelectedSong } = useContext(contextAPI)
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authUserData?.uid) {
      setLoading(false);
      return;
    }
    const favRef = collection(__DB, 'favorites', authUserData.uid, 'songs');
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      const favSongs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavorites(favSongs);
      setLoading(false);
    }, (error) => {
      console.error('Favorites fetch error:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [authUserData]);

  const handlePlay = (fav) => {
    setSelectedSong({
      title: fav.title || fav.songName,
      artist: fav.artist || fav.artistName,
      thumbnail: fav.image || fav.songImage,
      audioUrl: fav.audio || fav.audioUrl || fav.songUrl
    })
  }

  const handleRemove = async (e, favId) => {
    e.stopPropagation()
    try {
      await deleteDoc(doc(__DB, 'favorites', authUserData.uid, 'songs', favId))
      toast.success('Removed from favorites')
    } catch (error) {
      toast.error('Failed to remove')
    }
  }

  if (loading && authUserData?.uid) {
    return (
      <div style={{ background: '#0B0B0F', minHeight: '100vh' }}>
        <div className='content-container' style={{ paddingTop: '32px' }}>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold gradient-burgundy mb-2'>Liked Songs</h1>
            <p className='text-gray-400'>Your favorite tracks</p>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0B0B0F', minHeight: '100vh' }}>
      <div className='content-container' style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Header */}
        <div className='mb-8 fade-in'>
          <h1 className='text-3xl font-bold gradient-burgundy mb-2'>Liked Songs</h1>
          <p className='text-gray-400'>{favorites.length} songs</p>
        </div>

      {favorites.length === 0 ? (
        <>
          {/* Empty State */}
          <div className='card-container text-center py-16 mb-8'>
            <div className='text-6xl mb-4'>❤️</div>
            <h3 className='text-2xl font-bold text-white mb-2'>No liked songs yet</h3>
            <p className='text-gray-400 mb-6'>Start building your collection</p>
            <button 
              onClick={() => navigate('/')}
              className='btn-burgundy px-6 py-3 rounded-xl font-semibold'
            >
              Explore Music
            </button>
          </div>

          {/* Suggested Albums */}
          {allAlbums.length > 0 && (
            <div>
              <h2 className='text-2xl font-bold text-white mb-6'>Discover Music</h2>
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
            {favorites.map((fav, index) => (
              <div 
                key={fav.id} 
                className='grid gap-4 p-4 rounded-lg cursor-pointer transition-all hover:bg-white/5'
                style={{ gridTemplateColumns: '60px 2fr 1fr 80px' }}
                onClick={() => handlePlay(fav)}
              >
                <img 
                  src={fav.image || fav.songImage || 'https://via.placeholder.com/60'} 
                  alt={fav.title || fav.songName}
                  className='w-[60px] h-[60px] object-cover rounded-lg'
                  onError={(e) => e.target.src = 'https://via.placeholder.com/60'}
                />

                <div className='flex flex-col justify-center min-w-0'>
                  <span className='font-semibold text-white text-sm truncate'>{fav.title || fav.songName}</span>
                  <span className='text-xs text-gray-400 truncate'>{fav.artist || fav.artistName}</span>
                </div>

                <div className='flex items-center'>
                  <span className='text-sm text-gray-400'>{fav.artist || fav.artistName}</span>
                </div>

                <div className='flex items-center justify-end gap-4'>
                  <span className='text-sm text-gray-400'>{fav.duration || '--:--'}</span>
                  <button
                    onClick={(e) => handleRemove(e, fav.id)}
                    className='text-accent hover:text-red-500 transition-colors'
                  >
                    <FiHeart className='text-lg fill-current' />
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

export default Favorites