import { _api_key, articles_url } from "../config";

export async function getArticles() {
  try {
    let response = await fetch(`${articles_url}`, {
      headers: {
        "X-API-KEY": _api_key,
      },
    });

    let result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}
