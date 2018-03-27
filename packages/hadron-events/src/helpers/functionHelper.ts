import getArgs from '../../../hadron-utils/src/getArgs'


function hasFunctionArgument(func: any, argumentName: any) {
  return getArgs(func).indexOf(argumentName) >= 0;
}

export { hasFunctionArgument };
