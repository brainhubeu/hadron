// tslint:disable:ban-types

export interface IRoute {
    callback: Function;
    middleware?: Function[];
    path: string;
    methods: string[];
}
export interface IRoutesConfig {
    [key: string]: IRoute;
}
