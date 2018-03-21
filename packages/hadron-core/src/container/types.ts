interface IContainerItem {
  Item(): any;
  Item(key: string): void;
  getKey(): string;
  getArgs(): string[];
}

interface IContainer {
  take: (key: string) => any,
  register: (key: string, value: any, lifetime?: string) => any;
}

export { IContainerItem, IContainer };
