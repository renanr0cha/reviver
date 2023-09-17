import { Box, HStack, Heading, Text, VStack, useTheme } from 'native-base';
import { IconProps } from 'phosphor-react-native';
import React, { ReactNode } from 'react';
import { THEME } from '../styles/theme';


type Props = {
  title: string,
  subtitle: string,
  icon: React.ElementType<IconProps>,
  children: ReactNode
}

export function CardMenu({ title, subtitle, icon: Icon, children,...rest}: Props) {
  const { colors } = useTheme()
  return (
    <VStack {...rest}>
      <HStack
        p={4}
        marginX={4}
        marginTop={4}
        rounded="lg"
        borderWidth={1}
        borderColor="coolGray.300"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box backgroundColor={THEME.color.primary} p={2} mr={4}rounded={50} justifyItems="flex-start">
            <Icon size={36} color={colors.white} />
        </Box>
        <VStack
          flex={1}
          justifyContent="flex-end"
        >
          <Heading fontSize="lg" alignSelf="flex-start" allowFontScaling={false} mb={2}>{title}</Heading>
          <Text alignSelf="flex-start" fontSize="md" allowFontScaling={false}>{subtitle}</Text>
          {children}
        </VStack>
        
      </HStack>
    </VStack>
  );
}