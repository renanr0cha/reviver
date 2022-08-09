import { Button as ButtonNativeBase, IButtonProps, Heading } from 'native-base';

type Props = IButtonProps & {
  title: string
}

export function Button({ title, ...rest }: Props) {
  return (
    <ButtonNativeBase
      bg={"green.700"}
      h={14}
      rounded="xl"
      _pressed={{ bg: "green.500"}}
      {...rest}
    >
      <Heading color="white" fontSize="xl">{title}</Heading>
    </ButtonNativeBase>
  );
}