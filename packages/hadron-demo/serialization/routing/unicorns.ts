import { Container } from 'hadron-core';
import { unicorns } from '../unicorns-and-princesses';
import { ISerializer } from 'hadron-serialization';

Container.register('unicorns', unicorns);

export default {
  getUnicorn: {
    path: '/unicorns/:name',
    callback: (unicorns: any, name: string) => unicorns[name],
    methods: ['get'],
  },
  getUnicornWithRole: {
    path: '/unicorns/:role/:name',
    callback: (
      unicorns: any,
      serializer: ISerializer,
      role: string,
      name: string,
    ) => serializer.serialize(unicorns[name], [role], 'Unicorn'),
    methods: ['get'],
  },
  getUnicornWithRoleAndSerializer: {
    path: '/unicorns/:role/:name',
    callback: (
      unicorns: any,
      unicornSerializer: any,
      role: string,
      name: string,
    ) => unicornSerializer(unicorns[name], [role]),
    methods: ['get'],
  },
};
