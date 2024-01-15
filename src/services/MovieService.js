import axios from 'axios';

const apiKey = import.meta.env.VITE_API_KEY;
const baseURL = 'https://api.themoviedb.org/3/';

export default class MovieService {
  guestSessionId;

  requestApi = async (url, data = {}, params = {}, method = 'GET') => {
    const result = await axios
      .request({
        url,
        baseURL,
        method,
        data,
        params: {
          ...params,
          api_key: apiKey,
        },
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
      .then((r) => r.data);
    return result;
  };

  async search(query, page = 1) {
    const result = await this.requestApi('search/movie', {}, { query, page });
    return result;
  }

  async createGuestSession() {
    const result = await this.requestApi('authentication/guest_session/new').then((r) => {
      this.guestSessionId = r.guest_session_id;
    });
    return result;
  }

  async getRatedFilms(page) {
    const result = await this.requestApi(`guest_session/${this.guestSessionId}/rated/movies`, {}, { page });
    return result;
  }

  async addRatingToFilm(movieId, rating) {
    const result = await this.requestApi(
      `movie/${movieId}/rating`,
      { value: rating },
      { guest_session_id: this.guestSessionId },
      // eslint-disable-next-line prettier/prettier
      'POST',
    );
    return result;
  }

  async getGenreList() {
    const result = await this.requestApi('genre/movie/list');
    return result;
  }
}
