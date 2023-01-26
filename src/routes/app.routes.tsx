import { createNativeStackNavigator  } from "@react-navigation/native-stack";

import { Home } from "../screens/Home";
import { AddInspection1 } from "../screens/AddInspection1";
import { AddInspection2 } from "../screens/AddInspection2"
import { AddMedicine } from "../screens/AddMedicine";
import { EditMedicine } from "../screens/EditMedicine";
import { MedicineList } from "../screens/MedicineList";
import { PatientList } from "../screens/PatientList";
import { AddPatient } from "../screens/AddPatient";
import { FingerTap } from "../screens/FingerTap";
import { MedicineTakenInfo } from "../screens/MedicineTakenInfo";
import React from "react";
import { InspectionReminders } from "../screens/InspectionReminders";
import { InspectionHistory } from "../screens/InspectionHistory";

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
  return(
      <Navigator screenOptions={{ headerShown: false}} >
        <Screen name="home" component={Home}/>
        <Screen name="addinfo1" component={AddInspection1}/>
        <Screen name="addinfo2" component={AddInspection2}/>
        <Screen name="fingertap" component={FingerTap}/>
        <Screen name="addpatient" component={AddPatient}/>
        <Screen name="addmed" component={AddMedicine}/>
        <Screen name="editmed" component={EditMedicine}/>
        <Screen name="medtaken" component={MedicineTakenInfo}/>
        <Screen name="inforeminder" component={InspectionReminders}/>
        <Screen name="medlist" component={MedicineList}/>
        <Screen name="patientlist" component={PatientList}/>
        <Screen name="infohistory" component={InspectionHistory}/>

      </Navigator>
  )
}