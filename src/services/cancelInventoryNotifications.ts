import * as Notifications from 'expo-notifications';

export async function cancelInventoryNotifications(medicineUuid: string) {
  Notifications.cancelScheduledNotificationAsync(`${medicineUuid}-inventory`)
  Notifications.dismissNotificationAsync(`${medicineUuid}-inventory`)
  
}


