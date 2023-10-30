import React, { Component } from 'react'
import { Rate } from 'antd'
import PropTypes from 'prop-types'

export default class StarRating extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {rating, changeRatingHandler, className} = this.props;
    return <Rate allowHalf defaultValue={rating} rootClassName={className} count={10} onChange={changeRatingHandler} />
  }
}

StarRating.propTypes = {
  rating: PropTypes.number,
  changeRatingHandler: PropTypes.func,
  className: PropTypes.string,
}

StarRating.defaultProps = {
  rating: 0,
  changeRatingHandler: {},
  className: '',
}
