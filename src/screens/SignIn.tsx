import { useNavigation } from '@react-navigation/native';
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  HStack,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Select,
  Text,
  VStack,
  useTheme
} from 'native-base';
import { Eye, EyeSlash, Key, User } from 'phosphor-react-native';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { useAuth } from '../hooks/auth';

import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import * as Yup from "yup";
import { ButtonPrimary } from '../components/ButtonPrimary';
import { InputForm } from '../components/InputForm';
import { THEME } from '../styles/theme';

type Nav = {
  navigate: (value: string) => void;
}

const schema = Yup.object().shape({
  cpf: Yup.string().required('É preciso informar o cpf'),
  password: Yup.string().required('É preciso informar a senha'),
  signChoice: Yup.string().required('É preciso selecionar como quer logar')
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
      <ScrollView bg={colors.white}>
        <VStack alignItems="flex-start" bg="white" w="100%" h="100%" px={4} pt={24}>
          <Box alignSelf="center">
            <Image
              style={{ width: 280, height: 180 }}
              source={require('../assets/logo-reviver.png')}
            />

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
                  minH={46}
                  defaultValue=""
                  w="100%"
                  mt={3}
                  onValueChange={(itemValue: string) => {
                    onChange(itemValue);
                  }}
                  _selectedItem={{
                    bg: THEME.color.primary_200,
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
              <Button variant="ghost" size="lg" _text={{ fontWeight: 700, fontSize: 18, color: THEME.color.primary}}
              _focus={{ bg: THEME.color.primary_200}}
              _pressed={{ bg: THEME.color.primary_200 }}
              onPress={handleSignUp}>
                Cadastre-se
              </Button>
            </HStack>
        </VStack>
      </ScrollView>
    </>
  )
}
