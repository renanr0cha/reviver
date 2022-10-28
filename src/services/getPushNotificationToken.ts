import * as Notifications from 'expo-notifications'

export async function getPushNotificationToken() {

  Notifications.setNotificationChannelAsync("medicine", {
    name: "Medicine Alert",
    importance: Notifications.AndroidImportance.MAX,
    lightColor: "#FF231F7C",
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