import FetchClient from "../config";

export async function GetSchoolStudents(
  schoolId: number,
  currentPage?: number,
  perPage?: number,
  search?: string
) {
  return FetchClient({
    endpoint: `/school/students/${schoolId}?limit=${
      perPage || 100
    }&page=${currentPage}&search=${search}`,
  });
}

// export async function GetSchoolStudents(schoolId: number) {
//   return FetchClient({
//     endpoint: `/students-attendance/school/students/${schoolId}`,
//   });
// }
