interface IContainerItem {
  Item(): any;
  Item(key: string): void;
  Key(): string;
  getArgs(): string[];
}

export { IContainerItem };
