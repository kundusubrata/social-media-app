import dayjs from "dayjs";

export function FormatDate(date: string) {
  const parsedDate = dayjs(date).format("MMMM D, YYYY"); // e.g., "March 31, 2025"

  return parsedDate;
}
