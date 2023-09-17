import { Button as ButtonNativeBase, Heading, IButtonProps, useTheme } from 'native-base';
import { THEME } from '../styles/theme';

type Props = IButtonProps & {
  title: string
}

export function ButtonPrimary({ title, ...rest }: Props) {
  const { colors } = useTheme()
  return (
    <ButtonNativeBase
      bg={THEME.color.primary}
      minH={12}
      p={4}
      rounded="full"
      _pressed={{ bg: THEME.color.primary_800}}
      shadow={2}
      {...rest}
    >
      <Heading color="white" allowFontScaling={false} fontSize="xl">{title}</Heading>
    </ButtonNativeBase>
  );
}