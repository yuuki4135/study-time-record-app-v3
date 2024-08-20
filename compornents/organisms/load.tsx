import React from 'react'

export const Load = ({children, loading}) => {
  return (
    <div>
      {loading ? '...loading' : children}
    </div>
  )
}
