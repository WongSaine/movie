import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import { Context } from '../../services/Context.js'

export default class RatedTab extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    films: [],
    isLoading: false,
    error: null
  }
  static contextType = Context; 

  getRatedFilms = async () => {
    const { currentPage, setFilms, setIsLoading, setError, setTotalItems } = this.props;
    this.setState({isLoading: true});
    setIsLoading(true);
    try {
      const movieService = this.context.movie;
      const response = await movieService.getRatedFilms(currentPage);
      const films = response.results.map(film => {
        return film; 
      });
      this.setState({
        films: films //response.results
      });
      setFilms(films);
      setTotalItems(response.total_results);
    } catch(error) {
        this.setState({error});
        setError(error); 
    }
    this.setState({isLoading: false});
    setIsLoading(false);
  }

  componentDidMount() {
    this.getRatedFilms();
  }
  
  componentDidUpdate(prevProps) {
    const { currentPage } = this.props;
    if(prevProps.currentPage !== currentPage) {
      this.getRatedFilms();
    }
  }
  render() {
    if(this.state.isLoading) {
      return <Spin indicator = {<LoadingOutlined style={{ fontSize: 24 }} spin />}/>;;
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
}

RatedTab.defaultProps = {
  currentPage: 1,
  setFilms: () => {},
  setIsLoading: () => {},
  setError: () => {},
  setTotalItems: () => {},
}
