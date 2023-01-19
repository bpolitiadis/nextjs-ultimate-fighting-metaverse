import React, { useEffect, useRef, useState } from 'react'
import { Heading, Text, Button, MenuItem, FormControl, Select, Image, Container, Flex, Box, Grid, SimpleGrid } from '@chakra-ui/react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import abi from '../../../constants/abi.json'
import css from '../../styles/mint.module.css'
import { NFTStorage, File, Blob } from 'nft.storage'
import { Address, readContract } from '@wagmi/core'
import { ImagesResponseDataInner } from 'openai'
import { ethers } from 'ethers'

export default function MintFighter({
  imagesBinaryData,
}: // setBase64String,
{
  imagesBinaryData: ImagesResponseDataInner[]
  // setBase64String: React.Dispatch<React.SetStateAction<string>>
}) {
  const [selectedImage, setSelectedImage] = useState('')
  const [tokenUrl, setTokenUrl] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1)

  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFTSTORAGE
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN as string })

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
    },
    onError: (err) => {
      console.error(err)
    },
  })

  useEffect(() => {
    if (tokenUrl) {
      // write?.()
    }
  }, [tokenUrl, write])

  const mint = async () => {
    try {
      const imageFile = new File([selectedImage], 'UFM-12345.png', { type: 'image/png' })
      // const someData = new Blob([selectedImage])
      // const cid = await client.storeBlob(someData)
      // console.log(cid)

      const metadata = await client.store({
        name: 'UFM',
        description: 'Ultimate Fighting Metaverse NFT Fighter',
        image: imageFile,
        imageBase64: selectedImage,
        // blobURI: 'ipfs://' + cid,
        // gatewayURI: 'https://ipfs.io/ipfs/' + cid,
        properties: {
          tokenID: '12345',
          // martialArt: formData['martialArt'],
          // gender: formData['gender'],
          // skin: formData['skin'],
          // hairColor: formData['hairColor'],
          // hairStyle: formData['hairStyle'],
        },
      })

      console.log(metadata)
      console.log('Response from IPFS: ' + metadata.url)
      // console.log(metadata.data.imageBase64)
      // setBase64String(metadata.data.imageBase64)
      setTokenUrl(metadata.url)
      console.log('tokenURI : ' + tokenUrl)

      write?.()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container className={css.mintContainer}>
      {/* <Flex justifyContent="space-between" flexFlow="row" m="4px" flexWrap="wrap" className={css.imagesContainer}> */}
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        {imagesBinaryData.length > 0 &&
          imagesBinaryData.map((img, index) => (
            <Box
              key={img.b64_json}
              borderWidth={selectedImageIndex === index ? '2px' : '1px'}
              borderColor={selectedImageIndex === index ? 'blue.500' : 'gray.300'}
              m="4px"
              onClick={() => {
                setSelectedImage(img.b64_json as string)
                setSelectedImageIndex(index)
              }}>
              <Image alt="" className={css.imageContainer} src={`data:image/png;base64,${img.b64_json}`} />
            </Box>
          ))}
      </Grid>
      <Button
        disabled={!write && isLoading && selectedImageIndex === -1 && selectedImage === ''}
        onClick={mint}
        variant="outline"
        width="400px"
        colorScheme="green"
        className={css.Button}>
        {isLoading ? 'Minting...' : 'Mint'}
      </Button>
      {/* {isLoading && <div>Check Wallet</div>} */}
      {/* {isSuccess && (1)} */}
      {/* <div>
           <br />
           <Text> Your fighter is being minted </Text>
           {data ? ( */}
      {/*      <Text>
               {/* add a null check to data */}
      {/*        Transaction:{' '}
               <a style={{ color: '#4ba9af' }} href={`https://mumbai.polygonscan.com/tx/${data.hash}`} target="_blank" rel="noopener noreferrer">
                 {data ? data.hash : ''}
               </a>
             </Text> */}
      {/*    ) : (
             ''
           )} */}
      {/* {(isPrepareError || isError) && <div>Error: {(prepareError || error)?.message}</div>} */}
      {/* </div>
      )} */}
    </Container>
  )
}
