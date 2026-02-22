import React from 'react'

const LoadingSkeleton = () => {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4'>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
        <div key={item} className='card-container p-4 animate-pulse'>
          <div className='w-full aspect-square bg-accent/10 rounded-lg mb-3'></div>
          <div className='h-3 bg-accent/10 rounded-lg mb-2 w-3/4'></div>
          <div className='h-2 bg-accent/10 rounded-lg w-1/2'></div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton