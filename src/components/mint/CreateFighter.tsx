import React, { useEffect, useRef, useState } from 'react'
import { Heading, Text, Button, MenuItem, FormControl, Select, Image, Container, Spacer } from '@chakra-ui/react'
import { Configuration, ImagesResponseDataInner, OpenAIApi } from 'openai'
import css from '../../styles/mint.module.css'

interface OpenAIFormData {
  gender: string
  martialArt: string
  skin: string
  hairStyle: string
  hairColor: string
}

export default function CreateFighter({
  setImagesBinaryData,
}: {
  setImagesBinaryData: React.Dispatch<React.SetStateAction<ImagesResponseDataInner[]>>
}) {
  const [formData, setFormData] = useState<OpenAIFormData>({} as OpenAIFormData)
  const textPrompt = `Create a stunning, maximalist digital matte painting of an epic cinematic martial arts avatar, perfect for the comic book art style, in 8K resolution, utilizing the latest trends on ArtStation and Unreal Engine 5. The avatar should be ${formData['gender']}, ${formData['skin']} skinned, with ${formData['hairStyle']} and ${formData['hairColor']} hair, proficient in ${formData['martialArt']}, and with an intricate, meticulously detailed background that has no letters or numbers,  and is smooth, reminiscent of the styles of Mark Brooks and Dan Mumford.`
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
    console.log(text)
    try {
      const response = await oai.current.createImage({
        prompt: text,
        n: 4,
        size: '256x256',
        response_format: 'b64_json',
      })
      // console.log(response.data.data)
      setImagesBinaryData(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(formData.toString())
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Container className={css.selectionMenu}>
      <Text>Select you fighter&apos;s charachteristics:</Text>
      <Spacer m="16px" />
      <FormControl>
        <Select placeholder="Select gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </Select>
      </FormControl>
      <Spacer m="8px" />
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
      <Spacer m="8px" />
      <FormControl label="Skin">
        <Select placeholder="Select skin" value={formData.skin} onChange={(e) => setFormData({ ...formData, skin: e.target.value })}>
          <option value="Caucasian">Caucasian</option>
          <option value="Dark">Dark</option>
          <option value="Asian">Asian</option>
        </Select>
      </FormControl>
      <Spacer m="8px" />
      <FormControl label="Hair Style">
        <Select placeholder="Select hair style" value={formData.hairStyle} onChange={(e) => setFormData({ ...formData, hairStyle: e.target.value })}>
          <option value="Bald">Bald</option>
          <option value="Short">Short</option>
          <option value="Long">Long</option>
          <option value="Rasta">Rasta</option>
        </Select>
      </FormControl>
      <Spacer m="8px" />
      <FormControl label="Hair Color">
        <Select placeholder="Select hair color" value={formData.hairColor} onChange={(e) => setFormData({ ...formData, hairColor: e.target.value })}>
          <option value="Black">Black</option>
          <option value="Blonde">Blonde</option>
          <option value="Brown">Brown</option>
          <option value="Ginger">Ginger</option>
        </Select>
      </FormControl>
      <Spacer m="16px" />
      <Button onClick={create} variant="outline" width="400px" colorScheme="green">
        Generate
      </Button>
    </Container>
  )
}
