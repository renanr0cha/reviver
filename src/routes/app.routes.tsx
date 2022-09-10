import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../screens/Home";
import { AddInspection1 } from "../screens/AddInspection1";
import { AddInspection2 } from "../screens/AddInspection2"
import { AddMedicine } from "../screens/AddMedicine";
import { MedicineList } from "../screens/MedicineList";
import { PatientList } from "../screens/PatientList";
import { AddPatient } from "../screens/AddPatient";

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
  
  return(
    <Navigator screenOptions={{ headerShown: false}}>
      <Screen name="home" component={Home}/>
      <Screen name="addinfo1" component={AddInspection1}/>
      <Screen name="addinfo2" component={AddInspection2}/>
      <Screen name="addpatient" component={AddPatient}/>
      <Screen name="addmed" component={AddMedicine}/>
      <Screen name="medlist" component={MedicineList}/>
      <Screen name="patientlist" component={PatientList}/>

    </Navigator>
  )
}