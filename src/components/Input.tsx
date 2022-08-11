import { Input as NativeBaseInput, IInputProps, useTheme } from 'native-base';

export function Input({ ...rest}: IInputProps) {
  const { colors } = useTheme()
  return (
    <NativeBaseInput
      bg={colors.primary[100]}
      h={14}
      size="md"
      borderWidth={0}
      fontSize="md"
      fontFamily="body"
      color="white"
      placeholderTextColor={colors.text[400]}
      _focus={{
        borderWidth: 1,
        borderColor: colors.primary[500],
        bg: colors.primary[200]
      }}
      { ...rest}
    />
  );
}