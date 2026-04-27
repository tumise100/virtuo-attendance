import FetchClient, { HttpMethod } from "../config";

export async function GetStaff(query: any = {}) {
  const queryString = new URLSearchParams(query).toString();
  return FetchClient({
    endpoint: `/staff?${queryString}`,
  });
}

export async function GetStaffDetail(id: number | string) {
  return FetchClient({
    endpoint: `/staff/${id}`,
  });
}

export async function CreateStaff(data: any) {
  return FetchClient({
    endpoint: `/staff`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function UpdateStaff(id: number | string, data: any) {
  return FetchClient({
    endpoint: `/staff/${id}`,
    method: HttpMethod.PUT,
    body: data,
  });
}

// Legacy support
export async function GetAllSchoolTeacher(schoolId: number, currentPage?: number, perPage?: number, search?: string) {
  return GetStaff({ page: currentPage, limit: perPage, search });
}
