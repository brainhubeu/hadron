import { getArgs } from '@brainhubeu/hadron-utils';

function hasFunctionArgument(func: any, argumentName: any) {
  return getArgs(func).indexOf(argumentName) >= 0;
}

export { hasFunctionArgument };
