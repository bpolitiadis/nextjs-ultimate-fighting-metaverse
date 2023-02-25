import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Container,
  Flex,
  Heading,
  Spacer,
  Stack,
  StackDivider,
  Text,
  Image,
  Divider,
  Link,
  Button,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Badge,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { FighterCardProps, Rarities, RarityColors } from 'components/fight/FighterCard'

export const FighterModal = ({
  fighter,
  fighterStats,
  fighterImageBase64,
  owner,
  isOpen,
  onClose,
}: {
  fighter: number
  fighterStats: FighterCardProps
  fighterImageBase64: string
  owner: string
  isOpen: boolean
  onClose: any
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent textAlign="center">
        <ModalHeader fontFamily="fantasy" fontStyle="oblique">
          Fighter #{fighter}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Stack>
              <Image
                border="4px"
                borderColor={fighterStats.rarity ? RarityColors[fighterStats.rarity] : 'gray.400'}
                borderRadius="md"
                src={`data:image/png;base64,${fighterImageBase64}`}
                alt={`Fighter #${fighter}`}
                objectFit="cover"
              />
              <Badge colorScheme={RarityColors[fighterStats.rarity]}>{Rarities[fighterStats.rarity]}</Badge>
              <Divider />
              <Box>
                <Text>Strength: {fighterStats.strength}</Text>
                <Text>Stamina: {fighterStats.stamina}</Text>
                <Text>Technique: {fighterStats.technique}</Text>
              </Box>
              <Divider m="8px" />
            </Stack>
            <Text marginTop="8px">Victories: {fighterStats.victories}</Text>
            <Divider m="16px" />
            <Text textAlign="center" justifyContent="center">
              Owner:{' '}
              <Link
                flexWrap="wrap"
                fontWeight="light"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://mumbai.polygonscan.com/address/${owner}`}>
                View on Explorer <ExternalLinkIcon />
              </Link>
            </Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
