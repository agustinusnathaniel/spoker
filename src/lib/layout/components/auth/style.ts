import type { ModalContentProps } from '@chakra-ui/react';

export const contraBoxStyle = (
  borderColor: string
): Partial<ModalContentProps> => ({
  paddingY: 2,
  borderRadius: 16,
  border: `2px solid ${borderColor}`,
  boxShadow: `0px 6px 0px ${borderColor}`,
  marginX: { base: 2, sm: 8 },
});
