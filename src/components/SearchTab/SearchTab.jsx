import React, { Component } from 'react'
import { Input } from 'antd'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'

import FetcherService from '../../services/FetcherService.js'
import { Context } from '../../services/Context.js'

export default class SearchTab extends Component {
  constructor(props) {
    super(props);
    this.fetcher = new FetcherService();
    this.queryHandler = this.queryHandler.bind(this);
    this.debouncedQueryHandler = debounce(this.queryHandler, 600, {maxWait: 1000});
  }
  state = {
    queryString: "",
    isLoading: false,
    error: null,
    films: []
  }
  static contextType = Context;
  
  searchFilms = async () => {
    const { currentPage, setTotalItems, ratedFilms, setFilms, setError } = this.props;
    this.setState({isLoading: true});
    try {
      const movieService = this.context.movie;
      const response = await movieService.search(this.state.queryString, currentPage);
      const films = response.results.map(film => {
        const ratedFilm = ratedFilms.find((ratedFilm) => ratedFilm.id === film.id)
        if (ratedFilm) {
          film.rating = ratedFilm.rating
        }
        return film
      })
      setFilms(films); 
      setTotalItems(response.total_results);
    } catch(error) {
        this.setState({error: error});
        setError(error);    
    }
    this.setState({isLoading: false});
  }

  componentDidMount() {
    this.checkQueryString();
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { setIsLoading, setError } = this.props;
    if(prevProps.currentPage !== this.props.currentPage) {
      this.searchFilms(); 
    }
    if(prevState.queryString !== this.state.queryString) {
      this.checkQueryString();
    }
    if(prevState.error !== this.state.error) {
      setError(this.state.error);
    }
    if(prevState.isLoading !== this.state.isLoading) {
      setIsLoading(this.state.isLoading);
    }
  }
  
  checkQueryString = () => {
    if(this.state.queryString.trim() === '') {
      return;
    }
    this.searchFilms();
  }

  queryHandler = (e) => {
    this.setState({queryString: e.target.value});
  }
  render() {
    return <Input placeholder="Type to search..." onChange={this.debouncedQueryHandler} style={{ marginTop: '20px' }} />
  }
}

SearchTab.propTypes = {
  currentPage: PropTypes.number,
  setFilms: PropTypes.func,
  setIsLoading: PropTypes.func,
  setError: PropTypes.func,
  setTotalItems: PropTypes.func,
  ratedFilms: PropTypes.array,
}

SearchTab.defaultProps = {
  currentPage: 1,
  setFilms: {},
  setIsLoading: {},
  setError: {},
  setTotalItems: {},
  ratedFilms: {},
}
