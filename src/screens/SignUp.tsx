import { VStack, useTheme, Icon, HStack, Button, FormControl, Select, CheckIcon, Box, Pressable, ScrollView } from 'native-base';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
import { Eye, EyeSlash } from 'phosphor-react-native';
import React, { useState } from 'react';
import { TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { Header } from '../components/Header';
import { Section } from '../components/Section';
import api from '../services/api';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { InputForm } from '../components/InputForm';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaskInput from 'react-native-mask-input';
import DatePicker from 'react-native-date-picker';

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
const phoneRegex = /\([1-9]{2}\)\ ?[0-9]{4,5}?\-?[0-9]{4}/
const cpfRegex = /([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2})/
const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  cpf: Yup.string().required('Insira seu CPF').matches(cpfRegex, 'Informe um cpf válido.'),
  email: Yup.string().required('Email é obrigatório'),
  birth_date: Yup.date().required('Selecione a data de nascimento'),
  phone: Yup.string().required('Insira seu contato').matches(phoneRegex, 'Informe um número válido.'),
  sex: Yup.string().required('Selecione o sexo'),
  password: Yup.string().required('A senha é obrigatória'),
  password_confirmation: Yup.string().required('A confirmação da senha é obrigatória'),
})


export function SignUp() {
  const [phone, setPhone ] = useState('')
  const [cpf, setCpf] = React.useState('');

  const [birthDate, setBirthDate] = useState(new Date())
  const [stringBirthDate, setStringBirthDate] = useState("")
  const [birthDateOpen, setBirthDateOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation()


  //métodos do form
  const { control, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: yupResolver(schema)
  });

  //submit function do form
  const onSubmit: SubmitHandler<SignUpFormData>  = (data) => {
    setIsLoading(true)

    console.log(data.birth_date)

    console.log(data)
    if (!data.birth_date) {
      return Alert.alert("Selecione a sua data de nascimento")
    }
    if (!data.sex) {
      return Alert.alert("Selecione seu sexo")
    }
    if (data.password != data.password_confirmation) {
      setIsLoading(false)
      return Alert.alert("As duas senhas não coincidem")
    }

    api.post('/register', {
      name: data.name,
      cpf,
      email: data.email,
      birth_date: stringBirthDate,
      phone,
      sex: data.sex,
      password: data.password,
      password_confirmation: data.password_confirmation
    })
    .then(response => {
      console.log(response.data)

      const { uuid } = response.data

      try {
        AsyncStorage.setItem('uuid', uuid)
      } catch (e) {
        console.log(e)
      }

      navigation.goBack()
    })
    .catch(error => console.log(error))
};
  const { colors } = useTheme()

  const [show, setShow] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  return(
    <>
      <Header title='Criar conta'/>
      <ScrollView>
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
                    style={{
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: colors.coolGray[300],
                      padding: 8,
                      paddingLeft: 12,
                      borderRadius: 4
                    }}
                      value={cpf}
                      onChangeText={(masked, unmasked) => {
                        onChange(cpf)
                        setCpf(unmasked); 
                        
                        console.log(masked); 
                        console.log(unmasked); 
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
                    render={({}) => (
                      <>
                        <Button
                          onPress={() => setBirthDateOpen(true)}
                          variant="outline"
                          size="md"
                          borderWidth={1}
                          borderColor="coolGray.300"
                          fontSize="lg"
                          fontFamily="body"
                          color={colors.text[400]}
                          justifyContent="space-between"
                          alignItems="space-between"

                          _text={{
                            color: !stringBirthDate ? colors.text[400] : colors.text[600],
                            fontSize: "md",
                            fontFamily: "body"
                          }}
                        >
                          {
                            !stringBirthDate ?
                              `Escolha a data`
                            :
                              `${String(birthDate.getDate()).padStart(2, "0")}/${String(birthDate.getMonth() + 1).padStart(2, "0")}/${String(birthDate.getFullYear())}`
                          }
                        </Button>
                        <DatePicker
                          title="Escolha a sua data de nascimento"
                          confirmText="confirmar"
                          cancelText="cancelar"
                          maximumDate={new Date()}
                          modal
                          mode='date'
                          open={birthDateOpen}
                          date={birthDate}
                          onConfirm={(birthDate) => {
                            setBirthDateOpen(false)
                            setStringBirthDate(`${String(birthDate.getFullYear())}-${String(birthDate.getMonth() + 1).padStart(2, "0")}-${String(birthDate.getDate()).padStart(2, "0")}`)
                            setBirthDate(birthDate)
                          }}
                          onCancel={() => {
                            setBirthDateOpen(false)
                          }}
                        />
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
                          selectedValue={value}
                          onValueChange={(itemValue: string) => {
                            onChange(itemValue);
                          }}
                          _selectedItem={{
                          bg: "teal.600",
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
                    style={{
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: colors.coolGray[300],
                      padding: 8,
                      paddingLeft: 12,
                      borderRadius: 4
                    }}
                      value={phone}
                      onChangeText={(masked, unmasked) => {
                        onChange(phone)
                        setPhone(masked); // you can use the unmasked value as well
                        // assuming you typed "9" all the way:
                        console.log(masked); // (99)99999-9999
                        console.log(unmasked); // 99999999999
                      }}
                      mask={['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    />
                  )}
                  name="phone"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.phone && errors.phone.message}</FormControl.Label>
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
