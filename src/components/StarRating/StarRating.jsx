import React from 'react';
import { Rate } from 'antd';
import PropTypes from 'prop-types';

function StarRating(props) {
  const { rating, changeRatingHandler, className } = props;
  /* eslint-disable prettier/prettier */
  return (
    <Rate
      allowHalf
      defaultValue={rating}
      rootClassName={className}
      count={10}
      onChange={changeRatingHandler}
    />
  );
  /* eslint-enable prettier/prettier */
}

StarRating.propTypes = {
  rating: PropTypes.number,
  changeRatingHandler: PropTypes.func,
  className: PropTypes.string,
};

StarRating.defaultProps = {
  rating: 0,
  changeRatingHandler: {},
  className: '',
};

export default StarRating;
