export interface ICourse {
  code: string;
  title: string;
  level: string;
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

interface IClass {
  id: number;
  createdAt: string;
  updatedAt: string;
  courseId: number;
  startTime: string;
  endTime: string;
  day: string;
  classAttendance: [];
}

interface ILecturerCourseHeader {
  id: number;
  createdAt: string;
  updatedAt: string;
  courseId: string;
  lecturerId: string;
  course: {
    code: string;
    title: string;
    level: string;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
}
