'use client';

import type { InputProps } from '@chakra-ui/react';
import { Field, Input } from '@chakra-ui/react';
import type { Ref } from 'react';

type SpokerInputProps = {
  errorText?: string;
  helperText?: string;
  label?: string;
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
} & InputProps;

const contraInputStyle: Partial<InputProps> = {
  borderColor: 'black',
  borderRadius: 12,
  borderWidth: 2,
  size: 'lg',
};

export const SpokerInput = ({
  label,
  invalid,
  errorText,
  helperText,
  ref,
  ...inputProps
}: SpokerInputProps) => {
  return (
    <Field.Root invalid={invalid}>
      {label && <Field.Label>{label}</Field.Label>}
      <Input ref={ref} {...contraInputStyle} {...inputProps} />
      {errorText && <Field.ErrorText>{errorText}</Field.ErrorText>}
      {helperText && (
        <Field.HelperText color="red.400">{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
};
