import { Input as NativeBaseInput, IInputProps, useTheme, Text } from 'native-base';
import { TextInputProps } from 'react-native';
import React from 'react';
import { Controller } from 'react-hook-form';
import { THEME } from '../styles/theme';


interface InputProps extends TextInputProps {
  name: string;
  control: any,
  error?: any
}

export type FieldValues = Record<string, any>;


export function InputForm({ name, control, error,...rest}: IInputProps & InputProps) {
  


  const { colors } = useTheme()
  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, value}}) => (
          <NativeBaseInput
            onChangeText={(val) => onChange(val)}
            value={value}
            minH={46}
            size="md"
            borderWidth={1}
            borderColor="coolGray.300"
            fontSize="md"
            fontFamily="body"
            color={colors.text[600]}
            placeholderTextColor={colors.text[400]}
            _focus={{
              borderWidth: 1,
              borderColor: THEME.color.primary,
              bg: THEME.color.primary_200
            }}
            { ...rest}
          />
        )}
        name={name}
        />
        {error && <Text fontSize={12} mb={2} textAlign="left" fontWeight="bold" color={colors.red[400]}>{error}</Text>}
    </>
  );
}