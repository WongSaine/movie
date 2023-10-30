import React from 'react'
import { Col, Row, Typography } from 'antd'
import PropTypes from 'prop-types'

import FilmCard from '../FilmCard'

import classes from './FilmList.module.css'

const { Text } = Typography

const FilmList = ({ films, setRatingHandler }) => {
  return (
    <>
      {films.length ? (
        <Row className={classes['film-list']} gutter={[16, 16]}>
          {films.map((film) => (
            <Col key={film.id} xs={{ span: 24, offset: 0 }} md={{ span: 12 }}>
              <FilmCard film={film} setRatingHandler={setRatingHandler} />
            </Col>
          ))}
        </Row>
      ) : (
        <Text style={{ marginTop: '20px', display: 'block' }}>No one film found</Text>
      )}
    </>
  )
}

FilmList.propTypes = {
  films: PropTypes.arrayOf(
    PropTypes.shape({
      adult: PropTypes.bool,
      backdrop_path: PropTypes.string,
      genre_ids: PropTypes.arrayOf(PropTypes.number),
      id: PropTypes.number,
      original_language: PropTypes.string,
      original_title: PropTypes.string,
      overview: PropTypes.string,
      popularity: PropTypes.number,
      poster_path: PropTypes.string,
      release_date: PropTypes.string,
      title: PropTypes.string,
      video: PropTypes.bool,
      vote_average: PropTypes.number,
      vote_count: PropTypes.number,
    })
  ),
  setRatingHandler: PropTypes.func.isRequired
}

FilmList.defaultProps = {
  films: [],
}

export default FilmList
