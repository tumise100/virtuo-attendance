import FetchClient, { HttpMethod } from "../config";

export async function GetAnnouncements() {
  return FetchClient({
    endpoint: `/communication/announcements`,
  });
}

export async function GetNotifications(isReceived: boolean = true, termId?: number | string) {
  const query = new URLSearchParams({
    isReceived: String(isReceived),
    ...(termId ? { termId: String(termId) } : {}),
  }).toString();

  return FetchClient({
    endpoint: `/communication/notifications?${query}`,
  });
}

export async function MarkNotificationRead(notificationId: number) {
  return FetchClient({
    endpoint: `/communication/notifications/${notificationId}/read`,
    method: HttpMethod.PATCH,
  });
}

export async function CreateNotification(data: {
  title: string;
  message: string;
  receivers: string[];
  termId?: number | string;
}) {
  return FetchClient({
    endpoint: `/communication/notifications`,
    method: HttpMethod.POST,
    body: {
      ...data,
      receivers: Array.isArray(data.receivers) ? data.receivers : [],
    },
  });
}

export async function UpdateNotification(
  notificationId: number | string,
  data: {
    title?: string;
    message?: string;
    receivers?: string[];
  },
) {
  return FetchClient({
    endpoint: `/communication/notifications/${notificationId}`,
    method: HttpMethod.PATCH,
    body: data,
  });
}

export async function DeleteNotification(notificationId: number | string) {
  return FetchClient({
    endpoint: `/communication/notifications/${notificationId}`,
    method: HttpMethod.DELETE,
  });
}
