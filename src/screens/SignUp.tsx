import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Box, Button, CheckIcon, FormControl, HStack, Icon, Pressable, ScrollView, Select, VStack, useTheme, useToast } from 'native-base';
import { Eye, EyeSlash } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import MaskInput from 'react-native-mask-input';
import * as Yup from 'yup';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { Header } from '../components/Header';
import { InputForm } from '../components/InputForm';
import { Section } from '../components/Section';
import api from '../services/api';
import { THEME } from '../styles/theme';

interface SignUpFormData {
  name: string,
  cpf: string,
  email: string,
  birth_date: string,
  phone: string,
  sex: string,
  password: string,
  password_confirmation: string
}

//form validation
const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  cpf: Yup.string().required('Insira seu CPF').min(11, 'Insira todos os 11 digitos'),
  email: Yup.string().email('Favor inserir um endereço de email válido').required('Email é obrigatório'),
  phone: Yup.string().required('Insira seu contato').min(14, 'Insira o número do telefone completo').max(14, 'Insira o número do telefone completo'),
  sex: Yup.string().required('Selecione o sexo'),
  password: Yup.string().required('A senha é obrigatória'),
  password_confirmation: Yup.string().required('A confirmação da senha é obrigatória'),
})


export function SignUp() {

  const toast = useToast()

  function addNotifications() {
    toast.show({
      padding: 4,
      title: "Sua conta foi criada com sucesso! Agora basta inserir os dados para fazer login",
      placement: "bottom",
      duration: 5000,
      
    })
      
  }

  function setDateToStringDatabaseFormat(date:Date) {
    return `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  function setDateToStringLocalFormat(date:Date) {
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear())}`
  }

  
  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setBirthDate(currentDate);
    setBirthDateIsSelected(true)
  };

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: birthDate,
      onChange: onChangeDate,
      mode: currentMode,
      is24Hour: true,
      maximumDate : new Date()
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const [isCPFHighlighted, setCPFIsHighlighted] = useState(false)
  const [isPhoneHighlighted, setPhoneIsHighlighted] = useState(false)
  
  const [phone, setPhone ] = useState('')
  const [cpf, setCpf] = React.useState('');

  const [birthDate, setBirthDate] = useState(new Date())
  const [birthDateIsSelected, setBirthDateIsSelected] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation()


  //métodos do form
  const { control, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: yupResolver(schema)
  });

  //submit function do form
  const onSubmit: SubmitHandler<SignUpFormData>  = (data) => {
    setIsLoading(true)

    data.birth_date = setDateToStringDatabaseFormat(birthDate)

    if (!data.birth_date) {
      setIsLoading(false)

      return Alert.alert("Selecione a sua data de nascimento")
    }
    
    if (data.password != data.password_confirmation) {
      setIsLoading(false)
      return Alert.alert("As duas senhas não coincidem")
    }

    api.post('/register', {
      name: data.name,
      cpf,
      email: data.email,
      birth_date: data.birth_date,
      phone,
      sex: data.sex,
      password: data.password,
      password_confirmation: data.password_confirmation
    })
    .then(response => {
      const { uuid } = response.data
      
      try {
        AsyncStorage.setItem('uuid', uuid)
      } catch (e) {
        console.log(e)
      }
      
      addNotifications()
      setIsLoading(false)
      navigation.goBack()
    })
    .catch(error => {
      console.log(error.response) })
  };

  const { colors } = useTheme()

  const [show, setShow] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  return(
    <>
      <Header title='Criar conta'/>
      <ScrollView bg={colors.white}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack alignItems="center" bg="white" w="100%">
              <FormControl>
              <Section title='Informações do utilizador' mt={6}>
                <FormControl.Label _text={{bold: true}} mt={2}>Nome:</FormControl.Label>
                <InputForm
                  name="name"
                  control={control}
                  placeholder="João da Silva"
                  autoCapitalize="words"
                  autoCorrect={false}
                  error={errors.name && errors.name.message}
                />
                <FormControl.Label _text={{bold: true}} mt={2}>CPF:</FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, value}}) => (
                    <MaskInput
                    keyboardType='numeric'
                    placeholder='999.999.999-99'
                    onFocus={() => { setCPFIsHighlighted(true)}}
                    onBlur={() => {setCPFIsHighlighted(false)}}
                    style={ !isCPFHighlighted ? {
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: colors.coolGray[300],
                      padding: 8,
                      paddingLeft: 12,
                      borderRadius: 4,
                      minHeight: 46
                    } : {
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: THEME.color.primary,
                      backgroundColor: THEME.color.primary_200,
                      padding: 8,
                      paddingLeft: 12,
                      borderRadius: 4,
                      minHeight: 46
                    }}
                      value={cpf}
                      onChangeText={(masked, unmasked) => {
                        onChange(unmasked)
                        setCpf(unmasked); 
                      }}
                      mask={[/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/]}
                    />
                  )}
                  name="cpf"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.cpf && errors.cpf.message}</FormControl.Label>

                <FormControl.Label _text={{bold: true}} >Email:</FormControl.Label>
                <InputForm
                  name="email"
                  control={control}
                  placeholder="joao@email.com"
                  autoCorrect={false}
                  autoCapitalize="none"
                  error={errors.email && errors.email.message}
                />
                <HStack justifyContent="space-between">
                  <VStack w="46%" mr={4}>
                    <FormControl.Label _text={{bold: true}} mt={2}>Data de nascimento:</FormControl.Label>
                    <Controller
                    control={control}
                    name="birth_date"
                    render={() => (
                      <>
                        <Button
                          onPress={showDatepicker}
                          variant="outline"
                          size="md"
                          minH={46}
                          borderWidth={1}
                          borderColor="coolGray.300"
                          fontSize="lg"
                          fontFamily="body"
                          color={colors.text[400]}
                          justifyContent="space-between"
                          alignItems="space-between"

                          _text={{
                            color: birthDateIsSelected ? colors.text[600] : colors.text[400],
                            fontSize: "md",
                            fontFamily: "body"
                          }}
                        >
                          {
                            birthDateIsSelected ?
                            setDateToStringLocalFormat(birthDate) :
                            'Escolha a data'
                          }
                        </Button>
                      </>
                    )}
                  />
                    <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.birth_date && errors.birth_date.message}</FormControl.Label>
                  </VStack>
                  <VStack w="46%">
                    <FormControl.Label _text={{bold: true}} mt={2}>Sexo:</FormControl.Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          accessibilityLabel="Escolha"
                          placeholder="Escolha"
                          minH={46}
                          selectedValue={value}
                          onValueChange={(itemValue: string) => {
                            onChange(itemValue);
                          }}
                          _selectedItem={{
                          bg: "primary.200",
                          endIcon: <CheckIcon size="5" />
                        }} size="md" fontSize="md">
                            <Select.Item label="Masculino" value="m" />
                            <Select.Item label="Feminino" value="f" />
                          </Select>
                      )}
                      name="sex"
                      rules={{ required: 'Field is required' }}
                      defaultValue=""
                      />
                        <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.sex && errors.sex.message}</FormControl.Label>
                  </VStack>
                </HStack>
                <FormControl.Label _text={{bold: true}}>Telefone:</FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, value}}) => (
                    <MaskInput
                    keyboardType='numeric'
                    placeholder='(99)99999-9999'
                    onFocus={() => { setPhoneIsHighlighted(true)}}
                    onBlur={() => {setPhoneIsHighlighted(false)}}
                    style={ !isPhoneHighlighted ? {
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: colors.coolGray[300],
                      padding: 8,
                      paddingLeft: 12,
                      borderRadius: 4,
                      minHeight: 46
                    } : {
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: THEME.color.primary,
                      backgroundColor: THEME.color.primary_200,
                      padding: 8,
                      paddingLeft: 12,
                      borderRadius: 4,
                      minHeight: 46
                    }}
                      value={phone}
                      onChangeText={(masked, unmasked) => {
                        onChange(masked)
                        setPhone(masked); 
                        
                      }}
                      mask={['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    />
                  )}
                  name="phone"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.phone && errors.phone.message}</FormControl.Label>
                <FormControl.Label _text={{bold: true}}>Você é Paciente ou Cuidador?</FormControl.Label>
                  <Select
                  accessibilityLabel="Escolha"
                  minH={46}
                  placeholder="Selecione como quer se cadastrar:"
                  placeholderTextColor={colors.text[600]}
                  defaultValue=""
                  w="100%"
                  _selectedItem={{
                    bg: THEME.color.primary_200,
                    endIcon: <CheckIcon size="5" />
                  }} size="md" fontSize="md">
                    <Select.Item label="Paciente" value="paciente" />
                    <Select.Item label="Cuidador" value="cuidador" />
                  </Select>
              </Section>
              <Section title="Informações de segurança" mt={6}>
                <FormControl.Label _text={{
                  bold: true
                }} mt={2}>Senha:</FormControl.Label>
                <InputForm
                  control={control}
                  name="password"
                  placeholder="Minhasenha123"
                  type={show ? "text" : "password"}
                  autoCorrect={false}
                  error={errors.password && errors.password.message}
                  InputRightElement={
                  <Pressable onPress={() => setShow(!show)}>
                    <Icon as={show ? <Eye size={26} /> : <EyeSlash size={26} />} size={5} mr="4" color={colors.text[400]} />
                  </Pressable>}
                />
                <FormControl.HelperText _text={{fontSize: 'xs'}} mb={2}>
                  Sua senha deve conter ao menos 6 digitos, uma letra maiúscula, uma letra minúscula, e números.
                </FormControl.HelperText>
                <FormControl.Label _text={{bold: true}}>Confirme sua senha:</FormControl.Label>
                <InputForm
                  control={control}
                  name="password_confirmation"
                  autoCorrect={false}
                  placeholder="Minhasenha123"
                  type={showConfirm ? "text" : "password"}
                  error={errors.password_confirmation && errors.password_confirmation.message}
                  InputRightElement={
                  <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                    <Icon as={showConfirm ? <Eye size={26} /> : <EyeSlash size={26} />} size={5} mr="4" color={colors.text[600]} />
                  </Pressable>}
                />
              </Section>
              </FormControl>
          </VStack>
        </TouchableWithoutFeedback>
      </ScrollView>
      <VStack w="100%" bg={colors.white}>
                <Box px={4} mt={2} pb={2} w="100%">
                  <ButtonPrimary
                    title="Criar minha conta"
                    textAlign="center"
                    w="full"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={isLoading}
                  />
                </Box>
      </VStack>
    </>
  )
}
