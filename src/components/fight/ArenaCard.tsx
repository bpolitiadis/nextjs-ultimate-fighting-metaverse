import React, { useEffect, useRef, useState } from 'react'
import { Address, useAccount, useContractRead, usePrepareContractWrite, useWaitForTransaction, useContractWrite } from 'wagmi'
import abi from '../../../constants/abi.json'

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Box,
  StackDivider,
  Text,
  Image,
  Flex,
  Button,
  Spacer,
  Toast,
  useToast,
} from '@chakra-ui/react'
import Fight from 'pages/fight'
import { ethers } from 'ethers'

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
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalMessage, setModalMessage] = useState<string>('')
  const toast = useToast()

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
    overrides: {
      value: ethers.utils.parseEther('0.01'),
    },
  })

  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      console.log(JSON.stringify(data))
      toast({
        title: 'Success',
        description: 'You have joined the arena',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    },
    onError: (err) => {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    },
  })

  useEffect(() => {
    if (arenaData) {
      setMyArena(arenaData as ArenaCardProps)
    }
  }, [arenaData])

  async function joinArena() {
    if (selectedFighter === 0) {
      toast({
        title: 'Error',
        description: 'Please select a fighter',
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    } else if (selectedFighter === arena.tokenId1 || selectedFighter === arena.tokenId2) {
      if (arena.winnerId === selectedFighter) {
        setModalTitle('Congratulations!')
        setModalMessage('You won the arena match')
        setModalOpen(true)
      } else {
        setModalTitle('Sorry')
        setModalMessage('You lost the arena match')
        setModalOpen(true)
      }
    } else {
      if (config && write) {
        write()
      }
    }
  }

  return (
    <Card>
      <CardBody textAlign="center" rounded="lg" borderWidth={'1px'} borderColor={'gray.500'}>
        <Text align="center" fontSize="2xl" fontFamily="fantasy" fontStyle="oblique">
          Arena #{arenaId}
        </Text>
        <Spacer m="4px" />
        <Box display="flex" alignItems="center" justifyContent="center">
          {/* get arena1 image from public folder */}
          <Image
            src={'./images/arena1.jpg'}
            alt={'ArenaImg'}
            borderRadius="full"
            boxSize="100px"
            width="100px"
            height="100px"
            objectFit="contain"></Image>
        </Box>
        <Spacer m="8px" />
        <Flex justifyContent="space-between" flexDirection="row">
          <Text>Fighter 1: {arena.tokenId1}</Text>
          <Text>Fighter 2: {arena.tokenId2}</Text>
        </Flex>
        <Spacer m="4px" />
        <Button
          colorScheme="blue"
          // onClick={() => {
          //   console.log('Join Arena')
          //   if (selectedFighter === 0) {
          //     console.log('Please select a fighter')
          //   } else if (selectedFighter === arena.tokenId1 || selectedFighter === arena.tokenId2) {
          //     console.log('You are already in this arena')
          //   } else {
          //     console.log('Joining arena')
          //     joinArena()
          //   }
          // }}
          onClick={joinArena}
          variant="outline"
          size="sm">
          Join Arena
        </Button>
      </CardBody>
    </Card>
  )
}
