import React, { useRef, useEffect } from "react";
import { NativeBaseProvider, StatusBar } from "native-base";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { THEME } from "./src/styles/theme"


import { Subscription } from 'expo-modules-core'
import * as Notifications from 'expo-notifications'
import './src/services/notificationConfigs'
import { getPushNotificationToken } from './src/services/getPushNotificationToken'


import { Loading } from './src/components/Loading';
import { Routes } from "./src/routes";
import { AuthProvider } from "./src/hooks/auth";
import { setScheduledNotifications } from "./src/services/setScheduledNotifications";
import { setUpCategoryForNotificationResponse } from "./src/services/setUpCategoryForNotificationResponse";




export default function App() {

  const getNotificationListener = useRef<Subscription>()
  const responseNotificationListener = useRef<Subscription>()

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

  setUpCategoryForNotificationResponse()
  
  

  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold})
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar 
        barStyle='light-content'
        backgroundColor="#0891B2"
        translucent
      />
      <AuthProvider>
        { fontsLoaded ? <Routes /> : <Loading/>}
      </AuthProvider>
    </NativeBaseProvider>
  );
}