export const removeEmpty = (obj: { [key: string]: unknown }) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    // @ts-expect-error recursive
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
    // @ts-expect-error recursive
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
};
