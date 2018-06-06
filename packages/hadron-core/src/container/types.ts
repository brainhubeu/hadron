interface IContainerItem {
  Item(): any;
  Item(key: string): void;
  getKey(): string;
  getArgs(): string[];
}

interface IContainer {
  take: (key: string) => any;
  register: (key: string, value: any, lifecycle?: string) => any;
  keys: () => string[];
}

export { IContainerItem, IContainer };
