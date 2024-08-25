import * as React from 'react';

interface LoadProps {
  children: React.ReactNode;
  loading: boolean;
}

export const Load: React.FC<LoadProps> = ({children, loading}) => {
  return (
    <div>
      {loading ? '...loading' : children}
    </div>
  )
}
