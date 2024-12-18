import FetchClient from "../config";

export async function GetAllSchoolTeacher(schoolId: number) {
  return FetchClient({
    endpoint: `/school/lecturers/${schoolId}`,
  });
}
