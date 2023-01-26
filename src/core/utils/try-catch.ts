export const asyncTryCatch = async <P>(
  promise: Promise<P>
): Promise<[P, null] | [null, unknown]> => {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};

export const tryCatch = <FN extends (...args: any) => any>(
  fn: FN
): [ReturnType<FN> | null, null | unknown] => {
  try {
    const result = fn();
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};
