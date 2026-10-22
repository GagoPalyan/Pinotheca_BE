import { Transform } from 'class-transformer';

export function ToOptionalArray() {
  return Transform(({ value }: { value: unknown }) => {
    if (!value) return undefined;

    return Array.isArray(value) ? value : [value];
  });
}
