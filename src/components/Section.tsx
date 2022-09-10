import { Heading, VStack, Divider, StyledProps } from 'native-base';
import { ReactNode } from 'react';

type Props = StyledProps & {
  children: ReactNode,
  title: string,
  position?: string
}

export function Section({children, title, position,...rest}: Props) {
  return (
    <VStack
      w="full"
      px={4}
      {...rest}
    >
      <Heading textAlign="left" >{title}</Heading>
      {children}
      
    </VStack>
  );
}