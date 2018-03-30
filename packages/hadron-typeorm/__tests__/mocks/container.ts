let items: any = {};

const containerMock = {
  register: (key: string, value: any) => {
    items[key] = value;
  },
  take: (key: string) => items[key],
};

const clear = () => {
  items = {};
}

export {
  clear,
  items,
  containerMock as default,
};
