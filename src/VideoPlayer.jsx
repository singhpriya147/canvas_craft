// import React, { useState, useEffect, useRef } from 'react';
// import Konva from 'konva';
// import { Stage, Layer, Image, Text } from 'react-konva';

// const VideoPlayer = () => {
//   const [video, setVideo] = useState(null);
//   const [play, setPlay] = useState(false);

//   useEffect(() => {
//     const width = window.innerWidth;
//     const height = window.innerHeight;

//     const videoElement = document.createElement('video');
//     videoElement.src =
//       'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/Physicsworks.ogv/Physicsworks.ogv.240p.vp9.webm';

//     videoElement.addEventListener('loadedmetadata', () => {
//       setPlay(true); // Automatically start playing when meta is loaded
//     });

//     setVideo(videoElement);

//     return () => {
//       videoElement.pause();
//       videoElement.removeAttribute('src');
//       videoElement.load();
//     };
//   }, []);

//   useEffect(() => {
//     if (video) {
//       if (play) {
//         video.play();
//       } else {
//         video.pause();
//       }
//     }
//   }, [play, video]);

//   return (
//     <>
//       <button onClick={() => setPlay(true)}>Play</button>
//       <button onClick={() => setPlay(false)}>Pause</button>
//       <Stage width={window.innerWidth} height={window.innerHeight}>
//         <Layer>
//           <Text text='Loading video...' align='center' verticalAlign='middle' />
//           {video && (
//             <Image
//               image={video}
//               width={video.videoWidth}
//               height={video.videoHeight}
//               x={50}
//               y={20}
//               draggable
//             />
//           )}
//         </Layer>
//       </Stage>
//     </>
//   );
// };

// export default VideoPlayer;


import ReactDOM from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import Konva from 'konva'
const VideoPlayer = () => {
//    const imageRef = React.useRef(null);
//    const [size, setSize] = React.useState({ width: 50, height: 50 });
// const src =
//   'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/Physicsworks.ogv/Physicsworks.ogv.240p.vp9.webm';
//   const videoElement = React.useMemo(() => {
//     const element = document.createElement('video');
//     element.src = src;
//     return element;
//   }, [src]);

// React.useEffect(() => {
//   const onload = function () {
//     setSize({
//       width: videoElement.videoWidth,
//       height: videoElement.videoHeight,
//     });
//   };
//   videoElement.addEventListener('loadedmetadata', onload);
//   return () => {
//     videoElement.removeEventListener('loadedmetadata', onload);
//   };
// }, [videoElement]);


//  React.useEffect(() => {
//    videoElement.play();
//    const layer = imageRef.current.getLayer();

//    const anim = new Konva.Animation(() => {}, layer);
//    anim.start();

//    return () => anim.stop();
//  }, [videoElement]);

  const imageRef = useRef(null);
  const [size, setSize] = useState({ width: 50, height: 50 });
  const [isPlaying, setIsPlaying] = useState(true); // Track video playback status

  const src =
    'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/Physicsworks.ogv/Physicsworks.ogv.240p.vp9.webm';

  const videoElement = React.useMemo(() => {
    const element = document.createElement('video');
    element.src = src;
    return element;
  }, [src]);

  useEffect(() => {
    const onload = function () {
      setSize({
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      });
    };
    videoElement.addEventListener('loadedmetadata', onload);
    return () => {
      videoElement.removeEventListener('loadedmetadata', onload);
    };
  }, [videoElement]);

  useEffect(() => {
    if (isPlaying) {
      videoElement.play();
      const layer = imageRef.current.getLayer();
      const anim = new Konva.Animation(() => {}, layer);
      anim.start();
      return () => anim.stop();
    } else {
      videoElement.pause();
    }
  }, [isPlaying, videoElement]);

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };


  return (
    <div>
      <div>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handlePlay}>Play</button>
      </div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Image
            ref={imageRef}
            image={videoElement}
            x={20}
            y={20}
            stroke='red'
            width={size.width}
            height={size.height}
            draggable
          />
        </Layer>
      </Stage>

      {/* <video ref={videoRef} hidden /> */}
    </div>
  );
};

export default VideoPlayer;