import { Input as NativeBaseInput, IInputProps, useTheme, Container, Text } from 'native-base';
import { TextInputProps, TextInput } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { Control, Controller, UseControllerProps } from 'react-hook-form';

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
            minH={14}
            size="md"
            borderWidth={1}
            borderColor="coolGray.300"
            fontSize="md"
            fontFamily="body"
            color={colors.text[600]}
            placeholderTextColor={colors.text[400]}
            _focus={{
              borderWidth: 1,
              borderColor: colors.primary[500],
              bg: colors.primary[100]
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