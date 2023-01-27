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
//import an svg image from /public/svg/gold-cup.svg
// import goldCup from '../../../public/svg/gold-cup.svg'

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
import { messages } from '../../../constants/dictionary'

export interface ArenaCardProps {
  matchId: number
  tokenId1: number
  tokenId2: number
  winnerId: number
}

export const ArenaCard = ({ arenaId, arena, selectedFighter }: { arenaId: number; arena: ArenaCardProps; selectedFighter: number }) => {
  const { address: user, isConnecting, isDisconnected, isConnected } = useAccount()

  const [tokenId1, setTokenId1] = useState<number>(0)
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
      setMyArena({
        matchId: matchId.toNumber(),
        tokenId1: tokenId1.toNumber(),
        tokenId2: tokenId2.toNumber(),
        winnerId: outcome.toNumber(),
      })
    },
  })

  useContractEvent({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    eventName: 'ArenaOpened',
    listener(arenaId: any, tokenId: any) {
      console.log('ArenaOpened!')
      console.log('Arena Id : ' + arenaId)
      console.log('Token Id : ' + tokenId)
      setTokenId1(tokenId)
      setMyArena({
        matchId: 0,
        tokenId1: tokenId.toNumber(),
        tokenId2: 0,
        winnerId: 0,
      })
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
      // setMyArena(arenaData as ArenaCardProps)
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
              <Image src={`./images/arena${arenaId}.jpg`} alt={'ArenaImg'} borderRadius="full" width="100%" height="100%" objectFit="contain"></Image>
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
        </Card>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {isLoading && (
              <>
                <Text textAlign="center">Joining the arena...</Text>
              </>
            )}
            {isSuccess && (
              <>
                <Text textAlign="center">Joined the arena!</Text>
              </>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading && (
              <>
                <Flex flexDir="column" justifyContent="center" alignItems="center">
                  <Spinner />
                  <Text verticalAlign="center" m="16px" fontStyle="oblique">
                    Joining arena...
                  </Text>
                </Flex>
              </>
            )}
            {isSuccess && (
              <>
                {myArena.tokenId2 == 0 && (
                  <>
                    <Text verticalAlign="center" m="16px" fontStyle="oblique" justifyContent="center">
                      Waiting for another fighter to join...
                    </Text>
                  </>
                )}
                {myArena.tokenId2 != 0 && (
                  <>
                    {myArena.winnerId == selectedFighter && (
                      <>
                        <Flex flexDir="column" justifyContent="center" alignItems="center">
                          <Image src={'./svg/gold-cup.svg'} alt="Victory" width="15%" height="15%" />
                          <Text fontWeight="bold" fontSize="2xl" textAlign="center">
                            You won!
                          </Text>
                          <Text fontSize="md" fontStyle="oblique" textAlign="center">
                            {messages.winningMessages[Math.floor(Math.random() * messages.winningMessages.length)]}
                          </Text>
                        </Flex>
                      </>
                    )}
                    {myArena.winnerId != selectedFighter && (
                      <>
                        <Flex flexDir="column" justifyContent="center" alignItems="center">
                          <Image src={'./svg/sad-face.svg'} alt="Victory" width="15%" height="15%" />
                          <Text fontWeight="bold" fontSize="2xl" textAlign="center">
                            You lost!
                          </Text>
                          <Text fontSize="md" fontStyle="oblique" textAlign="center">
                            {messages.losingMessages[Math.floor(Math.random() * messages.losingMessages.length)]}
                          </Text>
                        </Flex>
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {isError && (
              <>
                <Text textAlign="center">Something went wrong</Text>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
