import axios from "axios";
import { mapGetters, mapActions } from "vuex";

const serverRequestMixin = {
  computed: { ...mapGetters(["sessionToken"]) },

  methods: {
    ...mapActions(["logOut", "setGlobalError"]),

    async postRequest(url, data, requireToken = true) {
      try {
        const response = requireToken
          ? await axios.post(url, data, {
              headers: { token: this.sessionToken },
            })
          : await axios.post(url, data);
        return response.data;
      } catch (error) {
        if (error.response.data.tokenExpired) this.expiredSession();
        else throw error.response;
      }
    },

    expiredSession() {
      this.setGlobalError({
        title: "Sesión caducada",
        message:
          "La sesión ha caducado, por favor, vuelva a iniciar sesión con su cuenta.",
      });
      this.logOut();
      this.$router.push("/login");
    },
  },
};

export default serverRequestMixin;
