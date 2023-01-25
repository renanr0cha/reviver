import * as Notifications from 'expo-notifications';
import { setInspectionNotifications } from './setInspectionNotifications';
import { setMedicineNotifications } from './setMedicineNotifications';

interface Props {
  name: string,
  id: number,
  notifications: string[],
  hours: string[],
  dosage: string,
  inventory: number,
  end_date?: string,
  medicine: Object,
}
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
    if (inspectionNotifications === undefined) {
      setInspectionNotifications("weekly")
    return
    }
  }
}


