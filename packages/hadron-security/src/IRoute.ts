interface IRoute {
  path: string;
  methods: IMethod[];
}

interface IMethod {
  name: string;
  allowedRoles: Array<string | string[]>;
}
