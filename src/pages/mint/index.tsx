import { Heading, Text, Button, MenuItem, FormControl, Select, Image } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import React, { useEffect, useRef, useState } from 'react'
import { Configuration, ImagesResponseDataInner, OpenAIApi } from 'openai'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { ethers } from 'ethers'
import abi from '../../../constants/abi.json'
import css from '../../styles/mint.module.css'
import { NFTStorage, File, Blob } from 'nft.storage'
import { Address, readContract } from '@wagmi/core'
import axios from 'axios'
import { useDebounce } from 'usehooks-ts'
import { useMenuItem } from '@chakra-ui/menu'

export default function Mint() {
  const [formData, setFormData] = useState({
    gender: 'Male',
    martialArt: 'KickBoxing',
    skin: 'Caucasian',
    hairStyle: 'Short',
    hairColor: 'Black',
  })

  // const [images, setImages] = useState<ImagesResponseDataInner[]>([])
  const [tokenUrl, setTokenUrl] = useState('')
  // const debouncedTokenId = useDebounce(tokenUrl, 500)

  const [base64String, setBase64String] = useState('')
  const [imagesBinaryData, setImagesBinaryData] = useState<ImagesResponseDataInner[]>([])
  const [selectedImage, setSelectedImage] = useState('')

  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFTSTORAGE
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN as string })

  // Picture a powerful martial artist, with [skin tone] skin, [hair style] hair, and [hair color] tresses, fiercely performing a [fighting style] move in front of a mesmerizing abstract background, with no letters or numbers.
  // Detailed matte painting, deep color, fantastical, 8k resolution, trending on Artstation Unreal Engine 5, epic cinematic, brilliant stunning, intricate meticulously detailed, dramatic atmospheric, maximalist digital matte painting, perfect comic book art, smooth Mark Brooks and Dan Mumford style.

  //Design a full-body 8k+ digital avatar of a female character for a video game with dark skin and brown hair styled in braids. The character should be shown in a futuristic fighting style inspired by muay thai and set against a simple, symbol-free background. The image should be visually striking and dynamic with a polished finish.
  const textPrompt = `
    High resolution 8k+ digital avatar of a futuristic human martial artist.
    Background should be simplistic and without letters, numbers, or symbols.
    Character has to be muscular in an action fighting pose with bold lines and a polished finish.
    Character is a ${formData['martialArt']} master.
    External appearance characteristics:
    Gender - ${formData['gender']}
    Skin - ${formData['skin']}
    Hair Style - ${formData['hairStyle']}
    Hair Color - ${formData['hairColor']}
    detailed matte painting, deep color, fantastical, intricate detail, splash screen, complementary colors, fantasy concept art, 8k resolution trending on Artstation Unreal Engine 5  `
  const [text, setText] = useState(textPrompt)

  useEffect(() => {
    setText(textPrompt)
  }, [formData, textPrompt])

  const oai = useRef(
    new OpenAIApi(
      new Configuration({
        organization: process.env.NEXT_PUBLIC_OPENAI_ORG_KEY,
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      })
    )
  )

  const create = async () => {
    console.log(textPrompt)
    console.log(text)
    try {
      const response = await oai.current.createImage({
        prompt: text,
        n: 2,
        size: '256x256',
        response_format: 'b64_json',
      })
      // console.log(response.data.data)
      setImagesBinaryData(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

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
          martialArt: formData['martialArt'],
          gender: formData['gender'],
          skin: formData['skin'],
          hairColor: formData['hairColor'],
          hairStyle: formData['hairStyle'],
        },
      })

      console.log(metadata)
      console.log('Response from IPFS: ' + metadata.url)
      // console.log(metadata.data.imageBase64)
      setBase64String(metadata.data.imageBase64)
      setTokenUrl(metadata.url)
      console.log('tokenURI : ' + tokenUrl)

      write?.()
    } catch (error) {
      console.error(error)
    }
  }

  const ipfsGatewayReplace = (url: string) => {
    return url.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(formData.toString())
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <>
      <Head />
      <main>
        <Heading as="h2">Mint Page</Heading>
        <Text>
          Welcome to the Ultimate Fighting Metaverse NFT mint page! It`&apos;`s time to create your very own digital asset representing your ultimate
          fighter. Plus, each NFT is one-of-a-kind, generated by the amazing DALL-E. Are you ready to prove your worth in the ring? Let`&apos;`s do
          this!
        </Text>
        {/* <Text> Next token to be minted: {nextTokenId}</Text> */}
        <div className={css.root}>
          <div className={css.container}>
            <div className={css.selectionMenu}>
              <FormControl>
                <Select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </FormControl>
              <br />
              <FormControl label="Martial Art">
                <Select
                  placeholder="Select martial art"
                  value={formData.martialArt}
                  onChange={(e) => setFormData({ ...formData, martialArt: e.target.value })}>
                  <option value="Boxing">Boxing</option>
                  <option value="Capoeira">Capoeira</option>
                  <option value="Wrestling">Wrestling</option>
                  <option value="KickBoxing">Kick-Boxing</option>
                  <option value="Karate">Karate</option>
                  <option value="Judo">Judo</option>
                  <option value="BrazilianJiuJitsu">Brazilian Jiu Jitsu</option>
                  <option value="MuaiThai">Muai Thai</option>
                </Select>
              </FormControl>
              <br />
              <FormControl label="Skin">
                <Select placeholder="Select skin" value={formData.skin} onChange={(e) => setFormData({ ...formData, skin: e.target.value })}>
                  <option value="Caucasian">Caucasian</option>
                  <option value="Dark">Dark</option>
                  <option value="Asian">Asian</option>
                </Select>
              </FormControl>
              <br />
              <FormControl label="Hair Style">
                <Select
                  placeholder="Select hair style"
                  value={formData.hairStyle}
                  onChange={(e) => setFormData({ ...formData, hairStyle: e.target.value })}>
                  <option value="Bald">Bald</option>
                  <option value="Short">Short</option>
                  <option value="Long">Long</option>
                  <option value="Rasta">Rasta</option>
                </Select>
              </FormControl>
              <br />
              <FormControl label="Hair Color">
                <Select
                  placeholder="Select hair color"
                  value={formData.hairColor}
                  onChange={(e) => setFormData({ ...formData, hairColor: e.target.value })}>
                  <option value="Black">Black</option>
                  <option value="Blonde">Blonde</option>
                  <option value="Brown">Brown</option>
                  <option value="Ginger">Ginger</option>
                </Select>
              </FormControl>
              <br />
              <Button onClick={create} variant="outline" width="400px" colorScheme="green" backgroundColor="green" className={css.Button}>
                Generate
              </Button>
            </div>
            <div className={css.mintContainer}>
              <div className={css.imagesContainer}>
                {imagesBinaryData.length > 0 &&
                  imagesBinaryData.map((img) => (
                    <label key={img.b64_json}>
                      <input
                        type="radio"
                        value={img.b64_json}
                        checked={img.b64_json === selectedImage}
                        onChange={(event) => setSelectedImage(event.target.value)}
                      />
                      <Image className={css.image} src={`data:image/png;base64,${img.b64_json}`} alt="Dall-e" />
                    </label>
                  ))}
              </div>
              {/* <Button disabled={!write || isLoading} onClick={mint} variant="contained" className={css.Button}> */}
              <Button
                disabled={!write && isLoading}
                onClick={mint}
                variant="outline"
                width="400px"
                colorScheme="green"
                backgroundColor="green"
                className={css.Button}>
                {isLoading ? 'Minting...' : 'Mint'}
              </Button>
            </div>
            <br />
          </div>
          <div className={css.container}>
            <Image className={css.image} src={`data:image/png;base64,${selectedImage}`} alt="Dall-e" />
            <Image className={css.image} src={`data:image/png;base64, ${base64String}`} alt="ToMoun-e" />
          </div>
          {isLoading && <div>Check Wallet</div>}
          {isSuccess && (
            <div>
              <br />
              <Text> Your fighter is being minted </Text>
              {data ? (
                <Text>
                  {/* add a null check to data */}
                  Transaction:{' '}
                  <a style={{ color: '#4ba9af' }} href={`https://mumbai.polygonscan.com/tx/${data.hash}`} target="_blank" rel="noopener noreferrer">
                    {data ? data.hash : ''}
                  </a>
                </Text>
              ) : (
                ''
              )}
            </div>
          )}
          {(isPrepareError || isError) && <div>Error: {(prepareError || error)?.message}</div>}
        </div>
      </main>
    </>
  )
}
