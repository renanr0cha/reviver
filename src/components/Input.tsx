import { Input as NativeBaseInput, IInputProps, useTheme } from 'native-base';

export function Input({ ...rest}: IInputProps) {
  const { colors } = useTheme()
  return (
    <NativeBaseInput
      minH={14}
      size="md"
      borderWidth={1}
      borderColor="coolGray.300"
      fontSize="md"
      fontFamily="body"
      color={colors.text[600]}
      placeholderTextColor={colors.text[400]}
      _focus={{
        borderWidth: 2,
        borderColor: colors.primary[500],
        bg: colors.primary[100]
      }}
      { ...rest}
    />
  );
}