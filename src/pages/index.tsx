import { Flex, Box, Image, Heading, Text, Button, Grid, useColorModeValue, Divider } from '@chakra-ui/react'
import { content } from '../../constants/dictionary'
import React from 'react'
import Link from 'next/link'

export default function Home() {
  const images = {
    fightersH: './images/fightersH.jpg',
    fightersV: './images/fightersV.jpg',
    // arenaCollageH: './images/arenaCollage1.jpg',
    // arenaCollageV: './images/arenaV-white.jpg',
    arenasH: './images/arenasH.jpg',
    arenasV: './images/arenasV.jpg',
    solidityLogo: './images/solidity-logo.png',
    nextjsLogo: './images/nextjs-logo.svg',
    openaiLogo: './images/openai-logo.png',
    dalleLogo: './images/dalle-logo.webp',
  }

  // const bgImage = useColorModeValue(images.fightersH_white, images.fightersH_black)
  const bgTextColor = useColorModeValue('white', 'white')

  return (
    <>
      {/* <Heading as="h1" size={['xl', '2xl']} textAlign="center" my={8}>
        {content.home_title}
      </Heading> */}
      <Box px={6} py={[8, 32]} bgImage={[images.fightersV, images.fightersH]} bgSize="cover" bgPosition="center" borderRadius="lg">
        <Flex flexDirection={['column', 'row']} justifyContent="space-between" alignItems={['center', 'flex-start']}>
          <Box flex="1" alignItems={['center', 'flex-start']} py={8} textAlign={['center', 'left']} mb={[8, 0]}>
            <Heading as="h1" size={['xl', '2xl']} textAlign={['center', 'left']} mx={['auto', 0]} mb={8} color={bgTextColor}>
              {content.home_mint_title}
            </Heading>
            <Text textAlign={['center', 'left']} my={4} fontSize={['lg', 'xl']} maxWidth={['100%', '70%']} color={bgTextColor}>
              {content.home_description}
            </Text>
            <Link href="/mint">
              <Button as="a" colorScheme="red" size={['md', 'lg']} mt={8} mb={[8, 0]} mx={['auto', 0]}>
                {content.home_cta}
              </Button>
            </Link>
          </Box>
          <Box flex="1" alignItems={['center', 'flex-end']} px={6} py={8}>
            <Grid templateColumns={['1fr', '1fr 1fr']} gap={[8, 12]} p={8} border="2px solid" borderColor="gray.200" borderRadius="xl">
              <Box>
                <Image src={images.arenasV} alt="arena-collage-1" maxWidth="100%" display={['none', 'block']} />
                <Image src={images.arenasH} alt="arena-collage-1-mobile" maxWidth="100%" display={['block', 'none']} />
              </Box>
              <Box>
                <Heading as="h2" size={['md', 'lg']} mb={4} color={bgTextColor}>
                  {content.home_second_box_title}
                </Heading>
                <Text textAlign="left" my={4} fontSize="md" color={bgTextColor}>
                  {content.home_second_box_description}
                </Text>
                <Link href="/fight">
                  <Button as="a" colorScheme="teal" size="lg" mt={8}>
                    {content.home_second_box_cta}
                  </Button>
                </Link>
              </Box>
            </Grid>
          </Box>
        </Flex>
      </Box>

      <Divider my={8} opacity={0} />

      <Box px={6} py={[8, 32]}>
        <Box textAlign="center" mb={8}>
          <Heading as="h3" size="md" mb={4}>
            {content.home_third_box_title}
          </Heading>
          <Text fontSize="md">{content.home_third_box_description}</Text>
        </Box>
        <Grid templateColumns={['repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(4, 1fr)']} gap={8}>
          <Box>
            <Image src={images.solidityLogo} alt="solidity-logo" maxWidth={['100%', '80%']} mb={4} />
          </Box>
          <Box>
            <Image src={images.nextjsLogo} alt="nextjs-logo" maxWidth={['100%', '80%']} mb={4} />
          </Box>
          <Box>
            <Image src={images.openaiLogo} alt="openai-logo" maxWidth={['100%', '80%']} mb={4} />
          </Box>
          <Box>
            <Image src={images.dalleLogo} alt="dalle-logo" maxWidth={['100%', '80%']} mb={4} />
          </Box>
        </Grid>
      </Box>
    </>
  )
}
