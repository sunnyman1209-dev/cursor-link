import "server-only";

export function getClassCode(): string {
  return process.env.CLASS_CODE?.trim() || "1-1";
}
