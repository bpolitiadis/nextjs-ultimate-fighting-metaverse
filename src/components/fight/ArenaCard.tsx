import React, { useEffect, useRef, useState } from 'react'
import { Address, useAccount, useContractRead, usePrepareContractWrite, useWaitForTransaction, useContractWrite } from 'wagmi'
import abi from '../../../constants/abi.json'

import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, Box, StackDivider, Text, Image, Flex, Button, Spacer } from '@chakra-ui/react'
import Fight from 'pages/fight'

export interface ArenaCardProps {
  matchId: number
  tokenId1: number
  tokenId2: number
  winnerId: number
}

export const ArenaCard = ({ arenaId, arena, selectedFighter }: { arenaId: number; arena: ArenaCardProps; selectedFighter: number }) => {
  const { address: user, isConnecting, isDisconnected, isConnected } = useAccount()

  const [tokenId, setTokenId] = useState<number>(0)
  const [myArena, setMyArena] = useState<ArenaCardProps>(arena)

  const {
    data: arenaData,
    isError: arenaError,
    isLoading: arenaLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getArena',
    args: [arenaId],
  })

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'joinArena',
    args: [arenaId, selectedFighter],
    enabled: Boolean(arenaId) && Boolean(selectedFighter),
  })

  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      console.log(data)
      // setMyArena(arenaData as ArenaCardProps)
    },
    onError: (err) => {
      console.error(err)
    },
  })

  useEffect(() => {
    if (arenaData) {
      setMyArena(arenaData as ArenaCardProps)
    }
  }, [arenaData])

  async function joinArena() {
    if (config) {
      write?.()
    }
  }

  return (
    <Card>
      <CardBody>
        <Text align="center" fontSize="2xl" fontFamily="fantasy" fontStyle="oblique">
          Arena #{arenaId}
        </Text>
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
        <Button
          colorScheme="blue"
          variant="outline"
          size="sm"
          onClick={() => {
            console.log('Join Arena')
            if (selectedFighter === 0) {
              console.log('Please select a fighter')
            } else if (selectedFighter === arena.tokenId1 || selectedFighter === arena.tokenId2) {
              console.log('You are already in this arena')
            } else {
              console.log('Joining arena')
              joinArena()
            }
          }}>
          Join Arena
        </Button>
      </CardBody>
    </Card>
  )
}
