import FetchClient, { HttpMethod } from "../config";

export async function CreatNewClass(input: {
  courseId: number;
  day: string;
  startTime: string;
  endTime: string;
}) {
  return FetchClient({
    endpoint: `/courses/create-class`,
    body: JSON.stringify(input),
    method: HttpMethod.POST,
  });
}
