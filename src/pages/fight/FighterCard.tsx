import React, { useEffect, useRef, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import abi from '../../../constants/abi.json'
import css from '../../styles/fight.module.css'

export const FighterCard = ({ fighter, user }: { fighter: any; user: any }) => {
  const [fighterStats, setFighterStats] = useState<{ strength: number; stamina: number; technique: number; rarity: number; victories: number }>({
    strength: 0,
    stamina: 0,
    technique: 0,
    rarity: 0,
    victories: 0,
  })

  const { data, isError, isLoading } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'getFighterStats',
    args: [fighter],
  })

  useEffect(() => {
    if (data) {
      const fighterStatsArray = data
        .toString()
        .split(',')
        .map((num) => parseInt(num))
      const [strength, stamina, technique, rarity, victories] = fighterStatsArray
      setFighterStats({ strength, stamina, technique, rarity, victories })
    }
  }, [data])

  return (
    <div className={css.fighter}>
      {/* <div className={css.fighterImage}>
        <img src={fighter.image} alt={fighter.name} />
      </div> */}
      <div>{JSON.stringify(fighterStats)}</div>
      <div className={css.fighterInfo}>
        <p>Strength: {fighterStats.strength}</p>
        <p>Stamina: {fighterStats.stamina}</p>
        <p>Technique: {fighterStats.technique}</p>
        <p>Victories: {fighterStats.victories}</p>
      </div>
    </div>
  )
}
