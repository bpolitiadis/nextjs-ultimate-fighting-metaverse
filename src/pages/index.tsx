import styles from 'styles/Home.module.css'
import { Flex, Box, Image, Heading, Text, Link, Center, Container, Stack } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { SITE_DESCRIPTION, SITE_NAME } from 'utils/config'
import { content } from '../../constants/dictionary'

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
          <Box alignItems="center" px={6} py={8} justifyContent="center" textAlign="center">
            <Heading as="h1" size={['lg', 'xl']} textAlign="center" justifyContent="center" mx="auto">
              {content.home_title}
            </Heading>
            <Text textAlign="center" my={4} fontSize={['mg', 'lg']}>
              {content.home_description1}
            </Text>

            <Box alignItems="center" px={6} py={8} justifyContent="center">
              <Image src={images[0]} alt="fighter-collage-1" maxWidth={['100%', '80%']} margin="0 auto" />
            </Box>

            <Text textAlign="center" my={4} fontSize={['md', 'lg']}>
              {content.home_description2}
            </Text>

            <Box alignItems="center" px={6} py={8} justifyContent="center">
              <Image src={images[1]} alt="arena-collage-1" maxWidth={['100%', '80%']} margin="0 auto" />
            </Box>

            <Text textAlign="center" my={4} fontSize={['md', 'lg']}>
              {content.home_description3}
            </Text>

            <Flex alignItems="center" px={6} py={8} justifyContent="space-around" flexDir={['column', 'row']}>
              <Image src={images[2]} alt="openai-logo" maxWidth={['100%', '40%']} textAlign="center" margin="0 auto" />
              <Image src={images[3]} alt="dalle-logo" maxWidth={['100%', '50%']} textAlign="center" margin="0 auto" />
            </Flex>

            <Stack spacing={4} px={6} py={8} maxWidth="800px" textAlign="center">
              <Text my={4} fontSize={['md', 'lg']}>
                {content.home_description4}
              </Text>
              <Text my={4} fontSize={['md', 'lg']}>
                {content.home_description5}
              </Text>
            </Stack>
          </Box>
        </Flex>
      </Box>
    </>
  )
}
