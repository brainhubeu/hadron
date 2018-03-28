import jsonProvider from 'hadron-json-provider'

export default (paths: string[]) => {
  if (paths.length >= 0) {
    try {
      return jsonProvider(paths, ['json'], true);
    } catch (error) {
      return Promise.reject(new Error(`Incorrect configuration: ${error}`));
    }
  }

  return Promise.resolve([]);
};
