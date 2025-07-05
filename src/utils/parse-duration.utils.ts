import * as ms from 'ms';

export function parseDuration(duration: string) {
  return ms(duration);
}
