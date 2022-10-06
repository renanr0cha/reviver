import {
  VStack,
  useTheme,
  HStack,
  Button,
  FormControl,
  Select,
  CheckIcon,
  Box,
  useToast
} from 'native-base';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
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
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';


type Nav = {
  goBack(): unknown;
  navigate: (value: string) => void;
}

interface AddPatientFormData {
  name: string,
  cpf: string,
  email: string,
  birth_date: string,
  phone: string,
  sex: string
}

//form validation
const schema = Yup.object().shape({
  name: Yup.string().required('O nome do paciente é obrigatório'),
   cpf: Yup.string().required('Insira o CPF do paciente').min(11, 'Insira todos os 11 digitos'),
  email: Yup.string().email('Favor inserir um endereço de email válido').required('Email é obrigatório'),
  phone: Yup.string().required('Insira o contato do paciente').min(14, 'Insira o número do telefone completo').max(14, 'Insira o número do telefone completo'),
  sex: Yup.string().required('Selecione o sexo do paciente'),
})



export function AddPatient() {
  const [phone, setPhone] = React.useState('');
  const [cpf, setCpf] = React.useState('');

  const [birthDate, setBirthDate] = useState(new Date())
  const [birthDateIsSelected, setBirthDateIsSelected] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation<Nav>()

  const toast = useToast()

  function addNotifications() {
    toast.show({
      padding: 4,
      title: "Você cadastrou o paciente com sucesso!",
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
      maximumDate : new Date(),
      display: 'spinner'
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  //métodos do form
  const { control, handleSubmit, formState: { errors } } = useForm<AddPatientFormData>({
    resolver: yupResolver(schema)
  });

  //submit function do form
  const onSubmit: SubmitHandler<AddPatientFormData>  = async (data) => {
    setIsLoading(true)

    data.birth_date = setDateToStringDatabaseFormat(birthDate)

    if (!data.birth_date) {
      setIsLoading(false)

      return Alert.alert("Selecione a sua data de nascimento")
    }
    if (!data.sex) {
      setIsLoading(false)
      return Alert.alert("Selecione seu sexo")
    }

    const token = await AsyncStorage.getItem('token')
    console.log({
      name: data.name,
      cpf,
      email: data.email,
      birth_date: data.birth_date,
      phone,
      sex: data.sex
    })

    api.post(`/${token}/patient/create`, {
      name: data.name,
      cpf,
      email: data.email,
      birth_date: data.birth_date,
      phone,
      sex: data.sex
    })
    .then(response => {
      console.log(response.data)

      // const { uuidPatient } = response.data
      // try {
      //   AsyncStorage.setItem('uuidPatient', uuidPatient)
      // } catch (e) {
      //   console.log(e)
      // }
      addNotifications()
      setIsLoading(false)
      navigation.navigate("patientlist")
    }).catch(error => {
      error.response.data.error === "Você não pode se adicionar como paciente" ?
      Alert.alert("Você não pode se adicionar como paciente") : Alert.alert(error.response.data.error)
      setIsLoading(false)

    })
    
};
  const { colors } = useTheme()


  return(
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <VStack alignItems="center" bg="white" w="100%" h="100%">
          <Header title='Cadastrar paciente'/>
            <FormControl>
            <Section title='Informações do paciente' mt={6}>
              <FormControl.Label _text={{bold: true}} mt={2}>Nome:</FormControl.Label>
              <InputForm
                name="name"
                control={control}
                placeholder="João da Silva"
                autoCapitalize="words"
                autoCorrect={false}
                error={errors.name && errors.name.message}
                mb={2}
              />
              <FormControl.Label _text={{bold: true}}>CPF:</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, value}}) => (
                  <MaskInput
                  keyboardType='numeric'
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
                      onChange(unmasked)
                      setCpf(unmasked)
                    }}
                    mask={[/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/]}
                  />
                )}
                name="cpf"
              />
              <FormControl.Label _text={{bold: true}}>Email:</FormControl.Label>
              <InputForm
                name="email"
                control={control}
                placeholder="joao@email.com"
                autoCorrect={false}
                autoCapitalize="none"
                error={errors.email && errors.email.message}
                mb={2}
              />
              <HStack justifyContent="space-between" >
              <VStack w="46%" mr={4}>
                  <FormControl.Label _text={{bold: true}}>Data de nascimento:</FormControl.Label>
                  <Controller
                    control={control}
                    name="birth_date"
                    render={({}) => (
                      <>
                        <Button
                          onPress={showDatepicker}
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
                            color: birthDateIsSelected ?  colors.text[600] : colors.text[400],
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
                  <FormControl.Label _text={{bold: true}}>Sexo:</FormControl.Label>
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
                      onChange(masked)
                      setPhone(masked)
                    }}
                    mask={['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                  />
                )}
                name="phone"
              />
            </Section>
              <Box mx={4} mt={6} pb={2}>
                <ButtonPrimary
                  title="Cadastrar paciente"
                  textAlign="center"
                  w="full"
                  onPress={handleSubmit(onSubmit)}
                  isLoading={isLoading}
                />
              </Box>
            </FormControl>
        </VStack>
      </TouchableWithoutFeedback>
    </>
  )
}
