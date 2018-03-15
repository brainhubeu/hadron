import IConfiguration, { IProperty, ISerializerOptions } from "./IConfiguration";

const defaultParsers = {
    bool: Boolean,
    number: Number,
    string: String,
};

export const getPropertyForKey = (key: string, properties: IProperty[] = []): IProperty => {
    return properties.find((property: IProperty) => property.name === key);
};

export const getParsers = (names: string[], availableParsers: object) => {
    const namesSet = new Set(names);
    return Object.entries(availableParsers)
        .filter(([key, parser]: [string, any]) => namesSet.has(key))
        .map(([key, parser]) => parser);
};

export const getConfigurationForType = (type: string, configurations: IConfiguration[]) => {
    return configurations.find((configuration: IConfiguration) => configuration.name === type);
};

export const serialize =
    (data: object, groups: string[], properties: IProperty[], parsers: object) => {
    return Object.entries(data)
        // exclude properties not present in schema or not containing proper group
        .filter(([key, value]: [string, any]) => {
            const property = getPropertyForKey(key, properties);
            // if parameter has no groups, its public
            return property && (!property.groups || hasIntersection(property.groups, groups));
        })
        .reduce((result, [key, value]: [string, any]) => {
                const property = getPropertyForKey(key, properties);
                const propertyKey = property.serializedName || key;
                return Object.assign(
                    result,
                    { [propertyKey]: serializeEntry(value, groups, property, parsers) },
                );
            },
            {},
        );
};

export const serializeEntry =
    (value: any, groups: string[], property: IProperty, availableParsers: object): any => {
    const parsers = getParsers([...(property.parsers || []), property.type], availableParsers);
    let serializedValue = value;

    if (property.properties && typeof value === "object") {
        serializedValue = serialize(value, groups, property.properties, availableParsers);
    }

    if (parsers) {
        serializedValue = parsers.reduce((accumulator, parser) => parser(accumulator), serializedValue);
    }
    return serializedValue;
};

export const hasIntersection = (firstArray: any[], secondArray: any[]): boolean => {
    const secondArraySet = new Set(secondArray);
    return firstArray.filter(
        (value: any) => secondArraySet.has(value),
    ).length > 0;
};

const serializerProvider = (configurations: IConfiguration[], options: ISerializerOptions) => {
    const parsers = {
        ...defaultParsers,
        ...(options.parsers || {}),
    };

    return (data: any, groups: string[], configurationName?: string) => {
        const name = configurationName || data.constructor.name;
        const foundConfiguration = configurations.find((configuration: IConfiguration) => configuration.name === name);
        if (!foundConfiguration) {
            return Promise.reject(new Error("Configuration not found"));
        }
        return Promise.resolve(foundConfiguration)
            .then((configuration: IConfiguration) => serialize(data, groups, configuration.properties, parsers));
    };
};

export default serializerProvider;
