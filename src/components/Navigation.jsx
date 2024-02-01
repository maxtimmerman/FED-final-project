import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <Flex as="nav" p="6" color="green.900" fontSize="2xl">
      <Box >
        <Link to="/" style={{ marginRight: '18px' }}>Home</Link>
      </Box>
    </Flex>
  );
};
