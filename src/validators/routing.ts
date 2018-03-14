import { HTTPRequestMethods } from "../constants/routing";
import RouterMethodError from "../errors/RouterMethodError";

export const validateMethods = (methods: string[]) => {
    methods.map((method) => {
        if (!HTTPRequestMethods.includes(method.toUpperCase())) {
            throw new RouterMethodError();
        }
    });
};
