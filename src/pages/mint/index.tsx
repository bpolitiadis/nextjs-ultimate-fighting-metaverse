import { Heading, Text, Button, MenuItem, FormControl, Select, Image } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import React, { useEffect, useRef, useState } from 'react'
import { Configuration, ImagesResponseDataInner, OpenAIApi } from 'openai'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import abi from '../../../constants/abi.json'
import css from '../../styles/mint.module.css'
import { ethers } from 'ethers'
import { NFTStorage, File, Blob } from 'nft.storage'
import { Address, readContract } from '@wagmi/core'
import axios from 'axios'
import { useDebounce } from 'usehooks-ts'

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
  const debouncedTokenId = useDebounce(tokenUrl, 500)

  const [base64String, setBase64String] = useState('')
  const [imagesBinaryData, setImagesBinaryData] = useState<ImagesResponseDataInner[]>([])
  const [selectedImage, setSelectedImage] = useState('')

  const contract = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFTSTORAGE
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

  //Design a full-body 8k+ digital avatar of a female character for a video game with dark skin and brown hair styled in braids. The character should be shown in a futuristic fighting style inspired by muay thai and set against a simple, symbol-free background. The image should be visually striking and dynamic with a polished finish.
  const textPrompt = `
    High resolution 8k+ digital avatar of a human martial artist video game character.
    Background should be simplistic and without letters, numbers, or symbols.
    Character has to be in an action pose with bold lines and a polished finish.
    Character is a ${formData['martialArt']} master.
    External characteristics:
    Gender - ${formData['gender']}
    Skin - ${formData['skin']}
    Hair Style - ${formData['hairStyle']}
    Hair Color - ${formData['hairColor']}
  `
  // Character has to be an ${formData['skin']} skinned ${formData['gender']}
  // with ${formData['hairColor']} hair and a ${formData['hairStyle']} hair style.
  // Character has to be in the ${formData['weightClass']} weight class division.
  // Art style: Digital Anime Art

  //   const textPrompt = `
  //   Create a high-resolution (8k or higher) digital avatar of a ${formData['gender']}, ${formData['skin']} skinned human character for a fighting martial arts video game,
  //   Character should have ${formData['hairStyle']} ${formData['hairColor']} hair and be depicted in a action pose. Fighter should be a master ${formData['martialArt']} martial artist.
  //   The background should be simplistic and without letters, numbers, or symbols.
  //   The image should be visually striking and dynamic, with a polished finish.
  // `

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
    try {
      const response = await oai.current.createImage({
        prompt: textPrompt,
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
    args: [debouncedTokenId.toString()],
    enabled: Boolean(debouncedTokenId),
    overrides: {
      value: ethers.utils.parseEther('0.01'),
    },
  })

  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const mint = async () => {
    try {
      const imageFile = new File([selectedImage], 'UFM-12345.png', { type: 'image/png' })
      const someData = new Blob([selectedImage])
      const cid = await client.storeBlob(someData)
      // console.log(cid)

      const metadata = await client.store({
        name: 'UFM',
        description: 'Ultimate Fighting Metaverse NFT Fighter',
        image: imageFile,
        imageBase64: selectedImage,
        blobURI: 'ipfs://' + cid,
        gatewayURI: 'https://ipfs.io/ipfs/' + cid,
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
      console.log(metadata.url)
      // console.log(metadata.data.imageBase64)
      setBase64String(metadata.data.imageBase64)
      setTokenUrl(metadata.url)

      write?.()
      console.log('Minted!')
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  const ipfsGatewayReplace = (url: string) => {
    return url.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          Welcome to the Ultimate Fighting Metaverse NFT mint page! It's time to create your very own digital asset representing your ultimate
          fighter. Plus, each NFT is one-of-a-kind, generated by the amazing DALL-E. Are you ready to prove your worth in the ring? Let's do this!
        </Text>
        {/* <Text> Next token to be minted: {nextTokenId}</Text> */}
        <div className={css.root}>
          <div className={css.container}>
            <div className={css.selectionMenu}>
              <FormControl label="Gender" name="gender" value={formData['gender']} onChange={handleChange}>
                <Select placeholder="Select gender">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </FormControl>
              <br />
              <FormControl name="martialArt" label="Martial Art" value={formData['martialArt']} onChange={handleChange}>
                <Select placeholder="Select martial art">
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
              <FormControl label="Skin" name="skin" value={formData['skin']} onChange={handleChange}>
                <Select placeholder="Select skin">
                  <option value="Caucasian">Caucasian</option>
                  <option value="DarkSkinned">Dark</option>
                  <option value="Asian">Asian</option>
                </Select>
              </FormControl>
              <br />
              <FormControl label="Hair Style" name="hairStyle" value={formData['hairStyle']} onChange={handleChange}>
                <Select placeholder="Select hair style">
                  <option value="Bald">Bald</option>
                  <option value="Short">Short</option>
                  <option value="Long">Long</option>
                  <option value="Rasta">Rasta</option>
                </Select>
              </FormControl>
              <br />
              <FormControl label="Hair Color" name="hairColor" value={formData['hairColor']} onChange={handleChange}>
                <Select placeholder="Select hair color">
                  <option value="Black">Black</option>
                  <option value="Blonde">Blonde</option>
                  <option value="Brown">Brown</option>
                  <option value="Ginger">Ginger</option>
                </Select>
              </FormControl>
              <br />
              <Button onClick={create} variant="contained" className={css.Button}>
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
              {/* <div className={css.imagesContainer}>
                {images.length > 0 &&
                  images.map((img) => (
                    <label key={img.url}>
                      <input
                        type="radio"
                        value={img.url}
                        checked={img.url === selectedImage}
                        onChange={(event) => setSelectedImage(event.target.value)}
                      />
                      <Image className={css.image} src={img.url} alt="Dall-e" />
                    </label>
                  ))}
              </div> */}
              <Button disabled={!write || isLoading} onClick={mint} variant="contained" className={css.Button}>
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
              <Text>
                Transaction:{' '}
                <a style={{ color: '#4ba9af' }} href={`https://mumbai.polygonscan.com/tx/${data.hash}`} target="_blank" rel="noopener noreferrer">
                  {data.hash}
                </a>
              </Text>
            </div>
          )}
          {(isPrepareError || isError) && <div>Error: {(prepareError || error)?.message}</div>}
        </div>
      </main>
    </>
  )
}
