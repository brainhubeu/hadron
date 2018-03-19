
import locate from '../util/file-locator';

locate(['src/util/__tests__/mock/app/config/*', 'src/util/__tests__/mock/plugins/*/config/*'],
       'config', 'development', ['js'])
.then(data => {
    // tslint:disable-next-line:no-console
  console.log(data);
});
