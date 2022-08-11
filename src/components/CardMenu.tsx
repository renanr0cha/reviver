import { VStack, Box, Icon, useTheme, Heading, Text, HStack  } from 'native-base';
import { IconProps } from 'phosphor-react-native';
import React from 'react';
import { ButtonSmall } from './ButtonSmall';

type Props = {
  title: string,
  subtitle: string,
  buttonTitle: string,
  icon: React.ElementType<IconProps>,
  secondButton: string
}

export function CardMenu({ title, subtitle, buttonTitle, icon: Icon, secondButton,...rest}: Props) {
  const { colors } = useTheme()
  return (
    <VStack>
      <HStack
        p={4}
        margin={8}
        rounded="lg"
        borderWidth={1}
        borderColor="coolGray.200"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box backgroundColor={colors.primary[500]} p={2} mr={4}rounded={50} justifyItems="flex-start">
            <Icon size={38} color={colors.white} />
        </Box>
        <VStack
          flex={1}
          justifyContent="flex-end"
          borderWidth={1}
          borderColor="red"
          alignItems="center"
        >
          <Heading fontSize="lg" alignSelf="flex-start">{title}</Heading>
          <Text alignSelf="flex-start">{subtitle}</Text>
          <ButtonSmall title={buttonTitle} h={12} mt={6} p={4} alignSelf="flex-end"/>

        </VStack>
        
      </HStack>
    </VStack>
  );
}