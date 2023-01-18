import { Heading, Text, Button, Image, Grid, Flex, SimpleGrid, Spacer, Box, Container, Center } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import React, { useEffect, useRef, useState } from 'react'
import { Address, useAccount, useContractRead, usePrepareContractWrite } from 'wagmi'
import abi from '../../../constants/abi.json'
import css from '../../styles/fight.module.css'
import { FighterCard } from '../../components/fight/FighterCard'
import { ArenaCard, ArenaCardProps } from '../../components/fight/ArenaCard'

export default function Fight() {
  const { address: user, isConnecting, isDisconnected, isConnected } = useAccount()

  const [myFighterIds, setMyFighterIds] = useState<Array<number>>([])
  const [arenas, setArenas] = useState<Array<ArenaCardProps>>([])
  const [selectedFighterId, setSelectedFighterId] = useState<number>(0)
  const [numColumns, setNumColumns] = useState(4)

  const {
    data: fighterData,
    isError: fighterError,
    isLoading: fighterLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getTokensOwnedByAddress',
    args: [user],
  })

  const {
    data: arenaData,
    isError: arenaError,
    isLoading: arenaLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getAllArenas',
    args: [],
  })

  useEffect(() => {
    if (fighterData) {
      const fighterIds = fighterData
        .toString()
        .split(',')
        .map((num) => parseInt(num))
      setMyFighterIds(fighterIds)
    }
  }, [fighterData])

  useEffect(() => {
    if ((arenaData as Array<ArenaCardProps>) && (arenaData as Array<ArenaCardProps>).length > 0) {
      //make a new array object of ArenaCardProps
      const arenaArray = new Array<ArenaCardProps>()
      //loop through the arenaData array
      for (let i = 0; i < (arenaData as Array<ArenaCardProps>).length; i++) {
        //create a new ArenaCardProps object
        const arena = {
          matchId: Number((arenaData as Array<ArenaCardProps>)[i].matchId),
          tokenId1: Number((arenaData as Array<ArenaCardProps>)[i].tokenId1),
          tokenId2: Number((arenaData as Array<ArenaCardProps>)[i].tokenId2),
          winnerId: Number((arenaData as Array<ArenaCardProps>)[i].winnerId),
        }
        //push the object into the array
        arenaArray.push(arena)
      }
      //set the state of the arenas array
      setArenas(arenaArray)
    }
  }, [arenaData])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setNumColumns(2)
      } else {
        setNumColumns(4)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <Head />
      <main className={css.root}>
        {/* <Heading as="h2">Fight Page</Heading>
        <Text>
          Welcome to the Ultimate Fighting Metaverse fight page! This is where you'll be able to use your one-of-a-kind NFT to access and battle in
          our virtual reality game. Select your fighter and get ready to prove your worth in the ring. Are you ready to take on all challengers? Let's
          do this!
        </Text> */}
        <div className={css.container}>
          <Heading as="h3" fontFamily="fantasy">
            My Fighters
          </Heading>
          <Text>Hi {user} !</Text>
          {/* <Text>
              Congratulations! You own {myFighterIds.length} Ultimate Fighters: {myFighterIds.toString()}
            </Text> */}
          <Text>Here are the fighters you own. Select one to fight!</Text>
          {myFighterIds.length === 0 ? (
            <Text textAlign="center">You don&apos;t own any fighters yet. Go to the Mint page to mint one!</Text>
          ) : (
            <SimpleGrid minChildWidth="120px" spacing="16px" gridTemplateColumns={`repeat(${numColumns}, 1fr)`}>
              {myFighterIds.map((id) => (
                <FighterCard key={id} fighter={id} isSelected={id === selectedFighterId} onClick={() => setSelectedFighterId(id)} />
              ))}
            </SimpleGrid>
          )}
          <Spacer />
          <Spacer />
          <Heading as="h3" fontFamily="fantasy">
            Arenas
          </Heading>
          <Text>Here are the arenas you can fight in.</Text>
          {/* <Text>All arena data : {JSON.stringify(arenas)}</Text> */}
          <SimpleGrid columns={4} spacing={5}>
            {arenas.map((arena, index) => (
              <Box p={4} key={index}>
                <ArenaCard key={index} arenaId={index + 1} arena={arenas[index]} selectedFighter={selectedFighterId} />
              </Box>
            ))}
          </SimpleGrid>
        </div>
      </main>
    </>
  )
}
