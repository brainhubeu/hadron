import constants from './src/constants/constants'
import eventsProvider from './src/eventsProvider';
import { IRoutesConfig } from './src/types';

export default eventsProvider;

export const register = (container: any, config: any) => {
  const eventsRegister = eventsProvider(container.take(constants.EVENT_EMITTER), config.events);
  container.register(constants.EVENT_REGISTER, eventsRegister);
}
