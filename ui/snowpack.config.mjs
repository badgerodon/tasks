export default {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-typescript"],
  packageOptions: {
    polyfillNode: true,
  },
  buildOptions: {},
  optimize: {
    bundle: true,
    treeshake: true,
    sourcemap: "inline",
  },
};
