import * as Notifications from 'expo-notifications';

export async function cancelNotifications(medicineName: string, hours: string[]) {
  hours.forEach(hour => {
  Notifications.cancelScheduledNotificationAsync(`${medicineName}-${hour}`)
  Notifications.dismissNotificationAsync(`${medicineName}-${hour}`)
  })
  
}


