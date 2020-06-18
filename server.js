const Koa = require('koa');
const proxy = require('saasify-faas-proxy');
const qs = require('qs');

const app = new Koa();

const apis = ['image', 'preview', 'publish'];

app.use(
  proxy({
    getPath: ({ path }) => {
      const [_, api, id] = path.split('/');

      if (api === 'image' || !id) {
        return `chrisvxd/og-impact/image`;
      } else if (api === 'preview') {
        return `chrisvxd/og-impact/preview`;
      }

      return `chrisvxd/og-impact${path}`;
    },
    getParams: ({ path, search }) => {
      const [_, api, id] = path.split('/');

      const searchObj = qs.parse(search.replace('?', ''));

      const params = {};

      if (api === 'image' || api === 'preview' || path === '/') {
        params.template = id;
      } else if (!apis[api]) {
        params.template = api; // If `api` is not an API, assume it's a template ID
      }

      return '?' + qs.stringify({ ...searchObj, ...params });
    },
  })
);

app.listen(process.env.PORT || 3000);
