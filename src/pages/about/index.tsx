import { Box, Flex, Heading, Text, Image } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { content } from '../../../constants/dictionary'

export default function About() {
  return (
    <>
      <Head />
      <Box>
        <Heading as="h2" textAlign="center" mb={8}>
          {content.about_title}
        </Heading>
        <Box mx="auto" maxW="100%" p={6}>
          <Flex align="center" mb={8} flexWrap={['wrap', 'wrap', 'nowrap']}>
            <Image
              src={'./images/ancient-greek-2.jpg'}
              alt=""
              rounded="lg"
              mr={[0, 0, 4]}
              mb={[4, 4, 0]}
              width={['100%', '100%', '25%']}
              height={['auto', 'auto', '25%']}
            />
            <Text fontSize={['lg', 'lg', 'xl']} mb={4}>
              {content.about_text1}
            </Text>
          </Flex>
          <Text fontSize={['lg', 'lg', 'xl']} mb={4}>
            {content.about_text2}
          </Text>
          <Flex align="center" mb={8} flexWrap={['wrap', 'wrap', 'nowrap']}>
            <Image
              src={'./images/developer2.jpg'}
              alt=""
              rounded="lg"
              mr={[0, 0, 4]}
              mb={[4, 4, 0]}
              width={['100%', '100%', '25%']}
              height={['auto', 'auto', '25%']}
            />
            <Text fontSize={['lg', 'lg', 'xl']} mb={4}>
              {content.about_text3}
            </Text>
          </Flex>
          <Text fontSize={['lg', 'lg', 'xl']} mb={4}>
            {content.about_text4}
          </Text>
          <Flex align="center" mb={8} flexWrap={['wrap', 'wrap', 'nowrap']}>
            <Image
              src={'./images/ai3.jpg'}
              alt=""
              rounded="lg"
              mr={[0, 0, 4]}
              mb={[4, 4, 0]}
              width={['100%', '100%', '25%']}
              height={['auto', 'auto', '25%']}
            />
            <Text fontSize={['lg', 'lg', 'xl']} mb={4}>
              {content.about_text5}
            </Text>
          </Flex>
          <Text fontSize={['lg', 'lg', 'xl']} mb={4}>
            {content.about_text6}
          </Text>
        </Box>
      </Box>
    </>
  )
}
