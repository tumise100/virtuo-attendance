import FetchClient from "../config";

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

export async function GetMyStudents(id: number) {
  return FetchClient({
    endpoint: `/courses/lecturer/students/${id}?limit=1000`,
  });
}

export async function GetTeacherStudents(id: number) {
  return FetchClient({
    endpoint: `/students-attendance/lecturer/students/${id}?limit=1000`,
  });
}
