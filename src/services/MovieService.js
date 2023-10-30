import axios from 'axios'

const apiKey = import.meta.env.VITE_API_KEY
const baseURL = 'https://api.themoviedb.org/3/'

export default class MovieService {
  guestSessionId

  async requestApi(url, data = {}, params = {}, method = 'GET') {
    return await axios
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
      .then((r) => {
        return r.data
      })
  }

  async search(query, page = 1) {
    return await this.requestApi('search/movie', {}, { query, page })
  }

  async createGuestSession() {
    return await this.requestApi('authentication/guest_session/new').then((r) => {
      this.guestSessionId = r.guest_session_id
    })
  }

  async getRatedFilms(page) {
    return await this.requestApi(`guest_session/${this.guestSessionId}/rated/movies`, {}, { page })
  }

  async addRatingToFilm(movieId, rating) {
    return await this.requestApi(
      `movie/${movieId}/rating`,
      { value: rating },
      { guest_session_id: this.guestSessionId },
      'POST'
    )
  }

  async getGenreList() {
    return await this.requestApi('genre/movie/list')
  }
}
