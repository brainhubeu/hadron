import Container from "../containers/container";

class ContainerItem {
    public container: Container;

    // tslint:disable-next-line:variable-name
    private _itemInstanse: any;
    // tslint:disable-next-line:variable-name
    private _lifetime: Lifetime;
    // tslint:disable-next-line:variable-name
    private _itemParameters: any[];

    constructor(private key: string, private item: any) {
        this.item = item;
        this._lifetime = Lifetime.Value;
    }

    get Item(): any {
        if (this._lifetime === Lifetime.Transient || this._lifetime === Lifetime.Singletone) {
            const parameters = this.getArgs();
            if (parameters.length > 0) {
                const parameterInstances = parameters.map((param) => this.container.take(param));
                if (this._lifetime === Lifetime.Transient) {
                    try {
                        return new this.item(...parameterInstances);
                    } catch (error) {
                        throw new Error("can not create an instance of " + this.key);
                    }
                } else if (this._lifetime === Lifetime.Singletone) {
                    if (this._itemInstanse === null) {
                        try {
                            this._itemInstanse = new this.item.call(...parameterInstances);
                        } catch (error) {
                            throw new Error("can not create an instance of " + this.key);
                        }
                    }
                    return this._itemInstanse;
                }
            } else {
                if (this._lifetime === Lifetime.Transient) {
                    try {
                        return new this.item();
                    } catch (error) {
                        throw new Error("can not create an instance of " + this.key);
                    }
                } else if (this._lifetime === Lifetime.Singletone) {
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
        return this.item;
    }
    set Item(item: any) {
        this.item = item;
    }
    get Lifetime() {
        return this._lifetime;
    }
    get Key() {
        return this.key;
    }
    public AsSingletone(): ContainerItem {
        this._lifetime = Lifetime.Singletone;
        return this;
    }
    public AsTransient(): ContainerItem {
        this._lifetime = Lifetime.Transient;
        return this;
    }
    public WithParameters(params: any[]): ContainerItem {
        this._itemParameters = params;
        return this;
    }
    public getArgs(): string[] {
        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        const ARGUMENT_NAMES = /([^\s,]+)/g;
        const funcContent = this.item.toString().replace(STRIP_COMMENTS, "");
        return funcContent
            .slice(
                funcContent.indexOf("(") + 1,
                funcContent.indexOf(")"),
            )
            .match(ARGUMENT_NAMES) || [];
    }
}

enum Lifetime {
    Transient = 0,
    Singletone = 1,
    Value = 2,
}

export default ContainerItem;
