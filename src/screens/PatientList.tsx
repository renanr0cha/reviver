import { VStack, useTheme, HStack, Box, Heading, IconButton, ScrollView, Modal, Text, Button } from 'native-base';
import React, { useState } from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ButtonPrimary } from '../components/ButtonPrimary';

import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationAction, useFocusEffect } from '@react-navigation/native';
import { PatientCard } from '../components/PatientCard';
import { SignOut } from 'phosphor-react-native';
import { useAuth } from '../hooks/auth';

type Nav = NavigationAction & {
  goBack(): void;
  navigate: (value: string) => void;
}

export function PatientList() {

  const [showModal, setShowModal] = useState(false);
  const [patients, getPatients] = useState([]);

  const { signOut } = useAuth();

  
  //navigation
  const navigation = useNavigation<Nav>()
  function handleSelectPatient() {
    navigation.navigate("home")
  }
  function handleAddPatient() {
    navigation.navigate("addpatient")
  }
  
  //get all patients when screen is shown
  useFocusEffect(
    React.useCallback(() => {
      getAllPatients()
    }, []))

  //set and delete patient uuid token
  const setPatientUuid = async (uuid: any) => {
    await AsyncStorage.setItem('uuidPatient', `/${uuid}`)
    console.log(await AsyncStorage.getItem('uuidPatient'))
  }
  const deletePatientUuid = async () => {
    await AsyncStorage.removeItem('uuidPatient')
  }
  // get patient list from database
  const getAllPatients = async () => {

    const userToken = await AsyncStorage.getItem('token')
    console.log(userToken)
    api.get(`/${userToken}/patient/list`)
    .then((response) => {
      const allPatients = response.data
      getPatients(allPatients)
    })
    .catch(error => console.error(`Error: ${error}`))
  }

  const { colors } = useTheme()
    return(
          <>
            <HStack
              w="full"
              justifyContent="space-between"
              alignItems="center"
              bg={colors.primary[600]}
              pb={4}
              pt={10}
              px={4}
            >
              <Heading color={colors.white}  textAlign="left" fontSize="xl" ml={4} flex={1} >
                Selecione seu paciente
              </Heading>
              <IconButton
                icon={<SignOut size={26} color={colors.white} />}
                onPress={signOut}
                borderRadius="full"
                bgColor={colors.primary[600]}
                _pressed={{
                  bg: colors.primary[700]
                }}
              />
            </HStack>
            
            <ScrollView bg="white">
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <VStack alignItems="center" justifyContent="space-between" bg="white" w="100%" h="100%">
                  <VStack w="100%" pb={10} bg="white" >
                    {/* populate component with data from api */}
                    {
                      patients.length > 0 ? 
                      patients.map((patient: any, index: any) => {
                        return (
                          <PatientCard
                            name={patient.name}
                            birthDate={`${String(new Date(patient.birth_date).getDate()).padStart(2, "0")}/${String(new Date(patient.birth_date).getMonth() + 1).padStart(2, "0")}/${String(new Date(patient.birth_date).getFullYear())}`}
                            cpf={patient.cpf}
                            phone={patient.phone}
                            sex={patient.sex === "m" ? "Masculino" : "Feminino"}
                            key={index} onPress={() => {
                              setPatientUuid(patient.uuid)
                              setShowModal(true)
                            }}
                            />
                              
                        )
                      }) : () => {
                        return(
                          <>
                            <VStack alignItems="center" justifyContent="center" bg="white" w="100%" h="full">
                              <Heading fontSize="lg">Você não tem nenhum paciente cadastrado</Heading>
                            </VStack>
                            
                          </>
                        )
                      }
                    }

                  </VStack>
                </VStack>
              </TouchableWithoutFeedback>
            </ScrollView>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Selecionar este paciente?</Modal.Header>
                <Modal.Body>
                  <Text>
                    Todas as informações que você ver e cadastrar serão salvos para o paciente selecionado até você fazer Logout e voltar a entrar como paciente
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                    setShowModal(false);
                    deletePatientUuid()
                  }}>
                      CANCELAR
                    </Button>
                    <Button onPress={() => {
                    setShowModal(false);
                    handleSelectPatient()
                  }}>
                      CONFIRMAR
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
                  <VStack w="100%" bg={colors.white}>
                    <Box px={4} mt={2} pb={2} w="100%">
                      <ButtonPrimary
                        title="Adicionar novo paciente"
                        textAlign="center"
                        w="full"
                        onPress={handleAddPatient}
                      />
                    </Box>
                  </VStack>
          </>
        )
}
