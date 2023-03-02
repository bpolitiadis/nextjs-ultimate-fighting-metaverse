import {
  Box,
  Container,
  Flex,
  Heading,
  Spacer,
  Stack,
  StackDivider,
  Text,
  Image,
  Divider,
  Link,
  Button,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Badge,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Address, useAccount, useContractRead, usePrepareContractWrite } from 'wagmi'
import abi from '../../../constants/abi.json'
import css from '../../styles/rankings.module.css'
import { FighterCardProps, Rarities, RarityColors } from '../../components/fight/FighterCard'
import { ipfsGatewayReplace } from 'utils/helpers/helpers'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { FighterModal } from 'components/common/FighterModal'

export const RankingItem = ({ fighter }: { fighter: any }) => {
  const [myFighterStats, setMyFighterStats] = useState<FighterCardProps>({
    strength: 0,
    stamina: 0,
    technique: 0,
    rarity: 0,
    victories: 0,
  })
  const [myTokenUrl, setMyTokenUrl] = useState<string>('')
  const [myFighterImageBase64, setMyFighterImageBase64] = useState<string>('')
  const [owner, setOwner] = useState<string>('')
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
    data: ownerData,
    isError: ownerDataError,
    isLoading: ownerDataLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getOwner',
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

  useEffect(() => {
    if (ownerData) {
      setOwner(ownerData.toString())
    }
  }, [ownerData])

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
            setMyFighterImageBase64(jsonResponse.imageBase64)
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

  // function to truncate long addresses
  const truncateAddress = (address: string) => {
    return address.slice(0, 8) + '...' + address.slice(-8)
  }

  return (
    <>
      <Box>
        <Flex justify="space-between" align="center" flexDirection="row" width="100%" border="1px" borderRadius="lg" borderColor="gray.500">
          <Text width="100%" textAlign="center" fontWeight="bold" margin="12px">
            #{fighter}
          </Text>
          <Divider h={32} orientation="vertical" margin="4px" borderRadius="full" />
          <Image
            border="4px"
            margin="4px"
            borderColor={myFighterStats.rarity ? RarityColors[myFighterStats.rarity] : 'gray.400'}
            borderRadius="md"
            width="15%"
            height="15%"
            src={`data:image/png;base64,${myFighterImageBase64}`}
            alt={'Fighter Image'}
          />
          <Divider h={32} orientation="vertical" margin="4px" borderRadius="full" />
          <Text flexGrow={1} width="100%" textAlign="center" justifyContent="center" fontWeight="bold" margin="12px">
            {myFighterStats.victories}
          </Text>
          <Divider h={32} orientation="vertical" margin="4px" borderRadius="full" />
          <Stack width="100%" flexDir="column" flexWrap="nowrap" textAlign="center" margin="12px">
            <Text width="100%" flexWrap="nowrap">
              Strength: {myFighterStats.strength}
            </Text>
            <Text width="100%" whiteSpace="nowrap">
              Stamina: {myFighterStats.stamina}
            </Text>
            <Text width="100%" whiteSpace="nowrap">
              Technique: {myFighterStats.technique}
            </Text>
          </Stack>
          <Divider h={32} orientation="vertical" margin="4px" borderRadius="full" />
          <Text textAlign="center" justifyContent="center" margin="12px">
            <Link
              flexWrap="nowrap"
              fontWeight="light"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://mumbai.polygonscan.com/address/${owner}`}>
              {truncateAddress(owner)}
            </Link>
          </Text>
          <Divider h={32} orientation="vertical" margin="4px" borderRadius="full" />
          <Button colorScheme="blue" variant="outline" onClick={onOpen} width="100%" margin="12px">
            Details
          </Button>
          <FighterModal
            isOpen={isOpen}
            onClose={onClose}
            fighter={fighter}
            fighterStats={myFighterStats}
            fighterImageBase64={myFighterImageBase64}
            owner={owner}
          />
          {/* <Modal isOpen={isOpen} onClose={onClose}>
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
                  <Text textAlign="center" justifyContent="center">
                    Owner:{' '}
                    <Link
                      flexWrap="wrap"
                      fontWeight="light"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://mumbai.polygonscan.com/address/${owner}`}>
                      View on Explorer <ExternalLinkIcon />
                    </Link>
                  </Text>
                  <Text>Rarity: {Rarities[myFighterStats.rarity]}</Text>
                  <Text>
                    Strength: {myFighterStats.strength} | Stamina: {myFighterStats.stamina} | Technique: {myFighterStats.technique}{' '}
                  </Text>
                  <Text>Victories: {myFighterStats.victories}</Text>
                </Container>
              </ModalBody>
            </ModalContent>
          </Modal> */}
        </Flex>
      </Box>
    </>
  )
}
