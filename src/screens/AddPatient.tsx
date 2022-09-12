import { VStack, useTheme, HStack, Button, FormControl, Select, CheckIcon, Box } from 'native-base';
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
import DatePicker from 'react-native-date-picker'


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
  name: Yup.string().required('Nome é obrigatório'),
  cpf: Yup.string().required('Insira seu CPF'),
  email: Yup.string(),
  //falta validar a data
  phone: Yup.string().required('Telefone é obrigatório'),
  sex: Yup.string().required('Selecione o sexo'),
})



export function AddPatient() {
  const [phone, setPhone] = React.useState('');
  const [cpf, setCpf] = React.useState('');

  const [birthDate, setBirthDate] = useState(new Date())
  const [stringBirthDate, setStringBirthDate] = useState("")
  const [birthDateOpen, setBirthDateOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation<Nav>()


  //métodos do form
  const { control, handleSubmit, formState: { errors } } = useForm<AddPatientFormData>({
    resolver: yupResolver(schema)
  });

  //submit function do form
  const onSubmit: SubmitHandler<AddPatientFormData>  = async (data) => {
    setIsLoading(true)

    data.birth_date = stringBirthDate

    console.log(data)
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
                          title="Escolha a data de nascimento"
                          textColor="#000000"
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
