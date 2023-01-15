import React, { useEffect, useRef, useState } from 'react'
import { Heading, Text, Button, MenuItem, FormControl, Select, Image } from '@chakra-ui/react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import abi from '../../../constants/abi.json'
import css from '../../styles/mint.module.css'
import { NFTStorage, File, Blob } from 'nft.storage'
import { Address, readContract } from '@wagmi/core'

export default function MintFighter() {
  return <div></div>
}
