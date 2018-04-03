import {
  IProperty,
  ISerializationSchema,
  ISerializer,
  ISerializerConfig,
} from './types';

import { DATA_TYPE } from './constants';

const defaultParsers = {
  [DATA_TYPE.BOOL]: Boolean,
  [DATA_TYPE.NUMBER]: Number,
  [DATA_TYPE.STRING]: String,
};

/**
 * Searches for property
 *
 * @param key "name" of current property
 * @param properties list of available properties
 */
export const getPropertyForKey = (
  key: string,
  properties: IProperty[] = [],
): IProperty => properties.find((property: IProperty) => property.name === key);

/**
 * Searches for parser
 *
 * @param names array of names for parsers, one of them should be "type" of property,
 * other are additional parsers defined in property
 * @param availableParsers list of available parsers
 */
export const getParsers = (names: string[], availableParsers: object) => {
  const namesSet = new Set(names);
  return (Object as any)
    .entries(availableParsers)
    .filter(([key, parser]: [string, any]) => namesSet.has(key))
    .map(([key, parser]: [string, any]) => parser);
};

/**
 * Searches for configration
 *
 * @param type "name" of current serialization
 * @param configurations list of available configurations
 */
export const getConfigurationForType = (
  type: string,
  configurations: ISerializationSchema[],
) =>
  configurations.find(
    (configuration: ISerializationSchema) => configuration.name === type,
  );

/**
 * Checks if given arrays have at least one common memer
 *
 * @param firstArray
 * @param secondArray
 */
export const hasIntersection = (
  firstArray: any[],
  secondArray: any[],
): boolean => {
  const secondArraySet = new Set(secondArray);
  return (
    firstArray.filter((value: any) => secondArraySet.has(value)).length > 0
  );
};

/**
 * Serializes object with given properties, excluding ones not existing in properties array
 *
 * @param data
 * @param groups serialization groups
 * @param properties list of available properties
 * @param parsers list of available parsers
 */
export const serialize = (
  data: object,
  groups: string[],
  properties: IProperty[],
  parsers: object,
) =>
  (Object as any)
    .entries(data)
    // exclude properties not present in schema or not containing proper group
    .filter(([key, value]: [string, any]) => {
      const property = getPropertyForKey(key, properties);
      // if parameter has no groups, its public
      return (
        property &&
        (!property.groups || hasIntersection(property.groups, groups))
      );
    })
    .reduce((result: any, [key, value]: [string, any]) => {
      const property = getPropertyForKey(key, properties);
      const propertyKey = property.serializedName || key;
      return Object.assign(
        result,
        // tslint:disable:no-use-before-declare
        { [propertyKey]: serializeEntry(value, groups, property, parsers) },
      );
    }, {});

/**
 *  Serializes one single entry
 *
 * @param value
 * @param groups current serialization group
 * @param property instance of property, which contains informations about serialization
 * @param availableParsers all available parsers
 */
export const serializeEntry = (
  value: any,
  groups: string[],
  property: IProperty,
  availableParsers: object,
): any => {
  const parsers = getParsers(
    [...(property.parsers || []), property.type],
    availableParsers,
  );
  let serializedValue = value;

  if (property.properties && property.type === DATA_TYPE.OBJECT) {
    serializedValue = serialize(
      value,
      groups,
      property.properties,
      availableParsers,
    );
  }

  if (property.properties && property.type === DATA_TYPE.ARRAY) {
    serializedValue = value
      .map((childValue: any) =>
        serialize(childValue, groups, property.properties, availableParsers),
      )
      .reduce(
        (result: any[], currentValue: any) => [...result, currentValue],
        [],
      );
  }

  if (parsers) {
    serializedValue = parsers.reduce(
      (accumulator: any, parser: (data: any) => any) => parser(accumulator),
      serializedValue,
    );
  }
  return serializedValue;
};

/**
 * Function provider for serialization
 *
 * @param configuration array of serialize configurations
 * @param options options for serializer, like path to configuration files, or additional parsers
 */
const serializerProvider = (config: ISerializerConfig) => {
  const parsers = {
    ...defaultParsers,
    ...(config.parsers || {}),
  } as any;

  const schemas = config.schemas || [];
  return {
    addParser: (parser: (data: any) => any, key: string) => {
      parsers[key] = parser;
      return parser;
    },
    addSchema: (schema: ISerializationSchema) => {
      schemas.push(schema);
      return schemas;
    },
    serialize: (data: any, groups: string[], configurationName?: string) => {
      // if configurationName is not defined, we are trying to get name from instance of object
      const name = configurationName || data.constructor.name;
      const foundConfiguration = schemas.find(
        (configuration: ISerializationSchema) => configuration.name === name,
      );
      if (!foundConfiguration) {
        return Promise.reject(new Error('Configuration not found'));
      }
      return Promise.resolve(foundConfiguration).then(
        (schema: ISerializationSchema) =>
          data && serialize(data, groups, schema.properties, parsers),
      );
    },
  } as ISerializer;
};

export default serializerProvider;
