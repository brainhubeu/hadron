import container from "../containers/container";

const containerItemFactory = (key: string, item: any, lifetime?: Lifetime): ContainerItem => {
    switch (+lifetime) {
        case Lifetime.Singletone:
            return new ContainerItemSingletone(key, item);
        case Lifetime.Transient:
            return new ContainerItemTransient(key, item);
        default:
            return new ContainerItem(key, item);
    }
};
export interface IContainerItem {
    Item(): any;
    Item(key: string): void;
    Lifetime(): Lifetime;
    Key(): string;
    getArgs(): string[];
}
class ContainerItem implements IContainerItem {
    // tslint:disable-next-line:variable-name
    protected _lifetime: Lifetime;
    constructor(protected key: string, protected item: any) {
        this._lifetime = Lifetime.Value;
    }

    get Item(): any {
        return this.item;
    }
    set Item(item: any) {
        this.item = item;
    }
    public Lifetime(): Lifetime {
        return this._lifetime;
    }
    public Key() {
        return this.key;
    }
    public getArgs() { return getArgs(this.item); }
}

// tslint:disable-next-line:max-classes-per-file
class ContainerItemSingletone extends ContainerItem {
    // tslint:disable-next-line:variable-name
    private _itemInstanse: any;
    constructor(key: string, item: any) {
        super(key, item);
        super._lifetime = Lifetime.Singletone;
    }
    set Item(item: any) {
        this.item = item;
    }
    get Item(): any {
        const parameters = getArgs(this.item);
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
    constructor(key: string, item: any) {
        super(key, item);
        super._lifetime = Lifetime.Transient;
    }
    set Item(item: any) {
        this.item = item;
    }
    get Item(): any {
        const parameters = getArgs(this.item);
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
const getArgs = (item: any): string[] => {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const funcContent = item.toString().replace(STRIP_COMMENTS, "");
    return funcContent
        .slice(
            funcContent.indexOf("(") + 1,
            funcContent.indexOf(")"),
        )
        .match(ARGUMENT_NAMES) || [];
};

enum Lifetime {
    Transient = 0,
    Singletone = 1,
    Value = 2,
}

export default { containerItemFactory, Lifetime };
