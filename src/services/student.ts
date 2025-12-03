import FetchClient, { HttpMethod } from "../config";

export async function GetAStudent({
  lecturerId,
  studentId,
}: {
  lecturerId: number;
  studentId: number;
}) {
  return FetchClient({
    endpoint: `/courses/lecturer/${lecturerId}/student/${studentId}/details`,
  });
}

export async function GetMyStudents(
  id: number,
  currentPage?: number,
  perPage?: number,
  search?: string
) {
  return FetchClient({
    endpoint: `/courses/lecturer/students/${id}?limit=${
      perPage || 100
    }&page=${currentPage}&search=${search}`,
  });
}

export async function GetTeacherStudents(
  id: number,
  currentPage?: number,
  perPage?: number,
  search?: string
) {
  return FetchClient({
    endpoint: `/students-attendance/lecturer/students/${id}?limit=${
      perPage || 100
    }&page=${currentPage}&search=${search}`,
  });
}

export async function RegisterStudentCard({
  studentId,
  cardUid,
}: {
  studentId: string;
  cardUid: string;
}) {
  return FetchClient({
    endpoint: "/students/register-card",
    method: HttpMethod.POST,
    body: { studentId, cardUid },
  });
}
