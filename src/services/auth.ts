import FetchClient, { HttpMethod } from "../config";

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

export async function GetAllStudents() {
  return FetchClient({
    endpoint: `/accounts?type=STUDENT`,
  });
}
