const routeQueryMixin = {
  methods: {
    changeQuery(payload) {
      const newQuery = {
        ...this.$route.query,
        ...payload,
      };
      this.$router.push({
        name: this.$route.name,
        query: newQuery,
      });
    },
  },
};

export default routeQueryMixin;
