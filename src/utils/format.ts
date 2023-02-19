import {
  DateTimeFormatter,
  Duration,
  ZonedDateTime,
  ZoneId,
} from '@js-joda/core';

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function decapitalizeFirstLetter(s: string) {
  if (s.match(/^[A-Z]+$/)) {
    return s;
  }

  return s.charAt(0).toLocaleLowerCase() + s.slice(1);
}

export function splitFieldName(fieldName: string) {
  const re = /[^_-][a-z\d]+|[A-Z][a-z\d]+|[A-Z]+/g;
  const [first, ...rest] = fieldName.match(re) as string[];
  return (
    capitalizeFirstLetter(first) +
    ' ' +
    rest.map(decapitalizeFirstLetter).join(' ')
  );
}

export type FieldFormatFn = (field: string, obj: any) => any;

export const dateFormatter = DateTimeFormatter.ofPattern('yyyy-MM-dd');
export const dateTimeFormatter =
  DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm');

export function formatDate(d: string): string {
  if (!d) {
    return '';
  }

  const date = ZonedDateTime.parse(d);
  return date.format(dateFormatter);
}

export function localDateTimeStr(date: ZonedDateTime): string {
  return date
    .withZoneSameInstant(ZoneId.systemDefault())
    .format(dateTimeFormatter);
}

export function formatDateTime(d: string): string {
  if (!d) {
    return '';
  }
  return localDateTimeStr(ZonedDateTime.parse(d));
}

export const dateTimeCellFormatter: FieldFormatFn = (field, obj) =>
  formatDateTime(obj[field]);

export interface ValueWithUnit {
  value: string | number;
  unit: string;
}

export function formatDuration(durationMillis: number): ValueWithUnit {
  const duration = Duration.ofMillis(durationMillis);
  const days = duration.toDays();
  const hours = duration.toHours();
  const minutes = duration.toMinutes();
  const seconds = duration.seconds();
  const millis = duration.toMillis();

  return days === 1
    ? { value: 1, unit: 'day' }
    : days > 1
    ? { value: days, unit: 'days' }
    : hours === 1
    ? { value: 1, unit: 'hour' }
    : hours > 1
    ? { value: hours, unit: 'hours' }
    : minutes === 1
    ? { value: 1, unit: 'minute' }
    : minutes > 1
    ? { value: minutes, unit: 'minutes' }
    : seconds === 1
    ? { value: 1, unit: 'second' }
    : seconds > 1
    ? { value: seconds, unit: 'seconds' }
    : { value: millis, unit: 'ms' };
}

export const durationCellFormatter: FieldFormatFn = (field, obj) => {
  const { value, unit } = formatDuration(obj[field]);
  return `${value} ${unit}`;
};

export const KB = 1024;
export const MB = Math.pow(1024, 2);
export const GB = Math.pow(1024, 3);
export const TB = Math.pow(1024, 4);

export function formatDataSize(bytes: number): ValueWithUnit {
  const tb = Math.trunc(bytes / TB);
  const gb = Math.trunc(bytes / GB);
  const mb = Math.trunc(bytes / MB);
  const kb = Math.trunc(bytes / KB);

  return tb > 0
    ? { value: tb, unit: 'Tb' }
    : gb > 0
    ? { value: gb, unit: 'Gb' }
    : mb > 0
    ? { value: mb, unit: 'Mb' }
    : kb > 0
    ? { value: kb, unit: 'Kb' }
    : { value: bytes, unit: 'bytes' };
}

export const dataSizeCellFormatter: FieldFormatFn = (field, obj) => {
  const { value, unit } = formatDataSize(obj[field]);
  return `${value} ${unit}`;
};
