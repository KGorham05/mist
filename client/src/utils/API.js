import axios from 'axios';
// import cheerio from 'cheerio';

export default {
  // Gets a single user by id
  getUser: (id) => {
    return axios.get(`/api/user/${id}`);
  },
  // sign up a user to our service
  signUpUser: (username, email, password) => {
    return axios.post('api/signup', {username: username, email: email, password: password});
  },

  //scrape code
  scrape: () => {
    axios.get("/scrape").then(res => console.log("scraped"))
   
    },
  getAllArticles: function(){
    return axios.get("/api/articles")
  }
};
