export interface ISerializationSchema {
  name: string;
  properties: IProperty[];
}

export interface IProperty {
  name: string;
  serializedName?: string;
  groups?: string[];
  type: string;
  parsers?: string[];
  properties?: IProperty[];
}

export interface ISerializerConfig {
  parsers?: object;
  schemas?: ISerializationSchema[];
}

export interface ISerializer {
  addParser: (parser: (data: any) => any, key: string) => object;
  addSchema: (schema: ISerializationSchema) => ISerializationSchema[];
  serialize: (data: any, groups: string[], configurationName?: string) => Promise<any>;
}
