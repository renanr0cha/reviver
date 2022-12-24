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

type Medicine = {
  days: 1,
  dosage: string,
  end_date: string,
  frequency: number,
  hours: Array<string>[],
  id: number,
  instruction: string | null,
  inventory: number,
  name: string,
  notifications: Array<string>,
  new_notifications: Array<newNotifications>,
  prescription: number,
  start_date: string,
  start_time: string,
  user_id: number,
  uuid: string,
}
interface newNotifications {
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

  function setDateToStringLocalFormat(date:Date) {
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear())}`
  }

  useEffect(() => {
      getAllMedicines()
    }, [])

  const [medicineTaken, getMedicineTaken] = useState<Medicine>();
  const [isLoading, setIsLoading] = useState(false)

  
  const getAllMedicines = async () => {

    const userToken = await AsyncStorage.getItem('token')
    const isCaregiver = await AsyncStorage.getItem("uuidPatient")

    await api.get(`/${userToken}/medicine/list${isCaregiver ? isCaregiver : ""}`)
    .then((response) => {
      const medicines:Array<Medicine> = response.data
      const medicine = medicines.find(element => element.id === id)
      getMedicineTaken(medicine)
    })
    .catch(error => console.error(`Error: ${error}`))
  }

  const medicineTakenConfirmation = async () => {

    const token = await AsyncStorage.getItem('token')
    const isCaregiver = await AsyncStorage.getItem("uuidPatient")

    await api.get(`/${token}/notification/create/${medicineTaken?.uuid}/${medicineTaken?.notifications[0]}/${isCaregiver ? isCaregiver : ""}`)
    .then((response) => {
      response.data.used === 1 ? showToast() : console.log(response.data) 
    })
    .catch(error => console.error(`Error: ${error}`))
  }

  function showToast() {
    toast.show({
      padding: 4,
      title: `Sucesso na confirmação da dose das ${medicineTaken?.new_notifications[0].time}!`,
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
                  <VStack px={4} pt={8}>
                    <View>
                      
                      <Text fontSize='lg' fontWeight='bold' mb={4} color={THEME.color.primary_800}><Text fontWeight='medium' color={colors.coolGray[800]}>Dose para ser administrada: </Text>{medicineTaken.dosage}</Text>
                      {
                        medicineTaken.instruction !== null &&
                          <Text fontSize='lg' fontWeight='bold' mb={6} color={THEME.color.primary_800}><Text fontWeight='medium' color={colors.coolGray[800]}>Instruções especiais: </Text>{medicineTaken.instruction}</Text>
                      }

                      <Text fontSize='lg' fontWeight='bold' mb={6} color={THEME.color.primary_800}><Text fontWeight='medium' color={colors.coolGray[800]}>Você deve parar dia: </Text>{setDateToStringLocalFormat(new Date(medicineTaken.end_date.slice(0, 10).replace(/-/g, '\/')))}</Text>
                    </View>
                    

                    
                  </VStack>
                </View>
                <VStack w="100%" bg={colors.white}>
                  <View px={4} mb={4}>
                    <Box
                      alignItems='center'
                      borderStyle='solid'
                      borderWidth={2}
                      p={2}
                      my={2}
                      borderColor={THEME.color.primary}
                      borderRadius='2xl'
                      bg={colors.white}
                    >
                      <Heading pb={1} fontWeight='bold' color={colors.coolGray[700]}>Seu estoque hoje: <Heading color={THEME.color.primary_800}>{medicineTaken.inventory}</Heading></Heading>
                    </Box>
                    <Text fontSize='md' fontWeight='medium' mb={10}><Text fontWeight='bold' color='#F13C46'>Atenção: </Text>Lembre de sempre renovar seu estoque quando estiver próximo ao fim!</Text>
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