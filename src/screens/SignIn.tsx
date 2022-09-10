import { useNavigation } from '@react-navigation/native';
import { Heading, VStack, useTheme, Icon, HStack, Text, Button, CheckIcon, Select } from 'native-base';
import { Key, User } from 'phosphor-react-native';
import React, { useCallback, useState } from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import Logo from "../assets/logo-primary.svg"
import { Controller, useForm } from "react-hook-form"

import { useAuth } from '../hooks/auth';

import { ButtonPrimary } from '../components/ButtonPrimary';
import { InputForm } from '../components/InputForm';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Nav = {
  navigate: (value: string) => void;
}

export function SignIn() {

  const {
    control,
    handleSubmit
  } = useForm()
  
  //signIn
  const { signIn } = useAuth();
  const handleSignIn = useCallback(async(data:any) => {
    await AsyncStorage.setItem('role', data.signChoice)
    console.log(data.signChoice)
    setIsLoading(true)
    await signIn({
      cpf: data.cpf,
      password: data.password
    })
    
  }, [signIn])

  const { colors } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation<Nav>()


  
  function handleSignUp() {
    navigation.navigate('register')

  }

  return(
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <VStack alignItems="center" bg="white" w="100%" h="100%" px={4} pt={24}>
          <Logo />
          <Heading color={colors.text[800]} fontSize="xl" mt={20} mb={6} >
            Acesse sua conta
          </Heading>
              <InputForm
                name="cpf"
                control={control}
                placeholder="CPF"
                mb={4}
                InputLeftElement={ <Icon as={<User color={colors.gray[300]}/>} ml={4}/>}
              />
              <InputForm
                name="password"
                control={control}
                placeholder="Senha"
                mb={4}
                InputLeftElement={ <Icon as={<Key color={colors.gray[300]}/>} ml={4}/>}
                secureTextEntry
              />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                  accessibilityLabel="Escolha"
                  placeholder="Logar como:"
                  placeholderTextColor={colors.text[600]}
                  selectedValue={value}
                  defaultValue=""
                  w="100%"
                  mb={6}
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
                defaultValue="Logar como:"
              />

              <ButtonPrimary
                title="Entrar"
                w="full"
                onPress={handleSubmit(handleSignIn)}
                isLoading={isLoading}
              />

            <HStack mt={4} alignItems="center">
              <Text fontSize="md">Novo usuário?</Text>
              <Button variant="ghost" size="lg" _text={{ fontWeight: 700, fontSize: 18}} onPress={handleSignUp}>
                Cadastre-se
              </Button>
            </HStack>
        </VStack>
      </TouchableWithoutFeedback>
    </>
  )
}
