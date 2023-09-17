import { Container, Icon, Text } from 'native-base';
import React from 'react';
import { TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
  title: string,
  type: "up" | "down"
}

export function CaregiverButton({
  title,
  ...rest
}:Props) {
  <Container {...rest}>
    <Icon />
    <Text allowFontScaling={false}>
      {title}
    </Text>
  </Container>
}