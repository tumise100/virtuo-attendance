import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type DrawerNavigatorProp = DrawerNavigationProp<any, any>;
export type StackNavigatorProp = StackNavigationProp<any, any>;
export type RouterProp = RouteProp<any, any>;

export interface DrawerNavigationProps {
  navigation: DrawerNavigatorProp;
  route?: RouterProp;
}

export interface StackNavigationProps {
  navigation: StackNavigatorProp;
  route?: RouterProp;
}

export enum AttendanceStatusType {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}

export interface ModalProp {
  setVisible: (a: boolean) => void;
}

export interface DropdownData {
  name: string;
  id: string;
}

export interface StudentAttendance {
  name: string;
  matric_no: string;
  course: string;
  level: string;
  id: string;
}
