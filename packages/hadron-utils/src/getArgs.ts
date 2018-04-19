// tslint:disable-next-line:ban-types
const getArgs = (f: Function): string[] => {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  const ARGUMENT_NAMES = /([^\s,]+)/g;
  const funcContent = f.toString().replace(STRIP_COMMENTS, '');
  return (
    funcContent
      .slice(funcContent.indexOf('(') + 1, funcContent.indexOf(')'))
      .match(ARGUMENT_NAMES) || []
  );
};

export default getArgs;
