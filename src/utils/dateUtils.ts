import { DIARY_START_DATE, DIARY_END_DATE } from "../constants";

export const toISODate = (date: Date): string => date.toISOString().slice(0, 10);

export const formatDatePtBr = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

/** Gera a lista de todas as datas (formato ISO) do período da missão. */
export const getDiaryDateRange = (): string[] => {
  const dates: string[] = [];
  const current = new Date(`${DIARY_START_DATE}T00:00:00`);
  const end = new Date(`${DIARY_END_DATE}T00:00:00`);

  while (current <= end) {
    dates.push(toISODate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const WEEKDAY_LABELS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MONTH_LABELS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** Abreviação do dia da semana em português (ex: "seg", "ter"). */
export const getWeekdayLabel = (isoDate: string): string =>
  WEEKDAY_LABELS[new Date(`${isoDate}T00:00:00`).getDay()];

/** Nome completo do mês em português para uma data ISO. */
export const getMonthLabel = (isoDate: string): string =>
  MONTH_LABELS[Number(isoDate.slice(5, 7)) - 1];

/** Verifica se a data ISO corresponde ao dia de hoje. */
export const isToday = (isoDate: string): boolean => isoDate === toISODate(new Date());

/** Formata um timestamp ISO completo (com hora) para "dd/mm/aaaa às HH:mm". */
export const formatDateTimePtBr = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};
