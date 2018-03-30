import { Container } from '../../../hadron-core';
import { princesses } from '../unicorns-and-princesses';
import { ISerializer } from '../../../hadron-serialization';

Container.register('princesses', princesses);

export default {
  getPrincess: {
    path: '/princesses/:name',
    callback: (princesses: any, name: string) => princesses[name],
    methods: ['get'],
  },
  getPrincessWithRole: {
    path: '/princesses/:role/:name',
    callback: (
      princesses: any,
      serializer: ISerializer,
      role: string,
      name: string,
    ) => serializer.serialize(princesses[name], [role], 'Princess'),
    methods: ['get'],
  },
  getPrincessWithRoleAndSerializer: {
    path: '/princesses/:role/:name',
    callback: (
      princesses: any,
      princessSerializer: any,
      role: string,
      name: string,
    ) => princessSerializer(princesses[name], [role]),
    methods: ['get'],
  },
};
