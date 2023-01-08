import * as Notifications from 'expo-notifications';

export async function cancelNotifications(medicineName: string) {
  Notifications.cancelScheduledNotificationAsync(medicineName)
  Notifications.dismissNotificationAsync(medicineName)

}


