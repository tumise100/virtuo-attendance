import { Buffer } from "buffer";
import { ELevel } from "../contracts/course.d";

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

export const convertLevelStringToNumber = (level: ELevel) => {
  switch (level) {
    case ELevel.HUNDRED:
      return "100";
    case ELevel.TWOHUNDRED:
      return "200";
    case ELevel.THREEHUNDRED:
      return "300";
    case ELevel.FOURHUNDRED:
      return "400";
    case ELevel.FIVEHUNDRED:
      return "500";
  }
};

export const extractStudentId = (url: string): number | null => {
  const match = url.match(/\/(\d+);?$/);
  return match ? parseInt(match[1], 10) : null;
};
