import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import type { ReactNode, RefObject } from 'react';

export interface TooltipProps extends ChakraTooltip.RootProps {
  content: ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement | null>;
  showArrow?: boolean;
}

export function Tooltip({
  showArrow,
  children,
  disabled,
  portalled = true,
  content,
  contentProps,
  portalRef,
  ...rest
}: TooltipProps) {
  if (disabled) {
    return children;
  }

  return (
    <ChakraTooltip.Root {...rest}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal container={portalRef} disabled={!portalled}>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content {...contentProps}>
            {showArrow && (
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
            )}
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  );
}
