export function arrayMove<T>(
  array: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  const newArray = [...array];
  const element = newArray.splice(fromIndex, 1)[0];
  newArray.splice(toIndex, 0, element);
  return newArray;
}
