import { Heading, Text, Box, Link, SimpleGrid } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import React, { useState } from 'react'
import { ImagesResponseDataInner, OpenAIApi } from 'openai'
import { useAccount } from 'wagmi'
import CreateFighter from 'components/mint/CreateFighter'
import MintFighter from 'components/mint/MintFighter'

/**
 * The Mint component is the main page for creating and minting unique fighters on the blockchain.
 * It uses the `CreateFighter` and `MintFighter` components to handle the creation and minting process, respectively.
 * It also utilizes the `useAccount` hook from `wagmi` to check the user's wallet connection status.
 */
export default function Mint() {
  // Get the user's address and connection status from the `wagmi` hook
  const { address: user, isConnecting, isDisconnected, isConnected } = useAccount()

  // State to hold the binary image data for the created fighter
  const [imagesBinaryData, setImagesBinaryData] = useState<ImagesResponseDataInner[]>([])

  return (
    <>
      <Head />
      <Box>
        <Heading as="h3" textAlign="center" fontFamily="fantasy">
          Mint Page
        </Heading>
        {/* Only show the creation and minting components if the user is connected to their wallet */}
        {isConnected && (
          <>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <CreateFighter setImagesBinaryData={setImagesBinaryData} />
              <MintFighter imagesBinaryData={imagesBinaryData} />
            </SimpleGrid>
          </>
        )}
        {/* Show a message if the user is not connected to their wallet */}
        {!isConnected && (
          <>
            <Text m="32px" fontStyle="oblique" textAlign="center">
              Connect your wallet to see your fighters!
              <Link href="https://chainlist.org/chain/80001" target="_blank" rel="noopener noreferrer">
                <Text fontSize="xs">Add Mumbai Testnet to Metamask</Text>
              </Link>
            </Text>
          </>
        )}
      </Box>
    </>
  )
}
