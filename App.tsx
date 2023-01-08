import React, { useRef, useEffect } from "react";
import { NativeBaseProvider, StatusBar } from "native-base";
import { useFonts, Roboto_400Regular, Roboto_700Bold, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { THEME } from "./src/styles/theme"


import { Subscription } from 'expo-modules-core'
import * as Notifications from 'expo-notifications'
import './src/services/notificationConfigs'
import { getPushNotificationToken } from './src/services/getPushNotificationToken'

import { Loading } from './src/components/Loading';
import { Routes } from "./src/routes";
import { AuthProvider } from "./src/hooks/auth";
import { Linking } from "react-native";

export default function App() {
  const getNotificationListener = useRef<Subscription>()
  const responseNotificationListener:any = useRef<Subscription>()
  const lastNotificationResponse:any = Notifications.useLastNotificationResponse()

  console.log(new Date(1671833700007))

  useEffect(() => {
    getPushNotificationToken()
  }, [])

  useEffect(() => {
    getNotificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification)
    })

    responseNotificationListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response)
    })



    return () => {
      if (getNotificationListener.current && responseNotificationListener.current) {
        Notifications.removeNotificationSubscription(getNotificationListener.current)
        Notifications.removeNotificationSubscription(responseNotificationListener.current)
      }
    }
  }, [])

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.medicine.id
    ){
      Linking.openURL(`reviver://medtaken/${lastNotificationResponse.notification.request.content.data.medicine.id}/${lastNotificationResponse.notification.request.identifier}`)
    }
  }, [lastNotificationResponse])
  
  

  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold, Roboto_500Medium })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar 
        barStyle='light-content'
        backgroundColor={THEME.color.primary}
        translucent
      />
      <AuthProvider>
        { fontsLoaded ? <Routes /> : <Loading/>}
      </AuthProvider>
    </NativeBaseProvider>
  );
}