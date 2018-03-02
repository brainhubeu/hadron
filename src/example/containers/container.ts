import ContainerItem from "../containers/containerItem";

class Container {
    private containerRegister: ContainerItem[];

    constructor() {
        this.containerRegister = new Array<ContainerItem>();
    }
    public register(key: string, item: any): ContainerItem {
        let containerItem = this.takeContainerByKey(key);
        if (containerItem === null) {
            containerItem = new ContainerItem(key, item);
            this.containerRegister.push(containerItem);
            return containerItem;
        }
        containerItem.Item = item;
        return containerItem;
    }

    public CountItems() {
        return this.containerRegister.length;
    }
    // public takeAndCast<T>(key: string): T {
    //     const containerItem = this.takeContainerByKey(key);
    //     if (containerItem == null) {
    //         // type is not registeres
    //     }

    //     const retval = containerItem.Item as T;
    //     return retval;
    // }
    public take(key: string): any {
        const containerItem = this.takeContainerByKey(key);
        if (containerItem == null) {
            // type is not registeres
            return null;
        }
        return  containerItem.Item;
    }
    private takeContainerByKey(key: string): any {
        for (let i = 0; i < this.CountItems(); i++) {
            if (this.containerRegister[i].Key === key) {
                return this.containerRegister[i];
            }
        }

        // type is not defineg
        return null;
    }

    // public register<T>(item: T): Container{

    // }
}

export default Container;
