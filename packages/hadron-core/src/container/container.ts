import containerItem from './containerItem';
import { IContainerItem, IContainer } from './types';
import isVarName from '../helpers/isVarName';
import IncorrectContainerKeyNameError from '../errors/IncorrectContainerKeyNameError';

const containerRegister = new Array<IContainerItem>();

const takeContainerByKey = (key: string): IContainerItem[] =>
  containerRegister.filter((x) => x.getKey() === key);

/* method for registering items in container */
/**
 * Method for registering items in container, optionally setting a lifespan for items
 * @param key for representing item in register, second use of the same key override previous item
 * @param item stored item, can be any type: value, type, function....
 * @param lifecycle setting type of life-span [value, singleton, transient] - value is default
 */
const register = (key: string, item: any, lifecycle?: string): void => {
  const containerItems = takeContainerByKey(key);
  if (containerItems.length === 0) {
    const ci = containerItem.containerItemFactory(key, item, lifecycle);
    containerRegister.push(ci);
  } else {
    containerItems[0].Item = item;
  }
};

/** method for getting item from register
 * Method which returns item previously registered for passed key
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

export default container as IContainer;
