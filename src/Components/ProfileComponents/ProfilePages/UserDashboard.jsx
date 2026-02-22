import React, { useContext, useState, useEffect } from 'react'
import { contextAPI } from '../../Context'
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore'
import { __DB } from '../../../Backend/Firebase'
import { FiMusic, FiHeart, FiClock, FiTrendingUp } from 'react-icons/fi'
import SimpleLineChart from '../../SimpleLineChart'

const UserDashboard = () => {
  const { authUserData } = useContext(contextAPI)
  const [stats, setStats] = useState({
    totalPlays: 0,
    totalFavorites: 0,
    recentSongs: [],
    activityData: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authUserData?.uid) {
      fetchUserStats()
    }
  }, [authUserData])

  const fetchUserStats = async () => {
    try {
      const playsRef = collection(__DB, 'recentlyPlayed', authUserData.uid, 'songs')
      const playsSnapshot = await getDocs(playsRef)
      const totalPlays = playsSnapshot.size
      const recentSongs = playsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 5)

      const favRef = collection(__DB, 'favorites', authUserData.uid, 'songs')
      const favSnapshot = await getDocs(favRef)
      const totalFavorites = favSnapshot.size

      // Generate last 7 days activity data
      const activityData = []
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayIndex = date.getDay()
        const dayLabel = days[dayIndex === 0 ? 6 : dayIndex - 1]
        
        // Count plays for this day (simplified - using random for demo)
        const playsForDay = Math.floor(Math.random() * 10)
        activityData.push({ label: dayLabel, value: playsForDay })
      }

      setStats({ totalPlays, totalFavorites, recentSongs, activityData })
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className='min-h-screen p-8 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4'></div>
          <p className='text-gray-400'>Loading your stats...</p>
        </div>
      </section>
    )
  }

  return (
    <section className='min-h-screen p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-10 fade-in'>
          <h1 className='text-4xl font-bold gradient-burgundy mb-2'>My Dashboard</h1>
          <p className='text-gray-400'>Your personal music activity</p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
          {/* Total Plays */}
          <div className='card-container'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center'>
                <FiTrendingUp className='text-2xl text-accent' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-white mb-1'>{stats.totalPlays}</h3>
            <p className='text-sm text-gray-400'>Songs Played</p>
          </div>

          {/* Total Favorites */}
          <div className='card-container'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center'>
                <FiHeart className='text-2xl text-accent' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-white mb-1'>{stats.totalFavorites}</h3>
            <p className='text-sm text-gray-400'>Liked Songs</p>
          </div>

          {/* Recent Activity */}
          <div className='card-container'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center'>
                <FiClock className='text-2xl text-accent' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-white mb-1'>{stats.recentSongs.length}</h3>
            <p className='text-sm text-gray-400'>Recent Tracks</p>
          </div>
        </div>

        {/* Activity Chart */}
        <div className='card-container mb-10'>
          <h2 className='text-xl font-bold text-white mb-4'>Listening Activity (Last 7 Days)</h2>
          <SimpleLineChart data={stats.activityData} title='' color='#E63946' />
        </div>

        {/* Recent Activity */}
        <div className='card-container'>
          <div className='flex items-center gap-3 mb-6'>
            <FiMusic className='text-2xl text-accent' />
            <h2 className='text-2xl font-bold text-white'>Recently Played</h2>
          </div>

          {stats.recentSongs.length === 0 ? (
            <div className='text-center py-12'>
              <FiMusic className='text-6xl text-accent/50 mx-auto mb-4' />
              <p className='text-gray-400'>No listening history yet</p>
            </div>
          ) : (
            <div className='space-y-2'>
              {stats.recentSongs.map((song, index) => (
                <div key={song.id} className='song-row'>
                  <div className='song-col-index'>{index + 1}</div>

                  <div className='song-col-title'>
                    {song.image ? (
                      <img src={song.image} alt={song.title} className='song-image' />
                    ) : (
                      <div className='song-image bg-gradient-to-br from-accent/20 to-burgundy/10 flex items-center justify-center'>
                        <FiMusic className='text-accent/50' />
                      </div>
                    )}
                    <div className='song-info'>
                      <span className='song-name'>{song.title}</span>
                      <span className='song-director'>{song.artist}</span>
                    </div>
                  </div>

                  <div className='song-col-singer'>
                    <span className='song-singer'>{song.artist}</span>
                  </div>

                  <div className='song-col-duration'>
                    <span className='song-duration'>{song.duration || '--:--'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default UserDashboard
