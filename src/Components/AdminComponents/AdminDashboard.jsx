import React, { useContext, useState, useEffect } from 'react'
import { contextAPI } from '../Context'
import { collection, getDocs } from 'firebase/firestore'
import { __DB } from '../../Backend/Firebase'
import { FiMusic, FiDisc, FiUsers, FiTrendingUp } from 'react-icons/fi'

const AdminDashboard = () => {
  const { allAlbums, authUserData } = useContext(contextAPI)
  const [stats, setStats] = useState({
    totalAlbums: 0,
    totalSongs: 0,
    totalUsers: 0,
    totalPlays: 0,
    playsPerDay: [],
    usersPerDay: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [allAlbums])

  const fetchAnalytics = async () => {
    try {
      const totalAlbums = allAlbums.length

      let totalSongs = 0
      allAlbums.forEach(album => {
        totalSongs += album.allSongsData?.length || 0
      })

      const usersSnapshot = await getDocs(collection(__DB, 'user_Profile'))
      const totalUsers = usersSnapshot.size

      let totalPlays = 0
      const usersQuery = await getDocs(collection(__DB, 'user_Profile'))
      for (const userDoc of usersQuery.docs) {
        const userPlaysRef = collection(__DB, 'recentlyPlayed', userDoc.id, 'songs')
        const userPlaysSnapshot = await getDocs(userPlaysRef)
        totalPlays += userPlaysSnapshot.size
      }

      // Generate last 7 days data
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const playsPerDay = []
      const usersPerDay = []
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayIndex = date.getDay()
        const dayLabel = days[dayIndex === 0 ? 6 : dayIndex - 1]
        
        playsPerDay.push({ label: dayLabel, value: Math.floor(Math.random() * 50) })
        usersPerDay.push({ label: dayLabel, value: Math.floor(Math.random() * 10) })
      }

      setStats({ totalAlbums, totalSongs, totalUsers, totalPlays, playsPerDay, usersPerDay })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className='min-h-screen p-8 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4'></div>
          <p className='text-gray-400'>Loading analytics...</p>
        </div>
      </section>
    )
  }

  return (
    <section style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: 20 }}>
      <div className='admin-dashboard-container'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold gradient-burgundy mb-1'>Analytics Dashboard</h1>
          <p className='text-gray-400'>Platform insights and statistics</p>
        </div>

        <div className='dashboard-grid'>
          {/* Top Stat Cards (4) */}
          <div className='stat-card'>
            <div className='flex items-center justify-between mb-2'>
              <div className='w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center'>
                <FiUsers className='text-2xl text-accent' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-white mb-1'>{stats.totalUsers}</h3>
            <p className='text-sm text-gray-400'>Total Users</p>
          </div>

          <div className='stat-card'>
            <div className='flex items-center justify-between mb-2'>
              <div className='w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center'>
                <FiDisc className='text-2xl text-accent' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-white mb-1'>{stats.totalAlbums}</h3>
            <p className='text-sm text-gray-400'>Total Albums</p>
          </div>

          <div className='stat-card'>
            <div className='flex items-center justify-between mb-2'>
              <div className='w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center'>
                <FiMusic className='text-2xl text-accent' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-white mb-1'>{stats.totalSongs}</h3>
            <p className='text-sm text-gray-400'>Total Songs</p>
          </div>

          <div className='stat-card'>
            <div className='flex items-center justify-between mb-2'>
              <div className='w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center'>
                <FiTrendingUp className='text-2xl text-accent' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-white mb-1'>{stats.totalPlays}</h3>
            <p className='text-sm text-gray-400'>Total Plays</p>
          </div>

          {/* Charts - each spans 2 columns */}
          <div className='chart-card span-2'>
            <h4 className='text-lg font-semibold mb-2'>Plays Per Day</h4>
            <div style={{ height: 220, borderRadius: 12, background: 'linear-gradient(180deg, rgba(122,16,35,0.04), rgba(0,0,0,0))' }}>
              <div className='w-full h-full flex items-end gap-2 p-4'>
                {[40, 60, 80, 30, 90, 70, 100].map((v, i) => (
                  <div key={i} style={{ width: '10%', height: `${v}%`, background: 'linear-gradient(180deg, var(--burgundy), var(--accent))', borderRadius: 6 }} />
                ))}
              </div>
            </div>
          </div>

          <div className='chart-card span-2'>
            <h4 className='text-lg font-semibold mb-2'>New Users Per Day</h4>
            <div style={{ height: 220, borderRadius: 12, background: 'linear-gradient(180deg, rgba(122,16,35,0.03), rgba(0,0,0,0))' }}>
              <div className='w-full h-full flex items-end gap-2 p-4'>
                {[10, 30, 20, 50, 80, 60, 40].map((v, i) => (
                  <div key={i} style={{ width: '10%', height: `${v}%`, background: 'linear-gradient(180deg, #9B1B30, #E63946)', borderRadius: 6 }} />
                ))}
              </div>
            </div>
          </div>

          {/* Split layout: Recent users + Recent uploads */}
          <div className='card-list span-2'>
            <h4 className='text-lg font-semibold mb-3'>Recent Users</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className='stat-card' style={{ padding: 12, minHeight: 60 }}>
                <div className='text-sm text-white'>Jane Doe — jane@example.com</div>
              </div>
              <div className='stat-card' style={{ padding: 12, minHeight: 60 }}>
                <div className='text-sm text-white'>John Smith — john@example.com</div>
              </div>
            </div>
          </div>

          <div className='card-list span-2'>
            <h4 className='text-lg font-semibold mb-3'>Recent Uploads</h4>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {allAlbums.slice(0, 4).map((a) => (
                <div key={a.id} className='stat-card' style={{ width: '48%', padding: 10 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden' }}>
                      {a.albumImage ? <img src={a.albumImage} alt={a.albumName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                    </div>
                    <div>
                      <div className='text-sm font-semibold'>{a.albumName}</div>
                      <div className='text-xs text-gray-400'>{a.artistName}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard
