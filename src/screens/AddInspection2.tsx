import {
  VStack,
  useTheme,
  FormControl,
  Box,
  Heading,
  Select,
  CheckIcon,
  ScrollView
} from 'native-base';
import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ButtonPrimary } from '../components/ButtonPrimary';
import { Header } from '../components/Header';
import { Section } from '../components/Section';
import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { getFormData, storeFormData } from '../lib/storage';

type Nav = {
  navigate: (value: string) => void;
}

interface AddInspection2FormData {
  speech: any,
  swallowing: any,
  hygiene: any,
  movement_in_bed: any,
  walk: any,
  tremors: any,
  rise_from_chair: any,
  posture: any,
  marching: any,
  slowness: any
}

const schema = Yup.object().shape({
  speech: Yup.string().required('Informe sua fala hoje'),
  swallowing: Yup.string().required('Informe sua deglutição hoje'),
  hygiene: Yup.string().required('Informe sua higiene hoje'),
  movement_in_bed: Yup.string().required('Informe sua movimentação na cama hoje'),
  walk: Yup.string().required('Informe seu caminhar hoje'),
  tremors: Yup.string().required('Informe seus tremores hoje'),
  rise_from_chair: Yup.string().required('Informe sua ação de levantar da cadeira hoje'),
  posture: Yup.string().required('Informe sua postura hoje'),
  marching: Yup.string().required('Informe sua marcha hoje'),
  slowness: Yup.string().required('Informe sua lentidão de movimentos hoje'),
})

export function AddInspection2() {
  const { colors } = useTheme()

  const retrieveData = async () => {
    const resp = await getFormData()
    return resp
  }
  const navigation = useNavigation<Nav>()

  const { control, handleSubmit, formState: { errors } } = useForm<AddInspection2FormData>({
    resolver: yupResolver(schema)
  })
  const onSubmit: SubmitHandler<AddInspection2FormData> = async (data) => {
    await storeFormData({
      speak: parseInt(data.speech),
      deglutition: parseInt(data.swallowing),
      hygiene: parseInt(data.hygiene),
      movement_in_bed: parseInt(data.movement_in_bed),
      walk: parseInt(data.walk),
      tremor: parseInt(data.tremors),
      rise: parseInt(data.rise_from_chair),
      posture: parseInt(data.posture),
      march: parseInt(data.marching),
      slowness: parseInt(data.slowness)
    })

    handleGoFingerTap()
  }

  function handleGoFingerTap() {
    navigation.navigate('fingertap')
  }

  return(
    <>
      <Header title='Adicionar - Seus sintomas'/>
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack alignItems="center" bg="white" w="100%" pb={10}>
            <FormControl>
              <Section title=''>
                <Heading fontSize="xl" mb={6}>Como está sua fala?</Heading>
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
                      <Select.Item label="Normal" value="1" />
                      <Select.Item label="Comprometimento leve, sem dificuldade em ser entendido" value="2" />
                      <Select.Item label="Comprometimento moderado, às vezes solicitado a repetir frases" value="3" />
                      <Select.Item label="Comprometimento intenso, frequentemente solicitado a repetir frases" value="4"/>
                      <Select.Item label="Incompreensível a maior parte do tempo" value="5" />
                    </Select>
                  )}
                  name="speech"
                  defaultValue="0"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.speech && errors.speech.message}</FormControl.Label>
              </Section>
              
              <Section title=''>
                <Heading fontSize="xl" mb={6}>Como está sua deglutição?</Heading>
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
                      <Select.Item label="Normal" value="1" />
                      <Select.Item label="Raros engasgos" value="2" />
                      <Select.Item label="Engasgos ocasionais" value="3" />
                      <Select.Item label="Necessita alimentos pastosos" value="4"/>
                      <Select.Item label="Necessita alimentação por sonda nasogástrica ou gastrostomia" value="5" />
                    </Select>
                  )}
                  name="swallowing"
                  defaultValue="0"

                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.swallowing && errors.swallowing.message}</FormControl.Label>
              </Section>
              
              <Section title=''>
                <Heading fontSize="xl" mb={6}>Como está sua higiene?</Heading>
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
                      <Select.Item label="Normal" value="1" />
                      <Select.Item label="Ação lenta, mas não precisa de ajuda" value="2" />
                      <Select.Item label="Precisa de ajuda no chuveiro ou apresenta-se muito lento nos cuidados de higiene" value="3" />
                      <Select.Item label="Necessita de assistência para se lavar, escovar os dentes, pentear-se, ir ao banheiro" value="4"/>
                      <Select.Item label="Sonda vesical (tubo para ajudar na eliminação da urina) ou outra ajuda mecânica" value="5" />
                    </Select>
                  )}
                  name="hygiene"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.hygiene && errors.hygiene.message}</FormControl.Label>
              </Section>

              <Section title=''>
                <Heading fontSize="xl" mb={6}>Como está sua movimentação na cama?</Heading>
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
                      <Select.Item label="Normal" value="1" />
                      <Select.Item label="Ação lenta e desajeitada, mas não precisa de ajuda" value="2" />
                      <Select.Item label="Pode girar sozinho na cama ou colocar lençóis, mas com grande dificuldade" value="3" />
                      <Select.Item label="Pode iniciar, mas não consegue rolar na cama ou colocar lençóis sozinho" value="4"/>
                      <Select.Item label="Incapaz" value="5" />
                    </Select>
                  )}
                  name="movement_in_bed"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.movement_in_bed && errors.movement_in_bed.message}</FormControl.Label>
              </Section>

              <Section title=''>
                <Heading fontSize="xl" mb={6}>Como está seu caminhar?</Heading>
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
                      <Select.Item label="Normal" value="1" />
                      <Select.Item label="Leve dificuldade, pode não balançar os braços ou tende a arrastar as pernas" value="2" />
                      <Select.Item label="Dificuldade moderada, mas necessita de pouca ou nenhuma ajuda" value="3" />
                      <Select.Item label="Dificuldade intensa de andar, necessitando de ajuda" value="4"/>
                      <Select.Item label="Não consegue andar, mesmo com ajuda" value="5" />
                    </Select>
                  )}
                  name="walk"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.walk && errors.walk.message}</FormControl.Label>
              </Section>
              <Section title=''>
                <Heading fontSize="xl" mb={6}>Como estão os tremores?</Heading>
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
                      <Select.Item label="Ausentes" value="1" />
                      <Select.Item label="Simples e com pouca frequência" value="2" />
                      <Select.Item label="Moderados, sendo capaz de lhe incomodar" value="3" />
                      <Select.Item label="Intensos, interferindo em muitas atividades" value="4"/>
                      <Select.Item label="Muito frequentes, interferindo na maioria das atividades" value="5" />
                    </Select>
                  )}
                  name="tremors"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.tremors && errors.tremors.message}</FormControl.Label>
              </Section>

              <Section title=''>
                <Heading fontSize="xl" mb={6}>Como está a ação de levantar da cadeira?</Heading>
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
                      <Select.Item label="Normal" value="1" />
                      <Select.Item label="Lenta ou pode precisar de mais de uma tentativa" value="2" />
                      <Select.Item label="Apoia-se nos braços da cadeira" value="3" />
                      <Select.Item label="Tende a cair para trás, podendo necessitar de várias tentativas, mas consegue levantar-se" value="4"/>
                      <Select.Item label="Incapaz de levantar-se sem ajuda" value="5" />
                    </Select>
                  )}
                  name="rise_from_chair"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.rise_from_chair && errors.rise_from_chair.message}</FormControl.Label>
              </Section>

              <Section title=''>
                <Heading fontSize="xl" mb={6}>Como está a sua postura?</Heading>
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
                      <Select.Item label="Normal reto" value="1" />
                      <Select.Item label="Postura não muito reta, levemente curvado, podendo ser normal em idosos" value="2" />
                      <Select.Item label="Moderadamente curvada, podendo apresentar inclinação leve para um lado" value="3" />
                      <Select.Item label="Intensamente curvada, podendo haver inclinação moderada para um lado" value="4"/>
                      <Select.Item label="Claramente curvada com anormalidade extrema da postura" value="5" />
                    </Select>
                  )}
                  name="posture"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.posture && errors.posture.message}</FormControl.Label>
              </Section>

              <Section title=''>
                <Heading fontSize="xl" mb={6}>Como está a sua marcha?</Heading>
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
                      <Select.Item label="Normal" value="1" />
                      <Select.Item label="Anda lentamente, podendo arrastar os pés com pequenas passadas" value="2" />
                      <Select.Item label="Anda com dificuldade, mas precisa de pouca ou nenhuma ajuda" value="3" />
                      <Select.Item label="Comprometimento intenso da marcha, necessitando de ajuda" value="4"/>
                      <Select.Item label="Não anda sozinho, mesmo com ajuda" value="5" />
                    </Select>
                  )}
                  name="marching"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.marching && errors.marching.message}</FormControl.Label>
              </Section>

              <Section title=''>
                <Heading fontSize="xl" mb={6}>Como está a lentidão dos movimentos?</Heading>
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
                      <Select.Item label="Nenhuma" value="1" />
                      <Select.Item label="Lentidão mínima, com possível redução na amplitude dos movimentos" value="2" />
                      <Select.Item label="Lentidão leve, com diminuição da amplitude dos movimentos" value="3" />
                      <Select.Item label="Lentidão MODERADA, com diminuição da amplitude dos movimentos" value="4"/>
                      <Select.Item label="Lentidão ACENTUADA, com diminuição da amplitude dos movimentos" value="5" />
                    </Select>
                  )}
                  name="slowness"
                />
                <FormControl.Label _text={{bold: true, fontSize: 12, color: colors.red[400]}}>{errors.slowness && errors.slowness.message}</FormControl.Label>
              </Section>

            </FormControl>
          </VStack>
        </TouchableWithoutFeedback>
      </ScrollView>
      <VStack w="100%" bg={colors.white}>
        <Box px={4} mt={2} pb={2} w="100%">
          <ButtonPrimary
            title="Avançar para Finger tap"
            w="full"
            onPress={handleSubmit(onSubmit)}
          />

        </Box>

      </VStack>
    </>
  )
}
