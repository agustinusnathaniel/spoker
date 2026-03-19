import type { UseRadioProps } from '@chakra-ui/react';
import { Box, useRadio } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

type SpokerRadioBoxProps = PropsWithChildren<UseRadioProps>;

export const SpokerRadioBox = ({ children, ...props }: SpokerRadioBoxProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const radio = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...radio}
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
        borderRadius="xl"
        borderWidth="1px"
        boxShadow="md"
        cursor="pointer"
        px={5}
        py={3}
      >
        {children}
      </Box>
    </Box>
  );
};
