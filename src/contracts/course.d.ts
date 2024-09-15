import { IStudentUser } from "./user";

export enum ELevel {
  HUNDRED = "HUNDRED",
  TWOHUNDRED = "TWOHUNDRED",
  THREEHUNDRED = "THREEHUNDRED",
  FOURHUNDRED = "FOURHUNDRED",
  FIVEHUNDRED = "FIVEHUNDRED",
}

export interface ICourse {
  code: string;
  title: string;
  level: ELevel;
  id: number;
  createdAt: string;
  updatedAt: string;
  lecturer: [
    {
      id: number;
      createdAt: string;
      updatedAt: string;
      courseId: number;
      lecturerId: number;
      lecturer: {
        accountId: number;
        lastName: string;
        firstName: string;
        position: string;
        bio: null;
        email: string;
        schoolId: number;
        createdAt: string;
        updatedAt: string;
        school: {
          accountId: number;
          name: string;
          regCode: string;
          address: string;
          email: string;
          phoneNumber: string;
          bio: null;
          logo: null;
          status: true;
        };
      };
    }
  ];
  students: [];
  classes: IClass[];
}

interface IClassBase {
  id: number;
  createdAt: string;
  updatedAt: string;
  courseId: number;
  startTime: string;
  endTime: string;
  day: string;
}

interface ICourseBase {
  code: string;
  title: string;
  level: ELevel;
  creditUnit: number;
  departmentId: number;
  facultyId: number;
  id: number;
  createdAt: string;
  updatedAt: string;
}

interface IClass extends IClassBase {
  classAttendance: IClassAttendance[];
}

interface IClassAttendance {
  id: number;
  createdAt: string;
  updatedAt: string;
  classId: number;
  studentId: number;
  attended: boolean;
}

export interface ICourseWithClasses extends ICourseBase {
  classes: IClass[];
}

interface IClassHeader extends IClassBase {
  course: ICourseBase;
}
// interface IClassHeader {
//   id: number;
//   createdAt: string;
//   updatedAt: string;
//   courseId: number;
//   startTime: string;
//   endTime: string;
//   day: string;
//   course: {
//     code: string;
//     title: string;
//     level: ELevel;
//     creditUnit: number;
//     departmentId: number;
//     facultyId: number;
//     id: number;
//     createdAt: string;
//     updatedAt: string;
//   };
// }

interface ILecturerCourseHeader {
  id: number;
  createdAt: string;
  updatedAt: string;
  courseId: number;
  lecturerId: number;
  lecturerAccountId: null;
  lecturer: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    type: string;
    identityCode: string;
  };
  course: ICourseBase;
}

interface IClassDetail extends IClassBase {
  course: ICourseBase & {
    // code: string;
    // title: string;
    // level: ELevel;
    // creditUnit: number;
    // departmentId: number;
    // facultyId: number;
    // id: number;
    // createdAt: string;
    // updatedAt: string;
    students: {
      id: number;
      createdAt: string;
      updatedAt: string;
      courseId: number;
      studentId: number;
      studentAccountId: null;
      student: {
        id: number;
        createdAt: string;
        updatedAt: string;
        deletedAt: null;
        type: string;
        identityCode: string;
        student: IStudentUser;
      };
    }[];
  };
}
