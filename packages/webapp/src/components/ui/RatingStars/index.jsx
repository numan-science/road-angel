import React from 'react'

const RatingStars = ({ rating }) => {
  const renderStars = () => {
    const filledStars = Math.round(rating) // Get the rounded value of the rating
    const stars = []

    // Generate filled stars
    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 text-yellow-500 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 1.034L6.472 6.67H.982L5.523 10.97 3.828 15.33l5.154-2.08 5.155 2.08-1.696-4.34 4.54-4.3h-5.49L10 1.035z" />
        </svg>,
      )
    }

    // Generate empty stars
    for (let i = filledStars; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 text-gray-300 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 1.034L6.472 6.67H.982L5.523 10.97 3.828 15.33l5.154-2.08 5.155 2.08-1.696-4.34 4.54-4.3h-5.49L10 1.035z" />
        </svg>,
      )
    }

    return stars
  }

  return <div className="flex items-center">{renderStars()}</div>
}

export default RatingStars
