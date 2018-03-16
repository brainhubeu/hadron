import jsonProvider from "../util/json-provider";

export default (paths: string[]) => {
    if (paths.length >= 0) {
        try {
            return jsonProvider(paths, "*", "", [], true);
        } catch (error) {
            return Promise.reject(new Error(`Incorrect configuration: ${error}`));
        }
    }

    return Promise.resolve([]);
};
