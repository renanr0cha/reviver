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
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback, Keyboard, Alert, BackHandler } from 'react-native';

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
import { calcDaysOfMedicineLeft } from '../services/calcDaysOfMedicineLeft';
import { Select as SelectAutoComplete } from '@mobile-reality/react-native-select-pro';
import { medList } from '../services/medList';


type Nav = {
  navigate: (value: string) => void;
}

interface ListProps {
  token: string,
  isCaregiver: boolean,
  medId: number
}
interface MedicineFormData {
  medicine: string,
  prescription: string,
  frequency: string,
  concentration_quant?: string,
  concentration_type?: string,
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
  medicine: Yup.string(),
  prescription: Yup.string().required('Selelcione se ele precisa ou não de receita'),
  frequency: Yup.string().required('É necessesário informar a frequência'),
  concentration_quant: Yup.string(),
  concentration_type: Yup.string(),
  dosage_quantity: Yup.string().required('Informe a quantidade'),
  dosage_unit: Yup.string().required('Informe a unidade'),
  start_date: Yup.string(),
  end_date: Yup.string(),
  instructions: Yup.string(),
  inventory: Yup.string()
})


export function AddMedicine() {

  const { colors } = useTheme()

  const [selectIsSelected, setSelectIsSelected] = useState<boolean>(false)

  const styles = {
    optionsList: {
      borderWidth: 1,
      borderColor: THEME.color.primary,
      borderRadius: 4,
    },
    option: {
      container: {
        borderBottomWidth: 1,
        borderColor: colors.coolGray[100],
      },
      text: {
        fontSize: 16
      },
      selected: {
        container: {
          backgroundColor: THEME.color.primary_200,
        }
      }
    },
    select: {
      container: {
          borderWidth: 1,
          borderColor: selectIsSelected ? THEME.color.primary : colors.coolGray[300],
          borderRadius: 4,
          backgroundColor: selectIsSelected ? THEME.color.primary_200 : "transparent",
          height: 46,
      },
      text: {
        fontSize: 16
      }
    }
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  const toast = useToast()

  function navigate() {
    setIsLoading(false)
    navigation.navigate("medlist")
  }

  function getMedicineList(token: string | null, isCaregiver: string | null, medId: number | null) {
    api.get(`/${token}/medicine/list${isCaregiver ? isCaregiver : ""}`)
      .then((response) => {
        const medicines = response.data
        const medicineData = medicines.find((medicine: {id: any}) => medicine.id === medId)

        console.log(medicineData)
        setMedicineNotifications(medicineData)
        calcDaysOfMedicineLeft(medicineData, medicineData.hours)
        showToast()
        setTimeout( navigate, 3000)
      })
      .catch(error => console.error(`Error: ${error}`))
  }

  function showToast() {
    toast.show({
      padding: 4,
      title: "Medicamento adicionado com sucesso!",
      placement: "bottom",
      duration: 2000,
      onCloseComplete: () => {
        Alert.alert("Notificações cadastradas com sucesso!", "Você será alertado toda vez que chegar a hora de tomar o medicamento")
      },
    })
      
  }
  const navigation = useNavigation<Nav>()

  const [startDate, setStartDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())
  const [medicineName, setMedicineName] = useState<string>()

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
    console.log(currentDate.getTimezoneOffset());

  };

  const onChangeTime = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setStartTime(currentDate);
    console.log(currentDate.getTimezoneOffset());

  };

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: currentMode === 'time' ? startTime : startDate,
      onChange: currentMode === 'time' ? onChangeTime : onChangeDate,
      mode: currentMode,
      is24Hour: true,
      minimumDate : new Date(),
    });
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const [isLoading, setIsLoading] = useState(false)

  const [showInputHours, setShowInputHours] = useState(false)
  
  //mostrar campo para adicionar informações adicionais
  const [showInstructions, setShowInstructions] = useState(false)

  const [showOtherInstruction, setShowOtherInstruction] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<MedicineFormData>({
    resolver: yupResolver(schema)
  });
  const onSubmit: SubmitHandler<MedicineFormData> = async (data) => {
    setIsLoading(true)

    function showNameAlert() {
      setIsLoading(false)
      Alert.alert("Insira o nome", "Favor inserir o nome do medicamento")
    }

    const medNameTest = medicineName === undefined || medicineName === ""
    if (data.medicine === "" && medNameTest) {
      showNameAlert()
      return
    }
    if (data.concentration_quant !== undefined && data.concentration_type === "" ) {
      setIsLoading(false)
      return Alert.alert("Informação incompleta", "Você inseriu a concentração, escolha também o tipo")
    }
    if (data.concentration_quant === undefined && data.concentration_type !== "" ) {
      setIsLoading(false)
      return Alert.alert("Informação incompleta", "Você escolheu o tipo, insira também a concentração")
    }

    const name = data.medicine === "" ? medicineName : data.medicine


    const concQuant = data.concentration_quant === undefined ? "" : data.concentration_quant
    const concType = data.concentration_type === "" ? "" : data.concentration_type
    const concentration = concQuant !== "" && concType !== "" ? `${concQuant} ${concType}` : undefined

    const prescription = data.prescription === "yes" ? true : false
    if (prescription === true && !data.inventory) {
      setIsLoading(false)

      return Alert.alert("Inserir estoque", "Se seu medicamento precisa de receita você precisa inserir o estoque que tem dele")
    }
    //tratando dados
    const dosage = `${data.dosage_quantity} ${data.dosage_unit}`
    const inventory =  data.inventory ? parseInt(data.inventory) : undefined
    const frequency = parseInt(data.frequency)
    const instruction = data.instructions === "Outro" && data.instructions !== undefined ? data.other_instruction : data.instructions

    const token = await AsyncStorage.getItem('token')

    const isCaregiver = await AsyncStorage.getItem("uuidPatient")
    await api.post(`/${token}/medicine/create${isCaregiver ? isCaregiver : ""}`, {
      name,
      prescription,
      dosage,
      frequency,
      concentration,
      start_date: setDateToStringDatabaseFormat(startDate),
      start_time: setTimeToString(startTime),
      days: 120, //remove when is no longer required
      instruction,
      inventory
    })
    .then((response) => {
      const medId = response.data.id
      getMedicineList(token, isCaregiver, medId)
      
    })
    .catch(error => console.error(`Error: ${error}`))
    
  };
  
  return(
    <>
          <Header title='Adicionar medicamento'/>
            <ScrollView>
              <VStack alignItems="center" bg="white" w="100%" pb={10}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FormControl>
            <Section title='Sobre o medicamento' mt={6}>
              <FormControl.Label _text={{bold: true}} mt={2}>Nome:</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectAutoComplete
                    searchable
                    options={medList}
                    placeholderText="Digite o nome do medicamento"
                    placeholderTextColor={colors.text[400]}
                    hideArrow
                    styles={styles}
                    onSelectOpened={() => setSelectIsSelected(true)}
                    onSelectClosed={() => setSelectIsSelected(false)}
                    onRemove={() => {
                      onChange("")
                    }}
                    onSelect={value => {
                      onChange(value.label)

                      console.log(value.label)
                    }}
                    onSelectChangeText={value => {
                      setMedicineName(value)
                      console.log(value)

                    }}
                    noOptionsText="Não encontrado, digite o nome inteiro manualmente"
                  />
                )}
                name="medicine"
                rules={{ required: 'Field is required' }}
                defaultValue=""
              />
              <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.medicine && errors.medicine.message}</FormControl.Label>
              <HStack justifyContent="space-between">
                        <VStack w="46%" mr={4}>
                          <FormControl.Label _text={{bold: true}} mt={2}>Concentração:</FormControl.Label>
                            <InputForm
                            name="concentration_quant"
                            control={control}
                            placeholder="Digite um número"
                            keyboardType="numeric"
                          />
                        </VStack>
                        <VStack w="46%">
                        <FormControl.Label _text={{bold: true}} mt={2}>Tipo de concentração:</FormControl.Label>
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
                                <Select.Item label="" value="" disabled/>
                                <Select.Item label="Miligrama(s) / mg" value="mg" />
                                <Select.Item label="Grama(s) / g" value="g" />
                              </Select>
                            )}
                            name="concentration_type"
                            rules={{ required: 'Field is required' }}
                            defaultValue=""
                          />
                          <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.concentration_type && errors.concentration_type.message}</FormControl.Label>
                        </VStack>
                        </HStack>
              <FormControl.Label _text={{bold: true}} mt={2}>Precisa de receita para adquirir?</FormControl.Label>
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
                    <Select.Item label="Sim, precisa de receita" value="yes" />
                    <Select.Item label="Não precisa de receita" value="no" />
                  </Select>
                )}
                name="prescription"
                rules={{ required: 'Field is required' }}
                defaultValue=""
              />
              <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.prescription && errors.prescription.message}</FormControl.Label>
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
            </Section>
            
            <Section title="Sobre a frequência e dose" mt={6}>

            <HStack justifyContent="space-between">
                <VStack w="46%" mr={4}>
                  <FormControl.Label _text={{bold: true}} mt={2}>Dose:</FormControl.Label>
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
                        <Select.Item label="1/4 - Um quarto" value="1/4" />
                        <Select.Item label="2/4 - Dois quartos" value="2/4" />
                        <Select.Item label="3/4 - Três quartos" value="3/4" />
                        <Select.Item label="1/2 - Meio(a)" value="1/2" />
                        <Select.Item label="1 - Um(a)" value="1" />
                        <Select.Item label="1.1/2 - Um(a) e meio(a)" value="1 e 1/2" />
                        <Select.Item label="1.1/4 - Um(a) e um quarto" value="1 e 1/4" />
                        <Select.Item label="1.2/4 - Um(a) e dois quartos" value="1 e 2/4" />
                        <Select.Item label="1.3/4 - Um(a) e três quartos" value="1 e 3/4" />
                        <Select.Item label="2 - Dois" value="2" />
                        <Select.Item label="3 - Três" value="3" />
                        <Select.Item label="4 - Quatro" value="4" />
                        <Select.Item label="5 - Cinco" value="5" />
                        <Select.Item label="6 - Seis" value="6" />
                        <Select.Item label="7 - Sete" value="7" />
                        <Select.Item label="8 - Oito" value="8" />
                        <Select.Item label="9 - Nove" value="9" />
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
                      minH={46}
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
                        <Select.Item label="Gota(s)" value="Gota(s)" />
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
                  minH={46}
                  defaultValue=""
                  onValueChange={(itemValue: string) => {
                    onChange(itemValue);
                    setShowInputHours(true);
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
                defaultValue=""
              />
              <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.frequency && errors.frequency.message}</FormControl.Label>
                  {
                    showInputHours &&
                    <VStack>
                      <FormControl.Label _text={{bold: true}} mt={2}>Horário que começou a tomar:"</FormControl.Label>
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
                  }
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
                    minH={46}
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
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
              />

            </Box>

          </VStack>
    
    </>
  )
}
