import FetchClient from "../config";

export async function GetSchoolStudents(schoolId: number) {
  return FetchClient({
    endpoint: `/school/students/${schoolId}`,
  });
}
