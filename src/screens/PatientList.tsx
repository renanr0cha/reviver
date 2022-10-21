import {
  VStack,
  useTheme,
  HStack,
  Box,
  Heading,
  IconButton,
  ScrollView,
  Modal,
  Text,
  Button
} from 'native-base';
import React, { useState } from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ButtonPrimary } from '../components/ButtonPrimary';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationAction, useFocusEffect } from '@react-navigation/native';
import { PatientCard } from '../components/PatientCard';
import { SignOut } from 'phosphor-react-native';
import { useAuth } from '../hooks/auth';
import { THEME } from '../styles/theme';

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
  }
  const deletePatientUuid = async () => {
    await AsyncStorage.removeItem('uuidPatient')
  }
  // get patient list from database
  const getAllPatients = async () => {

    const userToken = await AsyncStorage.getItem('token')
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
        bg={THEME.color.primary}
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
          bgColor={THEME.color.primary}
          _pressed={{
            bg: THEME.color.primary_800
          }}
        />
      </HStack>
      
      <ScrollView bg="white">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack alignItems="center" justifyContent="space-between" bg="white" w="100%" h="100%" >
            <VStack w="100%" pb={10} bg="white" >
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
                })
                :
                (
                  <>
                    <VStack alignItems="center" justifyContent="center" bg="white" w="100%"  mt={75}>
                      <Heading fontSize="lg" w={300} textAlign="center" mt={40}>Você não tem nenhum paciente cadastrado</Heading>
                      <Text fontSize="md" mt={6}>Cadastre um novo no botão abaixo</Text>
                    </VStack>
                    
                  </>
                )
              }
            </VStack>
          </VStack>
        </TouchableWithoutFeedback>
      </ScrollView>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} >
        <Modal.Content maxWidth="400px">
          <Modal.Header _text={{ fontWeight:"bold"}} >Selecionar este paciente?</Modal.Header>
          <Modal.Body>
            <Text>
              Todas as informações que você ver e cadastrar após confirmar serão salvos para o paciente selecionado até você fazer Logout e voltar a entrar como paciente
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="coolGray" onPress={() => {
              setShowModal(false);
              deletePatientUuid()
            }}>
                CANCELAR
              </Button>
              <Button
              bg={THEME.color.primary}
              _pressed={{ bg: THEME.color.primary_800}}
              onPress={() => {
              setShowModal(false);
              
              handleSelectPatient()
            }}>
                CONFIRMAR
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
            <VStack w="100%" bg={colors.white} >
              <Box px={4} mt={2} pb={2} w="100%" >
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
