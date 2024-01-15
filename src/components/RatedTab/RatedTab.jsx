import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import { Context } from '../../services/Context';

export default class RatedTab extends Component {
  // eslint-disable-next-line react/static-property-placement
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      films: [],
      isLoading: false,
      // eslint-disable-next-line react/no-unused-state
      error: null,
    };
  }

  componentDidMount() {
    this.getRatedFilms();
  }

  componentDidUpdate(prevProps) {
    const { currentPage } = this.props;
    if (prevProps.currentPage !== currentPage) {
      this.getRatedFilms();
    }
  }

  getRatedFilms = async () => {
    /* eslint-disable prettier/prettier */
    const {
      currentPage,
      setFilms,
      setIsLoading,
      setError,
      setTotalItems,
    } = this.props;
      /* eslint-enable prettier/prettier */
    const { movie } = this.context;
    this.setState({ isLoading: true });
    setIsLoading(true);
    try {
      const movieService = movie;
      const response = await movieService.getRatedFilms(currentPage);
      const films = response.results.map((film) => film);
      // eslint-disable-next-line react/no-unused-state
      this.setState({ films });
      setFilms(films);
      setTotalItems(response.total_results);
    } catch (error) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ error });
      setError(error);
    }
    this.setState({ isLoading: false });
    setIsLoading(false);
  };

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
    }
    return null;
  }
}

RatedTab.propTypes = {
  currentPage: PropTypes.number,
  setFilms: PropTypes.func,
  setIsLoading: PropTypes.func,
  setError: PropTypes.func,
  setTotalItems: PropTypes.func,
};

RatedTab.defaultProps = {
  currentPage: 1,
  setFilms: () => {},
  setIsLoading: () => {},
  setError: () => {},
  setTotalItems: () => {},
};
