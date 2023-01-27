import { Heading, Text, Button, MenuItem, FormControl, Select, Image, Container, Spacer, Box } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import React, { useEffect, useRef, useState } from 'react'
import { Configuration, ImagesResponseDataInner, OpenAIApi } from 'openai'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { ethers } from 'ethers'
import abi from '../../../constants/abi.json'
import css from '../../styles/mint.module.css'
import { Address, readContract } from '@wagmi/core'
import { useDebounce } from 'usehooks-ts'
import CreateFighter from 'components/mint/CreateFighter'
import MintFighter from 'components/mint/MintFighter'

export default function Mint() {
  const { address: user, isConnecting, isDisconnected, isConnected } = useAccount()

  const [imagesBinaryData, setImagesBinaryData] = useState<ImagesResponseDataInner[]>([])

  return (
    <>
      <Head />
      <Box>
        <Heading as="h3" textAlign="center" fontFamily="fantasy">
          Mint Page
        </Heading>
        {isConnected && (
          <>
            <Container className={css.root}>
              <Container className={css.container}>
                <CreateFighter setImagesBinaryData={setImagesBinaryData} />
                <Spacer m="16px" />
                <MintFighter imagesBinaryData={imagesBinaryData} />
                <br />
              </Container>
            </Container>
          </>
        )}
        {!isConnected && (
          <>
            <Text m="32px" fontStyle="oblique" textAlign="center">
              Please connect your wallet to continue.
            </Text>
          </>
        )}
      </Box>
    </>
  )
}
