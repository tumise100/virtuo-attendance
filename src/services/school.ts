import FetchClient from "../config";

export async function GetSchoolStudents(schoolId: number) {
  return FetchClient({
    endpoint: `/school/students/${schoolId}`,
  });
}

// export async function GetSchoolStudents(schoolId: number) {
//   return FetchClient({
//     endpoint: `/students-attendance/school/students/${schoolId}`,
//   });
// }
