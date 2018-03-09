import jsonProvider from '../util/json-provider';

jsonProvider(['src/util/__tests__/mock/app/config/*'], 'config', 'test', ['json', 'js'])
.then(data => console.log(data));
