const Koa = require('koa');
const proxy = require('saasify-faas-proxy');
const qs = require('qs');

const app = new Koa();

const apis = ['image', 'preview', 'publish', 'url', 's'];

const baseUrl = 'chrisvxd/og-impact';

app.use(
  proxy({
    getPath: ({ path }) => {
      const [_, api, id] = path.split('/');

      if (api === 'image' || !id) {
        return `${baseUrl}/image`;
      } else if (api === 'preview') {
        return `${baseUrl}/preview`;
      } else if (api === 'url' || api === 's') {
        return `${baseUrl}/url`;
      }

      return `${baseUrl}${path}`;
    },
    getParams: ({ path, search }) => {
      const [_, api, id] = path.split('/');

      const searchObj = qs.parse(search.replace('?', ''));

      const params = {};

      if (api === 'image' || api === 'preview' || path === '/') {
        params.template = id;
      } else if (api === 'url' || api === 's') {
        params.id = id;
      } else if (!apis[api]) {
        params.template = api; // If `api` is not an API, assume it's a template ID
      }

      return '?' + qs.stringify({ ...params, ...searchObj });
    },
  })
);

app.listen(process.env.PORT || 3000);
