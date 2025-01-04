import { ILecturerUser, IStudentUser } from "./user";

// export interface IStudentAttendanceHeader {
//   date: string;
// }
// export type IStudentAttendanceHeaderDate = (
export interface IStudentAttendanceHeader {
  dates: {
    date: string;
  }[];
  totalStudents?: number;
  totalTeacher?: number;
}

export type IStudentAttendanceResp = (
  | {
      date: string;
    }[]
  | {
      totalStudents: number;
    }
)[];

const a = {
  date: [
    { date: "2025-01-04T00:00:00.000Z" },
    { date: "2025-01-03T00:00:00.000Z" },
    { date: "2025-01-02T00:00:00.000Z" },
    { date: "2024-12-19T00:00:00.000Z" },
    { date: "2024-12-18T00:00:00.000Z" },
  ],
  totalStudents: 4,
};

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
  student?: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    type: string;
    identityCode: string;
    student: IStudentUser;
  };
  lecturer?: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    type: string;
    identityCode: string;
    lecturer: ILecturerUser;
  };
}

export interface ISecondaryStudentAttendanceDetail {
  studentData?: {
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

export interface ISecondaryTeacherAttendanceDetail {
  teacherData?: {
    accountId: number;
    firstName: string;
    lastName: string;
  };
  data: {
    entryTime: null;
    exitTime: string;
    morningAttendance: boolean;
    afternoonAttendance: boolean;
    date: string;
    accountId: number;
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    lecturer: {
      id: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: null;
      type: string;
      identityCode: string;
    };
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
