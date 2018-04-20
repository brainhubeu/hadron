import { connect } from './src/connectionHelper';
import * as constants from './src/constants';
import { IHadronTypeormConfig } from './src/types';
import { IContainer } from '@brainhubeu/hadron-core';

export const register = (
  container: IContainer,
  config: IHadronTypeormConfig,
): Promise<void> => connect(container, config);

export { connect, constants, IHadronTypeormConfig };
