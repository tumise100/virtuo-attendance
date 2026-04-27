import { Ndef } from "react-native-nfc-manager";

/**
 * Extracts the data from an NFC tag, prioritizing NDEF payload (the item written to the card)
 * and falling back to the hardware serial number (UID) if no NDEF data is found.
 */
export const extractDataFromTag = (tag: any): string => {
  if (!tag) return "";

  // 1. Try to extract NDEF payload first
  const ndefMessage = tag.ndefMessage;
  if (Array.isArray(ndefMessage) && ndefMessage.length > 0) {
    const record = ndefMessage[0];
    const payload = record.payload;
    
    if (Array.isArray(payload) && payload.length > 0) {
      // a. Check if it's a Text record (Type 'T' [84])
      if (Array.isArray(record.type) && record.type[0] === 84) {
        const statusByte = payload[0];
        const langCodeLen = statusByte & 0x3f;
        const textPayload = payload.slice(1 + langCodeLen);
        const text = textPayload.map((b: number) => String.fromCharCode(b)).join("");
        if (text) return text.trim().toUpperCase();
      }
      
      // b. Check if it's a URI record (Type 'U' [85])
      if (Array.isArray(record.type) && record.type[0] === 85) {
        try {
          const decoded = Ndef.uri.decodePayload(new Uint8Array(payload));
          if (decoded) return decoded.trim().toUpperCase();
        } catch (e) {
          // Fallback to raw if decoding fails
        }
      }

      // c. Generic fallback for any other payload: raw payload to string (stripping common control chars)
      const rawText = payload
        .map((b: number) => String.fromCharCode(b))
        .join("")
        .replace(/[\x00-\x1F\x7F-\x9F]/g, "");
      if (rawText) return rawText.trim().toUpperCase();
    }
  }

  // 2. Fallback to hardware serial number (UID)
  const serial = tag.id || tag.serialNumber || "";
  return String(serial).trim().toUpperCase();
};

/**
 * Strips non-hexadecimal characters and converts to uppercase.
 * Useful for legacy code that expects strict hex.
 */
export const sanitizeHex = (value?: string | null): string =>
  String(value || "")
    .replace(/[^a-fA-F0-9]/g, "")
    .toUpperCase();
