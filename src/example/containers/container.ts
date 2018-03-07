import * as container from "../containers/containerItem";

const containerRegister = new Array<container.IContainerItem>();

const register = (key: string, item: any, lifetime?: number): container.IContainerItem => {
    const containerItem = takeContainerByKey(key);
    if (containerItem.length === 0) {
        const ci = container.default.containerItemFactory(key, item, lifetime );
        containerRegister.push(ci);
        return ci;
    }
    containerItem[0].Item = item;
    return containerItem[0];
};

const take = (key: string): any => {
    const containerItem = takeContainerByKey(key);
    if (containerItem.length === 0) {
        // type is not registeres
        return null;
    }
    return  containerItem[0].Item;
};
const takeContainerByKey = (key: string): container.IContainerItem[] =>
    containerRegister.filter((x) => x.Key() === key);

const Container = {
    register,
    take,
    CountItems(): number {
        return containerRegister.length;
    },
};
export default Container;
