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
      <Text fontSize={{ base: 'sm', md: 'md' }} textAlign="center">
        {SITE_DESCRIPTION}
      </Text>

      <Flex color="gray.500" gap={2} alignItems="center" mt={2}>
        <LinkComponent href={`https://github.com/${SOCIAL_GITHUB}`}>
          <FaGithub />
        </LinkComponent>
        <LinkComponent href={`https://twitter.com/${SOCIAL_TWITTER}`}>
          <FaTwitter />
        </LinkComponent>
      </Flex>

      <Text fontSize={{ base: 'sm', md: 'md' }} mt={{ base: 2, md: 4 }} textAlign="center">
        To use the application, add Mumbai Testnet to Metamask and get some test MATIC from the faucet.
      </Text>

      <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} alignItems={{ base: 'center', md: 'flex-start' }} mt={{ base: 2, md: 4 }}>
        <Link href="https://chainlist.org/chain/80001" target="_blank" rel="noopener noreferrer" mr={{ base: 0, md: 4 }} mb={{ base: 2, md: 0 }}>
          <Text fontSize={{ base: 'sm', md: 'md' }}>Add Mumbai Network</Text>
        </Link>
        <Divider orientation="vertical" w="1px" h={{ base: '12px', md: 'auto' }} bg="gray.400" mx={4} />
        <Link href="https://mumbaifaucet.com/" target="_blank" rel="noopener noreferrer" ml={{ base: 0, md: 4 }}>
          <Text fontSize={{ base: 'sm', md: 'md' }}>Mumbai Faucet</Text>
        </Link>
      </Box>
    </Flex>
  )
}
