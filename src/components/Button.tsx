import { Button as ButtonNativeBase, IButtonProps, Heading, useTheme } from 'native-base';

type Props = IButtonProps & {
  title: string
}

export function Button({ title, ...rest }: Props) {
  const { colors } = useTheme()
  return (
    <ButtonNativeBase
      bg={colors.primary[700]}
      minH={12}
      p={4}
      rounded="full"
      _pressed={{ bg: colors.primary[900]}}
      {...rest}
    >
      <Heading color="white" fontSize="xl">{title}</Heading>
    </ButtonNativeBase>
  );
}