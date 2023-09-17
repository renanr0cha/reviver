import { Button as ButtonNativeBase, Heading, IButtonProps, useTheme } from 'native-base';
import { THEME } from '../styles/theme';

type Props = IButtonProps & {
  title: string
}

export function ButtonSmall({ title, ...rest }: Props) {
  const { colors } = useTheme()
  return (
    <ButtonNativeBase
      bg={THEME.color.primary}
      h={12}
      rounded="full"
      _pressed={{ bg: THEME.color.primary_800}}
      shadow={2}
      {...rest}
    >
      <Heading color="white" fontSize="sm" allowFontScaling={false} textTransform="uppercase">{title}</Heading>
    </ButtonNativeBase>
  );
}