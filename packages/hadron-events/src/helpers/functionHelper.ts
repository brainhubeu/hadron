import { getArgs } from '@brainhubeu/hadron-utils';

// tslint:disable-next-line:ban-types
function hasFunctionArgument(func: Function, argumentName: string) {
  return getArgs(func).indexOf(argumentName) >= 0;
}

export { hasFunctionArgument };
