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
} from '@chakra-ui/react'
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import abi from '../../../constants/abi.json'
import css from '../../styles/mint.module.css'
import { NFTStorage, File, Blob } from 'nft.storage'
import { Address, readContract } from '@wagmi/core'
import { ImagesResponseDataInner } from 'openai'
import { ethers } from 'ethers'

export default function MintFighter({ imagesBinaryData }: { imagesBinaryData: ImagesResponseDataInner[] }) {
  const [selectedImage, setSelectedImage] = useState('')
  const [tokenUrl, setTokenUrl] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1)
  const [imgFromIPFS, setImgFromIPFS] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)

  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFTSTORAGE
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN as string })

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
    data: fighterStats,
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
      setTransactionModalOpen(false)
    },
    onError: (err) => {
      console.error(err)
      setTransactionModalOpen(false)
    },
  })

  const handleMint = async () => {
    try {
      const imageFile = new File([selectedImage], `UFM-${String(Number(lastToken) + 1)}.png`, { type: 'image/png' })

      const metadata = await client.store({
        name: 'UFM',
        tokenID: String(Number(lastToken) + 1),
        description: 'Ultimate Fighting Metaverse NFT Fighter',
        image: imageFile,
        imageBase64: selectedImage,
      })

      console.log('Response from IPFS: ' + metadata.url)
      setTokenUrl(metadata.url)
      setConfirmModalOpen(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleConfirmMint = () => {
    if (config && write) {
      write()
      setConfirmModalOpen(false)
      setTransactionModalOpen(true)
    }
  }

  return (
    <Container className={css.mintContainer}>
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        {imagesBinaryData.length > 0 &&
          imagesBinaryData.map((img, index) => (
            <Box
              key={img.b64_json}
              borderWidth={selectedImageIndex === index ? '3px' : '1px'}
              borderColor={selectedImageIndex === index ? 'yellow.200' : 'gray.200'}
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
        disabled={!write && isLoading && selectedImageIndex === -1 && selectedImage === ''}
        onClick={handleMint}
        variant="outline"
        width="400px"
        colorScheme="green"
        className={css.Button}>
        {isLoading ? 'Minting...' : 'Mint'}
      </Button>
      <Modal isOpen={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Mint</ModalHeader>
          <ModalCloseButton />
          <Image borderRadius="md" m="8px" src={`data:image/png;base64,${selectedImage}`} alt={''} />
          <ModalBody>Are you sure you want to mint this NFT Fighter?</ModalBody>
          <Flex justifyContent="space-around">
            <Button onClick={handleConfirmMint}>Mint</Button>
            <Spacer width={4} />
            <Button onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
          </Flex>
        </ModalContent>
      </Modal>
      <Modal isOpen={transactionModalOpen} onClose={() => setTransactionModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction in progress</ModalHeader>
          <ModalCloseButton />
          <ModalBody flexDir="column" alignContent="center">
            <Spinner />
            Minting your NFT Fighter. Please wait...
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  )
}
