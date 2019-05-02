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
    return axios.get("/scrape")
    },
  clear: () => {
    return axios.get("/api/clear")
  },
  getAllArticles: function(){
    return axios.get("/api/articles")
  },
  saveArticle: function(artid, userid){
    return axios.post(`/api/articles/${artid}/${userid}`)
  },
  getsavedArticles: function(userId) {
    return axios.get(`/saved/${userId}`)
  }
};
