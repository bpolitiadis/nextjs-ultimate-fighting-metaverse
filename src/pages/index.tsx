import { Flex, Box, Image, Heading, Text, Button, Grid, useColorModeValue, Divider } from '@chakra-ui/react'
import { content } from '../../constants/dictionary'
import React from 'react'
import Link from 'next/link'

export default function Home() {
  const images = {
    fightersH: './images/fightersH.jpg',
    fightersV: './images/fightersV.jpg',
    arenasH: './images/arenasH.jpg',
    arenasV: './images/arenasV.jpg',
    solidityLogo: './images/solidity-logo.png',
    nextjsLogo: './images/nextjs-logo.svg',
    openaiLogo: './images/openai-logo.png',
    dalleLogo: './images/dalle-logo.webp',
  }

  const bgColor = 'rgba(30, 30, 40, 0.8)'

  return (
    <>
      {/* <Heading as="h1" size={['xl', '2xl']} textAlign="center" my={8}>
        {content.home_title}
      </Heading> */}
      {/* Home page hero section */}
      <Box px={6} py={[8, 32]} bgImage={[images.fightersV, images.fightersH]} bgSize="cover" bgPosition="center" borderRadius="lg" mx="auto">
        <Flex flexDirection={['column', 'row']} justifyContent="space-between" alignItems="center" bgColor={bgColor} borderRadius="2xl">
          {/* Create your own fighter Call to action */}
          <Box flex="1" py={8} textAlign="center" mb={[8, 0]}>
            <Heading as="h1" size={['xl', '2xl']} textAlign="center" mx="auto" mb={8} color="white" textShadow="1px 1px 2px black">
              {content.home_mint_title}
            </Heading>
            <Text
              textAlign="center"
              my={4}
              fontSize={['lg', 'xl']}
              maxWidth={['100%', '70%']}
              color="white"
              mx="auto"
              px={8}
              textShadow="1px 1px 2px black">
              {content.home_mint_description}
            </Text>
            <Link href="/mint">
              <Button
                as="a"
                colorScheme="teal"
                size={['md', 'lg']}
                mt={8}
                mb={[8, 0]}
                mx="auto"
                textTransform="uppercase"
                fontWeight="bold"
                letterSpacing="wide"
                _hover={{
                  background: 'teal.600',
                  boxShadow: '0 0 0 3px rgba(59, 130, 150, 0.6)',
                }}
                _active={{
                  background: 'teal.700',
                  boxShadow: 'inset 0 0 0 2px rgba(0, 0, 0, 0.2)',
                }}
                _focus={{
                  boxShadow: 'none',
                }}>
                {content.home_mint_cta}
              </Button>
            </Link>
          </Box>
          {/* Fight in the arenas Call to action */}
          <Box flex="1" alignItems="center" justifyContent="center" px={6} py={8}>
            <Grid templateColumns={['1fr', '1fr 1fr']} gap={[8, 12]} p={8} border="2px solid" borderColor="gray.200" borderRadius="xl">
              <Box alignItems="center" justifyContent="center" display="flex">
                <Image src={images.arenasV} alt="arenas-vertical" maxWidth="100%" display={['none', 'block']} />
                <Image src={images.arenasH} alt="arenas-horizontal" maxWidth="100%" display={['block', 'none']} />
              </Box>
              <Box textAlign="center">
                <Heading as="h2" size={['lg', 'xl']} mb={4} color="white" textShadow="1px 1px 2px black">
                  {content.home_fight_title}
                </Heading>
                <Text textAlign="center" my={4} fontSize={['md', 'lg']} color="white" textShadow="1px 1px 2px black">
                  {content.home_fight_description}
                </Text>
                <Link href="/fight">
                  <Button
                    as="a"
                    colorScheme="pink"
                    size={['md', 'lg']}
                    mt={8}
                    textTransform="uppercase"
                    fontWeight="bold"
                    letterSpacing="wide"
                    _hover={{
                      background: 'pink.600',
                      boxShadow: '0 0 0 3px rgba(221, 34, 139, 0.6)',
                    }}
                    _active={{
                      background: 'pink.700',
                      boxShadow: 'inset 0 0 0 2px rgba(0, 0, 0, 0.2)',
                    }}
                    _focus={{
                      boxShadow: 'none',
                    }}>
                    {content.home_fight_cta}
                  </Button>
                </Link>
              </Box>
            </Grid>
          </Box>
        </Flex>
      </Box>

      <Divider my={8} opacity={0} />

      {/* Technologies used */}
      <Box px={6} py={[8, 32]}>
        <Box textAlign="center" mb={16}>
          <Heading
            as="h2"
            size={['xl', '2xl']}
            textAlign="center"
            mx="auto"
            mb={8}
            color={useColorModeValue('black', 'white')}
            textShadow={useColorModeValue('1px 1px 2px rgba(0, 0, 0, 0.2)', '1px 1px 2px black')}>
            {content.home_technologies_title}
          </Heading>
          <Text
            textAlign="center"
            fontSize={['lg', 'xl']}
            color={useColorModeValue('black', 'white')}
            textShadow={useColorModeValue('1px 1px 2px rgba(0, 0, 0, 0.2)', '1px 1px 2px black')}>
            {content.home_technologies_description}
          </Text>
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
