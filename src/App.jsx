import React, { useRef, useState, useCallback } from 'react';
import { RiRectangleLine } from 'react-icons/ri';
import { MdFileDownload } from 'react-icons/md';
import { FaArrowPointer } from 'react-icons/fa6';
import { FaArrowRight } from 'react-icons/fa';
import { FaRegCircle } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi2';
import { FaUpload } from 'react-icons/fa';
import { CiText } from 'react-icons/ci';

import { MdBorderColor } from 'react-icons/md';
import {
  Stage,
  Arrow,
  Circle,
  Layer,
  Rect,
  Line,
  Transformer,
  Image as KonvaImage,
  Text,


} from 'react-konva';


import { v4 as uuidv4 } from 'uuid';

import { ACTIONS } from './Actions';


const App = () => {
  const [action, setAction] = useState(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [scribbles, setScribbles] = useState([]);

  const [image, setImage] = useState();
  const textNodeRef = useRef(null);
  const textRef = useRef(null);

 const [isTextVisible, setTextVisible] = useState(false);
  const stageRef = useRef();
  const isPainting = useRef();
  const currentShapeId = useRef();

  const isDraggable = action === ACTIONS.SELECT;
  const transformerRef = useRef();
 
  const onImportImageSelect = useCallback((e) => {
    if (e.target.files?.[0]) {
      const imageUrl = URL.createObjectURL(e.target.files?.[0]);
      const image = new Image();
      image.src = imageUrl;
      setImage(image);
    }
    e.target.files = null;
  }, []);

  const fileRef = useRef(null);
  const onImportImageClick = useCallback(() => {
    fileRef?.current && fileRef?.current?.click();
  }, []);

  const SIZE = 500;


    const handleIconClick = () => {
      setTextVisible(true);
    };


const colorInputRef = useRef(null);

const handleColorChange = () => {
  colorInputRef.current.click(); 
};

const handleColorInputChange = (event) => {
  setStrokeColor(event.target.value);

};


  const handleDoubleClick = () => {
    const textNode1 = textNodeRef.current;
    console.log(textNode1.batchDraw, textNode1.text, 'Line74');
    textNode1.hide();
   
    const textNode = textRef.current;

    const textPosition = textNode.absolutePosition();
    const areaPosition = {
      x: textPosition.x,
      y: textPosition.y,
    };

    const textarea = document.createElement('textarea');
        // const parentDiv = document.getElementById('parentDiv');
    document.body.appendChild(textarea);
    console.log(textarea , document)
    textarea.value = textRef.current.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textarea.style.height =
      textNode.height() - textNode.padding() * 2 + 5 + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'both';
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    const rotation = textNode.rotation();
    let transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';
    }
    textarea.style.transform = transform;

    textNode1.batchDraw();
  };

  const onClick = (e) => {
    if (action !== ACTIONS.SELECT) return;
    const target = e.currentTarget;
    // console.log(target);

    transformerRef.current.nodes([target]);
  };

  // const onDoubleClick=(e)=>{
  // const target=e.currentTarget;
  // // console.log(transformerRef.current.node([target]));
  // // transformerRef.current.nodes([target]).hide();
  // console.log(target);

  // }

  const onPointerDown = () => {
    if (action === ACTIONS.SELECT) return;
    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const id = uuidv4();
    currentShapeId.current = id;
    isPainting.current = true;

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) => [
          ...rectangles,
          {
            id,
            x,
            y,
            height: 20,
            width: 20,
            fillColor,
            strokeColor,
          },
        ]);
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) => [
          ...circles,
          {
            id,
            x,
            y,
            radius: 20,
            fillColor,
            strokeColor,
          },
        ]);
        break;
      case ACTIONS.ARROW:
        setArrows((arrows) => [
          ...arrows,
          {
            id,
            points: [x, y, x + 20, y + 20],
            fillColor,
            strokeColor,
          },
        ]);
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) => [
          ...scribbles,
          {
            id,
            points: [x, y],
            fillColor,
            strokeColor,
          },
        ]);
        break;
      // case ACTIONS.TEXT:
      //   setTexts((texts)=>{
      //     ...texts,

      //     {
      //        const texts = new Konva.Text({
      //     text: 'Some text here',
      //     x: 50,
      //     y: 80,
      //     fontSize: 50,
      //     draggable: true,
      //     width: 200,
      //     fill: 'red',
      //   });
      //     }
      //   })
      default:
        console.log("nothing valid is selected");

    }
  };

  const onPointerMove = () => {
    if (action === ACTIONS.SELECT || !isPainting.current) return;
    const stage = stageRef.current;
    // const { x, y } = stage.getPointerPosition();
    const pointerPos = stage.getPointerPosition();
    // const x = pointerPos.x - 190;
    // const  y = pointerPos.y - 40;
    const x = pointerPos.x;
    const y = pointerPos.y;

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) =>
          rectangles.map((rectangle) => {
            if (rectangle.id === currentShapeId.current) {
              return {
                ...rectangle,
                width: x - rectangle.x,
                height: y - rectangle.y,
              };
            }
            return rectangle;
          })
        );
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) =>
          circles.map((circle) => {
            if (circle.id === currentShapeId.current) {
              return {
                ...circle,
                radius: Math.sqrt((y - circle.y) ** 2 + (x - circle.x) ** 2),
              };
            }
            return circle;
          })
        );
        break;
      case ACTIONS.ARROW:
        setArrows((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === currentShapeId.current) {
              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
              };
            }
            return arrow;
          })
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) =>
          scribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              return {
                ...scribble,
                points: [...scribble.points, x, y],
              };
            }
            return scribble;
          })
        );
        break;
      default:
        console.log('nothing valid is selected');
    }
  };
  const onPointerUp = () => {
    isPainting.current = false;
  };

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    var link = document.createElement('a');
    link.download = 'image.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <>
      <div className=' relative w-full h-screen overflow-hidde'>
       
        <div className='flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg'>
          <button
            className={
              action === ACTIONS.SELECT
                ? 'bg-violet-300 p-1 rounded'
                : 'p-1 hover:bg-violet-100 rounded'
            }
            onClick={() => {
              setAction(ACTIONS.SELECT);
            }}
          >
            <FaArrowPointer />
          </button>
          <button
            className={
              action === ACTIONS.RECTANGLE
                ? 'bg-violet-300 p-1 rounded'
                : 'p-1 hover:bg-violet-100 rounded'
            }
            onClick={() => {
              setAction(ACTIONS.RECTANGLE);
            }}
          >
            <RiRectangleLine />
          </button>
          <button
            className={
              action === ACTIONS.CIRCLE
                ? 'bg-violet-300 p-1 rounded'
                : 'p-1 hover:bg-violet-100 rounded'
            }
            onClick={() => {
              setAction(ACTIONS.CIRCLE);
            }}
          >
            <FaRegCircle />
          </button>

          <button
            className={
              action === ACTIONS.TEXT
                ? 'bg-violet-300 p-1 rounded'
                : 'p-1 hover:bg-violet-100 rounded'
            }
            onClick={handleIconClick}
          >
            <CiText />
          </button>

          <button
            className={
              action === ACTIONS.SCRIBBLE
                ? 'bg-violet-300 p-1 rounded'
                : 'p-1 hover:bg-violet-100 rounded'
            }
            onClick={() => {
              setAction(ACTIONS.SCRIBBLE);
            }}
          >
            <HiPencil />
          </button>
          <button onClick={handleExport}>
            <MdFileDownload />
          </button>
          <button
            className={
              action === ACTIONS.RECTANGLE
                ? 'bg-violet-300 p-1 rounded'
                : 'p-1 hover:bg-violet-100 rounded'
            }
            onClick={() => {
              setAction(ACTIONS.ARROW);
            }}
          >
            <FaArrowRight />
          </button>
          <button>
            <input
              type='color'
              className='w-6 h-6'
              value={fillColor}
              onChange={(e) => {
                setFillColor(e.target.value);
              }}
            />
          </button>

        
          <label>
            <MdBorderColor onClick={handleColorChange} />
            <input
              type='color'
              style={{ display: 'none' }}
              value={strokeColor}
              ref={colorInputRef}
              onChange={handleColorInputChange}
        
            />
          </label>
          <label>
            <FaUpload onClick={onImportImageClick} />
            <input
              type='file'
              ref={fileRef}
              onChange={onImportImageSelect}
              style={{ display: 'none' }}
              accept='image/*'
            />
          </label>
        </div>
   
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              height={window.innerHeight}
              width={window.innerWidth}
              fill='#ffffff'
              id='bg'
            />
            {rectangles.map((rectangle) => (
              <Rect
                key={rectangle.id}
                x={rectangle.x}
                y={rectangle.y}
                stroke={strokeColor}
                strokeWidth={2}
                fill={rectangle.fillColor}
                height={rectangle.height}
                width={rectangle.width}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}
            {circles.map((circle) => (
              <Circle
                key={circle.id}
                x={circle.x}
                y={circle.y}
                stroke={strokeColor}
                strokeWidth={2}
                fill={circle.fillColor}
                radius={circle.radius}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}
            {arrows.map((arrow) => (
              <Arrow
                key={arrow.id}
                points={arrow.points}
                stroke={strokeColor}
                strokeWidth={2}
                fill={arrow.fillColor}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}
            {scribbles.map((scribble) => (
              <Line
                key={scribble.id}
                points={scribble.points}
                stroke={strokeColor}
                strokeWidth={2}
                fill={scribble.fillColor}
                lineCap='round'
                lineJoin='round'
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}
           

          

            {image && (
              <KonvaImage
                image={image}
                x={0}
                y={0}
                height={SIZE / 2}
                width={SIZE / 2}
                draggable={isDraggable}
                onClick={onClick}
              />
            )}

            <Transformer ref={transformerRef} />
          </Layer>
          <Layer ref={textNodeRef}>
            {isTextVisible && (
              <Text
                text='Some text on canvas'
                fontSize={15}
                draggable={isDraggable}
                onDblClick={handleDoubleClick}
                ref={textRef}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default App;



