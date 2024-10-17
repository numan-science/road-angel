import React, { useState, useEffect } from 'react'
import { RiSave2Line } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Card, Button, FormContainer, Dialog } from '@/components/ui'
import Write from './Write'
const ImageGrid = () => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [pixelSize, setPixelSize] = useState(10)
  const [selectedPixel, setSelectedPixel] = useState({ x: 0, y: 0 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPixelIndex, setSelectedPixelIndex] = useState(null)
  const { t } = useTranslation()
  const [highlightedPixels, setHighlightedPixels] = useState([
    [65, 2],
    [19, 11],
    [51, 13],
    [76, 12],
    [115, 9],
    [4, 34],
    [17, 35],
    [32, 35],
    [58, 35],
    [91, 35],
    [112, 35],
    [133, 35],
    [22, 59],
    [50, 59],
    [75, 59],
    [114, 60],
    [65, 69],
  ])
  const renderModalContent = () => {
    switch (selectedPixelIndex) {
      case 0:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://cache2.pakwheels.com/carsure_report_pictures/images/012/314/094/original/1686992201885.jpg?1686992209"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://cache4.pakwheels.com/carsure_report_pictures/images/012/314/051/original/1686992162749.jpg?1686992169"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://cache3.pakwheels.com/carsure_report_pictures/images/012/314/125/original/1686992237095.jpg?1686992245"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://cache2.pakwheels.com/carsure_report_pictures/images/012/314/142/original/1686992263536.jpg?1686992266"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://cache4.pakwheels.com/carsure_report_pictures/images/012/314/218/original/1686992337843.jpg?1686992350"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 5:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 6:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 7:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 8:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 9:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 10:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 11:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 12:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 13:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 14:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 15:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 16:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      case 17:
        return (
          <div class="container mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div class="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 bg-gray-200 p-4">
                <img
                  src="https://c8.alamy.com/comp/TBN1RR/car-with-damage-on-the-left-side-on-the-door-and-rotten-sill-on-the-bottom-TBN1RR.jpg"
                  alt="Car with damage"
                  class="w-full h-auto"
                />
              </div>
              <div class="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 bg-gray-200 p-4">
                <Write />
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    const loadImageSize = () => {
      const image = document.getElementById('fullscreen-image')
      setImageSize({ width: image.offsetWidth, height: image.offsetHeight })
    }

    loadImageSize()
    window.addEventListener('resize', loadImageSize)

    return () => {
      window.removeEventListener('resize', loadImageSize)
    }
  }, [])
  const handlePointPixelClick = (pixelX, pixelY, index) => {
    if (isHighlightedPixel(pixelX, pixelY)) {
      setSelectedPixelIndex(index)
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setSelectedPixelIndex(null)
    setIsModalOpen(false)
  }

  // const handlePixelClick = (event) => {
  //   const rect = event.target.getBoundingClientRect()
  //   const offsetX = event.clientX - rect.left
  //   const offsetY = event.clientY - rect.top

  //   const pixelX = Math.floor(offsetX / pixelSize)
  //   const pixelY = Math.floor(offsetY / pixelSize)

  //   const selectedPixelValue = getPixelValue(pixelX, pixelY)

  //   setSelectedPixel({ x: pixelX, y: pixelY })

  //   console.log(`Selected Pixel Value: ${selectedPixelValue}`)
  // }

  const getPixelValue = (x, y) => {
    return Math.floor(Math.random() * 256)
  }

  const isHighlightedPixel = (x, y) => {
    return highlightedPixels.some(([hx, hy]) => hx === x && hy === y)
  }

  return (
    <>
      <div className="relative">
        <img
          src="https://wsa4.pakwheels.com/assets/car_certification_v2-e9ae77bea60843256dbd759106c2911e.jpg"
          alt="Full Screen Image"
          id="fullscreen-image"
          style={{ width: '100%', height: '720px' }}
          onClick={handlePointPixelClick}
        />

        {highlightedPixels.map(([x, y], index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x * pixelSize,
              top: y * pixelSize,
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              backgroundColor: 'red',
              opacity: 0.5,
              borderRadius: '50%',
            }}
            onClick={() => handlePointPixelClick(x, y, index)}
          />
        ))}
      </div>
      <Dialog
        isOpen={isModalOpen}
        onClose={closeModal}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        contentClassName="bg-[#F3F4F6] px-0 py-0"
        bodyOpenClassName="overflow-hidden"
        width={1020}
      >
        <form>
          <FormContainer className="p-8">
            <div className="max-h-[70vh] overflow-y-auto">
              <Card
                className="dark:bg-gray-700 bg-white mb-2"
                header={<h5>{t('heading.Damage Car Description & Images')}</h5>}
              >
                {renderModalContent()}
              </Card>
            </div>
          </FormContainer>
          <div className="flex items-center justify-end dark:bg-gray-700 bg-white p-4 rounded-bl-lg rounded-br-lg">
            <Button
              type="button"
              size="sm"
              className="w-50 mr-2"
              // onClick={toggleDocumentModal}
            >
              {t('button.Cancel')}
            </Button>
            <Button
              icon={<RiSave2Line />}
              type="submit"
              variant="solid"
              size="sm"
              className="w-50"
            >
              {t('button.Save')}
            </Button>
          </div>
        </form>
      </Dialog>
      {/* <div>
        Selected Pixel: ({selectedPixel.x}, {selectedPixel.y})
      </div>
      <div>Left: {selectedPixel.x * pixelSize}</div>
      <div>Right: {selectedPixel.x * pixelSize + pixelSize}</div>
      <div>Top: {selectedPixel.y * pixelSize}</div>
      <div>Bottom: {selectedPixel.y * pixelSize + pixelSize}</div>
      <div>Image Width: {imageSize.width}</div>
      <div>Image Height: {imageSize.height}</div>
      <div style={{ marginTop: '20px' }}>
        Highlighted Pixels:
        {highlightedPixels.map(([x, y], index) => (
          <span
            key={index}
            style={{
              display: 'inline-block',
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              backgroundColor: isHighlightedPixel(x, y) ? 'red' : 'transparent',
              border: '1px solid black',
              marginRight: '2px',
            }}
          />
        ))}
      </div> */}
    </>
  )
}

export default ImageGrid
