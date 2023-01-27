import styles from 'styles/Home.module.css'
import { Flex, Box, Image, Heading, Text, Link, Center, Container } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { SITE_DESCRIPTION, SITE_NAME } from 'utils/config'

export default function Home() {
  const images = [
    './images/fighterCollage1.jpg',
    './images/arenaCollage1.jpg',
    'https://seeklogo.com/images/O/open-ai-logo-560B8FFD24-seeklogo.com.png',
    'https://articles-img.sftcdn.net/f_auto,t_article_cover_xl/auto-mapping-folder/sites/3/2022/07/DALL-E-2.jpg',
  ]

  return (
    <>
      <Box px={6} py={8}>
        <Flex justifyContent="center" flexDirection="column" alignItems="center">
          <Box alignItems="center" px={6} py={8} justifyContent="center">
            <Heading as="h1" size="xl" textAlign="center" justifyContent="center" mx="auto">
              Welcome to Ultimate Fighting Metaverse
            </Heading>
            <Text textAlign="center" my={4}>
              Welcome to the world of web3 fighting, where the only limit is your imagination (and the capabilities of OpenAI&apos;s DALL-E, but
              let&apos;s not get bogged down in technicalities). Are you tired of playing as the same old generic fighters in your favorite fighting
              games? Well, look no further because we&apos;ve got the solution for you! Our web3 dApp allows you to mint your very own unique fighter
              with the help of DALL-E&apos;s AI generated images.
            </Text>

            <Box alignItems="center" px={6} py={8} justifyContent="center">
              <Image src={images[0]} alt="Mint your fighter" width="100%" textAlign="center" margin="0 auto" />
            </Box>

            <Text textAlign="center" my={4}>
              Ready to create your own personal powerhouse? Head on over to our mint page and select the external characteristics of your desired
              fighter. Don&apos;t worry, we&apos;ll take care of the rest. DALL-E will generate four images for you to choose from, and voila!
              You&apos;ve got yourself a one-of-a-kind NFT fighter with random stats and rarity. So what are you waiting for? Go mint your own
              champion and show the world who&apos;s boss.
            </Text>

            <Box alignItems="center" px={6} py={8} justifyContent="center">
              <Image src={images[1]} alt="Mint your fighter" width="100%" textAlign="center" margin="0 auto" />
            </Box>

            <Text textAlign="center" my={4}>
              But what&apos;s the point of having your own personal fighter if you can&apos;t show off your skills in the ring? Head over to our fight
              page and choose one of your minted fighters to join one of our arenas. The more you play, the more your fighter&apos;s stats will
              increase. So go ahead, put your fighter to the test and dominate the competition.
            </Text>
            <Flex alignItems="center" px={6} py={8} justifyContent="space-between" flexDir="row">
              <Image src={images[2]} alt="Dall-E" width="40%" textAlign="center" />
              <Image src={images[3]} alt="Dall-E" width="50%" textAlign="center" />
            </Flex>
            <Text textAlign="center" my={4}>
              But let&apos;s not forget about the technologies that make all of this possible. We&apos;re talking about OpenAI&apos;s DALL-E, Ethereum
              Solidity, Nextjs, Web3, and the Metaverse. With these cutting-edge technologies, we&apos;re able to bring you a truly unique and
              immersive web3 fighting experience. So thank you, technology, for making our wildest dreams a reality.
            </Text>
            <Text textAlign="center" my={4}>
              In conclusion, our web3 dApp fighting game is the perfect blend of AI-generated uniqueness and competitive gameplay. So go mint your own
              fighter, put them to the test, and show the world who&apos;s boss. With the help of OpenAI, Ethereum, and the Metaverse, the
              possibilities are endless. See you in the ring!
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  )
}
