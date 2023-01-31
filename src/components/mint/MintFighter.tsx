import React, { useEffect, useRef, useState } from 'react'
import {
  Text,
  Button,
  Image,
  Container,
  Flex,
  Box,
  Grid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spacer,
  Spinner,
  Link,
  Stack,
  Badge,
  Divider,
} from '@chakra-ui/react'
import { useNetwork, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractEvent } from 'wagmi'
import abi from '../../../constants/abi.json'
import css from '../../styles/mint.module.css'
import { NFTStorage, File, Blob } from 'nft.storage'
import { Address, readContract } from '@wagmi/core'
import { ImagesResponseDataInner } from 'openai'
import { ethers } from 'ethers'
import { FighterCardProps, Rarities, RarityColors } from 'components/fight/FighterCard'

export default function MintFighter({ imagesBinaryData }: { imagesBinaryData: ImagesResponseDataInner[] }) {
  const network = useNetwork()
  const [mintPrice, setMintPrice] = useState(Number(0))
  const [selectedImage, setSelectedImage] = useState('')
  const [tokenUrl, setTokenUrl] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1)
  const [imgFromIPFS, setImgFromIPFS] = useState('')
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [ipfsModalOpen, setIpfsModalOpen] = useState(false)
  const [isModalClosed, setIsModalClosed] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [myTokenID, setMyTokenID] = useState(0)
  const [myFighterStats, setMyFighterStats] = useState<FighterCardProps>({
    strength: 0,
    stamina: 0,
    technique: 0,
    rarity: 0,
    victories: 0,
  })

  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFTSTORAGE
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN as string })

  useContractEvent({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    eventName: 'FighterCreated',
    listener(tokenID: any, fighterData: any) {
      setMyTokenID(tokenID.toNumber())
      setMyFighterStats({
        strength: fighterData.strength.toNumber(),
        stamina: fighterData.stamina.toNumber(),
        technique: fighterData.technique.toNumber(),
        rarity: fighterData.rarity,
        victories: fighterData.victories.toNumber(),
      })
      // console.log('Fighter Created!')
      // console.log('Token ID:', myTokenID)
      // console.log('Fighter Stats:', JSON.stringify(myFighterStats as FighterCardProps))
    },
  })

  const {
    data: mintPriceData,
    isError: mintPriceError,
    isLoading: mintPriceLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getMintPrice',
    args: [],
  })

  const {
    data: lastToken,
    isError: lastTokenError,
    isLoading: lastTokenLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getLastTokenId',
    args: [],
  })

  const {
    data: fighterStatsData,
    isError: fighterStatsError,
    isLoading: fighterStatsLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getFighterStats',
    args: [lastToken],
  })

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'safeMint',
    args: [tokenUrl],
    enabled: Boolean(tokenUrl),
    overrides: {
      value: ethers.utils.parseEther('0.01'),
    },
  })

  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      console.log('Minted!')
      console.log(data)
      setTransactionStatus('success')
    },
    onError: (err) => {
      console.error(err)
      setTransactionStatus('error')
    },
  })

  useEffect(() => {
    if (fighterStatsData) {
      const fighterStatsArray = fighterStatsData
        .toString()
        .split(',')
        .map((num) => parseInt(num))
      const [strength, stamina, technique, rarity, victories] = fighterStatsArray
      setMyFighterStats({ strength, stamina, technique, rarity, victories })
    }
  }, [fighterStatsData, isSuccess])

  useEffect(() => {
    if (mintPriceData) {
      setMintPrice(Number(mintPriceData.toString()) / 10 ** 18)
    }
  }, [mintPriceData])

  const handleMint = async () => {
    try {
      const imageFile = new File([selectedImage], `UFM-${String(Number(lastToken) + 1)}.png`, { type: 'image/png' })

      setIpfsModalOpen(true)
      const metadata = await client.store({
        name: 'UFM',
        tokenID: String(Number(lastToken) + 1),
        description: 'Ultimate Fighting Metaverse NFT Fighter',
        image: imageFile,
        imageBase64: selectedImage,
      })
      setIpfsModalOpen(false)

      console.log('Response from IPFS: ' + metadata.url)
      setTokenUrl(metadata.url)
      setConfirmModalOpen(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleConfirmMint = async () => {
    try {
      if (write) write()
      setTransactionStatus('pending')
      setConfirmModalOpen(false)
      setTransactionModalOpen(true)
    } catch (error) {
      setTransactionStatus('error')
    }
  }

  const handleCloseModal = () => {
    setTransactionModalOpen(false)
  }

  return (
    <Box className={css.mintContainer}>
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        {imagesBinaryData.length > 0 &&
          imagesBinaryData.map((img, index) => (
            <Box
              key={img.b64_json}
              borderWidth={selectedImageIndex === index ? '3px' : '1px'}
              borderColor={selectedImageIndex === index ? 'gold' : 'gray.200'}
              m="4px"
              rounded={selectedImageIndex === index ? 'md' : 'sm'}
              onClick={() => {
                setSelectedImage(img.b64_json as string)
                setSelectedImageIndex(index)
              }}>
              <Image alt="" className={css.imageContainer} src={`data:image/png;base64,${img.b64_json}`} />
            </Box>
          ))}
      </Grid>
      <Spacer m="8px" />
      <Button
        disabled={isLoading || selectedImageIndex === -1 || selectedImage === ''}
        onClick={handleMint}
        variant="outline"
        width="400px"
        colorScheme="teal"
        className={css.Button}>
        {isLoading ? 'Minting...' : 'Mint'}
      </Button>
      <Modal isOpen={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <ModalOverlay />
        <ModalContent px={12} py={6}>
          <ModalHeader fontWeight="medium" textAlign="center" mb={4}>
            Confirm Mint
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Flex justifyContent="center" alignItems="center" mb={6}>
              <Image borderRadius="md" width={250} height={250} objectFit="cover" src={`data:image/png;base64,${selectedImage}`} alt={''} />
            </Flex>
            <Text>Are you sure you want to mint this NFT?</Text>
            <Text fontSize="sm" fontStyle="oblique">
              Mint Price : {mintPrice} {network.chain?.network === 'mainnet' ? 'ETH' : 'MATIC'}
            </Text>
            <Flex justifyContent="center" alignItems="center" mt={6}>
              <Button size="lg" variant="outline" onClick={handleConfirmMint} mr={4} colorScheme="green">
                Mint
              </Button>
              <Button size="lg" colorScheme="red" variant="outline" onClick={() => setConfirmModalOpen(false)}>
                Cancel
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={transactionModalOpen} onClose={() => setTransactionModalOpen(false)}>
        <ModalOverlay />
        <ModalContent px={12} py={6}>
          <ModalCloseButton onClick={handleCloseModal} />
          {transactionStatus === 'pending' && (
            <>
              <ModalHeader fontWeight="medium" textAlign="center" mb={4}>
                Transaction in progress
              </ModalHeader>
              <Flex justifyContent="center" alignItems="center" mb={6}>
                <Spinner mr={4} size="xl" />
              </Flex>
              <ModalBody textAlign="center" mb={6}>
                <Text>Transaction is pending, please wait...</Text>
              </ModalBody>
            </>
          )}
          {transactionStatus === 'success' && (
            <>
              <ModalHeader fontWeight="medium" textAlign="center" mb={4}>
                Transaction Success!
              </ModalHeader>
              <ModalBody>
                <Box textAlign="center">
                  <Stack>
                    <Image
                      border="4px"
                      borderColor={myFighterStats.rarity ? RarityColors[myFighterStats.rarity] : 'gray.400'}
                      borderRadius="md"
                      src={`data:image/png;base64,${selectedImage}`}
                      alt={''}
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
                  <Link
                    href={`https://mumbai.polygonscan.com/tx/${data?.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    fontWeight="medium"
                    color="blue.500"
                    mb={4}>
                    View Transaction
                  </Link>
                </Box>
              </ModalBody>
            </>
          )}
          {transactionStatus === 'error' && (
            <>
              <ModalHeader fontWeight="medium" textAlign="center" mb={4}>
                Transaction Error
              </ModalHeader>
              <ModalBody textAlign="center" mb={6}>
                <Text>
                  Sorry, there was an error with the transaction. <br />
                  {error?.message}
                </Text>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={ipfsModalOpen} onClose={() => setIpfsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontWeight="medium">
            Please wait
          </ModalHeader>
          <Flex justifyContent="center" alignItems="center" mb={6}>
            <Spinner mr={4} size="xl" />
          </Flex>
          <ModalBody textAlign="center" mb={6}>
            <Text>Sending your fighter&apos;s image to IPFS. It&apos;s not as fast as your fighter&apos;s punches, but it&apos;s on its way.</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
