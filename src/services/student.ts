import FetchClient, { HttpMethod } from "../config";

export async function GetAStudent(studentId: number | string) {
  return FetchClient({
    endpoint: `/student/${studentId}`,
  });
}

export async function GetMyStudents(...args: any[]) {
  let query: any = args[0] ?? {};

  if (typeof query === "number" || typeof query === "string") {
    const [_id, page, limit, search] = args;
    query = { page, limit, search };
  }

  const queryString = new URLSearchParams(query).toString();
  return FetchClient({
    endpoint: `/student?${queryString}`,
  });
}

export async function GetTeacherStudents(...args: any[]) {
  let query: any = args[0] ?? {};

  if (typeof query === "number" || typeof query === "string") {
    const [_id, page, limit, search] = args;
    query = { page, limit, search };
  }

  return GetMyStudents(query);
}

export async function RegisterStudentCard({
  email,
  cardUID,
}: {
  email: string;
  cardUID: string;
}) {
  return FetchClient({
    endpoint: "/student/register-nfc",
    method: HttpMethod.POST,
    body: { email, nfcCode: cardUID },
  });
}

export async function CreateStudent(data: any) {
  return FetchClient({
    endpoint: "/student",
    method: HttpMethod.POST,
    body: data,
  });
}

export async function UpdateStudent(id: number | string, data: any) {
  return FetchClient({
    endpoint: `/student/${id}`,
    method: HttpMethod.PUT,
    body: data,
  });
}
