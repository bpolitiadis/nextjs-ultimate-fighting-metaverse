import React, { useEffect, useState } from 'react'
import {
  Address,
  useAccount,
  useContractRead,
  useContractEvent,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractWrite,
  useProvider,
} from 'wagmi'
import abi from '../../../constants/abi.json'
import { Card, CardBody, Box, Text, Image, Flex, Button, Spacer, useToast, useDisclosure, Spinner, Divider, Avatar } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { ipfsGatewayReplace } from 'utils/helpers/helpers'
import { FightModal } from './FightModal'

export interface ArenaCardProps {
  matchId: number
  tokenId1: number
  tokenId2: number
  winnerId: number
}

export const ArenaCard = ({
  arenaNo,
  arena,
  selectedFighter,
  handleSetArena,
}: {
  arenaNo: number
  arena: ArenaCardProps
  selectedFighter: number
  handleSetArena: (index: number, arena: ArenaCardProps) => void
}) => {
  const { address: user, isConnecting, isDisconnected, isConnected } = useAccount()
  const provider = useProvider()
  const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address, abi, provider)

  const [tokenId1, setTokenId1] = useState<number>(0)
  const [tokenId2, setTokenId2] = useState<number>(0)
  const [token1Url, setToken1Url] = useState<string>('')
  const [token2Url, setToken2Url] = useState<string>('')
  const [token1Image64, setToken1Image64] = useState<string>('')
  const [myArena, setMyArena] = useState<ArenaCardProps>(arena)
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
      handleSetArena(arenaNo, {
        matchId: matchId.toNumber(),
        tokenId1: tokenId1.toNumber(),
        tokenId2: tokenId2.toNumber(),
        winnerId: outcome.toNumber(),
      })

      setMyArena({
        matchId: matchId.toNumber(),
        tokenId1: tokenId1.toNumber(),
        tokenId2: tokenId2.toNumber(),
        winnerId: outcome.toNumber(),
      })
    },
    // once: true,
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
      handleSetArena(arenaId.toNumber(), {
        matchId: 0,
        tokenId1: tokenId.toNumber(),
        tokenId2: 0,
        winnerId: 0,
      })
      setMyArena({
        matchId: 0,
        tokenId1: tokenId.toNumber(),
        tokenId2: 0,
        winnerId: 0,
      })
    },
    // once: true,
  })

  const {
    data: arenaData,
    isError: arenaError,
    isLoading: arenaLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getArena',
    args: [arenaNo],
  })

  const {
    data: tokenUrl,
    isError: tokenUrlError,
    isLoading: tokenUrlLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'tokenURI',
    args: [arena.tokenId1],
  })

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'joinArena',
    args: [arenaNo, selectedFighter],
    enabled: Boolean(arenaNo) && Boolean(selectedFighter),
    overrides: {
      value: ethers.utils.parseEther('0.01'),
    },
  })

  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      console.log(JSON.stringify(data))
      setMyArena(arenaData as ArenaCardProps)
      handleSetArena(arenaNo, arenaData as ArenaCardProps)
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

  // useEffect(() => {
  //   if (arenaData) {
  //     setMyArena(arenaData as ArenaCardProps)
  //   }
  // }, [arenaData])

  useEffect(() => {
    if (tokenUrl) {
      // setMyTokenUrl(tokenUrl.toString())
      const fetchMetadata = async () => {
        try {
          const response = await fetch(ipfsGatewayReplace(tokenUrl.toString()))
          if (response.ok) {
            const jsonResponse = await response.json()
            setToken1Image64(jsonResponse.imageBase64)
            // setMyFighterTokenId(jsonResponse.tokenID)
          } else {
            console.log('Error fetching metadata: ' + response.statusText)
          }
        } catch (error) {
          console.log('Error fetching metadata: ' + error)
        }
      }
      fetchMetadata()
    }
  }, [])

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
      <Box p={2}>
        <Card rounded="lg" borderWidth="1px" borderColor="gray.500">
          <Box position="relative">
            <Image
              src={`./images/arena${arenaNo}.jpg`}
              alt="Arena Image"
              borderRadius="lg"
              borderBottomRadius={0}
              width="100%"
              height="200px"
              objectFit="cover"
            />
          </Box>
          <Divider />
          <CardBody>
            <Flex flexDirection="row" alignItems="center" justifyContent="center">
              {arena.tokenId1 !== 0 ? (
                <Flex flexDirection="row" align="center" justifyContent="center">
                  <Avatar src={`data:image/png;base64,${token1Image64}`} />
                  <Spacer m="4px" />
                  <Text>#{arena.tokenId1} is waiting</Text>
                </Flex>
              ) : (
                <Text align="center" justifyContent="center">
                  Arena is empty.
                </Text>
              )}
            </Flex>
            <Spacer m="24px" />
            <Button colorScheme="blue" onClick={joinArena} size="sm" variant="outline" disabled={isLoading || isSuccess} width="100%">
              {isLoading && <Spinner size="xs" mr="2" />} {isSuccess ? 'Joined!' : 'Join Arena'}
            </Button>
          </CardBody>
        </Card>
      </Box>
      <FightModal
        isOpen={isOpen}
        onClose={onClose}
        arena={myArena}
        selectedFighter={selectedFighter}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
      />
    </>
  )
}
