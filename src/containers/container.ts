import containerItem from '../containers/containerItem';
import { IContainerItem } from '../containers/IContainerItem';

const containerRegister = new Array<IContainerItem>();

const takeContainerByKey = (key: string): IContainerItem[] =>
    containerRegister.filter(x => x.Key() === key);

/* method for registering items in container */
/**
 * Method for registering items in container, optionaly setting a lifespan for items
 * @param key for representing item in register, second use of the same key override previous item
 * @param item stored item, can be any tyle: value, type, function....
 * @param lifetime setting type of life-span [value, singletone, transient] - value is default
 */
const register = (key: string, item: any, lifetime?: string): void => {
  const containerItems = takeContainerByKey(key);
  if (containerItems.length === 0) {
    const ci = containerItem.containerItemFactory(key, item, lifetime);
    containerRegister.push(ci);
  } else {
    containerItems[0].Item = item;
  }
};

/** method for getting item from register
 * Method whitch returns item previously registered for passed key
 * @param key for representing item in register
 * @return { any } return stored item
 */
const take = (key: string): any => {
  const containerItems = takeContainerByKey(key);
  return containerItems.length === 0 ? null : containerItems[0].Item;
};

const container = {
  register,
  take,
};

export default container;
