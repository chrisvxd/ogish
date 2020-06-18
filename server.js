const Koa = require('koa');
const proxy = require('saasify-faas-proxy');
const qs = require('qs');

const app = new Koa();

const apis = { image: true, preview: true, unwatermark: true, publish: true };

app.use(
  proxy({
    getPath: ({ path }) => {
      const [_, api, template] = path.split('/');
      const pathIsApi = apis[api];

      if (template) {
        return `chrisvxd/og-impact/${api}`;
      } else if (!pathIsApi || path === '/') {
        return 'chrisvxd/og-impact/image';
      }

      return `chrisvxd/og-impact${path}`;
    },
    getParams: ({ path, search }) => {
      const [_, api, template] = path.split('/');
      const pathIsApi = apis[api];

      const searchObj = qs.parse(search.replace('?', ''));

      const params = {};

      if (template && (api === 'image' || api === 'preview' || path === '/')) {
        params.template = template;
      } else if (api && !pathIsApi) {
        params.template = api;
      }

      return '?' + qs.stringify({ ...searchObj, ...params });
    },
  })
);

app.listen(process.env.PORT || 3000);
