import FetchClient from "../config";

export async function GetSecondaryStudentAttedance({
  lecturerId,
}: {
  lecturerId: string;
}) {
  return FetchClient({
    endpoint: `/students-attendance/lecturer-students/${lecturerId}`,
  });
}

export async function GetSecondaryTeacherAttendance({
  schoolId,
}: {
  schoolId: string;
}) {
  return FetchClient({
    endpoint: `/teachers-attendance/teachers-attendance-history/${schoolId}`,
  });
}

export async function GetAttendanceHistoryByDate({
  date,
  lecturerId,
}: {
  date: string;
  lecturerId: string;
}) {
  return FetchClient({
    endpoint: `/students-attendance/by-date/${date}/${lecturerId}`,
  });
}

export async function GetAttendanceHistoryByDateForTeacher({
  date,
  schoolId,
}: {
  date: string;
  schoolId: string;
}) {
  return FetchClient({
    endpoint: `/teachers-attendance/teacher-attendance-by-date/${date}/${schoolId}`,
  });
}

export async function MarkSecondaryStudentAttedance(studentId: string) {
  return FetchClient({
    endpoint: `/students-attendance/record?studentId=${studentId}`,
  });
}

export async function GetASingleStudentAttendance(id: string) {
  return FetchClient({
    endpoint: `/students-attendance/${id}`,
  });
}
