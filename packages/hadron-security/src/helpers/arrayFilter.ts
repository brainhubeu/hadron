const arrayFilter = (
  arrayToFilter: IMethod[],
  filterBy: string[],
  contains: boolean,
): IMethod[] => {
  return arrayToFilter.filter((item) => {
    return contains
      ? filterBy.indexOf(item.name) > -1
      : filterBy.indexOf(item.name) === -1;
  });
};

export const contains = (
  arrayToSearch: string[],
  filterBy: string[],
): boolean => {
  return filterBy.some((el) => {
    return arrayToSearch.indexOf(el) > -1;
  });
};

export default arrayFilter;
