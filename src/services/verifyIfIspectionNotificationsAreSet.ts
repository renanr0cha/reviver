import * as Notifications from 'expo-notifications';
import { setInspectionNotifications } from './setInspectionNotifications';

export async function verifyIfInspectionNotificationsAreSet() {
  const notifications = await Notifications.getAllScheduledNotificationsAsync()

  if (notifications.length === 0) {
    setInspectionNotifications("weekly")
    return
  }
  if (notifications.length > 0) {
    const inspectionNotifications = notifications.map(notification => {
      if (notification.identifier === "inspection-reminder")
        return notification
    })
    if (inspectionNotifications.length === 0) {
      setInspectionNotifications("weekly")
    return
    }
  }
}


