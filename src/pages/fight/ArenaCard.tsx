import React, { useEffect, useRef, useState } from 'react'
import { Address, useAccount, useContractRead } from 'wagmi'
import abi from '../../../constants/abi.json'

import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, Box, StackDivider, Text, Image, Flex, Button, Spacer } from '@chakra-ui/react'

export interface ArenaCardProps {
  matchId: number
  tokenId1: number
  tokenId2: number
  winnerId: number
}

export const ArenaCard = ({ arenaId, arena }: { arenaId: number; arena: ArenaCardProps }) => {
  const {
    data: arenaData,
    isError: arenaError,
    isLoading: arenaLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getAllArenas',
    args: [],
  })

  return (
    <Card>
      <CardBody>
        <Box display="flex" alignItems="center" justifyContent="center">
          {/* get arena1 image from public folder */}
          <Image
            src={'./images/arena1.jpg'}
            alt={'ArenaImg'}
            borderRadius="full"
            boxSize="100px"
            minW="100px"
            maxW="100px"
            minH="100px"
            maxH="100px"
            objectFit="contain"></Image>
        </Box>
        <Spacer m={4} />
        <Flex justifyContent="space-between" flexDirection="row">
          <Text>Fighter 1: {arena.tokenId1}</Text>
          <Text>Fighter 2: {arena.tokenId2}</Text>
        </Flex>
        <Button colorScheme="blue" variant="outline" size="sm" onClick={() => {}}>
          Join Arena
        </Button>
      </CardBody>
    </Card>
  )
}

export default ArenaCard
