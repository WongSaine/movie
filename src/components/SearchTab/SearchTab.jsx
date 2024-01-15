import React, { Component } from 'react';
import { Input } from 'antd';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

import FetcherService from '../../services/FetcherService';
import { Context } from '../../services/Context';

export default class SearchTab extends Component {
  // eslint-disable-next-line react/static-property-placement
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      queryString: '',
      isLoading: false,
      error: null,
      // eslint-disable-next-line react/no-unused-state
      films: [],
    };
    // eslint-disable-next-line react/no-unused-class-component-methods
    this.fetcher = new FetcherService();
    this.queryHandler = this.queryHandler.bind(this);
    this.debouncedQueryHandler = debounce(this.queryHandler, 600, { maxWait: 1000 });
  }

  componentDidMount() {
    this.checkQueryString();
    this.debouncedQueryHandler({ target: { value: 'return' } });
  }

  componentDidUpdate(prevProps, prevState) {
    const { setIsLoading, setError, currentPage } = this.props;
    const { queryString, error, isLoading } = this.state;
    if (prevProps.currentPage !== currentPage) {
      this.searchFilms();
    }
    if (prevState.queryString !== queryString) {
      this.checkQueryString();
    }
    if (prevState.error !== error) {
      setError(error);
    }
    if (prevState.isLoading !== isLoading) {
      setIsLoading(isLoading);
    }
  }

  searchFilms = async () => {
  /* eslint-disable prettier/prettier */

    const {
      currentPage,
      setTotalItems,
      ratedFilms,
      setFilms,
      setError,
    } = this.props;
    /* eslint-enable prettier/prettier */

    const { queryString } = this.state;
    const { movie } = this.context;
    this.setState({ isLoading: true });
    try {
      const movieService = movie;
      const response = await movieService.search(queryString, currentPage);
      const films = response.results.map((film) => {
        // eslint-disable-next-line no-shadow
        const ratedFilm = ratedFilms.find((ratedFilm) => ratedFilm.id === film.id);
        if (ratedFilm) {
          // eslint-disable-next-line no-param-reassign
          film.rating = ratedFilm.rating;
        }
        return film;
      });
      setFilms(films);
      setTotalItems(response.total_results);
    } catch (error) {
      this.setState({ error });
      setError(error);
    }
    this.setState({ isLoading: false });
  };

  checkQueryString = () => {
    const { queryString } = this.state;
    if (queryString.trim() === '') {
      return;
    }
    this.searchFilms();
  };

  queryHandler = (e) => {
    this.setState({ queryString: e.target.value });
  };

  render() {
    return (
      <Input
        placeholder="Type to search..."
        defaultValue="return"
        onChange={this.debouncedQueryHandler}
        style={{ marginTop: '20px' }}
      />
    );
  }
}

SearchTab.propTypes = {
  currentPage: PropTypes.number,
  setFilms: PropTypes.func,
  setIsLoading: PropTypes.func,
  setError: PropTypes.func,
  setTotalItems: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  ratedFilms: PropTypes.array,
};

SearchTab.defaultProps = {
  currentPage: 1,
  setFilms: {},
  setIsLoading: {},
  setError: {},
  setTotalItems: {},
  ratedFilms: {},
};
