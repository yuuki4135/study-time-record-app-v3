import * as React from 'react';

import { Flex } from '@chakra-ui/react'

interface LoadProps {
  children: React.ReactNode;
  loading: boolean;
}

export const Load: React.FC<LoadProps> = ({children, loading}) => {
  return (
    <Flex justify='center' align='center' w='100vw' direction='column'>
      {loading ? '...loading' : children}
    </Flex>
  )
}
