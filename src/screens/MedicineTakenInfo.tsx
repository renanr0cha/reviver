import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, useTheme, useToast, View, VStack } from 'native-base';
import { Header } from '../components/Header';
import { THEME } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { Loading } from '../components/Loading';
import { ButtonPrimary } from '../components/ButtonPrimary';
import * as Notifications from 'expo-notifications'
import { useNavigation } from '@react-navigation/native';
import { calcDaysOfMedicineLeft } from '../services/calcDaysOfMedicineLeft';

type Medicine = {
  days: 1,
  dosage: string,
  concentration?: string,
  end_date: string,
  frequency: number,
  hours: string[],
  id: number,
  instruction: string | null,
  inventory: number,
  name: string,
  notifications: Array<string>,
  new_notifications: Array<NotificationsData>,
  prescription: number,
  start_date: string,
  start_time: string,
  user_id: number,
  uuid: string,
}
interface NotificationsData {
  date: string,
  time: string
}

type Nav = {
  navigate: (value: string) => void;
}

export function MedicineTakenInfo({route}: any) {
  const { colors } = useTheme()
  const toast = useToast()
  const navigation = useNavigation<Nav>()


  const id = Number(route.params?.id)
  const notificationIdentifier = route.params?.identifier
  const hour = route.params?.identifier.slice(-5)

  useEffect(() => {
      getAllMedicines()
    }, [])

  const [medicineTaken, setMedicineTaken] = useState<Medicine>();

  const [isLoading, setIsLoading] = useState(false)
  
  const getAllMedicines = async () => {

    const userToken = await AsyncStorage.getItem('token')
    const isCaregiver = await AsyncStorage.getItem("uuidPatient")
    
    await api.get(`/${userToken}/medicine/list${isCaregiver ? isCaregiver : ""}`)
    .then((response) => {
      const medicines = response.data
      const medicine = medicines.find((medicine: {id: any}) => medicine.id  === id)
      setMedicineTaken(medicine)
      calcDaysOfMedicineLeft(medicine, medicine.hours)
      })
    .catch(error => console.error(`Error: ${error}`))
  }

  const medicineTakenConfirmation = async () => {

    const token = await AsyncStorage.getItem('token')

    const oldInventory = medicineTaken?.inventory
    const inventory = oldInventory ? oldInventory-1 : 0
    
    await api.put(`/${token}/medicine/update/${medicineTaken?.uuid}`, {
      name: medicineTaken?.name,
      prescription: medicineTaken?.prescription,
      dosage: medicineTaken?.dosage,
      frequency: medicineTaken?.frequency,
      start_date: medicineTaken?.start_date,
      start_time: medicineTaken?.start_time,
      days: 120, //remove when is no longer needed
      instruction: medicineTaken?.instruction,
      inventory
    })
    .then((response) => {
      console.log("Agora vem a response do update")
      console.log(response.data);
      showToast()
    })
    .catch(error => console.error(`Error: ${error}`))
    
  //   console.log(`/${token}/notification/create/${medicineTaken?.uuid}/${medicineTaken?.notifications[0]}/${isCaregiver ? isCaregiver : ""}`);
  //   await api.get(`/${token}/notification/create/${medicineTaken?.uuid}/${medicineTaken?.notifications[0]}/${isCaregiver ? isCaregiver : ""}`)
  //   .then((response) => {
  //     if (response.data.used === 1) {
        
  //     }
  //     console.log(response.data) 
  //   })
  //   .catch(error => console.error(`Error: ${error}`))
    }

  function showToast() {
    toast.show({
      padding: 4,
      title: `Sucesso na confirmação da dose das ${hour}!`,
      placement: "bottom",
      duration: 3000,
    })
      
  }

  function dismissMedicineTakenNotification() {
    Notifications.dismissNotificationAsync(notificationIdentifier)
  }

  function navigate() {
    setIsLoading(false)
    navigation.navigate("home")
  }

  function handleConfirmationOfMedicineTaken() {

    setIsLoading(true)
    medicineTakenConfirmation()
    dismissMedicineTakenNotification()
    navigate()
  }
  
  return (
    <>
        {
          medicineTaken !== undefined
            ? <VStack bg={colors.white} justifyContent="space-between" h='100%' w='100%' flex={1}>
                <View w='100%'>
                  <Header title="Confirmação de dose" />
                  <VStack bg={THEME.color.primary} pl={4} >
                      <Heading color="#FFFFFF" mb={4}>
                        {medicineTaken.name}
                      </Heading>
                    </VStack>
                  <VStack px={4} pt={6}>
                    <View>
                      {
                        medicineTaken.concentration &&
                          (
                            <>
                              <Text fontSize='lg' fontWeight='medium' color={colors.coolGray[800]}>Informação de concentração: </Text>
                              <Text fontSize='lg' fontWeight='bold' mb={4} color={THEME.color.primary_800}>{medicineTaken.concentration}</Text>
                            </>
                          )
                      }
                      <Text fontSize='lg' fontWeight='medium' color={colors.coolGray[800]}>Dose para ser administrada:</Text>
                      <Text fontSize='lg' fontWeight='bold' mb={4} color={THEME.color.primary_800}>{medicineTaken.dosage}</Text>
                      {
                        medicineTaken.instruction !== null &&
                          (
                            <>
                              <Text fontSize='lg' fontWeight='medium' color={colors.coolGray[800]}>Instruções especiais: </Text>
                              <Text fontSize='lg' fontWeight='bold' mb={4} color={THEME.color.primary_800}>{medicineTaken.instruction}</Text>
                            </>
                          )
                      }
                      {
                        medicineTaken.inventory > 0 &&
                          (
                            <>
                              <Text fontSize='lg' fontWeight='medium' color={colors.coolGray[800]}>Quantidade de estoque: </Text>
                              <Text fontSize='lg' fontWeight='bold' mb={4} color={THEME.color.primary_800}>{medicineTaken.inventory}</Text>
                            </>
                          )
                      }
                    </View>
                    

                    
                  </VStack>
                </View>
                <VStack w="100%" bg={colors.white}>
                  <View px={4} mb={4}>
                    <Box
                      alignItems='center'
                      justifyContent="center"
                      borderStyle='solid'
                      borderWidth={2}
                      p={2}
                      my={2}
                      borderColor={THEME.color.primary}
                      borderRadius='2xl'
                      bg={colors.white}
                    >
                      <Heading fontSize="lg" fontWeight='bold' color={colors.coolGray[700]}>ATUAL ESTOQUE PARA: <Heading color={THEME.color.primary_800}>{Math.floor(medicineTaken.inventory/medicineTaken.hours.length)} dias</Heading></Heading>
                    </Box>
                    <Text fontSize='md' fontWeight='medium' mb={6}><Text fontWeight='bold' color='#F13C46'>Atenção: </Text>Lembre de sempre renovar seu estoque quando estiver próximo ao fim!</Text>
                    <Text fontSize='lg' fontWeight='bold'>Você confirma que tomou a dose do seu medicamento ainda pouco?</Text>
                  </View>
                  <Box px={4} mt={2} pb={2} w="100%">
                    <ButtonPrimary
                      title="Confirmo"
                      textAlign="center"
                      w="100%"
                      onPress={handleConfirmationOfMedicineTaken}
                      isLoading={isLoading}
                    />
                  </Box>
                </VStack>
              </VStack>
            : <Loading />
        }
    </>
  );
}