import React, {Component} from 'react'
import { Alert, Col, ConfigProvider, Layout, Pagination, Row, Spin, Tabs } from 'antd'

import MovieService from './services/MovieService.js'
import SearchTab from './components/SearchTab'
import RatedTab from './components/RatedTab'
import FilmList from './components/FilmList'
import FetcherService from './services/FetcherService.js';
import { Context } from './services/Context.js';

const { Content } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props)
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
    }
  }

  changeRatingHandler = async (filmId, rating) => {
    this.setState((oldState) => ({
      ratedFilms: [...oldState.ratedFilms.filter((film) => film.id !== filmId), { id: filmId, rating }],
    }))
    await this.state.movie.addRatingToFilm(filmId, rating).catch((exception) => this.setState({ error: exception.message }))
  }

  getGenres = async () => {
    await this.state.movie.getGenreList().then((response) => {
      this.setState({ genres: response.genres })
    })
  }

  setError = (error) => {
    this.setState({ error });
  }

  setFilms = (films) => {
    this.setState({films});
  }

  setTotalItems = (totalItems) => {
    this.setState({ totalItems });
  }

  setIsLoading = (isLoading) => {
    this.setState({ isLoading });
  }
  
  componentDidMount() {
    const createSession = async () => await this.state.movie.createGuestSession()
    createSession()
    this.state.fetcher.fetch(this.getGenres, (error) => this.setState({ error }))
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.fetcher.state.loading !== this.state.fetcher.state.loading) {
      this.setState({ isLoading: this.state.fetcher.state.loading })
    }
    if (prevState.fetcher.state.error !== this.state.fetcher.state.error) {
      this.setState({ error: this.state.fetcher.state.error })
    }
  }

  changeTabHandler = () => {
    this.setState({
      films: [],
      isLoading: true,
      currentPage: 1,
    })
  }

  render() {
    const tabs = [
      {
        key: 1,
        label: 'Search',
        children: (
          <SearchTab
            setFilms={this.setFilms}
            setIsLoading={this.setIsLoading}
            currentPage={this.state.currentPage}
            setTotalItems={this.setTotalItems}
            setError={this.setError}
            ratedFilms={this.state.ratedFilms}
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
            currentPage={this.state.currentPage}
            setTotalItems={this.setTotalItems}
            setError={this.setError}
          />
        ),
      },
    ]

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
            movie: this.state.movie,
            genres: this.state.genres,
          }}
        >
          <Layout style={{ backgroundColor: '#fff' }}>
            <Content>
              <Col xs={{ span: 22, offset: 1 }} md={{ span: 14, offset: 4 }}>
                <Tabs
                  defaultActiveKey={1}
                  items={tabs}
                  style={{ background: '#fff', justifyContent: 'center' }}
                  destroyInactiveTabPane={true}
                  onChange={this.changeTabHandler}
                />

                <>
                  {this.state.error && <Alert type={'error'} message={this.state.error} style={{ margin: '10px auto' }} />}
                  {this.state.isLoading ? (
                    <Row>
                      <Spin tip={'Loading...'} style={{ margin: '10px auto' }} />
                    </Row>
                  ) : (
                    <>
                      <FilmList 
                        films={this.state.films} 
                        setRatingHandler={(filmId, rating) => this.changeRatingHandler(filmId, rating)} 
                      />
                      <Pagination
                        defaultCurrent={1}
                        current={this.state.currentPage}
                        total={this.state.totalItems}
                        defaultPageSize={20}
                        showQuickJumper={false}
                        showSizeChanger={false}
                        hideOnSinglePage={true}
                        style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
                        onChange={(page) => this.onPageChange(page)}
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
    )
  }
}
