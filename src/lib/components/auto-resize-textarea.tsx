import type {
  FormControlProps,
  FormErrorMessageProps,
  FormHelperTextProps,
  TextareaProps,
} from '@chakra-ui/react';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  forwardRef,
  Textarea,
} from '@chakra-ui/react';
import ResizeTextarea from 'react-textarea-autosize';

type AutoResizeTextareaProps = {
  errorText?: FormErrorMessageProps['children'];
  helperText?: FormHelperTextProps['children'];
} & TextareaProps &
  Pick<FormControlProps, 'label' | 'isInvalid'>;

const contraStyle: Partial<TextareaProps> = {
  borderColor: 'black',
  borderRadius: 12,
  borderWidth: 2,
  size: 'lg',
};

export const AutoResizeTextarea = forwardRef(
  (
    {
      isInvalid,
      label,
      errorText,
      helperText,
      ...props
    }: AutoResizeTextareaProps,
    ref,
  ) => {
    return (
      <FormControl isInvalid={isInvalid}>
        {label && <FormLabel>{label}</FormLabel>}

        <Textarea
          minH="unset"
          overflow="hidden"
          w="100%"
          resize="none"
          ref={ref}
          minRows={1}
          as={ResizeTextarea}
          {...contraStyle}
          {...props}
        />

        {errorText && <FormErrorMessage>{errorText}</FormErrorMessage>}
        {helperText && (
          <FormHelperText color="red.400">{helperText}</FormHelperText>
        )}
      </FormControl>
    );
  },
);
