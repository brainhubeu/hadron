import { HTTPRequestMethods } from '../constants/routing';
import InvalidRouteMethodError from '../errors/InvalidRouteMethodError';
import NoRouterMethodSpecifiedError from '../errors/NoRouterMethodSpecifiedError';

export const validateMethods = (route: string, methods: string[]) => {
  if (methods.length === 0) {
    throw new NoRouterMethodSpecifiedError(route);
  }

  methods.map((method) => {
    if (!(method.toUpperCase() in HTTPRequestMethods)) {
      throw new InvalidRouteMethodError(route, method);
    }
  });
};
