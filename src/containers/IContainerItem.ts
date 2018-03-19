interface IContainerItem {
  Item(): any;
  Item(key: string): void;
  getKey(): string;
  getArgs(): string[];
}

export { IContainerItem };
