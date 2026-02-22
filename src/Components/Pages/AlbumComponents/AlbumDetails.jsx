import React, { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { contextAPI } from '../../Context'
import { FiPlay, FiMusic, FiArrowLeft, FiClock } from 'react-icons/fi'

const AlbumDetails = () => {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const { allAlbums, setSelectedSong, selectedSong } = useContext(contextAPI)
  const [hoveredSong, setHoveredSong] = useState(null)
  
  const album = allAlbums.find(a => a.id === albumId)
  
  if (!album) {
    return (
      <div className='page-container' style={{ minHeight: '100vh', background: '#0B0B0F' }}>
        <div className='album-empty-state'>
          <FiMusic className='empty-icon' />
          <p className='empty-state-title'>Album not found</p>
        </div>
      </div>
    )
  }

  const handleSongClick = (song, index) => {
    setSelectedSong({
      title: song.songName,
      artist: album.artistName,
      thumbnail: song.songImage || album.albumImage,
      audioUrl: song.songUrl
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0F', width: '100%', overflowX: 'hidden' }}>
      <div className='page-container'>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className='back-button'
        >
          <FiArrowLeft />
          <span>Back to Home</span>
        </button>

        {/* Album Header */}
        <div className='album-header'>
          <div className='album-cover'>
            {album.albumImage ? (
              <img 
                src={album.albumImage} 
                alt={album.albumName}
              />
            ) : (
              <div className='album-cover-placeholder'>
                <FiMusic />
              </div>
            )}
          </div>

          <div className='album-meta'>
            <p className='album-label'>ALBUM</p>
            <h1 className='album-title'>{album.albumName}</h1>
            <div className='album-info'>
              <p className='album-artist'>{album.artistName}</p>
              <span className='divider'>•</span>
              <p className='album-detail'>{album.albumReleaseDate || 'Unknown'}</p>
              <span className='divider'>•</span>
              <p className='album-detail'>{album.allSongsData?.length || 0} songs</p>
            </div>
            {album.albumDescription && (
              <p className='album-description'>{album.albumDescription}</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className='section-divider'></div>

        {/* Songs List */}
        <div className='songs-container'>
          <h2 className='songs-heading'>Songs</h2>
          
          {!album.allSongsData || album.allSongsData.length === 0 ? (
            <div className='songs-empty-state'>
              <FiMusic className='empty-icon' />
              <p className='empty-state-subtitle'>No songs in this album yet</p>
            </div>
          ) : (
            <div className='songs-list'>
              {/* Table Header */}
              <div className='songs-header'>
                <div className='song-col-index'>#</div>
                <div className='song-col-title'>TITLE</div>
                <div className='song-col-singer'>SINGER</div>
                <div className='song-col-duration'><FiClock /></div>
              </div>

              {/* Songs */}
              {album.allSongsData.map((song, index) => {
                const isCurrentSong = selectedSong?.audioUrl === song.songUrl
                return (
                  <div
                    key={index}
                    onClick={() => handleSongClick(song, index)}
                    onMouseEnter={() => setHoveredSong(index)}
                    onMouseLeave={() => setHoveredSong(null)}
                    className={`song-row ${
                      isCurrentSong ? 'song-row-active' : ''
                    }`}
                  >
                    {/* Index / Play Icon */}
                    <div className='song-col-index'>
                      {hoveredSong === index || isCurrentSong ? (
                        <FiPlay className='song-play-icon' />
                      ) : (
                        <span className='song-index'>{index + 1}</span>
                      )}
                    </div>

                    {/* Song Info */}
                    <div className='song-col-title'>
                      <div className='song-thumbnail'>
                        {song.songImage ? (
                          <img src={song.songImage} alt={song.songName} />
                        ) : (
                          <div className='song-thumbnail-placeholder'>
                            <FiMusic />
                          </div>
                        )}
                      </div>
                      <div className='song-info'>
                        <p className='song-name'>{song.songName}</p>
                        <p className='song-director'>{song.songMusicDirector || 'Unknown'}</p>
                      </div>
                    </div>

                    {/* Singer */}
                    <div className='song-col-singer'>
                      <p className='song-singer'>{song.songSingers || album.artistName}</p>
                    </div>

                    {/* Duration */}
                    <div className='song-col-duration'>
                      <span className='song-duration'>--:--</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AlbumDetails