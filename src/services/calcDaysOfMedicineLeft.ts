import * as Notifications from 'expo-notifications';

export async function calcDaysOfMedicineLeft(inventory: number, hours: string[]) {
  console.log(hours.length);
  console.log(Number(hours.length + 1));
  const days = inventory/Number(hours.length)
  console.log(days);
}


