import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Box,
  Button,
  Heading,
  Modal,
  ScrollView,
  Text,
  VStack,
  useTheme,
  useToast
} from 'native-base';
import React, { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { MedicineCard } from '../components/MedicineCard';
import api from '../services/api';
import { cancelInventoryNotifications } from '../services/cancelInventoryNotifications';
import { cancelNotifications } from '../services/cancelNotifications';
import { verifyIfMedicineNotificationsAreSet } from '../services/verifyIfMedicineNotificationsAreSet';
import { THEME } from '../styles/theme';



type Nav = {
  navigate: (value: string, params: object) => void;
}

export function MedicineList() {

  const toast = useToast()
  const { colors } = useTheme()
  const navigation = useNavigation<Nav>()

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingScreen, setIsLoadingScreen] = useState(false)


  const [showModal, setShowModal] = useState(false);
  const [medicineToDeleteUuid, setMedicineToDeleteUuid] = useState<string>('');
  const [medicineToDeleteName, setMedicineToDeleteName] = useState<string>('');
  const [medicineToDeleteHours, setMedicineToDeleteHours] = useState<Array<string>>([]);


  function handleAddMedicine() {
    navigation.navigate("addmed", {})
  }

  function handleEditMedicine(medicineUuid: string) {
    navigation.navigate("editmed", {
      medicineUuid
    })
  }

  const handleDeleteMedicine = (medicineUuid: string, medicineName: string, medicineHours: Array<string>) => {
    setShowModal(true)
    setMedicineToDeleteUuid(medicineUuid)
    setMedicineToDeleteName(medicineName)
    setMedicineToDeleteHours(medicineHours)

  }


  function showToast() {
    toast.show({
      padding: 4,
      title: "Medicamento removido com sucesso!",
      placement: "bottom",
      duration: 4000,
    })
      
  }

  const removeMedicine = async () => {
    const userToken = await AsyncStorage.getItem('token')

    await api.delete(`/${userToken}/medicine/delete/${medicineToDeleteUuid}`)
    .then((response) => {
      cancelNotifications(medicineToDeleteName, medicineToDeleteHours)
      cancelInventoryNotifications(medicineToDeleteUuid)
      showToast()
      setIsLoading(false)
      setShowModal(false)
      setMedicineToDeleteName("")
      setMedicineToDeleteUuid("")
      setMedicineToDeleteHours([])
      getAllMedicines()
    })
    .catch(error => console.error(`Error: ${error}`))


  }



  useFocusEffect(
    React.useCallback(() => {
      getAllMedicines()
    }, []))

  const [medicines, getMedicines] = useState([]);
  
  const getAllMedicines = async () => {
    setIsLoadingScreen(true)

    const userToken = await AsyncStorage.getItem('token')
    const isCaregiver = await AsyncStorage.getItem("uuidPatient")

    await api.get(`/${userToken}/medicine/list${isCaregiver ? isCaregiver : ""}`)
    .then((response) => {
      const allMedicines = response.data
      getMedicines(allMedicines)
      verifyIfMedicineNotificationsAreSet(allMedicines)
      setIsLoadingScreen(false)
    })
    .catch(error => console.error(`Error: ${error}`))
    setIsLoadingScreen(false)

  }
  
  return(
    <>
      <Header title='Meus medicamentos'/>
      {
        isLoadingScreen ?
        (
          <Loading />
        )
        :
        (
          <ScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <VStack alignItems="center" justifyContent="space-between" bg="coolGray.100" w="100%" h="full" pb={8}>
                <VStack w="100%">
                  {
                    medicines.length > 0 ? 
                      medicines.map((medicine: any, index: any) => {
                        return (
                          <MedicineCard
                            medicineName={medicine.name}
                            frequency={medicine.hours.length}
                            startTime={medicine.hours.sort() && medicine.hours[0]}
                            secondTime={medicine.hours[1]}
                            thirdTime={medicine.hours[2]}
                            fourthTime={medicine.hours[3]}
                            dosage={medicine.dosage}
                            concentration={medicine.concentration}
                            days={medicine.days}
                            endDate={`${String(new Date(medicine.end_date).getDate()).padStart(2, "0")}/${String(new Date(medicine.end_date).getMonth() + 1).padStart(2, "0")}/${String(new Date(medicine.end_date).getFullYear())}`}
                            key={index}
                            inventory={medicine.inventory}
                            onPressDelete={() => handleDeleteMedicine(medicine.uuid, medicine.name, medicine.hours)}
                            onPressUpdate={() => handleEditMedicine(medicine.uuid)}
                          />
                        )
                      })
                    :
                    (
                      <>
                        <VStack alignItems="center" justifyContent="center"  w="100%"  mt={75}>
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
        )
      }
      
      <VStack w="100%" bg={colors.white} borderTopLeftRadius={34} borderTopRightRadius={34}>
        <Box px={4} mt={2} pb={2} w="100%">
          <ButtonPrimary
            title="Adicionar novo medicamento"
            textAlign="center"
            w="100%"
            onPress={handleAddMedicine}
          />
        </Box>
      </VStack>
      <Modal isOpen={showModal} closeOnOverlayClick={false} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.Header _text={{ fontWeight:"bold"}} >Excluir medicamento</Modal.Header>
              <Modal.Body>
                <Text>
                  <Text fontWeight="bold">Você tem certeza que deseja excluir esse medicamento? </Text>
                  Você não receberá mais nenhuma notificação ou aviso sobre ele.
                </Text>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    bg="white"
                    borderWidth={1}
                    borderColor={THEME.color.primary}
                    _focus={{ bg: THEME.color.primary_800}}
                    _pressed={{ bg: THEME.color.primary_200}}
                    onPress={() => {
                      setShowModal(false)
                    }}
                  >
                    <Text color={THEME.color.primary}>CANCELAR</Text>
                  </Button>
                  <Button
                  bg={colors.error[500]}
                  _focus={{ bg: colors.error[800]}}
                  _pressed={{ bg: colors.error[200]}}
                  isLoading={isLoading}
                  onPress={() => {
                    setIsLoading(true)
                    removeMedicine()
                  }}
                  >
                    EXCLUIR
                  </Button>

                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
    </>
  )
}
