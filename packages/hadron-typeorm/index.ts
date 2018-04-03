import { connect } from './src/connectionHelper';
import * as constants from './src/constants';

export const register = (container: any, config: any): Promise<void> =>
  connect(container, config);

export { connect, constants };
