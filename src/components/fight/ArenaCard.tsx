import React, { useEffect, useRef, useState } from 'react'
import {
  Address,
  useAccount,
  useTransaction,
  useContractRead,
  useContractEvent,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractWrite,
} from 'wagmi'
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
  ModalOverlay,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spinner,
  Divider,
} from '@chakra-ui/react'
import Fight from 'pages/fight'
import { ethers, providers } from 'ethers'

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
  const { isOpen, onOpen, onClose } = useDisclosure()

  useContractEvent({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    eventName: 'MatchCreated',
    listener(matchId: any, tokenId1: any, tokenId2: any, outcome: any) {
      console.log('MatchCreated!')
      console.log('Match Id : ' + matchId)
      console.log('Token Id 1 : ' + tokenId1)
      console.log('Token Id 2 : ' + tokenId2)
      console.log('Outcome : ' + outcome)
    },
  })

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
    } else if (selectedFighter === arena.tokenId1) {
      toast({
        title: 'Error',
        description: 'You cannot join your own arena',
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    } else {
      if (config && write) {
        onOpen()
        write()
      }
    }
  }

  return (
    <>
      <Box>
        <Card textAlign="center" rounded="lg" borderWidth="1px" borderColor="gray.500">
          <CardHeader>
            <Heading size="md">Arena #{arenaId}</Heading>
          </CardHeader>
          <Divider />
          <CardBody>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Image src={'./images/arena1.jpg'} alt={'ArenaImg'} borderRadius="full" width="100%" height="100%" objectFit="contain"></Image>
            </Box>
            <Spacer m="24px" />
            <Flex justifyContent="space-between" flexDirection="row">
              <Text>Fighter 1: {arena.tokenId1}</Text>
              <Text>Fighter 2: {arena.tokenId2}</Text>
            </Flex>
            <Spacer m="4px" />
            <Button colorScheme="blue" textAlign="center" onClick={joinArena} variant="outline" size="sm">
              Join Arena
            </Button>
          </CardBody>

          {/* <CardFooter justifyContent="center">
            <Button colorScheme="blue" textAlign="center" onClick={joinArena} variant="outline" size="sm">
              Join Arena
            </Button>
          </CardFooter> */}
        </Card>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Joining arena...</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="column" justifyContent="center" alignItems="center">
              {isLoading && (
                <>
                  <Spinner />
                  <Text>Joining arena...</Text>
                </>
              )}
              {isSuccess && (
                <>
                  <Text>Success!</Text>
                  <Text>Transaction hash: {data?.hash}</Text>
                </>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
