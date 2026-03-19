'use client';

import type { DialogContentProps, DialogRootProps } from '@chakra-ui/react';
import { CloseButton, Dialog, Portal } from '@chakra-ui/react';
import type * as React from 'react';

import { contraGridStyle } from '~/lib/components/style';

type SpokerModalWrapperProps = Pick<
  DialogRootProps,
  'open' | 'onOpenChange' | 'size'
> & {
  header?: React.ReactNode;
  withCloseButton?: boolean;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  contentWrapperProps?: DialogContentProps;
};

export const SpokerModalWrapper = ({
  open,
  size = 'lg',
  header,
  withCloseButton = true,
  body,
  footer,
  contentWrapperProps,
  onOpenChange,
}: SpokerModalWrapperProps) => {
  return (
    <Dialog.Root
      onOpenChange={onOpenChange}
      open={open}
      placement="center"
      size={size}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            {...contraGridStyle}
            marginX="6"
            {...contentWrapperProps}
          >
            {header && (
              <Dialog.Header>
                <Dialog.Title
                  fontSize={{ base: '2xl', lg: '3xl' }}
                  fontWeight="bold"
                >
                  {header}
                </Dialog.Title>
              </Dialog.Header>
            )}

            {body && <Dialog.Body>{body}</Dialog.Body>}

            {footer && <Dialog.Footer gap={2}>{footer}</Dialog.Footer>}

            {withCloseButton && (
              <Dialog.CloseTrigger asChild>
                <CloseButton />
              </Dialog.CloseTrigger>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
