import axios from "axios";

export default {
  api: axios.create({
    baseURL: "https://sportsclubmanager.herokuapp.com/api",
  }),
};
