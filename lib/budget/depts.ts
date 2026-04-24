export const DEPARTMENTS = [
  "여당(회장)",
  "야당(회장)",
  "감찰부(서기)",
  "총무부",
  "인성예절부",
  "환경부",
  "체육부",
  "교육부",
  "발명부",
  "선교부",
  "봉사부"
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export const CLASS_TOTAL_DEPARTMENT = "학급총액" as const;
