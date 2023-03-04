import React from 'react'
import { Text, Image, Flex, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Spinner } from '@chakra-ui/react'
import { messages } from '../../../constants/dictionary'
import { ArenaCardProps } from './ArenaCard'

export const FightModal = ({
  isOpen,
  onClose,
  arena,
  selectedFighter,
  isLoading,
  isSuccess,
  isError,
}: {
  isOpen: boolean
  onClose: any
  arena: ArenaCardProps
  selectedFighter: number
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered blockScrollOnMount={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          {isLoading && (
            <>
              <Text textAlign="center">Joining the arena...</Text>
            </>
          )}
          {isSuccess && (
            <>
              <Text textAlign="center">Joined the arena!</Text>
            </>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && (
            <>
              <Flex flexDir="column" justifyContent="center" alignItems="center">
                <Spinner />
                <Text verticalAlign="center" m="16px" fontStyle="oblique">
                  Joining arena...
                </Text>
              </Flex>
            </>
          )}
          {isSuccess && (
            <>
              {arena.tokenId2 == 0 && (
                <>
                  <Text verticalAlign="center" m="16px" fontStyle="oblique" justifyContent="center">
                    Waiting for another fighter to join...
                  </Text>
                </>
              )}
              {arena.tokenId2 != 0 && (
                <>
                  {arena.winnerId == selectedFighter && (
                    <>
                      <Flex flexDir="column" justifyContent="center" alignItems="center">
                        <Image src={'./svg/gold-cup.svg'} alt="Victory" width="15%" height="15%" />
                        <Text fontWeight="bold" fontSize="2xl" textAlign="center">
                          You won!
                        </Text>
                        <Text fontSize="md" fontStyle="oblique" textAlign="center">
                          {messages.winningMessages[Math.floor(Math.random() * messages.winningMessages.length)]}
                        </Text>
                      </Flex>
                    </>
                  )}
                  {arena.winnerId != selectedFighter && (
                    <>
                      <Flex flexDir="column" justifyContent="center" alignItems="center">
                        <Image src={'./svg/sad-face.svg'} alt="Victory" width="15%" height="15%" />
                        <Text fontWeight="bold" fontSize="2xl" textAlign="center">
                          You lost!
                        </Text>
                        <Text fontSize="md" fontStyle="oblique" textAlign="center">
                          {messages.losingMessages[Math.floor(Math.random() * messages.losingMessages.length)]}
                        </Text>
                      </Flex>
                    </>
                  )}
                </>
              )}
            </>
          )}
          {isError && (
            <>
              <Text textAlign="center">Something went wrong</Text>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
