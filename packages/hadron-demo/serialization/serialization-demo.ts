import { Container } from '../../hadron-core';
import { schemaProvider, CONTAINER_NAME, ISerializer } from '../../hadron-serialization';

const paths = [
  'serialization/schemas/*',
];

export const setupSerializer = (pathToSchemas: string[]) =>
  schemaProvider(pathToSchemas)
    .then(schemas => {
      const serializer: ISerializer = Container.take(CONTAINER_NAME);
      serializer.addSchema(schemas);
      serializer.addParser((value: any) => `${value}$`, 'currency');
    });

// export const serializeUnicorn = (unicornData: any, groups: string[] = []) => {
//   const serializer = Container.take(CONTAINER_NAME) as ISerializer;
//   return serializer.serialize(unicornData, groups, 'unicorn');
// };

// Container.register('unicornSerializer', serializeUnicorn);

// export const serializePrincess = (unicornData: any, groups: string[] = []) => {
//   const serializer = Container.take(CONTAINER_NAME) as ISerializer;
//   return serializer.serialize(unicornData, groups, 'princess');
// };

// Container.register('princessSerializer', serializePrincess);
