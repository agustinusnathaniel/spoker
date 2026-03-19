'use client';

import { Button, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { BiDonateHeart } from 'react-icons/bi';

import { SpokerModalWrapper } from '~/lib/components/spoker-modal-wrapper';

import { SupportContent } from './support-content';

interface SupportCTAProps {
  isCompact?: boolean;
}

export const SupportCTA = ({ isCompact = false }: SupportCTAProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <Button colorPalette="gray" onClick={onOpen} paddingX={2} size="md">
        <HStack gap={2}>
          <BiDonateHeart />
          {!isCompact && <Text fontSize="sm">Support</Text>}
        </HStack>
      </Button>

      <SpokerModalWrapper
        body={<SupportContent />}
        header="Support spoker"
        onOpenChange={({ open }) => {
          if (!open) {
            onClose();
          }
        }}
        open={isOpen}
        size="lg"
      />
    </>
  );
};
