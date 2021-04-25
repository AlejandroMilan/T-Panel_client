import axios from "axios";
import { mapGetters } from "vuex";

const serverRequestMixin = {
  computed: { ...mapGetters(["sessionToken"]) },

  methods: {
    async postRequest(url, data, requireToken = true) {
      try {
        const response = requireToken
          ? await axios.post(url, data, {
              headers: { token: this.sessionToken },
            })
          : await axios.post(url, data);
        return response.data;
      } catch (error) {
        console.error(error.response);
      }
    },
  },
};

export default serverRequestMixin;
