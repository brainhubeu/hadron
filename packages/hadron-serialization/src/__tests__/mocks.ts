import { IProperty, ISerializationSchema, ISerializerConfig } from '../types';

export const fruitConfiguration = {
  name: 'Fruit',
  properties: [
    { name: '_id', type: 'string', serializedName: 'ID' } as IProperty,
    { name: 'name', type: 'string' } as IProperty,
    {
      name: 'price',
      groups: ['common', 'seller'],
      type: 'number',
    } as IProperty,
    {
      groups: ['seller'],
      name: 'funkyName',
      parsers: ['funkyParser'],
      type: 'string',
    } as IProperty,
    {
      name: 'flavour',
      properties: [
        {
          name: 'bitterness',
          type: 'number',
        } as IProperty,
        {
          name: 'sweetness',
          type: 'number',
        } as IProperty,
      ],
      type: 'object',
    },
  ],
} as ISerializationSchema;

export const carConfiguration = {
  name: 'Car',
  properties: [
    { name: 'name', groups: ['common', 'seller'], type: 'string' } as IProperty,
    {
      name: 'price',
      groups: ['common', 'seller'],
      type: 'number',
    } as IProperty,
    {
      groups: ['seller'],
      name: 'type',
      type: 'string',
    } as IProperty,
  ],
} as ISerializationSchema;

export const options = {
  parsers: {
    funkyParser: (data: any) => `funky ${data}`,
  },
} as ISerializerConfig;
