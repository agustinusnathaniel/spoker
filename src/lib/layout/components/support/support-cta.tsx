'use client';

import type { ButtonProps } from '@chakra-ui/react';
import { Button, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { BiDonateHeart } from 'react-icons/bi';

import { Modal } from '~/lib/components/spoker-modal-wrapper';

import { SupportContent } from './support-content';

interface SupportButtonBaseProps extends ButtonProps {
  children: React.ReactNode;
}

function SupportButtonBase({ children, ...props }: SupportButtonBaseProps) {
  return (
    <Button colorPalette="gray" paddingX={2} size="md" {...props}>
      {children}
    </Button>
  );
}

function SupportIcon() {
  return <BiDonateHeart />;
}

function SupportLabel() {
  return <Text fontSize="sm">Support</Text>;
}

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SupportModal({ isOpen, onClose }: SupportModalProps) {
  return (
    <Modal.Provider
      onOpenChange={({ open }) => {
        if (!open) {
          onClose();
        }
      }}
      open={isOpen}
      size="lg"
    >
      <Modal.Content>
        <Modal.Header>Support spoker</Modal.Header>
        <Modal.Body>
          <SupportContent />
        </Modal.Body>
        <Modal.CloseTrigger />
      </Modal.Content>
    </Modal.Provider>
  );
}

// ============================================================================
// Support CTA Components
// ============================================================================

/**
 * Full support button with icon and label
 */
export function SupportCTA() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <SupportButtonBase onClick={onOpen}>
        <HStack gap={2}>
          <SupportIcon />
          <SupportLabel />
        </HStack>
      </SupportButtonBase>

      <SupportModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

/**
 * Compact support button - icon only
 */
export function SupportCTACompact() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <SupportButtonBase onClick={onOpen}>
        <SupportIcon />
      </SupportButtonBase>

      <SupportModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
