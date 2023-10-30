import React, {Component} from 'react'
import { Alert, Col, ConfigProvider, Layout, Pagination, Row, Spin, Tabs } from 'antd'

import { MovieService } from './services/MovieService.js'
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
  fetcher = new FetcherService();
  
  fetchData = () => {
    this.fetcher.fetch(() => {
      async () =>
      await this.state.movie.getGenreList().then((response) => {
        this.setGenres(response.genres)
      });
    });
  }

  setIsLoading = (isLoading) => {
    this.setState({ isLoading });
  }
  
  setCurrentPage = (currentPage) => {
    this.setState({ currentPage });
  }
  
  setTotalItems = (totalItems) => {
    this.setState({ totalItems });
  }

  setFilms = (films) => {
    this.setState({films});
  }

  setError = (error) => {
    this.setState({ error });
  }
  
  async componentDidMount() {
    await this.createSession();
    this.getGenres();
  }
  getGenres = async () => {

    this.setState({isLoading: true});

    try {
      const data = this.state.movie.fetchGenres();

      this.setState({
        genres: data, 
        isLoading: false
      });
      
    } catch (error) {
    
      this.setState({
        error,
        isLoading: false  
      });
      this.setError(`${error.code} -- ${error.message}`)
    }

  };

  changeRatingHandler = async (filmId, rating) => {
    this.setState((oldState) => ({
      ratedFilms: [...oldState.ratedFilms.filter((film) => film.id !== filmId), { id: filmId, rating }]
    }));
    try {
      await this.state.movie.addRatingToFilm(filmId, rating);
    } catch (exception) {
      this.setState({ error: exception.message });
    }
  }
  createSession = async () => {
    await this.state.movie.createGuestSession();
  }

  tabs = [
    {
      key: 1,
      label: 'Search',
      children: (
        <SearchTab
          setFilms={(films) => this.setFilms(films)}
          setIsLoading={(isLoading) => this.setIsLoading(isLoading)}
          currentPage={(page) => this.setCurrentPage(page)}
          setTotalItems={(totalResults) => this.setTotalItems(totalResults)}
          setError={(error) => this.setError(error)}
          ratedFilms={this.state.ratedFilms}
        />
      ),
    },
    {
      key: 2,
      label: 'Rated',
      children: (
        <RatedTab
          setFilms={(films) => this.setFilms(films)}
          setIsLoading={(isLoading) => this.setIsLoading(isLoading)}
          currentPage={(page) => this.setCurrentPage(page)}
          setTotalItems={(totalResults) => this.setTotalItems(totalResults)}
          setError={(error) => this.setError(error)}
        />
      ),
    },
  ]

  paginationItemRender = (page, type, originElement) => {
    this.setState({
      currentPage: page
    });
    if (page === this.state.currentPage && type === 'page') {
      return <a style={{ backgroundColor: '#4096ff', color: '#fff' }}>{page}</a>
    }
    return originElement
  }

  changeTabHandler = () => {
    const {setFilms, setIsLoading, setCurrentPage} = this;
    setFilms([])
    setIsLoading(true)
    setCurrentPage(1)
  }
  render() {
    const {movie, genres, tabs, error, isLoading, films, currentPage, totalItems } = this.state;
    const {changeTabHandler, changeRatingHandler, paginationItemRender } = this;
    const { loading } = this.fetcher.state;
    if (!this.state) {
      return null; 
    } 
    else if(loading) {
      return <Spinner />
    }
    else {
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
                <Col xs={{ span: 22, offset: 1 }} md={{ span: 14, offset: 4 }}>
                  <Tabs
                    defaultActiveKey={1}
                    items={tabs}
                    style={{ background: '#fff', justifyContent: 'center' }}
                    destroyInactiveTabPane={true}
                    onChange={changeTabHandler}
                  />

                  <>
                    {error && <Alert type={'error'} message={error.message} style={{ margin: '10px auto' }} />}
                    {isLoading ? (
                      <Row>
                        <Spin tip={'Loading...'} style={{ margin: '10px auto' }} />
                      </Row>
                    ) : (
                      <>
                        <FilmList films={films} setRatingHandler={changeRatingHandler} />
                        <Pagination
                          defaultCurrent={1}
                          current={currentPage}
                          total={totalItems}
                          defaultPageSize={20}
                          showQuickJumper={false}
                          showSizeChanger={false}
                          hideOnSinglePage={true}
                          style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
                          onChange={(page) => {
                            setIsLoading(true)
                            setCurrentPage(page)
                          }}
                          itemRender={paginationItemRender}
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
}
