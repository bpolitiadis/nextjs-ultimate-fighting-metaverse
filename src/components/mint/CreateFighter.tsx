import React, { useEffect, useRef, useState } from 'react'
import {
  Heading,
  Text,
  Button,
  Menu,
  MenuItem,
  FormControl,
  Select,
  Image,
  Container,
  Spacer,
  useDisclosure,
  useToast,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Modal,
  Flex,
  Spinner,
} from '@chakra-ui/react'
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
  const [formData, setFormData] = useState<OpenAIFormData>({
    gender: '',
    martialArt: '',
    skin: '',
    hairStyle: '',
    hairColor: '',
  })
  const [text, setText] = useState('')
  const isFormComplete = Object.values(formData).every((val) => val !== '')

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    const textPrompt = `Create a stunning, maximalist digital matte painting of an epic cinematic martial arts avatar, perfect for the comic book art style, in 8K resolution, utilizing the latest trends on ArtStation and Unreal Engine 5. The avatar should be ${formData['gender']}, ${formData['skin']} skinned, with ${formData['hairStyle']} and ${formData['hairColor']} hair, proficient in ${formData['martialArt']}, and with an intricate, meticulously detailed background that has no letters or numbers,  and is smooth, reminiscent of the styles of Mark Brooks and Dan Mumford.`
    setText(textPrompt)
  }, [formData])

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
      onOpen()
      const response = await oai.current.createImage({
        prompt: text,
        n: 4,
        size: '256x256',
        response_format: 'b64_json',
      })
      setImagesBinaryData(response.data.data)
      onClose()
      // toast({
      //   title: 'Success',
      //   description: 'Now choose your fighter!',
      //   status: 'success',
      //   duration: 5000,
      //   isClosable: true,
      // })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: `Uh oh! It looks like OpenAI is running a little behind schedule. Let's give them another chance!`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        <Select placeholder="Select gender" value={formData.gender} onChange={handleChange} name="gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Select>
      </FormControl>
      <Spacer m="8px" />
      <FormControl label="Martial Art">
        <Select placeholder="Select martial art" value={formData.martialArt} onChange={handleChange} name="martialArt">
          <option value="Karate">Karate</option>
          <option value="Muay Thai">Muay Thai</option>
          <option value="Capoeira">Capoeira</option>
          <option value="Wrestling">Wrestling</option>
          <option value="Kung Fu">Kung Fu</option>
        </Select>
      </FormControl>
      <Spacer m="8px" />
      <FormControl label="Skin">
        <Select placeholder="Select skin" value={formData.skin} onChange={handleChange} name="skin">
          <option value="caucasian">Caucasian</option>
          <option value="dark">Dark</option>
          <option value="asian">Asian</option>
        </Select>
      </FormControl>
      <Spacer m="8px" />
      <FormControl label="Hair Style">
        <Select placeholder="Select hair style" value={formData.hairStyle} onChange={handleChange} name="hairStyle">
          <option value="short">Short</option>
          <option value="long">Long</option>
          <option value="braided">Braided</option>
          <option value="shaved">Shaved</option>
        </Select>
      </FormControl>
      <Spacer m="8px" />
      <FormControl label="Hair Color">
        <Select placeholder="Select hair color" value={formData.hairColor} onChange={handleChange} name="hairColor">
          <option value="black">Black</option>
          <option value="blonde">Blonde</option>
          <option value="brown">Brown</option>
          <option value="red">Red</option>
          <option value="silver">Silver</option>
        </Select>
      </FormControl>
      <Spacer m="16px" />
      <Button isDisabled={!isFormComplete} onClick={create} variant="outline" width="400px" colorScheme="teal">
        Generate
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontWeight="medium">
            Please wait
          </ModalHeader>
          <Flex justifyContent="center" alignItems="center" mb={6}>
            <Spinner mr={4} size="xl" />
          </Flex>
          <ModalBody textAlign="center" mb={6}>
            <Text>Hold tight while we summon OpenAI&apos;s DALL-E to craft your masterpiece!</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  )
}
