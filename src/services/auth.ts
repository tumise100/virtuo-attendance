import FetchClient, { API_URL, HttpMethod } from "../config";

export async function Login(input: { email: string; password: string }) {
  return FetchClient({
    endpoint: "/auth/login",
    body: input,
    method: HttpMethod.POST,
  });
}

export async function GetMe() {
  return FetchClient({
    endpoint: "/auth/me",
  });
}

export async function GetMyCourses(id: number) {
  return FetchClient({
    endpoint: `/courses/lecturer/${id}`,
  });
}

export async function GetACourse(id: string) {
  return FetchClient({
    endpoint: `/courses/${id}`,
  });
}

export async function GetAllStudents() {
  return FetchClient({
    endpoint: `/accounts?type=STUDENT`,
  });
}

export async function MarkAttendance(input: {
  classId: number;
  studentId: number;
}) {
  return FetchClient({
    endpoint: `/courses/mark-attendance`,
    method: HttpMethod.POST,
    body: input,
  });
}
