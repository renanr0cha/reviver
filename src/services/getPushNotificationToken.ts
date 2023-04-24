import * as Notifications from 'expo-notifications'
import { AndroidNotificationVisibility } from 'expo-notifications'
import { Platform } from 'react-native';

export async function getPushNotificationToken() {

  if (Platform.OS === 'android') {

    await Notifications.setNotificationChannelAsync('medicine', {
      name: 'Lembretes de medicamento',
      importance: Notifications.AndroidImportance.MAX,
      lightColor: '#FF231F7C',
      bypassDnd: true,
      lockscreenVisibility:AndroidNotificationVisibility.PUBLIC,
      audioAttributes: {
        flags: {
          enforceAudibility: true,
          requestHardwareAudioVideoSynchronization: true
        }
      }
    })
    await Notifications.setNotificationChannelAsync('inventory', {
      name: 'Lembretes de estoque',
      importance: Notifications.AndroidImportance.MAX,
      lightColor: '#FF231F7C',
      enableVibrate: true,
      sound: 'notification.mp3',
      bypassDnd: true,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility:AndroidNotificationVisibility.PUBLIC,
      audioAttributes: {
        flags: {
          enforceAudibility: true,
          requestHardwareAudioVideoSynchronization: true
        }
      }
    })
    
    Notifications.setNotificationChannelAsync('inspection', {
      name: 'Lembretes para fazer registro de saúde',
      importance: Notifications.AndroidImportance.MAX,
      lightColor: '#FF231F7C',
      enableVibrate: true,
      bypassDnd: true,
      vibrationPattern: [0, 250, 250, 250],
      audioAttributes: {
        flags: {
          enforceAudibility: true,
          requestHardwareAudioVideoSynchronization: true
        }
      }
    })
  }
  Notifications.setNotificationCategoryAsync('okButton', [{
    identifier: "ok",
    buttonTitle: 'Ok, entendido',
}])
  
  const { granted } = await Notifications.getPermissionsAsync()
  
  if (!granted) {
    await Notifications.requestPermissionsAsync()
  }

  if (granted) {
    const pushToken = await Notifications.getExpoPushTokenAsync({experienceId: '@carlosrenan/reviver'})
    console.log(pushToken);

    return pushToken.data
  }
  
}