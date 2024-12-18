import { IStudentUser } from "./user";

export interface IStudentAttendanceHeader {
  date: string;
}
// export interface IStudentAttendanceHeader {
//   entryTime: null;
//   exitTime: string;
//   morningAttendance: boolean;
//   afternoonAttendance: boolean;
//   date: string;
//   accountId: number;
//   id: number;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: null;
// }

export interface IAttendanceHistoryDetail {
  entryTime: string | null;
  exitTime: string | null;
  morningAttendance: boolean;
  afternoonAttendance: boolean;
  date: string;
  accountId: number;
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  student: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    type: string;
    identityCode: string;
    student: IStudentUser;
  };
}

export interface ISecondaryStudentAttendanceDetail {
  studentData: {
    accountId: number;
    firstName: string;
    lastName: string;
    class: {
      name: string;
    };
  };
  attendancedata: {
    entryTime: string | null;
    exitTime: string | null;
    morningAttendance: boolean;
    afternoonAttendance: boolean;
    date: string;
    accountId: number;
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
  }[];
  totalCount: number;
  totalPresent: number;
  totalAbsent: number;
}

export enum EAttendancePeriod {
  Morning = "Morning",
  Afternoon = "Afternoon",
}

export enum EAttendanceStatus {
  Present = "Present",
  Absent = "Absent",
}
