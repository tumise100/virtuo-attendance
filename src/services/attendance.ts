import FetchClient, { HttpMethod } from "../config";

function getPositiveId(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
}

export async function GetAttendanceStats(query: any = {}) {
  const queryString = new URLSearchParams(query).toString();
  return FetchClient({
    endpoint: `/attendance/stats?${queryString}`,
  });
}

export async function GetStudentAttendance(query: any = {}) {
  const queryString = new URLSearchParams(query).toString();
  return FetchClient({
    endpoint: `/attendance/student?${queryString}`,
  });
}

export async function GetStaffAttendance(query: any = {}) {
  const queryString = new URLSearchParams(query).toString();
  return FetchClient({
    endpoint: `/attendance/staff?${queryString}`,
  });
}

export async function MarkSecondaryStudentAttedance(
  studentId?: number | string | null,
  data: any = {},
) {
  const parsedStudentId = getPositiveId(studentId);

  return FetchClient({
    endpoint: `/attendance/student/mark`,
    method: HttpMethod.POST,
    body: {
      ...(parsedStudentId ? { studentId: parsedStudentId } : {}),
      status: "PRESENT",
      ...data,
    },
  });
}

export async function MarkSecondaryTeacherAttedance(
  staffId?: number | string | null,
  data: any = {},
) {
  const parsedStaffId = getPositiveId(staffId);

  return FetchClient({
    endpoint: `/attendance/staff/mark`,
    method: HttpMethod.POST,
    body: {
      ...(parsedStaffId ? { staffId: parsedStaffId } : {}),
      status: "PRESENT",
      ...data,
    },
  });
}

export async function GetASingleStudentAttendance(id: number | string) {
  const query = new URLSearchParams({
    studentId: String(id),
    period: "month",
  }).toString();

  return FetchClient({
    endpoint: `/attendance/student?${query}`,
  });
}

export async function GetASingleTeacherAttendance(id: number | string) {
  const query = new URLSearchParams({
    staffId: String(id),
    period: "month",
  }).toString();

  return FetchClient({
    endpoint: `/attendance/staff?${query}`,
  });
}

export async function GetAttendanceHistoryByDate({
  date,
  lecturerId,
}: {
  date: string;
  lecturerId?: string | number;
}) {
  const query = new URLSearchParams({
    ...(date ? { date } : {}),
    ...(lecturerId ? { staffId: String(lecturerId) } : {}),
  }).toString();

  return FetchClient({
    endpoint: `/attendance/staff?${query}`,
  });
}

export async function GetAttendanceHistoryByDateForTeacher({
  date,
  lecturerId,
}: {
  date: string;
  lecturerId?: string | number;
}) {
  return GetAttendanceHistoryByDate({ date, lecturerId });
}

export async function GetAttendanceHistoryByDateForSchool({
  date,
  schoolId,
}: {
  date: string;
  schoolId?: string | number;
}) {
  const query = new URLSearchParams({
    ...(date ? { date } : {}),
    ...(schoolId ? { schoolId: String(schoolId) } : {}),
  }).toString();

  return FetchClient({
    endpoint: `/attendance/student?${query}`,
  });
}

// Backward compatibility or legacy naming support if needed
export async function GetSecondaryStudentAttedance(query: any) {
  return GetStudentAttendance(query);
}

export async function GetSecondaryTeacherAttendance(query: any) {
  return GetStaffAttendance(query);
}
