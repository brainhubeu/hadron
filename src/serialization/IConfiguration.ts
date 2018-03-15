export default interface IConfiguration {
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

export interface ISerializerOptions {
    parsers?: object;
}
