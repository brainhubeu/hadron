import { HTTPRequestMethods } from "../constants/routing";
import HadronRouterError from "../errors/HadronRouterError";

export const validateMethods = (methods: string[]) => {
    methods.map((method) => {
        if (!(method.toUpperCase() in HTTPRequestMethods)) {
            throw new HadronRouterError();
        }
    });
};
