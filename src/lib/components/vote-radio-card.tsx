'use client';

import { RadioGroup } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface VoteRadioCardProps {
  children: ReactNode;
  value: string;
}

export const VoteRadioCard = ({ children, value }: VoteRadioCardProps) => {
  return (
    <RadioGroup.Item key={value} value={value}>
      <RadioGroup.ItemHiddenInput />
      <RadioGroup.ItemControl
        _checked={{
          bg: 'teal.500',
          color: 'white',
          borderColor: 'black',
          borderWidth: 2,
          fontWeight: 'bold',
          boxShadow: 'none',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        alignItems="center"
        borderRadius="xl"
        borderWidth="1px"
        boxShadow="md"
        color="bg.inverted"
        cursor="pointer"
        display="inline-flex"
        fontSize="lg"
        justifyContent="center"
        px="8"
        py="6"
        w="full"
      >
        <RadioGroup.ItemText>{children}</RadioGroup.ItemText>
      </RadioGroup.ItemControl>
    </RadioGroup.Item>
  );
};
