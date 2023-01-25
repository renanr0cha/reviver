import * as Notifications from 'expo-notifications';
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
export async function verifyIfNotificationsAreSet( allMedicines: Array<Props>) {
  const notifications = await Notifications.getAllScheduledNotificationsAsync()
  console.log(notifications)

  if (notifications.length === 0) {
    allMedicines.forEach(medicine => {
      setMedicineNotifications(medicine)
    })
    return
  }
  return 
}


