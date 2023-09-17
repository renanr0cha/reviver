import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  HStack,
  ScrollView,
  Select,
  VStack,
  useTheme,
  useToast
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, BackHandler, Keyboard, TouchableWithoutFeedback } from 'react-native';
import MaskInput from 'react-native-mask-input';
import * as Yup from 'yup';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { Header } from '../components/Header';
import { InputForm } from '../components/InputForm';
import { Section } from '../components/Section';
import api from '../services/api';
import { THEME } from '../styles/theme';

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

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  
  const [phone, setPhone] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  const [patientCpf, setPatientCpf] = React.useState<string>('')
  const [patientData, setPatientData] = React.useState<object>({})

  useEffect(() => {
    console.log(patientCpf)
  }, [setPatientCpf])

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

  function cpfNotFound() {
    setPatientCpf('')
    toast.show({
      padding: 4,
      marginTop: 14,
      maxW: 300,
      title: "CPF não encontrado na base de dados, tente novamente ou insira os dados abaixo para cadastrar",
      placement: "top",
      duration: 8000,
      
    })
  }

  function cpfFound(data:AddPatientFormData) {
    console.log(data)
    const values = {
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone,
      sex: data.sex,
      birth_date: setDateToStringLocalFormat(new Date(data.birth_date))
    }
    setCpf(data.cpf)
    setPhone(data.phone)
    setBirthDate(new Date(data.birth_date))
    toast.show({
      padding: 4,
      marginTop: 14,
      maxW: 300,
      title: "As informações do paciente foram carregadas, você só precisar apertar em Cadastrar paciente para finalizar",
      placement: "top",
      duration: 5000,
      
    })

    reset(values)
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

  //métodos do form
  const { control, handleSubmit, formState: { errors }, reset } = useForm<AddPatientFormData>({
    resolver: yupResolver(schema)
  });

  const findPatient = async (patientCpf: string) => {
    console.log(patientCpf)
    const token = await AsyncStorage.getItem('token')
    api.get(`/${token}/patient/show/${patientCpf}`)
    .then((response) => {
      const data = response.data
      if (Array.isArray(data) && data.length === 0) {
        cpfNotFound()
      } else {
        cpfFound(response.data)
      }
    })
    .catch(error => console.error(`Error: ${error}`))
  }

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
      <Header title='Cadastrar paciente'/>
      <ScrollView bg={colors.white}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <VStack alignItems="center" bg="white" w="100%" h="100%">
        <VStack w="100%">
          <Section title='Pesquise pelo CPF' mt={6}>
          <FormControl.Label _text={{bold: true}}>Insira o CPF do Paciente (ele precisa possuir cadastro na plataforma):</FormControl.Label>
            <MaskInput
              keyboardType='numeric'
              style={{
                fontSize: 16,
                borderWidth: 1,
                borderColor: colors.coolGray[300],
                padding: 8,
                paddingLeft: 12,
                borderRadius: 4,
                minHeight: 46
              }}
                value={patientCpf}
                onChangeText={(masked, unmasked) => {
                  setPatientCpf(unmasked)
                }}
                mask={[/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/]}
            />
            <Box mx={4} mt={6} pb={2}>
              <ButtonPrimary
                title="Pesquisar paciente pelo CPF"
                textAlign="center"
                w="full"
                onPress={() => findPatient(patientCpf)}
                isLoading={isLoading}
              />
            </Box>
          </Section>
        </VStack>
          <VStack w="100%">
            <FormControl>
            <Section title='Digite as informações do paciente' mt={6}>
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
                    borderRadius: 4,
                    marginBottom: 4,
                    minHeight: 46
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
                        <Button
                          onPress={showDatepicker}
                          variant="outline"
                          size="md"
                          minH={14}
                          borderWidth={1}
                          borderColor="coolGray.300"
                          fontSize="lg"
                          fontFamily="body"
                          color={colors.text[400]}
                          justifyContent="space-between"
                          alignItems="space-between"

                          _text={{
                            color: colors.text[600],
                            fontSize: "md",
                            fontFamily: "body",
                            paddingBottom: 0,

                          }}
                        >
                          {
                            setDateToStringLocalFormat(birthDate)
                          }
                        </Button>
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
                        minH={46}
                        selectedValue={value}
                        onValueChange={(itemValue: string) => {
                          onChange(itemValue);
                        }}
                        _selectedItem={{
                        bg: THEME.color.primary_200,
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
                    borderRadius: 4,
                    minHeight: 46
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
        </VStack>
      </TouchableWithoutFeedback>
      </ScrollView>
    </>
  )
}
