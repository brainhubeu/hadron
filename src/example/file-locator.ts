import locate from '../util/file-locator';

locate(['src/util/__tests__/mock/app/config/*', 'src/util/__tests__/mock/plugins/*/config/*'], 'config', 'development', ['js'])
.then(data => {
    console.log(data);
});