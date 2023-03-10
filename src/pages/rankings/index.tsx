import { Box, Button, Container, Divider, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import React, { useEffect, useRef, useState } from 'react'
import { Address, useAccount, useContractRead, usePrepareContractWrite } from 'wagmi'
import abi from '../../../constants/abi.json'
import css from '../../styles/rankings.module.css'
import { FighterCard } from '../../components/fight/FighterCard'
import { RankingItem } from 'components/rankings/RankingItem'

export default function Rankings() {
  const { address: user, isConnecting, isDisconnected, isConnected } = useAccount()

  // state to store the fighterIds that belong to the user
  const [myFighterIds, setMyFighterIds] = useState<Array<number>>([])
  // state to store the current page number
  const [currentPage, setCurrentPage] = useState(1)
  // state to store the number of entries per page
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  // state to store the current entries to be displayed on the page
  const [currentEntries, setCurrentEntries] = useState<Array<number>>([])

  // useContractRead hook to fetch the last token id from the contract
  // also means the total number of fighters minted
  const {
    data: numFightersData,
    isError: numFightersError,
    isLoading: numFightersLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getLastTokenId',
    args: [],
  })

  // useEffect hook to fetch the user's fighterIds
  useEffect(() => {
    if (numFightersData && !numFightersLoading && !numFightersError) {
      // make an array of numbers from 1 to the last token id
      const fighterIds = Array.from(Array(Number(numFightersData)).keys()).map((id) => id + 1)

      setMyFighterIds(fighterIds)
    }
  }, [isConnected, numFightersData, numFightersError, numFightersLoading])

  // useEffect hook to paginate the entries
  useEffect(() => {
    // calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * entriesPerPage
    const endIndex = startIndex + entriesPerPage
    // set the current entries to be displayed on the page
    setCurrentEntries(myFighterIds.slice(startIndex, endIndex))
  }, [currentPage, entriesPerPage, myFighterIds])

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1)
  }

  return (
    <>
      <Head />
      <Heading as="h2" m={{ base: '24px', md: '32px' }}>
        Rankings Page
      </Heading>
      {/* <Text>Welcome to the Ultimate Fighting Metaverse! Rankings Page</Text> */}
      <Divider m="4px" />
      <Grid templateColumns="repeat(6, 1fr)" gap={4} m="4px">
        <GridItem w="100%" textAlign="center">
          <Text fontWeight="bold">Token Id</Text>
        </GridItem>
        <GridItem w="100%" textAlign="center">
          <Text fontWeight="bold">Avatar</Text>
        </GridItem>
        <GridItem w="100%" textAlign="center">
          <Text fontWeight="bold">Victories</Text>
        </GridItem>
        <GridItem w="100%" textAlign="center">
          <Text fontWeight="bold">Stats</Text>
        </GridItem>
        <GridItem w="100%" textAlign="center">
          <Text fontWeight="bold">Owner</Text>
        </GridItem>
        <GridItem w="100%" textAlign="center">
          <Text fontWeight="bold">Details</Text>
        </GridItem>
      </Grid>
      <Divider m="4px" />
      <Box width="100%" mx="auto" p={{ base: 2, md: 4 }}>
        {/* map through the current entries and display a RankingItem for each */}
        {currentEntries.map((fighterId) => (
          <RankingItem key={fighterId} fighter={fighterId} />
        ))}
      </Box>
      <Flex justifyContent="center" flexDirection={{ base: 'column', md: 'row' }}>
        <Button onClick={handlePreviousPage} disabled={currentPage === 1} m={{ base: '8px 0', md: '0 8px' }} width={{ base: '100%', md: 'auto' }}>
          Previous Page
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(myFighterIds.length / entriesPerPage)}
          m={{ base: '8px 0', md: '0 8px' }}
          width={{ base: '100%', md: 'auto' }}>
          Next Page
        </Button>
      </Flex>
    </>
  )
}
