const buildRange = (min?: number, max?: number) => ({
  ...(min !== undefined && { gte: min }),
  ...(max !== undefined && { lte: max }),
});

const checkArrayFilter = (key: string, array: unknown[] | undefined) =>
  array?.length && { [key]: { in: array } };

const checkRangeFilter = (key: string, min: number | undefined, max: number | undefined) =>
  (min !== undefined || max !== undefined) && {
    [key]: buildRange(min, max),
  };

export { checkArrayFilter, checkRangeFilter };
