import { Button } from '@/components/ui'
import React, { useState } from 'react'
import {
  HiOutlineArrowCircleLeft,
  HiOutlineArrowCircleRight,
} from 'react-icons/hi'

const CustomSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    )
  }

  return (
    <div className="custom-slider">
      <div className="flex justify-center items-center my-3 bg-gray-100 p-2"><img src={images[currentIndex]} alt="Slider Image" className='w-25 h-20' /></div>
      <div className="flex justify-center items-center my-3">
        <Button
          variant="solid"
          type="button"
          size="xs"
          onClick={handleNext}
          icon = {<HiOutlineArrowCircleLeft  /> }
        >
        </Button>
        <Button
          variant="solid"
          type="button"
          size="xs"
          className="ml-2"
          onClick={handleNext}
          icon = {<HiOutlineArrowCircleRight  />}
        >
        </Button>
      </div>
    </div>
  )
}

export default CustomSlider
