import {
  Button,
  HStack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { BiDonateHeart } from 'react-icons/bi';

import { SpokerModalWrapper } from '~/lib/components/spoker-modal-wrapper';

import { SupportContent } from './support-content';

interface SupportCTAProps {
  isCompact?: boolean;
}

export const SupportCTA = ({ isCompact = false }: SupportCTAProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buttonSize = useBreakpointValue({
    base: 'md',
    sm: 'lg',
  });

  return (
    <>
      <Button
        colorScheme="gray"
        onClick={onOpen}
        paddingX={2}
        size={buttonSize}
      >
        <HStack fontSize="2xl" spacing={2}>
          <BiDonateHeart />
          {!isCompact && <Text fontSize="sm">Support</Text>}
        </HStack>
      </Button>

      <SpokerModalWrapper
        body={<SupportContent />}
        closeOnOverlayClick
        header="Support spoker"
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      />
    </>
  );
};
