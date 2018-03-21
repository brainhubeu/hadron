import * as interfaces from './src/types';
import * as constants from './src/constants';
import schema from './src/schema-provider';
import serializerProvider from './src/serializer';

export default serializerProvider;

export const schemaProvider = schema;

export type ISerializer = interfaces.ISerializer;
export type ISerializerConfig = interfaces.ISerializerConfig;
export type ISerializationSchema = interfaces.ISerializationSchema;
export type IProperty = interfaces.IProperty;

export const register = (container: any, config: any) => {
  const serializerConfig = config.serializer as interfaces.ISerializerConfig;
  const serializer = serializerProvider(serializerConfig);
  container.register(constants.CONTAINER_NAME, serializer);
};
