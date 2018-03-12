import container from "../containers/container";
import { IContainerItem } from "../containers/IContainerItem";
import { Lifetime } from "../containers/lifetime";
import { getArgs } from "../helpers/functionHelper";

const containerItemFactory = (key: string, item: any, lifetime?: string): ContainerItem => {
    switch (lifetime) {
        case Lifetime.Singletone:
            return new ContainerItemSingletone(key, item);
        case Lifetime.Transient:
            return new ContainerItemTransient(key, item);
        default:
            return new ContainerItem(key, item);
    }
};

class ContainerItem implements IContainerItem {
    // tslint:disable-next-line:variable-name
    constructor(protected key: string, protected item: any) { }

    get Item(): any { return this.item; }
    set Item(item: any) { this.item = item; }

    public Key() { return this.key; }
    public getArgs(): string[] { return getArgs(this.item); }
}

// tslint:disable-next-line:max-classes-per-file
class ContainerItemSingletone extends ContainerItem {
    // tslint:disable-next-line:variable-name
    private _itemInstanse: any;

    constructor(key: string, item: any) {
        super(key, item);
        this._itemInstanse = null;
    }

    set Item(item: any) { this.item = item; }
    get Item(): any {
        const parameters = this.getArgs();
        if (parameters.length > 0) {
            const parameterInstances = parameters.map((paramName) => container.take(paramName));
            if (this._itemInstanse === null) {
                try {
                    this._itemInstanse = new this.item(...parameterInstances);
                } catch (error) {
                    throw new Error("can not create an instance of " + this.key);
                }
            }
            return this._itemInstanse;
        } else {
            if (this._itemInstanse === null) {
                try {
                    this._itemInstanse = new this.item();
                } catch (error) {
                    throw new Error("can not create an instance of " + this.key);
                }
            }
            return this._itemInstanse;
        }
    }
}
// tslint:disable-next-line:max-classes-per-file
class ContainerItemTransient extends ContainerItem {
    constructor(key: string, item: any) { super(key, item); }

    set Item(item: any) { this.item = item; }
    get Item(): any {
        const parameters = this.getArgs();
        if (parameters.length > 0) {
            const parameterInstances = parameters.map((paramName) => container.take(paramName));
            try {
                return new this.item(...parameterInstances);
            } catch (error) {
                throw new Error("can not create a new instance of " + this.key);
            }
        } else {
            try {
                return new this.item();
            } catch (error) {
                throw new Error("can not create a new instance of " + this.key);
            }
        }
    }
}

export default { containerItemFactory };
