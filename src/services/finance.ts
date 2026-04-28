import FetchClient, { HttpMethod } from "../config";

export async function GetStudentTransactions(
  studentId: number | string,
  opts?: { termId?: number | string; sessionId?: number | string },
) {
  const params = new URLSearchParams();
  if (opts?.termId) params.set("termId", String(opts.termId));
  if (opts?.sessionId) params.set("sessionId", String(opts.sessionId));
  const query = params.toString() ? `?${params.toString()}` : "";
  return FetchClient({
    endpoint: `/finance/payments/student/${studentId}${query}`,
  });
}

export async function GetStudentFees(studentId: number | string, termId?: number | string) {
  const query = termId ? `?termId=${termId}` : "";
  return FetchClient({
    endpoint: `/finance/fees/student/${studentId}${query}`,
  });
}

export async function RecordPayment(data: {
  studentId: number;
  feeId: number;
  amount: number;
  paymentMethod: string;
  reference?: string;
  description?: string;
}) {
  return FetchClient({
    endpoint: `/finance/record-payment`,
    method: HttpMethod.POST,
    body: data,
  });
}
