import React, { Component } from 'react'
import { Card, Typography } from 'antd'
import PropTypes from 'prop-types'
import { format } from 'date-fns'

import StarRating from '../StarRating'
import { Context } from '../../services/Context.js'
import classes from './FilmCard.module.css'

const { Title, Text, Paragraph } = Typography

export default class FilmCard extends Component {
  static contextType = Context;

  ellipsisText(text, words) {
    const arr = text.split(' ');
    if (arr.length <= words) {
      return text;
    }
    return arr.splice(0, words).join(' ') + ' ...';
  }

  parseAndFormatDate(dateString) {
    const date = Date.parse(dateString);
    if (isNaN(date)) {
      return 'Unknown release date';
    }
    return format(date, 'PPP');
  }

  changeRatingHandler = async (rating) => {
    this.props.setRatingHandler(this.props.film.id, rating);
  }

  getGenreName(genreId) {
    const genre = this.context.genres.find((genreItem) => genreItem.id === genreId);
    return genre ? genre.name : 'Unknown genre';
  }

  ratingColor() {
    if (this.props.film.vote_average <= 3) return '#E90000';
    else if (this.props.film.vote_average <= 5) return '#E97E00';
    else if (this.props.film.vote_average <= 7) return '#E9D100';
    else return '#66E900';
  }

  render() {
    const { film } = this.props;
    return (
      <Card
        cover={
          <img
            alt={film.title}
            src={
              film.poster_path ? `https://image.tmdb.org/t/p/w500/${film.poster_path}` : 'https://via.placeholder.com/200'
            }
            className={classes.filmCard__image}
          />
        }
        className={classes.filmCard}
      >
        <div className={classes.filmCard__content}>
          <div className={classes.filmCard__headerWrapper}>
            <Title level={3} className={classes.filmCard__header}>
              {this.ellipsisText(film.title, 3)}
              <span className={classes.filmCard__rating} style={{ borderColor: this.ratingColor() }}>
                {film.vote_average.toFixed(1)}
              </span>
            </Title>
            {film.release_date && <Text type={'secondary'}>{this.parseAndFormatDate(film.release_date)}</Text>}
            {!!film.genre_ids.length && (
              <div className={classes.filmCard__genres}>
                {film.genre_ids.map((genreId) => {
                  return (
                    <Text code key={genreId} className={classes.filmCard__genre}>
                      {this.getGenreName(genreId)}
                    </Text>
                  )
                })}
              </div>
            )}
          </div>
          <div className={classes.filmCard__contentWrapper}>
            <Paragraph>{this.ellipsisText(film.overview, 34)}</Paragraph>
            <StarRating
              className={classes.filmCard__stars}
              rating={film.rating ?? 0}
              changeRatingHandler={this.changeRatingHandler}
            />
          </div>
        </div>
      </Card>
    )
  }
}

FilmCard.propTypes = {
  film: PropTypes.shape({
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
    rating: PropTypes.oneOfType([PropTypes.number]),
  }).isRequired,
}

FilmCard.defaultProps = {
  film: {},
}
