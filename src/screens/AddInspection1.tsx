import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import {
  Box,
  CheckIcon,
  FormControl,
  HStack,
  Heading,
  ScrollView,
  Select,
  Switch,
  Text,
  VStack,
  useTheme
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BackHandler, Keyboard, TouchableWithoutFeedback } from 'react-native';
import * as Yup from "yup";
import { ButtonPrimary } from '../components/ButtonPrimary';
import { Header } from '../components/Header';
import { InputForm } from '../components/InputForm';
import { Section } from '../components/Section';
import { getFormData, storeFormData } from '../lib/storage';
import { THEME } from '../styles/theme';


type Nav = {
  navigate: (value: string) => void;
}

interface AddInspection1FormData {
  blood_pressure_first_value: string,
  blood_pressure_second_value: string,
  heart_frequency: string,
  saturation: string,
  blood_glucose: any,
  feeling: any,
  motivation: any,
  depression: any,
}

const schema = Yup.object().shape({
  blood_pressure_first_value: Yup.string(),
  blood_pressure_second_value: Yup.string(),
  heart_frequency: Yup.string(),
  saturation: Yup.string(),
  blood_glucose: Yup.string(),
  feeling: Yup.string().required("Informe como está se sentindo hoje"),
  motivation: Yup.string().required("Informe como está sua motivação"),
  depression: Yup.string().required("Informe como está seu estado depressivo hoje"),
})



export function AddInspection1() {

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])
  
  const [showPressure, setShowPressure] = useState(false)
  const [showFrequency, setShowFrequency] = useState(false)
  const [showSaturation, setShowSaturation] = useState(false)
  const [showGlucose, setShowGlucose] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation<Nav>()

  const { control, handleSubmit, formState: { errors } } = useForm<AddInspection1FormData>({
    resolver: yupResolver(schema)
  });

  const retrieveData = async () => {
    const resp = await getFormData()
    console.log(resp)
    return resp
  }

  const onSubmit: SubmitHandler<AddInspection1FormData> = async (data) => {
    setIsLoading(true)
    await storeFormData({
      pressure: data.blood_pressure_first_value && data.blood_pressure_second_value ? `${data.blood_pressure_first_value} por ${data.blood_pressure_second_value}` : "Sem registro",
      heart_rate: data.heart_frequency ? parseInt(data.heart_frequency) : 0,
      saturation: data.saturation ? parseInt(data.saturation) : 0,
      blood_glucose: data.blood_glucose ? parseInt(data.blood_glucose) : 0,
      emoji: parseInt(data.feeling),
      motivation: parseInt(data.motivation),
      depression: parseInt(data.depression)
    })
    handlePartTwo()
    console.log(await retrieveData())
  };

  function handlePartTwo() {
    navigation.navigate('addinfo2')
  }

  const { colors } = useTheme() 

  
  return(
    <>
      <Header title='Adicionar - Sinais vitais e Humor'/>
      <ScrollView bg={colors.white}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <VStack alignItems="center" bg="white" w="100%" pb={10}>
          <FormControl>
            <FormControl.HelperText _text={{fontSize: 'sm',textAlign: 'center'}}>Insire os dados ou selecione não informar para prosseguir.</FormControl.HelperText>
            <Section title='' >
              <HStack alignItems="center">
                  <Heading fontSize="xl" mb={2} allowFontScaling={false}>Pressão arterial</Heading>
                  <Text ml={6} mr={2} fontSize="md" color="coolGray.500" pb={1} allowFontScaling={false}>Informar</Text>
                  <Switch size="md" colorScheme="orange" onToggle={() =>setShowPressure(previousState => !previousState)} value={!showPressure}></Switch>
              </HStack>
              {
                !showPressure &&
                <HStack justifyContent="space-between">
                  <VStack w="46%">
                    <FormControl.Label _text={{bold: true}}>Maior valor:</FormControl.Label>
                      <InputForm
                        name='blood_pressure_first_value'
                        control={control}
                        placeholder="12"
                        keyboardType='numeric'
                        error={errors.blood_pressure_first_value && errors.blood_pressure_first_value.message}
                      />
                  </VStack>
                  <Heading alignSelf="center" mt={4} textAlign="left" fontSize="md">X</Heading>
                  <VStack w="46%">
                    <FormControl.Label _text={{bold: true}}>Menor valor:</FormControl.Label>
                      <InputForm
                        name="blood_pressure_second_value"
                        control={control}
                        placeholder="8"
                        keyboardType='numeric'
                        error={errors.blood_pressure_second_value && errors.blood_pressure_second_value.message}
                      />
                  </VStack>
                </HStack>
              }
            </Section>

            <Section title=''>
              <HStack  alignItems="center">
                <Heading alignSelf="center" fontSize="xl" mb={2} allowFontScaling={false}>Frequência cardíaca</Heading>
                <Text ml={6} mr={2} fontSize="md" color="coolGray.500" pb={1} allowFontScaling={false}>Informar</Text>
                <Switch size="md" colorScheme="orange" onToggle={() =>setShowFrequency(previousState => !previousState)} value={!showFrequency}></Switch>
              </HStack>
                {
                  !showFrequency &&
                  <VStack>
                  <FormControl.Label _text={{bold: true}}>Valor em BPM:</FormControl.Label>
                    <InputForm
                      name="heart_frequency"
                      control={control}
                      placeholder="80"
                      keyboardType='numeric'
                      error={errors.heart_frequency && errors.heart_frequency.message}
                    />
                  </VStack>
                }
            </Section>
            
            <Section title=''>
              <HStack  alignItems="center">
                <Heading alignSelf="center" fontSize="xl" mb={2} allowFontScaling={false}>Saturação do Sangue</Heading>
                <Text ml={6} mr={2} fontSize="md" color="coolGray.500" pb={1} allowFontScaling={false}>Informar</Text>
                <Switch size="md" colorScheme="orange" onToggle={() =>setShowSaturation(previousState => !previousState)} value={!showSaturation}></Switch>
              </HStack>
              {
                !showSaturation &&
                <VStack>
                  <FormControl.Label _text={{bold: true}}>Valor em porcentagem:</FormControl.Label>
                    <InputForm
                      name="saturation"
                      control={control}
                      placeholder="99"
                      keyboardType='numeric'
                      error={errors.saturation && errors.saturation.message}
                    />
                </VStack>
              }
            </Section>
            <Section title=''>
              <HStack  alignItems="center">
                <Heading alignSelf="center" fontSize="xl" mb={2} allowFontScaling={false}>Glicemia</Heading>
                <Text ml={6} mr={2} fontSize="md" color="coolGray.500" pb={1} allowFontScaling={false}>Informar</Text>
                <Switch size="md" colorScheme="orange" onToggle={() =>setShowGlucose(previousState => !previousState)} value={!showGlucose}></Switch>
              </HStack>
              {
                !showGlucose &&
                <VStack>
                <FormControl.Label _text={{bold: true}}>Valor em mg/dl:</FormControl.Label>
                  <InputForm
                    name="blood_glucose"
                    control={control}
                    placeholder="89"
                    keyboardType='numeric'
                    error={errors.blood_glucose && errors.blood_glucose.message}
                  />
              </VStack>
              }
            </Section>
            <FormControl.HelperText _text={{fontSize: 'sm',textAlign: 'center'}}>Sobre o seu humor você deve preencher todos os campos</FormControl.HelperText>
            <Section title=''>
              <Heading fontSize="xl" mb={4}>Como você está se sentindo hoje?</Heading>
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
                      bg: THEME.color.primary_200,
                      endIcon: <CheckIcon size="5" />
                    }} size="md" fontSize="md">
                      <Select.Item label="🤩  -  Radiante" value="1" />
                      <Select.Item label="😊  -  Bem" value="2" />
                      <Select.Item label="😐  -  Mais ou menos" value="3" />
                      <Select.Item label="😞  -  Mal" value="4"/>
                      <Select.Item label="😖  -  Horrível" value="5" />
                      <Select.Item label="😡  -  Estressado" value="6" />
                  </Select>
                )}
                name="feeling"
                
              />
              <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.feeling && errors.feeling.message}</FormControl.Label>
              
            </Section>
            <Section title=''>
              <Heading fontSize="xl" mb={6}>Como está sua motivação hoje:</Heading>
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
                    bg: THEME.color.primary_200,
                    endIcon: <CheckIcon size="5" />
                  }} size="md" fontSize="md">
                    <Select.Item label="😁  -  Normal" value="0" />
                    <Select.Item label="🙂  -  Está menos interessado que o normal, sentindo-se mais desanimado" value="1" />
                    <Select.Item label="😔  -  Sem vontade de realizar tarefas ou desinteresse por atividades não rotineiras" value="2" />
                    <Select.Item label="😟  -  Sem vontade de realizar tarefas ou desinteresse por atividades do dia-a-dia" value="3"/>
                    <Select.Item label="😩  -  Sentindo-se calado, com perda completa da motivação" value="4" />
                  </Select>
                )}
                name="motivation"
              />
              <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.motivation && errors.motivation.message}</FormControl.Label>
            </Section>

            <Section title=''>
              <Heading fontSize="xl" mb={6}>Como está seu sentimento de tristeza hoje:</Heading>
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
                    bg: THEME.color.primary_200,
                    endIcon: <CheckIcon size="5" />
                  }} size="md" fontSize="md">
                    <Select.Item label="😃  -  Ausente" value="0" />
                    <Select.Item label="🙁  -  Períodos de tristeza ou culpa acima do normal, por períodos curtos" value="1" />
                    <Select.Item label="😢  -  Tristeza permanente, período de uma semana ou mais" value="2" />
                    <Select.Item label="😰  -  Tristeza mantida com alguns sintomas como insônia, falta de apetite, perda de peso e desinteresse" value="3"/>
                    <Select.Item label="😭  -  Tristeza mantida com sintomas como insônia, falta de apetite, perda de peso, desinteresse e pensamento ou tentativa de suicídio" value="4" />
                  </Select>
                  )}
                  name="depression"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.depression && errors.depression.message}</FormControl.Label>
            </Section>
              
          </FormControl>
        </VStack>
                </TouchableWithoutFeedback>
        </ScrollView>
      <VStack w="100%" bg={colors.white}>
        <Box px={4} mt={2} pb={2} w="100%">
          <ButtonPrimary
            title="Continuar para adicionar sintomas"
            w="full"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />
        </Box>
      </VStack>
    </>
  )
}
