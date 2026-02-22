import React from 'react'

const SimpleLineChart = ({ data, title, color = '#E63946' }) => {
  if (!data || data.length === 0) return null

  const maxValue = Math.max(...data.map(d => d.value), 1)
  const width = 100
  const height = 60

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - (d.value / maxValue) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <div className='w-full'>
      <p className='text-xs font-medium mb-2' style={{ color: '#B3B3B3' }}>{title}</p>
      <svg viewBox={`0 0 ${width} ${height}`} className='w-full h-16'>
        <polyline
          fill='none'
          stroke={color}
          strokeWidth='2'
          points={points}
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * width
          const y = height - (d.value / maxValue) * height
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r='2'
              fill={color}
            />
          )
        })}
      </svg>
      <div className='flex justify-between mt-1'>
        {data.map((d, i) => (
          <span key={i} className='text-xs' style={{ color: '#B3B3B3' }}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default SimpleLineChart
