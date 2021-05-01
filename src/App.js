import './App.css';
import {useEffect, useState, useRef} from 'react';
function App() {

  const [color, setColor] = useState("#fff");
  const videoRef = useRef();
  const canvasRef = useRef(null);
  const { innerWidth: width, innerHeight: height } = window;
  const [front, setFront] = useState(false);
  const [desktopMode, setDesktopMode] = useState(false);

  useEffect(() => {
    let isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
    setDesktopMode(!isMobile);
    return () => {
      
    }
  }, [desktopMode])

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
          facingMode: front ? "user" : "environment"
        }
      })
      .then(function (stream) {
        videoRef.current.srcObject = stream;
      })
      .catch(function (err) {
        alert(err);
      });
    return () => {};
  }, [front]);

  function handleCanPlay() {
    videoRef.current.play();
  }
  async function handleCapture() {
    const context = await canvasRef.current.getContext("2d");
    await context.drawImage(videoRef.current, 0, 0, width, height);
    await canvasRef.current.toBlob(
      (blob) => {
        console.log(blob);
        console.log(URL.createObjectURL(blob));
      },
      "image/jpeg",
      1
    );
    let data = context.getImageData(width / 2, height / 2, 1, 1).data;
    setColor(`rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`);
  }
  return (
    <div className="App">
      {desktopMode?'':(<button
        style={{
          position: "absolute",
          top: "30px",
          color: "white",
          backgroundColor: "transparent",
          height: "40px",
          width: "auto",
          fontSize: "20px",
          border: "solid 1px white",
          fontWeight: "bold",
          lineHeight: "1.5em",
          borderRadius: "5px",
          padding: "10px 20px 40px 20px"
        }}
        onClick={() => setFront(!front)}
      >
        Flip
      </button>)}
      <video
        width={width}
        height={height}
        ref={videoRef}
        onCanPlay={handleCanPlay}
        autoPlay
        playsInline
        muted
      />
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: `${color}`,
          position: "absolute",
          top: "50%",
          transform: "translate(-50%,-50%)"
        }}
      ></div>
      <div
        style={{
          backgroundColor: "white",
          position: "absolute",
          bottom: "40%",
          fontSize: "13px",
          borderRadius: "7px",
          padding: "0px 10px",
          transform: "translate(0, -50%)"
        }}
      >
        {color}
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: "none" }}
      />
      <button
        style={{
          position: "absolute",
          bottom: "30px",
          color: "white",
          backgroundColor: "transparent",
          height: "40px",
          width: "auto",
          fontSize: "20px",
          border: "solid 1px white",
          fontWeight: "bold",
          lineHeight: "1.5em",
          borderRadius: "5px",
          padding: "10px 20px 40px 20px"
        }}
        onClick={handleCapture}
      >
        Capture
      </button>
    </div>
  );
}

export default App;
