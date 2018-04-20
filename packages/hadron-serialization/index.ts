import * as interfaces from './src/types';
import { CONTAINER_NAME } from './src/constants';
import schema from './src/schema-provider';
import serializerProvider from './src/serializer';
import { IContainer } from '@brainhubeu/hadron-core';

export default serializerProvider;

export * from './src/constants';

export const schemaProvider = schema;

export type ISerializer = interfaces.ISerializer;
export type ISerializerConfig = interfaces.ISerializerConfig;
export type ISerializationSchema = interfaces.ISerializationSchema;
export type IProperty = interfaces.IProperty;

export const register = (
  container: IContainer,
  config: interfaces.IHadronSerializerConfig,
) => {
  const serializerConfig: interfaces.ISerializerConfig = {
    ...config.serializer,
  };
  const serializer = serializerProvider(serializerConfig);
  container.register(CONTAINER_NAME, serializer);
};
