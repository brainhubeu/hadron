export interface IRoute {
  path: string;
  methods: IMethod[];
}

export interface IMethod {
  name: string;
  allowedRoles: Array<string | string[]>;
}
