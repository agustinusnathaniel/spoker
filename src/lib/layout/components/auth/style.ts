import type { DialogContentProps } from '@chakra-ui/react';

export const contraBoxStyle = (
  borderColor: string
): Partial<DialogContentProps> => ({
  border: `2px solid ${borderColor}`,
  borderRadius: 16,
  boxShadow: `0px 6px 0px ${borderColor}`,
  marginX: { base: 2, sm: 8 },
  paddingY: 2,
});
