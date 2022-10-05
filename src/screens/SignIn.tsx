import { useNavigation } from '@react-navigation/native';
import { Heading, VStack, useTheme, Icon, HStack, Text, Button, CheckIcon, Select, FormControl, Pressable, Box } from 'native-base';
import { Eye, EyeSlash, Key, User } from 'phosphor-react-native';
import React, { useCallback, useState } from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import Logo from "../assets/logo-primary.svg"
import { Controller, useForm } from "react-hook-form"
import { Alert } from "react-native"
import { useAuth } from '../hooks/auth';

import { ButtonPrimary } from '../components/ButtonPrimary';
import { InputForm } from '../components/InputForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup"

type Nav = {
  navigate: (value: string) => void;
}

const schema = Yup.object().shape({
  cpf: Yup.string().required('É necessesário informar o cpf'),
  password: Yup.string().required('É necessesário informar a senha'),
  signChoice: Yup.string().required('É necessesário selecionar como quer logar')
})

export function SignIn() {

  const [showConfirm, setShowConfirm] = React.useState(false);

  const {
    control,
    handleSubmit, formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })
  
  //signIn
  const { signIn } = useAuth();
  const handleSignIn = useCallback(async(data:any) => {
    await AsyncStorage.setItem('role', data.signChoice)
    setIsLoading(true)
    await signIn({
      cpf: data.cpf,
      password: data.password
    })

    setIsLoading(false)
    
  }, [signIn])

  const { colors } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation<Nav>()


  
  function handleSignUp() {
    navigation.navigate('register')

  }

  return(
    <>
        <VStack alignItems="flex-start" bg="white" w="100%" h="100%" px={4} pt={24}>
          <Box alignSelf="center">
            <Logo />

          </Box>
          <Heading color={colors.text[800]} alignSelf="center" fontSize="xl" mt={20} mb={6} >
            Acesse sua conta
          </Heading>
              <InputForm
                textAlign="left"
                name="cpf"
                control={control}
                keyboardType="numeric"
                mb={1}
                placeholder="CPF"
                InputLeftElement={ <Icon as={<User color={colors.text[400]}/>} ml={4}/>}
                error={errors.cpf && errors.cpf.message}
              />
              <InputForm
                name="password"
                control={control}
                placeholder="Senha"
                mt={2}
                mb={1}
                type={showConfirm ? "text" : "password"}
                InputLeftElement={ <Icon as={<Key color={colors.text[400]}/>} ml={4}/>}
                error={errors.password && errors.password.message}
                InputRightElement={
                  <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                    <Icon as={showConfirm ? <Eye size={26} color={colors.text[400]}/> : <EyeSlash size={26} color={colors.text[400]}/>} size={5} mr="4" />
                  </Pressable>}
              />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                  accessibilityLabel="Escolha"
                  placeholder="Selecione como quer logar:"
                  placeholderTextColor={colors.text[600]}
                  selectedValue={value}
                  defaultValue=""
                  w="100%"
                  mt={3}
                  onValueChange={(itemValue: string) => {
                    onChange(itemValue);
                  }}
                  _selectedItem={{
                    bg: "primary.200",
                    endIcon: <CheckIcon size="5" />
                  }} size="md" fontSize="md">
                    <Select.Item label="Paciente" value="paciente" />
                    <Select.Item label="Cuidador" value="cuidador" />
                  </Select>
                )}
                name="signChoice"
                rules={{ required: 'Field is required' }}
                defaultValue=""
              />
              <FormControl.Label fontWeight="bold" fontSize={12}  mb={6} color={colors.red[400]}>{errors.signChoice && errors.signChoice.message}</FormControl.Label>


              <ButtonPrimary
                title="Entrar"
                w="full"
                onPress={handleSubmit(handleSignIn)}
                isLoading={isLoading}
              />

            <HStack mt={4} alignItems="center" alignSelf="center">
              <Text fontSize="md">Novo usuário?</Text>
              <Button variant="ghost" size="lg" _text={{ fontWeight: 700, fontSize: 18}} onPress={handleSignUp}>
                Cadastre-se
              </Button>
            </HStack>
        </VStack>
    </>
  )
}
