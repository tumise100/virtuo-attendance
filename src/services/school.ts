import FetchClient from "../config";

export async function GetSchoolStudents(schoolId: number) {
  return FetchClient({
    endpoint: `/school/students/${schoolId}?limit=1000`,
  });
}

// export async function GetSchoolStudents(schoolId: number) {
//   return FetchClient({
//     endpoint: `/students-attendance/school/students/${schoolId}`,
//   });
// }
