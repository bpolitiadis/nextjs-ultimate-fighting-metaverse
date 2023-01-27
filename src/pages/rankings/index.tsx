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
      <Heading as="h2">Rankings Page</Heading>
      {/* <Text>Welcome to the Ultimate Fighting Metaverse! Rankings Page</Text> */}
      <Divider m="4px" />
      <Grid templateColumns="repeat(6, 1fr)" gap={4} m="4px">
        <GridItem w="100%" textAlign="center">
          <Text fontWeight="bold">Token Id</Text>
        </GridItem>
        <GridItem w="100%" textAlign="center">
          Avatar
        </GridItem>
        <GridItem w="100%" textAlign="center">
          Victories
        </GridItem>
        <GridItem w="100%" textAlign="center">
          Stats
        </GridItem>
        <GridItem w="100%" textAlign="center">
          Owner
        </GridItem>
        <GridItem w="100%" textAlign="center">
          Details
        </GridItem>
      </Grid>
      <Divider m="4px" />
      <Box width="100%" mx="auto" p={4}>
        {/* map through the current entries and display a RankingItem for each */}
        {currentEntries.map((fighterId) => (
          <RankingItem key={fighterId} fighter={fighterId} />
        ))}
      </Box>
      <Box display="flex" justifyContent="center">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous Page
        </Button>
        <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(myFighterIds.length / entriesPerPage)}>
          Next Page
        </Button>
      </Box>
    </>
  )
}
