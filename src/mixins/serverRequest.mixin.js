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

    async getRequest(url, requireToken = true, query) {
      try {
        const response = requireToken
          ? await axios.get(url, {
              headers: { token: this.sessionToken },
              params: query,
            })
          : await axios.get(url, { params: query });
        return response.data;
      } catch (error) {
        if (error.response.data.tokenExpired) this.expiredSession();
        else throw error.response;
      }
    },

    async getFileRequest(url, requireToken = true) {
      try {
        const response = requireToken
          ? await axios.get(url, {
              headers: { token: this.sessionToken },
              responseType: "arraybuffer",
            })
          : await axios.get(url);
        return {
          file: response.data,
          responseHeaderType: response.headers["content-type"],
        };
      } catch (error) {
        if (error.response.data.tokenExpired) this.expiredSession();
        else {
          throw JSON.parse(Buffer.from(error.response.data).toString("utf8"));
        }
      }
    },

    async putRequest(url, data, requireToken = true) {
      try {
        const response = requireToken
          ? await axios.put(url, data, {
              headers: { token: this.sessionToken },
            })
          : await axios.put(url, data);
        return response.data;
      } catch (error) {
        if (error.response.data.tokenExpired) this.expiredSession();
        else throw error.response;
      }
    },

    async deleteRequest(url, requireToken = true) {
      try {
        const response = requireToken
          ? await axios.delete(url, {
              headers: { token: this.sessionToken },
            })
          : await axios.delete(url);
        return response.data;
      } catch (error) {
        if (error.response.data.tokenExpired) this.expiredSession();
        else throw error.response;
      }
    },

    expiredSession() {
      this.setGlobalError({
        title: "Sesi??n caducada",
        message:
          "La sesi??n ha caducado, por favor, vuelva a iniciar sesi??n con su cuenta.",
      });
      this.logOut();
      this.$router.push("/login");
    },
  },
};

export default serverRequestMixin;
