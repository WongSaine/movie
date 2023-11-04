/* eslint-disable react/jsx-no-constructed-context-values */
import React, { Component } from 'react';
// eslint-disable-next-line object-curly-newline
import { Alert, Col, ConfigProvider, Layout, Pagination, Row, Spin, Tabs } from 'antd';

import MovieService from './services/MovieService';
import SearchTab from './components/SearchTab';
import RatedTab from './components/RatedTab';
import FilmList from './components/FilmList';
import FetcherService from './services/FetcherService';
import { Context } from './services/Context';

const { Content } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: new MovieService(),
      genres: [],
      films: [],
      isLoading: true,
      currentPage: 1,
      totalItems: 0,
      error: false,
      ratedFilms: [],
      fetcher: new FetcherService(),
    };
  }

  async componentDidMount() {
    const { movie, fetcher } = this.state;
    
    const createSession = async () => {
      const x = await movie.createGuestSession();
      return x;
    };
    await createSession();
    fetcher.fetch(this.getGenres, (error) => this.setState({ error }));
  }

  componentDidUpdate(prevProps, prevState) {
    const { fetcher } = this.state;
    if (prevState.fetcher.state.loading !== fetcher.state.loading) {
      this.setState({ isLoading: fetcher.state.loading });
    }
    if (prevState.fetcher.state.error !== fetcher.state.error) {
      this.setState({ error: fetcher.state.error });
    }
  }

  changeRatingHandler = async (filmId, rating) => {
    const { movie } = this.state;
    this.setState((state) => ({
      // eslint-disable-next-line prettier/prettier
      ratedFilms: [...state.ratedFilms.filter(
        (film) => film.id !== filmId,
      ), { id: filmId, rating }],
    }));
    /* eslint-disable prettier/prettier */
    await movie.addRatingToFilm(filmId, rating).catch((exception) =>
      // eslint-disable-next-line indent, implicit-arrow-linebreak
        this.setState({ error: exception.message }));
  };
  /* eslint-enable  prettier/prettier */

  getGenres = async () => {
    const { movie } = this.state;
    await movie.getGenreList().then((response) => {
      this.setState({ genres: response.genres });
    });
  };

  setError = (error) => {
    this.setState({ error });
  };

  setFilms = (films) => {
    this.setState({ films });
  };

  setTotalItems = (totalItems) => {
    this.setState({ totalItems });
  };

  setIsLoading = (isLoading) => {
    this.setState({ isLoading });
  };

  setCurrentPage = (page) => {
    this.setState({
      currentPage: page,
    });
  };

  changeTabHandler = () => {
    this.setState({
      films: [],
      isLoading: true,
      currentPage: 1,
    });
  };

  render() {
    /* eslint-disable prettier/prettier */
    const {
      currentPage,
      ratedFilms,
      movie,
      genres,
      error,
      isLoading,
      films,
      totalItems,
    } = this.state;
    /* eslint-enable  prettier/prettier */
    const tabs = [
      {
        key: 1,
        label: 'Search',
        children: (
          <SearchTab
            setFilms={this.setFilms}
            setIsLoading={this.setIsLoading}
            currentPage={currentPage}
            setTotalItems={this.setTotalItems}
            setError={this.setError}
            ratedFilms={ratedFilms}
          />
        ),
      },
      {
        key: 2,
        label: 'Rated',
        children: (
          <RatedTab
            setFilms={this.setFilms}
            setIsLoading={this.setIsLoading}
            currentPage={currentPage}
            setTotalItems={this.setTotalItems}
            setError={this.setError}
          />
        ),
      },
    ];

    return (
      <ConfigProvider
        theme={{
          token: {
            fontSize: 12,
            fontFamily: "'Inter', sans-serif",
          },
        }}
      >
        <Context.Provider
          value={{
            movie,
            genres,
          }}
        >
          <Layout style={{ backgroundColor: '#fff' }}>
            <Content>
              <Col xs={{ span: 22, offset: 1 }} md={{ span: 17, offset: 4 }}>
                <Tabs
                  defaultActiveKey={1}
                  items={tabs}
                  style={{ background: '#fff', justifyContent: 'center' }}
                  destroyInactiveTabPane
                  onChange={this.changeTabHandler}
                />

                <>
                  {error && <Alert type="error" message={error} style={{ margin: '10px auto' }} />}
                  {isLoading ? (
                    <Row>
                      <Spin tip="Loading..." style={{ margin: '10px auto' }} />
                    </Row>
                  ) : (
                    <>
                      <FilmList
                        films={films}
                        // eslint-disable-next-line max-len
                        setRatingHandler={(filmId, rating) => this.changeRatingHandler(filmId, rating)}
                      />
                      <Pagination
                        defaultCurrent={1}
                        current={currentPage}
                        total={totalItems}
                        defaultPageSize={20}
                        showQuickJumper={false}
                        showSizeChanger={false}
                        hideOnSinglePage
                        style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
                        onChange={(page) => this.setCurrentPage(page)}
                        itemRender={this.paginationItemRender}
                      />
                    </>
                  )}
                </>
              </Col>
            </Content>
          </Layout>
        </Context.Provider>
      </ConfigProvider>
    );
  }
}
