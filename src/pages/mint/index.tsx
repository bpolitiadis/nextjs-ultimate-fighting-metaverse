import { Heading, Text, Button, Image, Spacer, Box, Link } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import React, { useEffect, useRef, useState } from 'react'
import { ImagesResponseDataInner, OpenAIApi } from 'openai'
import { useAccount } from 'wagmi'
import abi from '../../../constants/abi.json'
import css from '../../styles/mint.module.css'
import { Address, readContract } from '@wagmi/core'
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
            <Box className={css.root}>
              <Box className={css.container}>
                {/* Pass the `setImagesBinaryData` function as a prop to the `CreateFighter` component */}
                <CreateFighter setImagesBinaryData={setImagesBinaryData} />
                <Spacer m="16px" />
                {/* Pass the `imagesBinaryData` state as a prop to the `MintFighter` component */}
                <MintFighter imagesBinaryData={imagesBinaryData} />
              </Box>
            </Box>
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
