import { Container } from '../../hadron-core';
import {
  schemaProvider,
  CONTAINER_NAME,
  ISerializer,
} from '../../hadron-serialization';
import { resolve } from 'path';

const paths = [resolve(__dirname, 'schemas/*')];

export const setupSerializer = () =>
  schemaProvider(paths).then((schemas) => {
    const serializer: ISerializer = Container.take(CONTAINER_NAME);
    schemas.forEach(serializer.addSchema);
    serializer.addParser((value: any) => `${value}$`, 'currency');
  });

export const serializeUnicorn = (unicornData: any, groups: string[] = []) => {
  const serializer = Container.take(CONTAINER_NAME) as ISerializer;
  return serializer.serialize(unicornData, groups, 'Unicorn');
};

Container.register('unicornSerializer', serializeUnicorn);

export const serializePrincess = (unicornData: any, groups: string[] = []) => {
  const serializer = Container.take(CONTAINER_NAME) as ISerializer;
  return serializer.serialize(unicornData, groups, 'Princess');
};

Container.register('princessSerializer', serializePrincess);
