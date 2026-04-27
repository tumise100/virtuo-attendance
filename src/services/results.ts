import FetchClient, { HttpMethod } from "../config";

export async function GetResults(query: any = {}) {
  const queryString = new URLSearchParams(query).toString();
  return FetchClient({
    endpoint: `/results?${queryString}`,
  });
}

export async function CreateResult(data: any) {
  return FetchClient({
    endpoint: `/results`,
    method: HttpMethod.POST,
    body: data,
  });
}

export async function UpdateResult(id: number, data: any) {
  return FetchClient({
    endpoint: `/results/${id}`,
    method: HttpMethod.PUT,
    body: data,
  });
}

export async function GetPerformanceTrend(period: string = 'month') {
  return FetchClient({
    endpoint: `/results/stats/performance-trend?period=${period}`,
  });
}

export async function GetResultTemplate() {
  return FetchClient({
    endpoint: `/results/template`,
  });
}

export async function BulkUploadResults(formData: FormData) {
  return FetchClient({
    endpoint: `/results/bulk-upload`,
    method: HttpMethod.POST,
    body: formData,
    isMultipart: true,
  });
}
