import { Container } from '@brainhubeu/hadron-core';
import { unicorns } from '../unicorns-and-princesses';
import { ISerializer } from '@brainhubeu/hadron-serialization';

Container.register('unicorns', unicorns);

export default {
  getUnicorn: {
    path: '/unicorns/:name',
    callback: ({ params }: any, { unicorns }: any) => {
      return { body: unicorns[params.name] };
    },
    methods: ['get'],
  },
  getUnicornWithRole: {
    path: '/unicorns/:role/:name',
    callback: ({ params }: any, { serializer, unicorns }: any) => {
      return {
        body: serializer.serialize(
          unicorns[params.name],
          [params.role],
          'Unicorn',
        ),
      };
    },
    methods: ['get'],
  },
  getUnicornWithRoleAndSerializer: {
    path: '/unicorns/:role/:name',
    callback: ({ params }: any, { unicorns, unicornSerializer }: any) => {
      return {
        body: unicornSerializer(unicorns[params.name], [params.role]),
      };
    },
    methods: ['get'],
  },
};
