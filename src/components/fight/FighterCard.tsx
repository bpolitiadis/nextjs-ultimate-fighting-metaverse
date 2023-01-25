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
  0: 'gray.400',
  1: 'green.400',
  2: 'blue.400',
  3: 'yellow.400',
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
    <Flex width={['85%', '80%', '75%']} mx="auto" my={4}>
      <Card
        minWidth="250px"
        maxWidth="250px"
        rounded="lg"
        borderWidth={isSelected ? '2px' : '1px'}
        borderColor={isSelected ? 'blue.200' : 'gray.200'}
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
              border="4px"
              borderColor={myFighterStats.rarity ? RarityColors[myFighterStats.rarity] : 'gray.400'}
              borderRadius="md"
              src={`data:image/png;base64,${myFighterImageBase64}`}
              alt={myFighterTokenId}
              objectFit="cover"
            />
            <StackDivider />
            <Box>
              <Text>Rarity: {Rarities[myFighterStats.rarity]}</Text>
              <Text>
                Strength: {myFighterStats.strength} | Stamina: {myFighterStats.stamina} | Technique: {myFighterStats.technique}{' '}
              </Text>
              <Text>Victories: {myFighterStats.victories}</Text>
            </Box>
          </Stack>
        </CardBody>
        <CardFooter justifyContent="center">
          <Button colorScheme="blue" variant="outline" size="sm" onClick={onOpen}>
            Details
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent textAlign="center">
              <ModalHeader fontFamily="fantasy" fontStyle="oblique">
                Fighter #{fighter}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Container>
                  <Image
                    border="4px"
                    borderColor={myFighterStats.rarity ? RarityColors[myFighterStats.rarity] : 'gray.400'}
                    display="block"
                    margin="auto"
                    borderRadius="md"
                    src={`data:image/png;base64,${myFighterImageBase64}`}
                    alt={`Fighter #${fighter}`}
                    rounded="md"
                  />
                  <Text>Token ID: {fighter}</Text>
                  <Text>Rarity: {Rarities[myFighterStats.rarity]}</Text>
                  <Text>
                    Strength: {myFighterStats.strength} | Stamina: {myFighterStats.stamina} | Technique: {myFighterStats.technique}{' '}
                  </Text>
                  <Text>Victories: {myFighterStats.victories}</Text>
                </Container>
              </ModalBody>
            </ModalContent>
          </Modal>
        </CardFooter>
      </Card>
    </Flex>
  )
}
