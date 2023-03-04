import React, { useEffect, useState } from 'react'
import { Address, useAccount, useContractRead } from 'wagmi'
import abi from '../../../constants/abi.json'
import { Card, CardHeader, CardBody, Stack, Box, Text, Image, Flex, useDisclosure, useTheme, Badge, Divider } from '@chakra-ui/react'
import { ipfsGatewayReplace } from 'utils/helpers/helpers'
import { FighterModal } from 'components/common/FighterModal'

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

export const FighterCard = ({ fighter, isSelected, onClick }: { fighter: number; isSelected: boolean; onClick: any }) => {
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
  const [myFighterTokenId, setMyFighterTokenId] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [owner, setOwner] = useState<string>('')

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

  const {
    data: ownerData,
    isError: ownerDataError,
    isLoading: ownerDataLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getOwner',
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
  }, [])

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
  }, [])

  useEffect(() => {
    if (ownerData) {
      setOwner(ownerData.toString())
    }
  }, [ownerData])

  return (
    <Box width={['85%', '80%', '75%']} mx={1} my={2}>
      <Card
        minWidth="250px"
        maxWidth="250px"
        rounded="lg"
        borderWidth={isSelected ? '4px' : '2px'}
        borderColor={RarityColors[myFighterStats.rarity]}
        cursor="pointer"
        onClick={() => onClick(fighter)}
        _hover={{
          boxShadow: `0px 0px 10px ${theme.colors.gray[400]}`,
          borderColor: RarityColors[myFighterStats.rarity], //: theme.colors.gray[500],
        }}>
        <Box
          position="relative"
          backgroundColor={myFighterStats.rarity ? RarityColors[myFighterStats.rarity] : 'gray.400'}
          borderRadius="md"
          borderBottomRadius={0}
          overflow="hidden">
          <Image
            cursor="pointer"
            src={`data:image/png;base64,${myFighterImageBase64}`}
            alt={myFighterTokenId}
            objectFit="cover"
            height="100%"
            width="100%"
            onClick={onOpen}
          />
        </Box>
        <Badge colorScheme={RarityColors[myFighterStats.rarity]} textAlign={'center'} justifyContent={'center'}>
          {Rarities[myFighterStats.rarity]} #{fighter}
        </Badge>
        <CardBody textAlign="center">
          <Box>
            <Text>Strength: {myFighterStats.strength}</Text>
            <Text>Stamina: {myFighterStats.stamina}</Text>
            <Text>Technique: {myFighterStats.technique}</Text>
          </Box>
          <Divider m="4px" />
          <Text marginTop="8px">Victories: {myFighterStats.victories}</Text>
        </CardBody>
      </Card>
      <FighterModal
        isOpen={isOpen}
        onClose={onClose}
        fighter={fighter}
        fighterStats={myFighterStats}
        fighterImageBase64={myFighterImageBase64}
        owner={owner}
      />
    </Box>
  )
}
