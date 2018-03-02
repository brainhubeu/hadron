class ContainerItem {

    // tslint:disable-next-line:variable-name
    private _itemInstanse: any;
    // tslint:disable-next-line:variable-name
    private _lifetime: Lifetime;

    constructor(private key: string, private item: any) {
        this.item = item;
        this._lifetime = Lifetime.Transient;
    }

    get Item(): any {
        if (typeof this.item === "function") {
            if (this._lifetime === Lifetime.Transient) {
                return new this.item();
            }
            if (this._itemInstanse === null) {
                this._itemInstanse = new this.item();
            }
            return this._itemInstanse;
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
    public AsSingletone() {
        this._lifetime = Lifetime.Singletone;
    }
    public AsTransient() {
        this._lifetime = Lifetime.Transient;
    }
}

enum Lifetime {
    Transient,
    Singletone,
}

export default ContainerItem;
