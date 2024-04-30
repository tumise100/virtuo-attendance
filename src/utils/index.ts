import { Buffer } from "buffer";

export function toBase64(input: string) {
  return Buffer.from(input, "utf-8").toString("base64");
}

export function fromBase64(encoded: string) {
  return Buffer.from(encoded, "base64").toString("utf8");
}

export const splitStringIntoTwoHalves = (inputString: string) => {
  const length = inputString.length;
  const midpoint = Math.floor(length / 2);
  const firstHalf = inputString.slice(0, midpoint);
  const secondHalf = inputString.slice(midpoint);
  return [firstHalf, secondHalf];
};
