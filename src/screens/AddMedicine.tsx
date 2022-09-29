import React, { useEffect, useState } from 'react';
import { VStack, useTheme, HStack, Button, FormControl, Select, CheckIcon, Box, Switch, Divider, ScrollView } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import { ButtonPrimary } from '../components/ButtonPrimary';
import { Header } from '../components/Header';
import { Section } from '../components/Section';
import { InputForm } from '../components/InputForm';

import * as Notifications from 'expo-notifications';

import * as Yup from "yup"
import DatePicker from 'react-native-date-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import api from '../services/api';
import { setScheduledNotifications } from '../services/setScheduledNotifications';


type Nav = {
  navigate: (value: string) => void;
}
interface MedicineFormData {
  medicine: string,
  prescription: string,
  frequency: string,
  dosage_quantity: string,
  dosage_unit: string,
  // duration: string,
  start_date?: string,
  end_date?: string,
  quantity_of_days: string,
  instructions?: string,
  inventory?: string,
  start_time?: string,
  other_instruction?: string
}

const schema = Yup.object().shape({
  medicine: Yup.string().required('É necessesário informar o nome do medicamento'),
  prescription: Yup.string().required('É necessesário informar o nome do medicamento'),
  frequency: Yup.string().required('É necessesário informar a frequência'),
  dosage_quantity: Yup.string().required('Informe a quantidade'),
  dosage_unit: Yup.string().required('Informe a unidade'),
  // duration: Yup.string().required('Informe a duração que vai tomar o medicamento'),
  start_date: Yup.string(),
  end_date: Yup.string(),
  quantity_of_days: Yup.string(),
  instructions: Yup.string(),
  inventory: Yup.string()
})


export function AddMedicine() {

  const navigation = useNavigation<Nav>()

  const [medicineId, setMedicineId] = useState("")

  const [startDate, setStartDate] = useState(new Date())
  const [stringStartDate, setStringStartDate] = useState("")
  const [startDateOpen, setStartDateOpen] = useState(false)

  const [startTime, setStartTime] = useState(new Date())
  const [stringStartTime, setStringStartTime] = useState("")
  const [startTimeOpen, setStartTimeOpen] = useState(false)


  const [isLoading, setIsLoading] = useState(false)


  const [showInputHours, setShowInputHours] = useState(false)
  

  //mostrar campo para adicionar informações adicionais
  const [showInstructions, setShowInstructions] = useState(false)

  const [showOtherInstruction, setShowOtherInstruction] = useState(false)

  const [showDatePickers, setShowDatePickers] = useState(false)


  //mostrar campo para adicionar estoque
  const [showInventory, setShowInventory] = useState(false)

  const { control, reset, handleSubmit, formState: { errors } } = useForm<MedicineFormData>({
    resolver: yupResolver(schema)
  });
  const onSubmit: SubmitHandler<MedicineFormData> = async (data) => {
    setIsLoading(false)
    

    

    //tratando dados
    const dosage = `${data.dosage_quantity} ${data.dosage_unit}`
    const prescription = data.prescription === "yes" ? true : false
    const inventory =  data.inventory ? parseInt(data.inventory) : undefined
    const choosenDays = parseInt(data.quantity_of_days)
    const frequency = parseInt(data.frequency)
    const instruction = data.instructions === "Outro" && data.instructions !== undefined ? data.other_instruction : data.instructions

    const token = await AsyncStorage.getItem('token')

    const isCaregiver = await AsyncStorage.getItem("uuidPatient")
    await api.post(`/${token}/medicine/create${isCaregiver ? isCaregiver : ""}`, {
      name: data.medicine,
      prescription,
      dosage,
      frequency,
      start_date: stringStartDate,
      start_time: stringStartTime,
      days: choosenDays,
      instruction,
      inventory
    })
    .then((response) => {
      setMedicineId(response.data.id)
      
      // navigation.navigate("medlist")
    })
    .catch(error => console.log(error))


  
    await api.get(`/${token}/medicine/list${isCaregiver ? isCaregiver : ""}`)
    .then((response) => {
      const medicines = response.data
      const medicineData = medicines.find((medicine: { id: string; }) => medicine.id === medicineId)
      console.log(medicineData)

      setScheduledNotifications(medicineData.name, medicineData.hours, medicineData.dosage)
  
      
    })
    .catch(error => console.error(`Error: ${error}`))
    
    

    
  };
  
  const { colors } = useTheme()
  return(
    <>
          <Header title='Adicionar medicamento'/>
            <ScrollView>
              <VStack alignItems="center" bg="white" w="100%" pb={10}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FormControl>
            <Section title='Sobre o medicamento' mt={6}>
              <FormControl.Label _text={{bold: true}} mt={2}>Nome:</FormControl.Label>
              <InputForm
                name="medicine"
                control={control}
                placeholder="Paracetamol 500mg"
                autoCapitalize="sentences"
                autoCorrect={false}
                error={errors.medicine && errors.medicine.message}
                defaultValue=""
              />
              <FormControl.Label _text={{bold: true}} mt={2}>Precisa de receita para adquirir?</FormControl.Label>
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
                    <Select.Item label="Sim, precisa de receita" value="yes" />
                    <Select.Item label="Não precisa de receita" value="no" />
                  </Select>
                )}
                name="prescription"
                rules={{ required: 'Field is required' }}
                defaultValue=""
              />
              <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.prescription && errors.prescription.message}</FormControl.Label>
            </Section>
            
            <Section title="Sobre a frequência e dosagem" mt={6}>

            <HStack justifyContent="space-between">
                <VStack w="46%" mr={4}>
                  <FormControl.Label _text={{bold: true}} mt={2}>Dosagem:</FormControl.Label>
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
                        <Select.Item label="1" value="1" />
                        <Select.Item label="2" value="2" />
                        <Select.Item label="3" value="3" />
                        <Select.Item label="4" value="4" />
                        <Select.Item label="5" value="5" />
                        <Select.Item label="6" value="6" />
                        <Select.Item label="7" value="7" />
                        <Select.Item label="8" value="8" />
                        <Select.Item label="9" value="9" />
                      </Select>
                    )}
                    name="dosage_quantity"
                    rules={{ required: 'Field is required' }}
                    defaultValue=""
                  />
                  <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.dosage_quantity && errors.dosage_quantity.message}</FormControl.Label>
                </VStack>
                <VStack w="46%">
                  <FormControl.Label _text={{bold: true}} mt={2}>Unidade:</FormControl.Label>
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
                        <Select.Item label="Mais comuns" value="" disabled/>
                        <Select.Item label="Comprimido(s)" value="Comprimido(s)" />
                        <Select.Item label="Cápsula(s)" value="Cápsula(s)" />
                        <Select.Item label="Miligrama(s) / mg" value="mg" />
                        <Select.Item label="Mililitro(s) / ml" value="ml" />
                        <Select.Item label="Gota(s)" value="Gota(s)" />
                        <Select.Item label="Grama(s)" value="Grama(s)" />
                        <Select.Item label="Unidade(s)" value="Unidade(s)" />
                        <Select.Item label="" value="" disabled/>
                        <Select.Item label="Outros" value="" disabled/>
                        <Select.Item label="Ampola(s)" value="Ampola(s)" />
                        <Select.Item label="Aplicação/ões" value="Aplicação/ões" />
                        <Select.Item label="Inalação/ões" value="Inalação/ões" />
                        <Select.Item label="Injeção/ões" value="Injeção/ões" />
                        <Select.Item label="Pulverização/ões" value="Pulverização/ões" />
                        <Select.Item label="Colher(es) de chá" value="Colher(es) de chá" />
                        <Select.Item label="Colher(es) de sopa" value="Colher(es) de sopa" />
                        <Select.Item label="UI" value="UI" />
                        <Select.Item label="Pedaço(s)" value="Pedaço(s)" />
                        <Select.Item label="Penso(s)" value="Penso(s)" />
                        <Select.Item label="Sache(s)" value="Sache(s)" />
                        <Select.Item label="Supositório(s)" value="Supositório(s)" />
                        <Select.Item label="Óvulo(s)" value="Óvulo(s)" />
                      </Select>
                    )}
                    name="dosage_unit"
                    rules={{ required: 'Field is required' }}
                  />
                  <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.dosage_unit && errors.dosage_unit.message}</FormControl.Label>
                </VStack>
              </HStack>
              <FormControl.Label _text={{bold: true}} mt={2}>Quantas vezes tomar?</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                  accessibilityLabel="Escolha"
                  placeholder="Escolha uma frequência"
                  selectedValue={value}
                  defaultValue=""
                  onValueChange={(itemValue: string) => {
                    onChange(itemValue);
                    setShowInputHours(true);
                  }}
                  _selectedItem={{
                    bg: "primary.200",
                    endIcon: <CheckIcon size="5" />
                  }} size="md" fontSize="md">
                    <Select.Item label="Uma vez ao dia" value="24" />
                    <Select.Item label="Duas vezes ao dia" value="12" />
                    <Select.Item label="Três vezes ao dia" value="8" />
                    <Select.Item label="Quatro vezes ao dia" value="6" />
                  </Select>
                  
                )}
                name="frequency"
                rules={{ required: 'Field is required' }}
                defaultValue=""
              />
              <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.frequency && errors.frequency.message}</FormControl.Label>
                  {
                    showInputHours &&
                    <VStack>
                      <FormControl.Label _text={{bold: true}} mt={2}>Horário que começou a tomar:</FormControl.Label>
                          <Button
                            onPress={() => setStartTimeOpen(true)}
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
                              color: !stringStartTime ? colors.text[400] : colors.text[600],
                              fontSize: "md",
                              fontFamily: "body"
                            }}
                          >
                            {
                              !stringStartTime ?
                                `Escolha o horário`
                              :
                                `${String(startTime.getHours()).padStart(2, "0")}:${String(startTime.getMinutes()).padStart(2, "0")}`
                            }
                          </Button>
                          <DatePicker
                            title="Escolha a data de início do tratamento"
                            confirmText="confirmar"
                            cancelText="cancelar"
                            modal
                            minuteInterval={30}
                            mode='time'
                            open={startTimeOpen}
                            date={startTime}
                            onConfirm={(startTime) => {
                              setStartTimeOpen(false)
                              setStringStartTime(`${String(startTime.getHours()).padStart(2, "0")}:${String(startTime.getMinutes()).padStart(2, "0")}`)
                              setStartTime(startTime)
                            }}
                            onCancel={() => {
                              setStartTimeOpen(false)
                            }}
                          />
                    </VStack>
                  }
            </Section>
            <Section title="Sobre a duração do tratamento" mt={6}>
              {/* <FormControl.Label _text={{bold: true}} mt={2}>Período do tratamento:</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    accessibilityLabel="Escolha"
                    placeholder="Escolha"
                    selectedValue={value}
                    onValueChange={(itemValue: string) => {
                      onChange(itemValue);
                      if(itemValue == "Sem data de término") {
                        setShowDatePickers(false)
                        setStringStartDate("")
                      } else {
                        setShowDatePickers(true)
                      } 
                    }}
                    _selectedItem={{
                      bg: "primary.200",
                      endIcon: <CheckIcon size="5" />
                    }} size="md" fontSize="md">
                      <Select.Item label="Sem data de término" value="Sem data de término" />
                      <Select.Item label="Até uma data específica" value="Até uma data específica" />
                  </Select>
                )}
                name="duration"
                rules={{ required: 'Field is required' }}
                defaultValue=""
              /> */}
              <FormControl.Label _text={{bold: true}} mt={2}>Início do tratamento:</FormControl.Label>
              <Button
                onPress={() => setStartDateOpen(true)}
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
                  color: !stringStartDate ? colors.text[400] : colors.text[600],
                  fontSize: "md",
                  fontFamily: "body"
                }}
              >
                {
                  !stringStartDate ?
                    `Escolha a data`
                  :
                    `${String(startDate.getDate()).padStart(2, "0")}/${String(startDate.getMonth() + 1).padStart(2, "0")}/${String(startDate.getFullYear())}`
                }
              </Button>
              <DatePicker
                title="Escolha a data de início do tratamento"
                textColor="#000000"
                confirmText="confirmar"
                cancelText="cancelar"
                minimumDate={new Date()}
                modal
                mode='date'
                open={startDateOpen}
                date={startDate}
                onConfirm={(startDate) => {
                  setStartDateOpen(false)
                  setStringStartDate(`${String(startDate.getFullYear())}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`)
                  setStartDate(startDate)
                }}
                onCancel={() => {
                  setStartDateOpen(false)
                }}
              />

              <FormControl.Label _text={{bold: true}} mt={2}>Número de dias:</FormControl.Label>
              <InputForm
                name="quantity_of_days"
                control={control}
                placeholder="Insira a quantidade"
                autoCorrect={false}
                keyboardType="numeric"
              />
              {/* {
                showDatePickers &&
                <>
                </>
              } */}
              <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.quantity_of_days && errors.quantity_of_days.message}</FormControl.Label>
            </Section>

            <Section title="Informações adicionais" mt={6}>
              <VStack>
                <HStack alignItems="center">
                  <FormControl.Label _text={{bold: true}} mt={2}>Instruções diversas (Opcional):</FormControl.Label>
                  <Switch size="sm" colorScheme="primary" onToggle={() => setShowInstructions(previousState => !previousState)} value={showInstructions}></Switch>
                </HStack>
                {
                  showInstructions &&
                  <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                    accessibilityLabel="Escolha"
                    placeholder="Escolha"
                    selectedValue={value}
                    onValueChange={(itemValue: string) => {
                      onChange(itemValue);
                      itemValue === "Outro" ? setShowOtherInstruction(true) : setShowOtherInstruction(false)
                    }}
                    _selectedItem={{
                      bg: "primary.200",
                      endIcon: <CheckIcon size="5" />
                    }} size="md" fontSize="md">
                      <Select.Item label="Antes das refeições" value="Antes das refeições" />
                      <Select.Item label="Durante as refeições" value="Durante as refeições" />
                      <Select.Item label="Depois das refeições" value="Depois das refeições" />
                      <Select.Item label="Antes de dormir" value="Antes de dormir" />
                      <Select.Item label="Ao acordar" value="Ao acordar" />
                      <Select.Item label="Outro" value="Outro" />
                    </Select>
                    
                  )}
                  name="instructions"
                  defaultValue=""
                />
                }
                {
                  showOtherInstruction && showInstructions &&
                  <InputForm
                  name="other_instruction"
                  control={control}
                  placeholder="Escreva a instrução"
                  my={2}
                  />
                }
              </VStack>
              <Divider my={4}/>
                  
              <VStack>
                <HStack alignItems="center">
                  <FormControl.Label _text={{bold: true}} >Estoque do medicamento (Opcional):</FormControl.Label>
                  <Switch size="sm" colorScheme="primary" onToggle={() => setShowInventory(previousState => !previousState)} value={showInventory}></Switch>
                </HStack>
                {
                  showInventory && 
                  <InputForm
                    name="inventory"
                    control={control}
                    placeholder="Digite o estoque do medicamento"
                    my={2}
                    keyboardType="numeric"
                  />
                }
              </VStack>
            </Section>
              

          </FormControl>
              </TouchableWithoutFeedback>
              </VStack>
          </ScrollView>
          <VStack w="100%" bg={colors.white}>
            <Box px={4} mt={2} pb={2} w="100%">
              <ButtonPrimary
                title="Adicionar medicamento"
                w="full"
                mb={4}
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
              />

            </Box>

          </VStack>
    
    </>
  )
}
