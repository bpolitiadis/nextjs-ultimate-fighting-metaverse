import React from 'react'
import { Divider, Flex, Link, Text, Image, Box } from '@chakra-ui/react'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { LinkComponent } from './LinkComponent'
import { SITE_DESCRIPTION, SOCIAL_GITHUB, SOCIAL_TWITTER } from 'utils/config'

interface Props {
  className?: string
}

export function Footer(props: Props) {
  const className = props.className ?? ''

  return (
    <Flex as="footer" className={className} flexDirection="column" justifyContent="center" alignItems="center" my={8}>
      <Text>{SITE_DESCRIPTION}</Text>

      <Flex color="gray.500" gap={2} alignItems="center" mt={2}>
        <LinkComponent href={`https://github.com/${SOCIAL_GITHUB}`}>
          <FaGithub />
        </LinkComponent>
        <LinkComponent href={`https://twitter.com/${SOCIAL_TWITTER}`}>
          <FaTwitter />
        </LinkComponent>
      </Flex>

      <Text fontSize="sm" mt={4} textAlign="center">
        To use the application, add Mumbai Testnet to Metamask and get some test MATIC from the faucet.
      </Text>

      <Box display="flex" alignItems="center" mt={4}>
        <Link href="https://chainlist.org/chain/80001" target="_blank" rel="noopener noreferrer">
          <Text fontSize="sm">Add Mumbai Network</Text>
        </Link>
        <Box w="1px" h="12px" bg="gray.400" mx={4} />
        <Link href="https://mumbaifaucet.com/" target="_blank" rel="noopener noreferrer">
          <Text fontSize="sm">Mumbai Faucet</Text>
        </Link>
      </Box>
    </Flex>
  )
}
