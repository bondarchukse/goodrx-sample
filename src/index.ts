import { writeFile } from 'fs/promises';
import { flatten } from 'lodash';
import {
  createClient,
  getConditionsFromHealthPages,
  getConditionsFromPageContainer,
  getRelatedArticles
} from './utils';

const run = async () => {
  const client = createClient();
  // TODO: Retrieve list of "condition" items
  // const ids = ['v8TkdNxUoEgjclaH1s6fK', '4QNBvIKiGuKa7bpNfzqhlE', '1dnXmiMpBcxCWPXdCbeuJI'];
  // const conditions = await Promise.all([
  //   getConditionsFromHealthPages(client),
  //   getConditionsFromPageContainer(client),
  // ])
  // return flatten(conditions);


  // TODO: Retrieve list of related articles
  return getRelatedArticles(client, 'erectile-dysfunction');
};

run()
  .then((r) => JSON.stringify(r, null, 2))
  // .then((r) => { console.log(r); return r; })
  .then(content => writeFile('out/entries.json', content))
  .catch(console.error);
