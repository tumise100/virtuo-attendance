import FetchClient, { HttpMethod } from "../config";

export async function GetLeaveRequests(query: any = {}) {
  const queryString = new URLSearchParams(query).toString();
  return FetchClient({
    endpoint: `/leave?${queryString}`,
  });
}

export async function CreateLeaveRequest(data: any) {
  return FetchClient({
    endpoint: `/leave`,
    method: HttpMethod.POST,
    body: data,
    isMultipart: true,
  });
}

export async function GetLeaveBalance() {
  return FetchClient({
    endpoint: `/leave/balance`,
  });
}

export async function UpdateLeaveStatus(id: number, status: string) {
  return FetchClient({
    endpoint: `/leave/${id}`,
    method: HttpMethod.PUT,
    body: { status },
  });
}

export async function deleteLeaveRequest(id: number) {
  return FetchClient({
    endpoint: `/leave/${id}`,
    method: HttpMethod.DELETE,
  });
}
