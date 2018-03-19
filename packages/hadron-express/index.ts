import hadronExpress from "./src/hadronToExpress";
export { IRoutesConfig, IRoute } from "./src/interfaces";
import { IRoutesConfig } from "./src/interfaces";

export default hadronExpress;

export const register = (Container: any, config: any) => {
    hadronExpress(config.routes as IRoutesConfig, Container as any);
    console.log("registering express");
};
