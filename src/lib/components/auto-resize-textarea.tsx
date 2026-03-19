'use client';

import type { TextareaProps } from '@chakra-ui/react';
import { Field, Textarea } from '@chakra-ui/react';
import type { Ref } from 'react';
import ResizeTextarea from 'react-textarea-autosize';

type AutoResizeTextareaProps = {
  errorText?: string;
  helperText?: string;
  label?: string;
  invalid?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
  minRows?: number;
} & Omit<TextareaProps, 'rows'>;

const contraStyle: Partial<TextareaProps> = {
  borderColor: 'black',
  borderRadius: 12,
  borderWidth: 2,
  size: 'lg',
};

export const AutoResizeTextarea = ({
  invalid,
  label,
  errorText,
  helperText,
  ref,
  minRows,
  ...props
}: AutoResizeTextareaProps) => {
  return (
    <Field.Root invalid={invalid}>
      {label && <Field.Label>{label}</Field.Label>}
      <Textarea
        as={ResizeTextarea}
        minH="unset"
        overflow="hidden"
        ref={ref}
        resize="none"
        w="100%"
        {...contraStyle}
        {...props}
      />
      {errorText && <Field.ErrorText>{errorText}</Field.ErrorText>}
      {helperText && (
        <Field.HelperText color="red.400">{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
};
