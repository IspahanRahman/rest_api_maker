const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  /* config options here */
  reactCompiler: true,
};

module.exports = withNextIntl(nextConfig);
