import React, { useState } from 'react'
import {
  Flex,
  useColorModeValue,
  Spacer,
  Heading,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { SITE_NAME } from 'utils/config'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { ConnectKitButton } from 'connectkit'
import { HamburgerIcon } from '@chakra-ui/icons'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const className = props.className ?? ''
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex
      as="header"
      className={className}
      bg={useColorModeValue('gray.100', 'gray.900')}
      px={4}
      py={2}
      mb={8}
      alignItems="center"
      // maxWidth="1200px" // Add a maxWidth property to limit the width of the header
      mx="auto" // Center the header on larger screens
    >
      <LinkComponent href="/">
        <Heading as="h1" size={['sm', 'md']}>
          {SITE_NAME}
        </Heading>
      </LinkComponent>

      <Spacer />

      <Flex alignItems="center" gap={4}>
        <HStack display={{ base: 'none', md: 'flex' }} spacing="4">
          {/* Only show the navigation links on screens larger than md */}
          <LinkComponent href="/">Home</LinkComponent>
          <LinkComponent href="/mint">Mint</LinkComponent>
          <LinkComponent href="/fight">Fight</LinkComponent>
          <LinkComponent href="/rankings">Rankings</LinkComponent>
          <LinkComponent href="/about">About</LinkComponent>
        </HStack>

        <IconButton aria-label="Open menu" icon={<HamburgerIcon />} display={{ base: 'flex', md: 'none' }} onClick={onOpen} />

        <ConnectKitButton />

        <ThemeSwitcher />
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <VStack alignItems="center" mt="8">
              {/* Show the navigation links in a vertical stack on smaller screens */}
              <LinkComponent href="/" onClick={onClose}>
                Home
              </LinkComponent>
              <LinkComponent href="/mint" onClick={onClose}>
                Mint
              </LinkComponent>
              <LinkComponent href="/fight" onClick={onClose}>
                Fight
              </LinkComponent>
              <LinkComponent href="/rankings" onClick={onClose}>
                Rankings
              </LinkComponent>
              <LinkComponent href="/about" onClick={onClose}>
                About
              </LinkComponent>
            </VStack>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Flex>
  )
}
