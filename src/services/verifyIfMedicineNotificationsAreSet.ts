import * as Notifications from 'expo-notifications';
import { calcDaysOfMedicineLeft } from './calcDaysOfMedicineLeft';
import { setMedicineNotifications } from './setMedicineNotifications';

interface Props {
  name: string,
  id: number,
  uuid: string,
  notifications: string[],
  hours: string[],
  dosage: string,
  inventory: number,
  end_date?: string,
  medicine: Object,
}
export async function verifyIfMedicineNotificationsAreSet( allMedicines: Array<Props>) {
  const notifications = await Notifications.getAllScheduledNotificationsAsync()

  if (notifications.length === 0) {
    allMedicines.forEach(medicine => {
      setMedicineNotifications(medicine)
      calcDaysOfMedicineLeft(medicine, medicine.hours)
    })
    return
  }

  if (notifications.length > 0) {
    
    const medicineNotifications = notifications.map(notification => {
      if (notification.identifier !== "inspection-reminder")
        return notification
    })

    if (medicineNotifications === undefined) {
      allMedicines.forEach(medicine => {
        setMedicineNotifications(medicine)
        calcDaysOfMedicineLeft(medicine, medicine.hours)
      })
      return
    }
  }
  return 
}


