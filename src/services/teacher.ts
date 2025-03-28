import FetchClient from "../config";

export async function GetAllSchoolTeacher(
  schoolId: number,
  currentPage?: number,
  perPage?: number,
  search?: string
) {
  return FetchClient({
    endpoint: `/school/lecturers/${schoolId}?limit=${
      perPage || 100
    }&page=${currentPage}&search=${search}`,
  });
}
