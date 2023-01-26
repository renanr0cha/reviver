import {
  VStack,
  useTheme,
  HStack,
  Button,
  FormControl,
  Select,
  CheckIcon,
  Box,
  Switch,
  ScrollView,
  useToast
} from 'native-base';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';

import { ButtonPrimary } from '../components/ButtonPrimary';
import { Header } from '../components/Header';
import { Section } from '../components/Section';
import { InputForm } from '../components/InputForm';


import * as Yup from "yup"
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import api from '../services/api';
import { setMedicineNotifications } from '../services/setMedicineNotifications';
import { THEME } from '../styles/theme';
import { Loading } from '../components/Loading';
import { cancelNotifications } from '../services/cancelNotifications';


type Nav = {
  navigate: (value: string) => void;
  addListener: any;
  dispatch: any
}
interface MedicineFormData {
  medicine: string,
  prescription: string,
  frequency: string,
  dosage_quantity: string,
  dosage_unit: string,
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
  start_date: Yup.string(),
  end_date: Yup.string(),
  quantity_of_days: Yup.string(),
  instructions: Yup.string(),
  inventory: Yup.string().required('Informe o estoque do medicamento')
})


export function EditMedicine({ route }: any) {

  const toast = useToast()
  const navigation = useNavigation<Nav>()

  const [oldMedicineNotificationHours, setOldMedicineNotificationHours] = useState<string[]>([])

  console.log(oldMedicineNotificationHours);
  const medicineUuid = route.params?.medicineUuid

  function navigate() {
    setIsLoading(false)
    navigation.navigate("medlist")

  }

  function getMedicineList(token: string | null, isCaregiver: string | null, medId: number | null) {
    api.get(`/${token}/medicine/list${isCaregiver ? isCaregiver : ""}`)
      .then((response) => {
        const medicines = response.data
        const medicineData = medicines.find((medicine: {id: any}) => medicine.id === medId)
        
        cancelNotifications(medicineData.name, oldMedicineNotificationHours)
        setMedicineNotifications(medicineData)
        showToast()
        setTimeout( navigate, 3000)
      })
      .catch(error => console.error(`Error: ${error}`))
  }

  async function getMedicineInfo( medicineUuid: string | null) {

    const token = await AsyncStorage.getItem('token')

    const isCaregiver = await AsyncStorage.getItem("uuidPatient")

    await api.get(`/${token}/medicine/list${isCaregiver ? isCaregiver : ""}`)
      .then((response) => {
        const medicines = response.data
        const medicineData = medicines.find((medicine: {uuid: any}) => medicine.uuid === medicineUuid)

        const dosageQuantity = medicineData?.dosage.slice(0, 1)
        const dosageUnit = medicineData?.dosage.slice(2)
        const prescriptionValue = medicineData?.prescription === 1 ? "yes" : "no"

        setOldMedicineNotificationHours(medicineData.hours)
        
        const instructions = [
          "Antes das refeições",
          "Durante as refeições",
          "Depois das refeições",
          "Antes de dormir",
          "Ao acordar",
      ]

        const verifiedInstructions = instructions.map(instruction => {
            if (instruction !== medicineData.instruction) {
              return undefined
            } else {
              return instruction
            }
          });

        const filteredInstructions = verifiedInstructions.filter(function(x:any) {
          return x !== undefined;
        })
        
        // console.log(medicineData)
        const values = {
          medicine: medicineData?.name,
          prescription: prescriptionValue,
          frequency: String(medicineData.frequency),
          dosage_quantity: dosageQuantity,
          dosage_unit: dosageUnit,
          start_date: medicineData?.start_date,
          end_date: "",
          quantity_of_days: String(medicineData?.days),
          instructions: filteredInstructions[0],
          inventory: String(medicineData?.inventory),
          other_instruction: undefined

        }

        if (filteredInstructions[0] === undefined) {
          values.other_instruction = medicineData.instruction
          values.instructions = "Outro"
          setShowOtherInstruction(true)
        }
        setStartDate(new Date(medicineData.start_date))
        setStartTime(new Date(medicineData.start_time))
        reset(values)
        setIsLoadingScreen(false)

      })
      .catch(error => console.error(`Error: ${error}`))
  }

  function showToast() {
    toast.show({
      padding: 4,
      title: "Medicamento alterado com sucesso!",
      placement: "bottom",
      duration: 2000,
      onCloseComplete: () => {
        Alert.alert("Notificações re-cadastradas com sucesso!", "Você será alertado toda vez que chegar a hora de tomar o medicamento")
      },
    })
      
  }

  const [startDate, setStartDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())

  function setDateToStringDatabaseFormat(date:Date) {
    return `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  function setDateToStringLocalFormat(date:Date) {
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear())}`
  }

  function setTimeToString(time:Date) {
    return `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`
  }

  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setStartDate(currentDate);
  };

  const onChangeTime = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setStartTime(currentDate);
  };

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: currentMode === 'time' ? startTime : startDate,
      onChange: currentMode === 'time' ? onChangeTime : onChangeDate,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingScreen, setIsLoadingScreen] = useState(true)

  //mostrar campo para adicionar informações adicionais
  const [showInstructions, setShowInstructions] = useState(true)

  const [showOtherInstruction, setShowOtherInstruction] = useState(false)

  //mostrar campo para adicionar estoque
  const [showInventory, setShowInventory] = useState(true)

  const { control, handleSubmit, formState: { errors }, reset } = useForm<MedicineFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      medicine: "",
      prescription: "",
      frequency: "",
      dosage_quantity: "",
      dosage_unit: "",
      start_date: "",
      start_time: "",
      end_date: "",
      quantity_of_days: "",
      instructions: "",
      inventory: "",
    }
  });
  const onSubmit: SubmitHandler<MedicineFormData> = async (data) => {
    setIsLoading(true)

    //tratando dados
    const dosage = `${data.dosage_quantity} ${data.dosage_unit}`
    const prescription = data.prescription === "yes" ? true : false
    const inventory =  data.inventory ? parseInt(data.inventory) : undefined
    const frequency = parseInt(data.frequency)
    const instruction = data.instructions === "Outro" && data.instructions !== undefined ? data.other_instruction : data.instructions

    const token = await AsyncStorage.getItem('token')

    const isCaregiver = await AsyncStorage.getItem("uuidPatient")
    await api.put(`/${token}/medicine/update/${medicineUuid}${isCaregiver ? isCaregiver : ""}`, {
      name: data.medicine,
      prescription,
      dosage,
      frequency,
      start_date: setDateToStringDatabaseFormat(startDate),
      start_time: setTimeToString(startTime),
      days: 120, //removed when is no longer needed
      instruction,
      inventory
    })
    .then((response) => {
      const medId = response.data.id
      getMedicineList(token, isCaregiver, medId)
    })
    .catch(error => console.error(`Error: ${error}`))
    
  };

  useEffect(() => {
    getMedicineInfo(medicineUuid)
  }, [reset])
  
  const { colors } = useTheme()
  return(
    <>
          <Header title='Alterar medicamento'/>
          {
            !isLoadingScreen ?
              (
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
                              setShowInventory(itemValue === "yes" ? true : false)
                            }}
                            _selectedItem={{
                              bg: THEME.color.primary_200,
                              endIcon: <CheckIcon size="5" />
                            }} size="md" fontSize="md">
                            <Select.Item label="Sim, precisa de receita" value="yes" />
                            <Select.Item label="Não precisa de receita" value="no" />
                          </Select>
                        )}
                        name="prescription"
                        rules={{ required: 'Field is required' }}
                      />
                      <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.prescription && errors.prescription.message}</FormControl.Label>
                      {
                          showInventory &&
                          <VStack >
                            <FormControl.Label _text={{bold: true}} >Estoque do medicamento:</FormControl.Label>
                            <InputForm
                            name="inventory"
                            control={control}
                            placeholder="Digite o estoque do medicamento"
                            my={2}
                            keyboardType="numeric"
                          />
                          </VStack> 
                        }
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
                                bg: THEME.color.primary_200,
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
                                bg: THEME.color.primary_200,
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
                          onValueChange={(itemValue: string) => {
                            onChange(itemValue);
                          }}
                          _selectedItem={{
                            bg: THEME.color.primary_200,
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
                      />
                      <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.frequency && errors.frequency.message}</FormControl.Label>
                        <VStack>
                          <FormControl.Label _text={{bold: true}} mt={2}>Horário que começou a tomar:</FormControl.Label>
                              <Button
                                onPress={showTimepicker}
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
                                  color: colors.text[600],
                                  fontSize: "md",
                                  fontFamily: "body"
                                }}
                              >
                                    {setTimeToString(startTime)}
                              </Button>
                        </VStack>
                    </Section>
                    <Section title="Sobre a duração do tratamento" mt={6}>
                      <FormControl.Label _text={{bold: true}} mt={2}>Início do tratamento:</FormControl.Label>
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
                          color: colors.text[600],
                          fontSize: "md",
                          fontFamily: "body"
                        }}
                      >
                        {setDateToStringLocalFormat(startDate)}
                      </Button>

                      <VStack>
                        <HStack alignItems="center">
                          <FormControl.Label _text={{bold: true}} mt={2}>Instruções diversas (Opcional):</FormControl.Label>
                          <Switch size="sm" colorScheme="orange" onToggle={() => setShowInstructions(previousState => !previousState)} value={showInstructions}></Switch>
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
                              bg: THEME.color.primary_200,
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
                    </Section>

                  </FormControl>
                      </TouchableWithoutFeedback>
                      </VStack>
                </ScrollView>
              )
              :
              <Loading />
          }
          <VStack w="100%" bg={colors.white}>
            <Box px={4} mt={2} pb={2} w="100%">
              <ButtonPrimary
                title="Adicionar medicamento"
                w="full"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
              />
            </Box>

          </VStack>
    
    </>
  )
}
