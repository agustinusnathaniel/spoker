import type {
  FormControlProps,
  FormErrorMessageProps,
  FormHelperTextProps,
  InputProps,
} from '@chakra-ui/react';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  forwardRef,
  Input,
} from '@chakra-ui/react';

type SpokerInputProps = {
  errorText?: FormErrorMessageProps['children'];
  helperText?: FormHelperTextProps['children'];
  formControlWidth?: FormControlProps['width'];
} & Pick<FormControlProps, 'label' | 'isInvalid'> &
  InputProps;

const contraInputStyle: Partial<InputProps> = {
  borderColor: 'black',
  borderRadius: 12,
  borderWidth: 2,
  size: 'lg',
};

export const SpokerInput = forwardRef(
  (
    {
      label,
      formControlWidth,
      isInvalid,
      errorText,
      helperText,
      ...inputProps
    }: SpokerInputProps,
    ref,
  ) => {
    return (
      <FormControl isInvalid={isInvalid} width={formControlWidth}>
        {label && <FormLabel>{label}</FormLabel>}

        <Input ref={ref} {...contraInputStyle} {...inputProps} />

        {errorText && <FormErrorMessage>{errorText}</FormErrorMessage>}
        {helperText && (
          <FormHelperText color="red.400">{helperText}</FormHelperText>
        )}
      </FormControl>
    );
  },
);
