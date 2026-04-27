import FetchClient, { HttpMethod } from "../config";

export async function GetTeacherTimetable(teacherId: number) {
  return FetchClient({
    endpoint: `/timetable/teacher/${teacherId}`,
  });
}

export async function GetClassTimetable(classId: number) {
  return FetchClient({
    endpoint: `/timetable/class/${classId}`,
  });
}

export async function GetSchoolTimetable() {
  return FetchClient({
    endpoint: `/timetable/school`,
  });
}

export async function GetTodaySchedule(teacherId: number) {
  return FetchClient({
    endpoint: `/timetable/teacher/${teacherId}`,
  });
}

export async function GetTimetableSettings() {
  return FetchClient({
    endpoint: `/timetable/settings`,
  });
}

export async function UpdateTimetableSettings(data: any) {
  return FetchClient({
    endpoint: `/timetable/settings`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function CreateTimetableSchedule(data: any) {
  return FetchClient({
    endpoint: `/timetable`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function UpdateTimetableSchedule(id: number | string, data: any) {
  return FetchClient({
    endpoint: `/timetable/${id}`,
    method: HttpMethod.PATCH,
    body: data,
  });
}

export async function DeleteTimetableSchedule(id: number | string) {
  return FetchClient({
    endpoint: `/timetable/${id}`,
    method: HttpMethod.DELETE,
  });
}

export async function GetHolidays() {
  return FetchClient({
    endpoint: `/timetable/holiday`,
  });
}

export async function CreateHoliday(data: any) {
  return FetchClient({
    endpoint: `/timetable/holiday`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function UpdateHoliday(id: number | string, data: any) {
  return FetchClient({
    endpoint: `/timetable/holiday/${id}`,
    method: HttpMethod.PATCH,
    body: data,
  });
}

export async function DeleteHoliday(id: number | string) {
  return FetchClient({
    endpoint: `/timetable/holiday/${id}`,
    method: HttpMethod.DELETE,
  });
}
