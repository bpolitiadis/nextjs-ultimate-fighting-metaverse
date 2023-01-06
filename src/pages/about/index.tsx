import { Heading, Text } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'

export default function About() {
  return (
    <>
      <Head />
      <main>
        <Heading as="h2">About Page</Heading>
        <Text>
          Welcome to the Ultimate Fighting Metaverse! We are a virtual reality game where players can use their unique NFTs to access and battle in
          the ring. Each NFT is one-of-a-kind, generated using the amazing DALL-e. Our goal is to create a fun and immersive gaming experience for all
          players. Thank you for choosing us as your go-to fighting game.
        </Text>
      </main>
    </>
  )
}
