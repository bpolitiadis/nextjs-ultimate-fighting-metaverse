import React, { useEffect, useRef, useState } from 'react'
import { Address, useAccount, useContractRead } from 'wagmi'
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
  useDisclosure,
  ModalBody,
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  useTheme,
  Button,
} from '@chakra-ui/react'

export interface FighterCardProps {
  strength: number
  stamina: number
  technique: number
  rarity: number
  victories: number
}

export const FighterCard = ({ fighter, isSelected, onClick }: { fighter: any; isSelected: boolean; onClick: any }) => {
  const [myFighterStats, setMyFighterStats] = useState<FighterCardProps>({
    strength: 0,
    stamina: 0,
    technique: 0,
    rarity: 0,
    victories: 0,
  })
  const [myTokenUrl, setMyTokenUrl] = useState<string>('')
  const [myFighterImage, setMyFighterImage] = useState<string>('')
  const [myFighterImageBase64, setMyFighterImageBase64] = useState<string>('')
  const [myFighterBlobURI, setMyFighterBlobURI] = useState<string>('')
  const [myFighterTokenId, setMyFighterTokenId] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    data: fighterStatsData,
    isError: fighterStatsError,
    isLoading: fighterStatsLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getFighterStats',
    args: [fighter],
  })

  const {
    data: tokenUrl,
    isError: tokenUrlError,
    isLoading: tokenUrlLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'tokenURI',
    args: [fighter],
  })

  const theme = useTheme()

  useEffect(() => {
    if (fighterStatsData) {
      const fighterStatsArray = fighterStatsData
        .toString()
        .split(',')
        .map((num) => parseInt(num))
      const [strength, stamina, technique, rarity, victories] = fighterStatsArray
      setMyFighterStats({ strength, stamina, technique, rarity, victories })
    }
  }, [fighterStatsData])

  useEffect(() => {
    if (tokenUrl) {
      setMyTokenUrl(tokenUrl.toString())
      const fetchMetadata = async () => {
        try {
          const response = await fetch(ipfsGatewayReplace(tokenUrl.toString()))
          if (response.ok) {
            const jsonResponse = await response.json()
            setMyFighterImage(jsonResponse.image)
            setMyFighterImageBase64(jsonResponse.imageBase64)
            setMyFighterBlobURI(jsonResponse.blobURI)
            setMyFighterTokenId(jsonResponse.properties.tokenID)
          } else {
            console.log('Error fetching metadata: ' + response.statusText)
          }
        } catch (error) {
          console.log('Error fetching metadata: ' + error)
        }
      }
      fetchMetadata()
    }
  }, [tokenUrl])

  const ipfsGatewayReplace = (url: string) => {
    console.log('url: ' + url)
    return url.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/')
  }

  return (
    <Flex width={['85%', '80%', '75%']} mx="auto" my={4}>
      <Card
        minWidth="250px"
        maxWidth="250px"
        rounded="lg"
        borderWidth="2px"
        borderColor={isSelected ? 'blue.500' : 'gray.200'}
        onClick={() => onClick(fighter)}>
        <CardHeader>
          <Heading as="h3" size="md">
            Fighter #{fighter}
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack>
            <Image src={`data:image/png;base64,${myFighterImageBase64}`} alt={myFighterTokenId} objectFit="cover" />
            <StackDivider />
            <Box>
              <Text>
                Strength: {myFighterStats.strength} | Stamina: {myFighterStats.stamina} | Technique: {myFighterStats.technique}{' '}
              </Text>
              <Text>
                Rarity: {myFighterStats.rarity} | Victories: {myFighterStats.victories}
              </Text>
            </Box>
          </Stack>
        </CardBody>
        <CardFooter>
          <Button onClick={onOpen}>Details</Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Fighter #{fighter}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  Strength: {myFighterStats.strength} | Stamina: {myFighterStats.stamina} | Technique: {myFighterStats.technique}{' '}
                </Text>
                <Text>
                  Rarity: {myFighterStats.rarity} | Victories: {myFighterStats.victories}
                </Text>
                <Text>Token ID: {myFighterTokenId}</Text>
                <Image src={myFighterImage} alt={`Fighter #${fighter}`} rounded="md" />
              </ModalBody>
            </ModalContent>
          </Modal>
        </CardFooter>
      </Card>
    </Flex>
  )
}
