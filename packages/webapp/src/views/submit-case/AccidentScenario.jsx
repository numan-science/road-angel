import React, { useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import { Stage, Layer, Image, Line } from 'react-konva'
import useImage from 'use-image'
import { Container } from '@/components/shared'
import { Card, Button, Notification, toast } from '@/components/ui'
import { saveAccidentScenario } from '@/services/submit-case'
import _ from 'lodash'

const URLImage = ({ image, rotationAngle, setSelectedImage }) => {
  const [img] = useImage(image.src)
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      draggable
      offsetX={img ? img.width / 2 : 0}
      offsetY={img ? img.height / 2 : 0}
      rotation={rotationAngle}
      onClick={() => setSelectedImage(image.id)}
    />
  )
}

const GridLayer = () => {
  const gridSize = 20;

  const createGrid = () => {
    const grid = [];
    for (let x = 0; x < window.innerWidth; x += gridSize) {
      grid.push(
        <Line
          key={`x_${x}`}
          points={[x, 0, x, window.innerHeight]}
          stroke="lightgray"
          strokeWidth={2}
        />
      );
    }
    for (let y = 0; y < window.innerHeight; y += gridSize) {
      grid.push(
        <Line
          key={`y_${y}`}
          points={[0, y, window.innerWidth, y]}
          stroke="lightgray"
          strokeWidth={2}
        />
      );
    }
    return grid;
  };

  return (
    <Layer>
      {createGrid()}
    </Layer>
  );
};

const AccidentScenario = ({ accidentCaseId, setAccidentCaseScenario, setAccidentScenario }) => {
  const { t } = useTranslation()
  const dragUrl = useRef()
  const stageRef = useRef()
  const [images, setImages] = useState([])
  const objectImages = [
    '/img/icons/bike.png',
    '/img/icons/car.png',
    '/img/icons/truck.png',
  ]
  const [history, setHistory] = useState([
    { images: [], lines: [] }, // Initial dummy state
    // other states...
  ])
  // const [rotationAngle, setRotationAngle] = useState(0) // State for rotation angle

  // Function to handle rotation
  const [selectedImage, setSelectedImage] = useState(null)
  const [historyPosition, setHistoryPosition] = useState(0)
  const [tool, setTool] = useState('Edit Tools')
  const [loading, setLoading] = useState(false)
  const [lines, setLines] = useState([])
  const isDrawing = useRef(false)
  const [isTouchDevice, setIsTouchDevice] = useState(isMobile)

  useEffect(() => {
    // Detect if the user is using a touch device
    const handleTouchDetect = () => {
      setIsTouchDevice(true)
    }

    window.addEventListener('touchstart', handleTouchDetect)

    return () => {
      window.removeEventListener('touchstart', handleTouchDetect)
    }
  }, [])
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'z' && event.ctrlKey) {
        event.preventDefault()
        undo()
      } else if (event.key === 'y' && event.ctrlKey) {
        event.preventDefault()
        redo()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  
  const handleRotate = (angle) => {
    const newImages = _.map(images, (img) => ({
      ...img,
      angle: selectedImage === img.id ? img.angle + angle : img.angle,
    }))
    setImages(newImages)
    // Check if the 'id' matches the 'selectedImage'
    // Rotate only the selected image
    // setRotationAngle(rotationAngle + degrees)
  }

  const updateHistory = (updatedImages, updatedLines) => {
    const newHistory = history.slice(0, historyPosition + 1)
    newHistory.push({ images: updatedImages, lines: updatedLines })
    setHistory(newHistory)
    setHistoryPosition(newHistory.length - 1)
  }

  const undo = () => {
    if (historyPosition > 0) {
      const prevPosition = historyPosition - 1
      const { images, lines } = history[prevPosition]
      setImages(images ? [...images] : [])
      setLines(lines ? [...lines] : [])
      setHistoryPosition(prevPosition)
    }
  }

  const redo = () => {
    if (historyPosition < history.length - 1) {
      const nextPosition = historyPosition + 1
      const { images, lines } = history[nextPosition]
      setImages(images ? [...images] : [])
      setLines(lines ? [...lines] : [])
      setHistoryPosition(nextPosition)
    }
  }

  const handleClearAll = () => {
    setImages([])
    setLines([])
    setHistory([])
    setHistoryPosition(0)
  }

  const handleMouseDown = (e) => {
    // Handle both touch and mouse events
    const isTouch = e.evt.type.startsWith('touch')
    if (isTouch) {
      // Ignore the event if it's a touch event and not a mouse event
      return
    }

    isDrawing.current = true

    // Check if the tool is pencil
    if (tool === 'pen') {
      const pos = e.target.getStage().getPointerPosition()
      const newLine = {
        id: lines.length,
        tool,
        points: [pos.x, pos.y],
      }

      // Update the lines state and history with the new pencil line
      const updatedLines = [...lines, newLine]
      setLines(updatedLines)
      updateHistory(images, updatedLines)
    }
  }

  const handleMouseMove = (e) => {
    // Handle both touch and mouse events
    const isTouch = e.evt.type.startsWith('touch')
    if (!isDrawing.current || (isTouch && e.target.nodeType === 'Stage')) {
      // Ignore the event if it's not a touch event and not a Stage target
      // This check prevents drawing while dragging an image
      return
    }

    const stage = stageRef.current
    const point = isTouch
      ? stage.getPointerPosition() // For touch events, use the stage's pointer position
      : stage.getPointerPosition(e.evt) // For mouse events, use the event's pointer position

    if (tool === 'eraser') {
      // Eraser tool
      const updatedLines = lines.map((line) => {
        // Interpolate points and gradually remove them based on distance
        const updatedPoints = []

        for (let i = 0; i < line.points.length - 1; i += 2) {
          const x1 = line.points[i]
          const y1 = line.points[i + 1]
          const x2 = line.points[i + 2]
          const y2 = line.points[i + 3]

          const segmentLength = Math.sqrt(
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2),
          )
          const segmentsCount = Math.ceil(segmentLength / 1) // Divide segment into smaller segments of length 1 pixel

          for (let j = 0; j <= segmentsCount; j++) {
            const t = j / segmentsCount
            const x = x1 + (x2 - x1) * t
            const y = y1 + (y2 - y1) * t
            const distance = Math.sqrt(
              Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2),
            )

            if (distance > 10) {
              // Add point if it's not too close to the mouse pointer
              updatedPoints.push(x, y)
            }
          }
        }

        // Update line points
        line.points = updatedPoints

        return line
      })

      setLines(updatedLines)
    } else {
      // Pen tool drawing
      let lastLine = lines[lines.length - 1]

      // Add point
      lastLine.points = lastLine.points.concat([point.x, point.y])

      // Replace last line
      lines.splice(lines.length - 1, 1, lastLine)
      setLines([...lines])
    }
  }

  const handleMouseUp = (e) => {
    // Ignore the event if it's a touch event
    if (e.evt.type === 'touchend') {
      return
    }

    isDrawing.current = false
  }
  const handleTouchStart = (e) => {
    // Prevent default touch behavior (e.g., scrolling and zooming)
    e.evt.preventDefault()

    // Check if the tool is pencil
    if (tool === 'pen') {
      const pos = stageRef.current.getPointerPosition() // Use stageRef.current.getPointerPosition() for touch events
      const newLine = {
        id: lines.length,
        tool,
        points: [pos.x, pos.y],
      }

      // Update the lines state and history with the new pencil line
      const updatedLines = [...lines, newLine]
      setLines(updatedLines)
      updateHistory(images, updatedLines)
    }
  }

  const handleTouchMove = (e) => {
    // Prevent default touch behavior (e.g., scrolling and zooming)
    e.evt.preventDefault()

    const stage = stageRef.current
    const point = stage.getPointerPosition() // Use stage.getPointerPosition() for touch events

    if (tool === 'eraser') {
      // Eraser tool
      const updatedLines = lines.map((line) => {
        // Interpolate points and gradually remove them based on distance
        const updatedPoints = []

        for (let i = 0; i < line.points.length - 1; i += 2) {
          const x1 = line.points[i]
          const y1 = line.points[i + 1]
          const x2 = line.points[i + 2]
          const y2 = line.points[i + 3]

          const segmentLength = Math.sqrt(
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2),
          )
          const segmentsCount = Math.ceil(segmentLength / 1) // Divide segment into smaller segments of length 1 pixel

          for (let j = 0; j <= segmentsCount; j++) {
            const t = j / segmentsCount
            const x = x1 + (x2 - x1) * t
            const y = y1 + (y2 - y1) * t
            const distance = Math.sqrt(
              Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2),
            )

            if (distance > 10) {
              // Add point if it's not too close to the touch point
              updatedPoints.push(x, y)
            }
          }
        }

        // Update line points
        line.points = updatedPoints

        return line
      })

      setLines(updatedLines)
    } else {
      // Pen tool drawing
      let lastLine = lines[lines.length - 1]

      // Add point
      lastLine.points = lastLine.points.concat([point.x, point.y])

      // Replace last line
      lines.splice(lines.length - 1, 1, lastLine)
      setLines([...lines])
    }
  }

  const handleTouchEnd = (e) => {
    // Prevent default touch behavior (e.g., scrolling and zooming)
    e.evt.preventDefault()

    isDrawing.current = false
  }
  const generateUniqueId = () => {
    const timestamp = new Date().getTime() // Get current timestamp in milliseconds
    const randomNum = Math.random().toString(36).slice(2, 12) // Get a random string of 10 characters

    return `${timestamp}-${randomNum}`
  }
  const handleDrop = (e) => {
    e.preventDefault()
    const imageUrl = e.dataTransfer.getData('text/plain')
    const newImageId = generateUniqueId()
    stageRef.current.setPointersPositions(e)
    const newImages = images.concat([
      {
        ...stageRef.current.getPointerPosition(),
        src: imageUrl,
        id: newImageId,
        angle: 0,
      },
    ])
    setImages(newImages)
    updateHistory(newImages, lines)
  }
  const imageIds = images?.map((image) => image.id)
  const handleExport = () => {
    const stage = stageRef.current;
  
    // Get all the images' positions and dimensions
    const imageBoundingBoxes = images.map((image) => {
      const img = new window.Image();
      img.src = image.src;
      return {
        x: image.x - img.width / 2,
        y: image.y - img.height / 2,
        width: img.width,
        height: img.height,
      };
    });
  
    // Calculate the bounding box of all images and lines
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
  
    // Adjust bounding box calculation for images
    imageBoundingBoxes.forEach((bbox) => {
      minX = Math.min(minX, bbox.x);
      minY = Math.min(minY, bbox.y);
      maxX = Math.max(maxX, bbox.x + bbox.width);
      maxY = Math.max(maxY, bbox.y + bbox.height);
    });
  
    // Adjust bounding box calculation for lines
    lines.forEach((line) => {
      if (line.tool !== 'eraser') {
        line.points.forEach((point, index) => {
          if (index % 2 === 0) {
            minX = Math.min(minX, point);
            maxX = Math.max(maxX, point);
          } else {
            minY = Math.min(minY, point);
            maxY = Math.max(maxY, point);
          }
        });
      }
    });
  
    // Calculate the width and height of the bounding box
    const bboxWidth = maxX - minX;
    const bboxHeight = maxY - minY;
  
    // Create an off-screen temporary canvas to draw the visible area
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = bboxWidth;
    tempCanvas.height = bboxHeight;
    const tempContext = tempCanvas.getContext('2d');
  
    // Draw the visible area on the temporary canvas
    tempContext.fillStyle = 'gray';
    tempContext.fillRect(0, 0, bboxWidth, bboxHeight);
  
    images.forEach((image) => {
      const img = new window.Image();
      img.src = image.src;
      tempContext.drawImage(
        img,
        image.x - minX - img.width / 2,
        image.y - minY - img.height / 2
      );
    });
  
    lines.forEach((line) => {
      if (line.tool !== 'eraser') {
        tempContext.beginPath();
        tempContext.moveTo(line.points[0] - minX, line.points[1] - minY);
        for (let i = 2; i < line.points.length; i += 2) {
          tempContext.lineTo(line.points[i] - minX, line.points[i + 1] - minY);
        }
        tempContext.strokeStyle = '#df4b26';
        tempContext.lineWidth = 5;
        tempContext.lineCap = 'round';
        tempContext.lineJoin = 'round';
        tempContext.stroke();
      }
    });
  
    // Draw the temporary canvas to an image
    const dataURL = tempCanvas.toDataURL();
  
    // Create a download link for the image
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSave = () => {
    return new Promise((resolve, reject) => {
      const stage = stageRef.current;
  
    // Get all the images' positions and dimensions
    const imageBoundingBoxes = images.map((image) => {
      const img = new window.Image();
      img.src = image.src;
      return {
        x: image.x - img.width / 2,
        y: image.y - img.height / 2,
        width: img.width,
        height: img.height,
      };
    });
    // Calculate the bounding box of all images and lines
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
  
    // Adjust bounding box calculation for images
    imageBoundingBoxes.forEach((bbox) => {
      minX = Math.min(minX, bbox.x);
      minY = Math.min(minY, bbox.y);
      maxX = Math.max(maxX, bbox.x + bbox.width);
      maxY = Math.max(maxY, bbox.y + bbox.height);
    });
  
    // Adjust bounding box calculation for lines
    lines.forEach((line) => {
      if (line.tool !== 'eraser') {
        line.points.forEach((point, index) => {
          if (index % 2 === 0) {
            minX = Math.min(minX, point);
            maxX = Math.max(maxX, point);
          } else {
            minY = Math.min(minY, point);
            maxY = Math.max(maxY, point);
          }
        });
      }
    });
  
    // Calculate the width and height of the bounding box
    const bboxWidth = maxX - minX;
    const bboxHeight = maxY - minY;
  
    // Create an off-screen temporary canvas to draw the visible area
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = bboxWidth;
    tempCanvas.height = bboxHeight;
    const tempContext = tempCanvas.getContext('2d');
  
    // Draw the visible area on the temporary canvas
    tempContext.fillStyle = '#fafafa';
    tempContext.fillRect(0, 0, bboxWidth, bboxHeight);
  
    images.forEach((image) => {
      const img = new window.Image();
      img.src = image.src;
      tempContext.drawImage(
        img,
        image.x - minX - img.width / 2,
        image.y - minY - img.height / 2
      );
    });
  
    lines.forEach((line) => {
      if (line.tool !== 'eraser') {
        tempContext.beginPath();
        tempContext.moveTo(line.points[0] - minX, line.points[1] - minY);
        for (let i = 2; i < line.points.length; i += 2) {
          tempContext.lineTo(line.points[i] - minX, line.points[i + 1] - minY);
        }
        tempContext.strokeStyle = '#df4b26';
        tempContext.lineWidth = 5;
        tempContext.lineCap = 'round';
        tempContext.lineJoin = 'round';
        tempContext.stroke();
      }
    });
    const savedWidth = 420;
    const savedHeight = 210;

    // Calculate scaling factors for resizing content to fit the desired dimensions
    const scaleX = savedWidth / bboxWidth;
    const scaleY = savedHeight / bboxHeight;
    const savedCanvas = document.createElement('canvas');
    savedCanvas.width = savedWidth;
    savedCanvas.height = savedHeight;
    const savedContext = savedCanvas.getContext('2d');

    // Draw the visible area on the new canvas with the resized content
    savedContext.drawImage(
      tempCanvas,
      0, 0, bboxWidth, bboxHeight,
      0, 0, savedWidth, savedHeight
    );
    const savedDataURL = savedCanvas.toDataURL();
      resolve(savedDataURL);
    });
  };
  
      const handleSaveCanvas = async () => {
        try {
          const dataURL = await handleSave()
          const payload = {
            accidentCaseId: accidentCaseId,
            filePath: dataURL,
          }
          const response = await saveAccidentScenario(payload)
          setAccidentCaseScenario(response);
          // setAccidentScenario(response)
          setLoading(false)
          toast.push(
            <Notification className="mb-4" type="success">
              Successfully Save
            </Notification>,
          )
        } catch (error) {
          setLoading(false)
          toast.push(
            <Notification className="mb-4" type="success">
              Successfully Save
            </Notification>,
          )
        }
      }
  const handleDragStart = (e, imageUrl) => {
    e.dataTransfer.setData('text/plain', imageUrl)
  }
  return (
    <Container>
      <div className="bg-white dark:bg-gray-800">
        <Card>
          <h2 className="text-xl font-bold mb-4">
            {t('heading.Create Accident Scenario')}
          </h2>
          <Card className="mb-4">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center">
              <div className="flex flex-wrap">
                <Button
                  type="button"
                  size="sm"
                  className="w-full lg:w-auto mb-2 lg:mb-0 mr-0 lg:mr-2"
                  onClick={() => handleRotate(-45)}
                >
                  {t('button.Rotate Left')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="w-full lg:w-auto mb-2 lg:mb-0 mr-0 lg:mr-2"
                  onClick={() => handleRotate(45)}
                >
                  {t('button.Rotate Right')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="w-full lg:w-auto mb-2 lg:mb-0 mr-0 lg:mr-2"
                  onClick={() => {
                    setTool('pen')
                  }}
                >
                  {t('button.Pencil')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="w-full lg:w-auto mb-2 lg:mb-0 mr-0 lg:mr-2"
                  onClick={() => {
                    setTool('eraser')
                  }}
                >
                  {t('button.Eraser')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="w-full lg:w-auto mb-2 lg:mb-0 mr-0 lg:mr-2"
                  onClick={undo}
                >
                  {t('button.Undo')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="w-full lg:w-auto mb-2 lg:mb-0 mr-0 lg:mr-2"
                  onClick={redo}
                >
                  {t('button.Redo')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="w-full lg:w-auto mb-2 lg:mb-0 mr-0 lg:mr-2"
                  onClick={handleExport}
                >
                  {t('button.Export All')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="solid"
                  className="w-full lg:w-auto mb-2 lg:mb-0 mr-0 lg:mr-2"
                  onClick={handleSaveCanvas}
                >
                  {t('button.Save')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="w-full lg:w-auto mb-2 lg:mb-0 mr-0 lg:mr-2"
                  onClick={handleClearAll}
                  variant="solid"
                >
                  {t('button.Clear All')}
                </Button>
              </div>
            </div>
          </Card>
          <div className="flex gap-4 overflow-x-auto">
            {objectImages.map((imageUrl, index) => (
              <img
                key={index}
                alt="image"
                src={imageUrl}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, imageUrl)}
                className="flex"
                style={{
                  marginBottom: '10px',
                  height: '60px',
                }}
              />
            ))}
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="overflow-x-auto"
          >
            
            <Stage
            // className='w-[680px] bg-gray-200'
              touchEnabled={isTouchDevice} 
              onClick={(e) => (e.cancelBubble = true)}
              onTap={(e) => (e.cancelBubble = true)}
              width={680}
              height={340}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              ref={stageRef}
            >
              <GridLayer/>
              <Layer>
                {images.map((image) => (
                  <URLImage
                    key={image.id}
                    image={image}
                    rotationAngle={image?.angle}
                    setSelectedImage={setSelectedImage}
                  />
                ))}
                {lines.map((line) => (
                  <Line
                    key={line.id}
                    points={line.points}
                    stroke="#df4b26"
                    strokeWidth={5}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </Card>
      </div>
    </Container>
  )
}

export default AccidentScenario
