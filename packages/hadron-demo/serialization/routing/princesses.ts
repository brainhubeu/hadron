import { Container } from '@brainhubeu/hadron-core';
import { princesses } from '../unicorns-and-princesses';
import { ISerializer } from '@brainhubeu/hadron-serialization';

Container.register('princesses', princesses);

export default {
  getPrincess: {
    path: '/princesses/:name',
    callback: ({ params }: any, { princesses }: any) => {
      return {
        body: princesses[params.name],
      };
    },
    methods: ['get'],
  },
  getPrincessWithRole: {
    path: '/princesses/:role/:name',
    callback: ({ params }: any, { princesses, serializer }: any) => {
      return {
        body: serializer.serialize(
          princesses[params.name],
          [params.role],
          'Princess',
        ),
      };
    },
    methods: ['get'],
  },
  getPrincessWithRoleAndSerializer: {
    path: '/princesses/:role/:name',
    callback: ({ params }: any, { princesses, princessSerializer }: any) => {
      return {
        body: princessSerializer(princesses[params.name], [params.role]),
      };
    },
    methods: ['get'],
  },
};
