import React, { useState, useContext, useMemo } from 'react'
import { contextAPI } from '../Context'
import { FiSearch, FiMusic, FiPlay } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const Search = () => {
  const { allAlbums, setSelectedSong } = useContext(contextAPI)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // Real-time search with useMemo for performance
  const searchResults = useMemo(() => {
    if (!query.trim()) return { albums: [], songs: [] }

    const lowerQuery = query.toLowerCase()
    const albums = allAlbums.filter(album =>
      album.albumName?.toLowerCase().includes(lowerQuery) ||
      album.artistName?.toLowerCase().includes(lowerQuery)
    )

    const songs = []
    allAlbums.forEach(album => {
      album.allSongsData?.forEach(song => {
        if (
          song.songName?.toLowerCase().includes(lowerQuery) ||
          song.songSingers?.toLowerCase().includes(lowerQuery)
        ) {
          songs.push({ ...song, albumInfo: album })
        }
      })
    })

    return { albums, songs }
  }, [query, allAlbums])

  const handleSongPlay = (song, album) => {
    setSelectedSong({
      title: song.songName,
      artist: album.artistName,
      thumbnail: song.songImage || album.albumImage,
      audioUrl: song.songUrl
    })
  }

  return (
    <section className='min-h-screen p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Search Header */}
        <div className='mb-10 fade-in'>
          <h1 className='text-4xl font-bold gradient-burgundy mb-2'>Search</h1>
          <p className='text-gray-400'>Find your favorite music</p>
        </div>

        {/* Search Input */}
        <div className='relative mb-8'>
          <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl' />
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search albums, songs, or artists...'
            className='w-full bg-secondary/50 border border-burgundy/30 rounded-xl pl-12 pr-4 py-4 text-white input-focus'
            autoFocus
          />
        </div>

        {/* Results */}
        {query.trim() && (
          <div className='space-y-8'>
            {/* Albums */}
            {searchResults.albums.length > 0 && (
              <div>
                <h2 className='text-xl font-semibold text-white mb-4'>Albums</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {searchResults.albums.map(album => (
                    <div
                      key={album.id}
                      onClick={() => navigate(`/album/${album.id}`)}
                      className='glass-dark rounded-xl p-4 cursor-pointer card-elegant'
                    >
                      <div className='w-full aspect-square rounded-lg overflow-hidden mb-3'>
                        {album.albumImage ? (
                          <img src={album.albumImage} alt={album.albumName} className='w-full h-full object-cover' />
                        ) : (
                          <div className='w-full h-full bg-gradient-to-br from-accent/20 to-burgundy/10 flex items-center justify-center'>
                            <FiMusic className='text-4xl text-accent/50' />
                          </div>
                        )}
                      </div>
                      <h3 className='text-white font-semibold truncate'>{album.albumName}</h3>
                      <p className='text-sm text-gray-400 truncate'>{album.artistName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Songs */}
            {searchResults.songs.length > 0 && (
              <div>
                <h2 className='text-xl font-semibold text-white mb-4'>Songs</h2>
                <div className='space-y-2'>
                  {searchResults.songs.map((song, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSongPlay(song, song.albumInfo)}
                      className='glass-dark rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all'
                    >
                      <div className='w-12 h-12 rounded overflow-hidden flex-shrink-0'>
                        {song.songImage ? (
                          <img src={song.songImage} alt={song.songName} className='w-full h-full object-cover' />
                        ) : (
                          <div className='w-full h-full bg-gradient-to-br from-accent/20 to-burgundy/10 flex items-center justify-center'>
                            <FiMusic className='text-accent/50' />
                          </div>
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-white font-medium truncate'>{song.songName}</h3>
                        <p className='text-sm text-gray-400 truncate'>{song.songSingers || song.albumInfo.artistName}</p>
                      </div>
                      <FiPlay className='text-accent text-xl flex-shrink-0' />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults.albums.length === 0 && searchResults.songs.length === 0 && (
              <div className='text-center py-12'>
                <FiSearch className='text-6xl text-gray-600 mx-auto mb-4' />
                <p className='text-xl text-gray-400'>No results found for "{query}"</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!query.trim() && (
          <div className='text-center py-12'>
            <FiSearch className='text-6xl text-accent/50 mx-auto mb-4' />
            <p className='text-xl text-gray-400'>Start typing to search</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Search
