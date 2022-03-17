import backendService from "./backendService";

export default {
  async login(email, password) {
    try {
      const response = await backendService.api.post("/auth/login", {
        email: email,
        password: password,
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};
