const external = ['react'];

const plugins = [];

const DefaultConfig = [
  // CommonJs
  {
    input: 'js/index.js',
    output: {
      file: 'lib/store.js',
      format: 'cjs',
      exports: 'named',
    },
    external,
    plugins,
  },
  // ES
  {
    input: 'js/index.js',
    output: {
      file: 'es/store.js',
      format: 'es',
      exports: 'named',
    },
    external,
    plugins,
  },
  // ES for browsers
  {
    input: 'js/index.js',
    output: {
      file: 'es/store.mjs',
      format: 'es',
      exports: 'named',
    },
    external,
    plugins,
  },
  // UMD
  {
    input: 'js/index.js',
    output: {
      file: 'dist/store.js',
      format: 'umd',
      name: 'Store',
      exports: 'named',
      globals: {
        react: 'React',
      },
    },
    external,
    plugins,
  },
];

export default DefaultConfig;
