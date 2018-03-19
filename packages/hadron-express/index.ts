import hadronExpress from "./src/hadronToExpress";
export { IRoutesConfig, IRoute } from "./src/interfaces";
import { IRoutesConfig } from "./src/interfaces";

export default hadronExpress;

export const register = (app: any, Container: any, config: any) => {
    hadronExpress(app, config.routes as IRoutesConfig, Container as any);
    console.log("registering express");
};
