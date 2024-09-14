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

interface IClassHeader {
  id: number;
  createdAt: string;
  updatedAt: string;
  courseId: number;
  startTime: string;
  endTime: string;
  day: string;
  course: {
    code: string;
    title: string;
    level: string;
    creditUnit: number;
    departmentId: number;
    facultyId: number;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
}

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
  course: {
    code: string;
    title: string;
    level: string;
    creditUnit: null;
    departmentId: number;
    facultyId: null;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
}

// interface ILecturerCourseHeader {
//   id: number;
//   createdAt: string;
//   updatedAt: string;
//   courseId: string;
//   lecturerId: string;
//   course: {
//     code: string;
//     title: string;
//     level: string;
//     id: number;
//     createdAt: string;
//     updatedAt: string;
//   };
// }

// e = {
//   id: number,
//   createdAt: string,
//   updatedAt: string,
//   courseId: number,
//   startTime: string,
//   endTime: string,
//   day: string,
//   course: {
//     code: string,
//     title: string,
//     level: string,
//     creditUnit: number,
//     departmentId: number,
//     facultyId: number,
//     id: number,
//     createdAt: string,
//     updatedAt: string,
//   },
// };
