import {
  VStack,
  useTheme,
  Box,
  Heading,
  ScrollView,
  Text
} from 'native-base';
import React, { useState } from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { Header } from '../components/Header';
import { MedicineCard } from '../components/MedicineCard';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

type Nav = {
  navigate: (value: string) => void;
}

export function MedicineList() {

  const { colors } = useTheme()
  const navigation = useNavigation<Nav>()

  function handleAddMedicine() {
    navigation.navigate("addmed")
  }

  useFocusEffect(
    React.useCallback(() => {
      getAllMedicines()
    }, []))

  const [medicines, getMedicines] = useState([]);
  
  const getAllMedicines = async () => {

    const userToken = await AsyncStorage.getItem('token')
    const isCaregiver = await AsyncStorage.getItem("uuidPatient")

    await api.get(`/${userToken}/medicine/list${isCaregiver ? isCaregiver : ""}`)
    .then((response) => {
      const allMedicines = response.data
      console.log(allMedicines)
      getMedicines(allMedicines)
    })
    .catch(error => console.error(`Error: ${error}`))
  }
  return(
    <>
      <Header title='Meus medicamentos'/>
      <ScrollView bg="white">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack alignItems="center" justifyContent="space-between" bg="white" w="100%" h="full" pb={10}>
            <VStack w="100%">
              {
                medicines.length > 0 ? 
                medicines.map((medicine: any, index: any) => {
                  return (
                    <MedicineCard medicineName={medicine.name} frequency={medicine.hours.length} startTime={medicine.hours[0]} secondTime={medicine.hours[1]} thirdTime={medicine.hours[2]} fourthTime={medicine.hours[3]} dosage={medicine.dosage} days={medicine.days} endDate={`${String(new Date(medicine.end_date).getDate()).padStart(2, "0")}/${String(new Date(medicine.end_date).getMonth() + 1).padStart(2, "0")}/${String(new Date(medicine.end_date).getFullYear())}`} key={index} inventory={medicine.inventory}/>
                  )
                })
                :
                (
                  <>
                    <VStack alignItems="center" justifyContent="center" bg="white" w="100%"  mt={75}>
                      <Heading fontSize="lg" w={300} textAlign="center" mt={40}>Você não possui nenhum medicamento cadastrado</Heading>
                      <Text fontSize="md" mt={6}>Cadastre um novo no botão abaixo</Text>
                    </VStack>
                  </>
                )
              }
            </VStack>
          </VStack>
        </TouchableWithoutFeedback>
      </ScrollView>
      <VStack w="100%" bg={colors.white}>
        <Box px={4} mt={2} pb={2} w="100%">
          <ButtonPrimary
            title="Adicionar novo medicamento"
            textAlign="center"
            w="100%"
            onPress={handleAddMedicine}
          />
        </Box>
      </VStack>
    </>
  )
}
