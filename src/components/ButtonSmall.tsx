import { Button as ButtonNativeBase, IButtonProps, Heading, useTheme } from 'native-base';

type Props = IButtonProps & {
  title: string
}

export function ButtonSmall({ title, ...rest }: Props) {
  const { colors } = useTheme()
  return (
    <ButtonNativeBase
      bg={colors.primary[700]}
      h={12}
      rounded="full"
      _pressed={{ bg: colors.primary[900]}}
      {...rest}
    >
      <Heading color="white" fontSize="sm" textTransform="uppercase">{title}</Heading>
    </ButtonNativeBase>
  );
}