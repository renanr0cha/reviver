import { setInventoryNotifications } from './setInventoryNotifications';

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

export async function calcDaysOfMedicineLeft(medicine: Props, hours: string[]) {
  const numberOfTimesPerDay = Number(hours.length)
  console.log("Number per day" + numberOfTimesPerDay)
  if (medicine.inventory !== undefined) {
    const days = medicine.inventory/numberOfTimesPerDay
    console.log(days);
    setInventoryNotifications(medicine, days)
  }
}


