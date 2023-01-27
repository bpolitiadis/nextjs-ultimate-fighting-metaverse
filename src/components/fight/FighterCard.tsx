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
  Container,
  ThemeProvider,
  Badge,
  Divider,
} from '@chakra-ui/react'
import { ThemeContext } from '@emotion/react'
import { ipfsGatewayReplace } from 'utils/helpers/helpers'

export interface FighterCardProps {
  strength: number
  stamina: number
  technique: number
  rarity: number
  victories: number
}

export const Rarities: any = {
  0: 'Common',
  1: 'Uncommon',
  2: 'Rare',
  3: 'Legendary',
}

export const RarityColors: any = {
  0: 'gray',
  1: 'green',
  2: 'blue',
  3: 'yellow',
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
            setMyFighterTokenId(jsonResponse.tokenID)
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

  return (
    <Box width={['85%', '80%', '75%']} mx="auto" my={4}>
      <Card
        minWidth="250px"
        maxWidth="250px"
        rounded="lg"
        borderWidth={isSelected ? '2px' : '1px'}
        borderColor={isSelected ? 'blue.200' : 'gray.500'}
        cursor="pointer"
        // bgColor={myFighterStats.rarity ? rarityColors[myFighterStats.rarity] : 'gray.400'}
        onClick={() => onClick(fighter)}>
        <CardHeader>
          <Text align="center" fontSize="2xl" fontFamily="fantasy" fontStyle="oblique">
            Fighter #{fighter}
          </Text>
        </CardHeader>
        <CardBody textAlign="center">
          <Stack>
            <Image
              cursor="pointer"
              border="4px"
              borderColor={myFighterStats.rarity ? RarityColors[myFighterStats.rarity] : 'gray.400'}
              borderRadius="md"
              src={`data:image/png;base64,${myFighterImageBase64}`}
              alt={myFighterTokenId}
              objectFit="cover"
              onClick={onOpen}
            />
            <Badge colorScheme={RarityColors[myFighterStats.rarity]}>{Rarities[myFighterStats.rarity]}</Badge>
            <Divider />
            <Box>
              {/* <Text>Rarity: {Rarities[myFighterStats.rarity]}</Text> */}
              <Text>Strength: {myFighterStats.strength}</Text>
              <Text>Stamina: {myFighterStats.stamina}</Text>
              <Text>Technique: {myFighterStats.technique}</Text>
            </Box>
            <Divider m="8px" />
          </Stack>

          <Text marginTop="8px">Victories: {myFighterStats.victories}</Text>
        </CardBody>
        {/* <CardFooter justifyContent="center">
          <Button colorScheme="blue" variant="outline" size="sm" onClick={onOpen}>
            Details
          </Button>
        </CardFooter> */}
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent textAlign="center">
          <ModalHeader fontFamily="fantasy" fontStyle="oblique">
            Fighter #{fighter}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Stack>
                <Image
                  border="4px"
                  borderColor={myFighterStats.rarity ? RarityColors[myFighterStats.rarity] : 'gray.400'}
                  borderRadius="md"
                  src={`data:image/png;base64,${myFighterImageBase64}`}
                  alt={myFighterTokenId}
                  objectFit="cover"
                />
                <Badge colorScheme={RarityColors[myFighterStats.rarity]}>{Rarities[myFighterStats.rarity]}</Badge>
                <Divider />
                <Box>
                  <Text>Strength: {myFighterStats.strength}</Text>
                  <Text>Stamina: {myFighterStats.stamina}</Text>
                  <Text>Technique: {myFighterStats.technique}</Text>
                </Box>
                <Divider m="8px" />
              </Stack>
              <Text marginTop="8px">Victories: {myFighterStats.victories}</Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
