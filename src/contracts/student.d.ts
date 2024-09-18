import { IStudentUser } from "./user";

export interface IStudentItem {
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
}

// export interface ILecturerStudents {

// }