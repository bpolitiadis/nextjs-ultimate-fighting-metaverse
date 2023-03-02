import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Badge,
  Box,
  Divider,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Image,
} from '@chakra-ui/react'
import { FighterCardProps, Rarities, RarityColors } from 'components/fight/FighterCard'
import React, { useState } from 'react'

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
  const [showOwnerInfo, setShowOwnerInfo] = useState(false)

  const toggleOwnerInfo = () => {
    setShowOwnerInfo(!showOwnerInfo)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent textAlign="center">
        <ModalHeader fontFamily="fantasy" fontStyle="oblique">
          Fighter #{fighter}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" position="relative">
          <Box flex="1">
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
            {/* <Divider m="16px" /> */}
          </Box>
          <Box
            bg="white"
            position="absolute"
            top="0"
            right="0"
            bottom="0"
            width={showOwnerInfo ? '100%' : '0'}
            transition="width 0.3s ease-in-out"
            overflow="hidden">
            <Box py="2" px="4" textAlign="left">
              <Text fontWeight="semibold" mb="2">
                Owner:
              </Text>
              <Link
                fontWeight="light"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://mumbai.polygonscan.com/address/${owner}`}
                _hover={{ textDecoration: 'underline' }}>
                {owner}
              </Link>
            </Box>
          </Box>
        </ModalBody>
        {/* <Box py="2" display="flex" justifyContent="flex-end" position="absolute" bottom="0" right="0" width="100%">
          <IconButton aria-label="Show Owner Info" icon={<ChevronRightIcon />} variant="ghost" size="sm" onClick={toggleOwnerInfo} />
        </Box> */}
      </ModalContent>
    </Modal>
  )
}
