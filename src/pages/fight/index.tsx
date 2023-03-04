import { Heading, Text, Button, Image, Grid, Flex, SimpleGrid, Spacer, Box, Container, Center, Link } from '@chakra-ui/react'
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

  //Handle setArenas for one specific arena index
  const handleSetArena = (index: number, arena: ArenaCardProps) => {
    const newArenas = arenas
    newArenas[index] = arena
    setArenas(newArenas)
  }

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
      console.log('arenas : ', arenaArray)
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
      <Box className={css.root}>
        <Box className={css.container}>
          <Heading as="h3" fontFamily="fantasy">
            My Fighters
          </Heading>
          {isConnected && (
            <>
              <Text>Hello {user} !</Text>
              {myFighterIds.length === 0 ? (
                <Text textAlign="center">You don&apos;t own any fighters yet. Go to the Mint page to mint one!</Text>
              ) : (
                <>
                  <Text>Congratulations! You own {myFighterIds.length} Ultimate Fighters!</Text>
                  <Text>Here are the fighters you own. Select one to fight!</Text>
                  <SimpleGrid
                    minChildWidth={{ sm: '90px', md: '120px' }}
                    spacing={{ sm: '8px', md: '16px' }}
                    gridTemplateColumns={`repeat(${numColumns}, 1fr)`}>
                    {myFighterIds.map((id) => (
                      <FighterCard key={id} fighter={id} isSelected={id === selectedFighterId} onClick={() => setSelectedFighterId(id)} />
                    ))}
                  </SimpleGrid>
                </>
              )}
            </>
          )}
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

          <Spacer m="8px" />
          <Heading as="h3" fontFamily="fantasy">
            Arenas
          </Heading>
          {isConnected && (
            <>
              <Text>Here are the arenas you can fight in.</Text>
              <SimpleGrid columns={{ sm: 2, md: 4 }} spacing={{ sm: '4px', md: '0' }}>
                {arenas.map((arena, index) => (
                  <Box p={{ sm: '2', md: '4' }} key={index}>
                    <ArenaCard
                      key={index}
                      arenaNo={index + 1}
                      arena={arenas[index]}
                      selectedFighter={selectedFighterId}
                      handleSetArena={handleSetArena}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </>
          )}
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
      </Box>
    </>
  )
}
