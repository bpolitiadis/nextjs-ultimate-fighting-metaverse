import { Heading, Text, Button, Image } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import React, { useEffect, useRef, useState } from 'react'
import { Address, useAccount, useContractRead, usePrepareContractWrite } from 'wagmi'
import abi from '../../../constants/abi.json'
import css from '../../styles/fight.module.css'
import { FighterCard } from './FighterCard'

export default function Fight() {
  const { address: user, isConnecting, isDisconnected, isConnected } = useAccount()

  const [myFighterIds, setMyFighterIds] = useState<Array<number>>([])

  const { data, isError, isLoading } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: abi,
    functionName: 'getTokensOwnedByAddress',
    args: [user],
  })

  useEffect(() => {
    if (data) {
      const fighterIds = data
        .toString()
        .split(',')
        .map((num) => parseInt(num))
      setMyFighterIds(fighterIds)
    }
  }, [data])

  return (
    <>
      <Head />
      <main>
        <Heading as="h2">Fight Page</Heading>
        <Text>
          Welcome to the Ultimate Fighting Metaverse fight page! This is where you'll be able to use your one-of-a-kind NFT to access and battle in
          our virtual reality game. Select your fighter and get ready to prove your worth in the ring. Are you ready to take on all challengers? Let's
          do this!
        </Text>
        <div className={css.root}>
          <div className={css.container}>
            <Heading as="h3">My Fighters</Heading>
            <Text>Hi {user} Here are the fighters you own. Select one to fight!</Text>
            <Text>
              Congratulations! You own {myFighterIds.length} Ultimate Fighters: {myFighterIds.toString()}
            </Text>
          </div>
          {/* TODO - CHECK CHAKRA-UI/CARD */}
          <div className={css.fighters}>
            {myFighterIds.map((fighterId) => (
              <FighterCard key={fighterId} fighter={fighterId} user={user} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
