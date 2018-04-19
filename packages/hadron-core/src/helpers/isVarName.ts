// tslint:disable:no-eval
export default function isVarName(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }

  if (str.trim() !== str) {
    return false;
  }

  if (!isNaN(parseInt(str[0], null))) {
    return false;
  }

  try {
    eval(`var temp = { ${str}: null }`);
  } catch (e) {
    return false;
  }

  return true;
}
