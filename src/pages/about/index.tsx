import { Box, Flex, Heading, Text, Image } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'

export default function About() {
  return (
    <>
      <Head />
      <Box>
        <Heading as="h2" textAlign="center" mb={8}>
          About Ultimate Fighting Metaverse
        </Heading>
        <Box mx="auto" maxW="100%" p={6}>
          <Flex align="center" mb={8}>
            <Image src={'./images/ancient-greek-2.jpg'} alt="" rounded="lg" mr={4} width="25%" height="25%" />
            <Text fontSize="xl" mb={4}>
              Once upon a time, in the ancient land of Athens, Greece, there lived a man named Bill. Bill was a man of simple pleasures - he enjoyed a
              cold beer on a hot day, a good book on a rainy one, and the occasional video game to pass the time. But one day, Bill grew tired of the
              same old routine. He found himself feeling unfulfilled, like there was something missing in his life. And so, he began to explore the
              world of Web3 development.
            </Text>
          </Flex>
          <Text fontSize="xl" mb={4}>
            At first, Bill was a bit intimidated. He had never been one for coding or programming, but he was determined to learn. He dove headfirst
            into the world of Solidity and EVM smart contracts, mastering the ins and outs of Hardhat and NextJS. He was particularly fond of the
            wagmi library and chakra-ui, which made building frontend applications a breeze.
          </Text>
          <Flex align="center" mb={8}>
            <Image src={'./images/developer2.jpg'} alt="" rounded="lg" mr={4} width="25%" height="25%" />
            <Text fontSize="xl" mb={4}>
              As Bill learned more and more about Web3, he found himself becoming more and more obsessed. He spent hours upon hours tinkering with
              code and experimenting with new technologies. And before long, he had created something truly special - a portfolio dApp called Ultimate
              Fighting Metaverse.
            </Text>
          </Flex>
          <Text fontSize="xl" mb={4}>
            The Ultimate Fighting Metaverse was a place where users could create and customize their own fighter avatars, using DALL-E to generate
            unique images. These avatars could then be minted into NFTs on the Polygon Network and used to battle in virtual arenas. As users fought
            and won battles, their NFTs would gain new abilities and stats, becoming more powerful with each victory.
          </Text>
          <Flex align="center" mb={8}>
            <Image src={'./images/ai3.jpg'} alt="" rounded="lg" mr={4} width="25%" height="25%" />
            <Text fontSize="xl" mb={4}>
              And so, Bill&apos;s boredom was cured. He had found a new passion, and had created something truly unique and special. But as he looked
              back on his journey, he couldn&apos;t help but think of one final irony. For all his hard work, all his hours of coding and tinkering,
              it was none other than the magnificent OpenAI and DALL-E that had truly inspired him to greatness.
            </Text>
          </Flex>
          <Text fontSize="xl" mb={4}>
            But let&apos;s be real, it&apos;s not like Bill had anything better to do. He was just too lazy to write his own about page, so he had to
            resort to using a language model like me, ChatGPT, to do it for him. I mean, come on Bill, you&apos;re in ancient Greece, you could be out
            fighting mythological monsters or something. But no, you had to go and make a dApp. Priorities, am I right?
          </Text>
        </Box>
      </Box>
    </>
  )
}
