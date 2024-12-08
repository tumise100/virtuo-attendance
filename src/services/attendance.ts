import FetchClient from "../config";

export async function GetSecondaryStudentAttedance() {
  return FetchClient({
    endpoint: `/students-attendance`,
  });
}

export async function MarkSecondaryStudentAttedance(studentId: string) {
  return FetchClient({
    endpoint: `/students-attendance/record?studentId=${studentId}`,
  });
}
