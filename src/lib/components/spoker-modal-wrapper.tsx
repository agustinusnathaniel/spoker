'use client';

import type { DialogContentProps, DialogRootProps } from '@chakra-ui/react';
import { CloseButton, Dialog, Portal } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { createContext, use } from 'react';

import { contraGridStyle } from '~/lib/components/style';

// ============================================================================
// Context for sharing modal state between compound components
// ============================================================================

interface ModalContextValue {
  onOpenChange: DialogRootProps['onOpenChange'];
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
  const context = use(ModalContext);
  if (!context) {
    throw new Error(
      'Modal compound components must be used within Modal.Provider'
    );
  }
  return context;
}

// ============================================================================
// Modal Root Component
// ============================================================================

interface ModalProviderProps {
  children: ReactNode;
  onOpenChange: DialogRootProps['onOpenChange'];
  open: boolean;
  size?: DialogRootProps['size'];
}

function ModalProvider({
  children,
  open,
  onOpenChange,
  size = 'lg',
}: ModalProviderProps) {
  return (
    <ModalContext value={{ onOpenChange }}>
      <Dialog.Root
        onOpenChange={onOpenChange}
        open={open}
        placement="center"
        size={size}
      >
        {children}
      </Dialog.Root>
    </ModalContext>
  );
}

// ============================================================================
// Modal Content Components
// ============================================================================

interface ModalContentProps {
  children: ReactNode;
  contentWrapperProps?: DialogContentProps;
}

function ModalContent({ children, contentWrapperProps }: ModalContentProps) {
  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          {...contraGridStyle}
          backgroundColor={{ _dark: 'gray.500' }}
          marginX="6"
          {...contentWrapperProps}
        >
          {children}
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
}

interface ModalHeaderProps {
  children: ReactNode;
}

function ModalHeader({ children }: ModalHeaderProps) {
  return (
    <Dialog.Header>
      <Dialog.Title fontSize={{ base: '2xl', lg: '3xl' }} fontWeight="bold">
        {children}
      </Dialog.Title>
    </Dialog.Header>
  );
}

interface ModalBodyProps {
  children: ReactNode;
}

function ModalBody({ children }: ModalBodyProps) {
  return <Dialog.Body>{children}</Dialog.Body>;
}

interface ModalFooterProps {
  children: ReactNode;
}

function ModalFooter({ children }: ModalFooterProps) {
  return <Dialog.Footer gap={2}>{children}</Dialog.Footer>;
}

function ModalCloseTrigger() {
  useModalContext(); // Ensure we're inside the provider
  return (
    <Dialog.CloseTrigger asChild>
      <CloseButton />
    </Dialog.CloseTrigger>
  );
}

// ============================================================================
// Compound Component Export
// ============================================================================

/**
 * Modal compound component for flexible composition.
 *
 * @example
 * ```tsx
 * <Modal.Provider open={isOpen} onOpenChange={setIsOpen}>
 *   <Modal.Content>
 *     <Modal.Header>Modal Title</Modal.Header>
 *     <Modal.Body>Modal content goes here</Modal.Body>
 *     <Modal.Footer>
 *       <Button>Cancel</Button>
 *       <Button>Save</Button>
 *     </Modal.Footer>
 *     <Modal.CloseTrigger />
 *   </Modal.Content>
 * </Modal.Provider>
 * ```
 */
export const Modal = {
  Provider: ModalProvider,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  CloseTrigger: ModalCloseTrigger,
};
