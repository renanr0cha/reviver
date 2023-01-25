import * as Notifications from 'expo-notifications'
import { AndroidNotificationVisibility } from 'expo-notifications'

export async function getPushNotificationToken() {

  Notifications.setNotificationChannelAsync('medicine', {
    name: 'Lembretes de medicamento',
    importance: Notifications.AndroidImportance.MAX,
    lightColor: '#FF231F7C',
    sound: 'alarmsound.wav',
    enableVibrate: true,
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
  const { granted } = await Notifications.getPermissionsAsync()

  if (!granted) {
    await Notifications.requestPermissionsAsync()
  }

  if (granted) {
    const pushToken = await Notifications.getExpoPushTokenAsync({experienceId: '@carlosrenan/reviver'})

    return pushToken.data
  }
  
}