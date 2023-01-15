import styles from 'styles/Home.module.css'
import { Flex, Box, Image, Heading, Text, Link, Center } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { SITE_DESCRIPTION, SITE_NAME } from 'utils/config'

export default function Home() {
  const images = [
    'https://www.giantbomb.com/a/uploads/original/3/33745/2472077-tekken%20eddy.png',
    'https://articles-img.sftcdn.net/f_auto,t_article_cover_xl/auto-mapping-folder/sites/3/2022/07/DALL-E-2.jpg',
  ]

  return (
    <>
      <Box px={6} py={8}>
        <Flex mx="auto" align="center" justify="center">
          <Heading as="h1" size="xl" textAlign="center" justifyContent="center">
            Welcome to Ultimate Fighting Metaverse
          </Heading>
        </Flex>
        <Box mt={4}>
          <Text className="large-font" style={{ textAlign: 'center' }}>
            Where the ultimate fighters are born!
          </Text>
        </Box>

        <Flex mt={6} align="center">
          <Image src={images[0]} alt="fighter character" mr={6} w="80%" h="80%" />
          <Text className="large-font">
            Are you ready to create your own unstoppable warrior? With just a few clicks, you can customize your fighter&apos;s appearance and let our
            AI art wizard, DALL-e, bring your creation to life.
          </Text>
        </Flex>
        <Flex mt={6} align="center">
          <Text mr={6} className="large-font">
            But the fun doesn&apos;t stop there - your fighter &apos; s stats and rarity are determined by the roll of the dice, so to speak. Will you
            be the proud owner of a rare and powerful champion, or will you have to train and grind your way to the top?
          </Text>
          <Image src={images[1]} alt="DALL-e AI art wizard" w="60%" h="60%" />
        </Flex>
        <Box mt={6}>
          <Text className="large-font">
            Join the ranks of the Ultimate Fighting Metaverse and see if you have what it takes to become the ultimate champion. Mint your own
            Ultimate Fighter today and let the battles begin!
          </Text>
        </Box>
        <Box mt={6}>
          <Link href="/mint" className="create-fighter-link">
            Create your fighter
          </Link>
        </Box>
      </Box>
    </>
  )
}
