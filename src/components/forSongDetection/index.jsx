import React, { useEffect, useRef, useState } from 'react'

export const RecordMedia = () => {
  const [recorder, setRecorder] = useState({});

  const ref = useRef()

  const audioChunks = [];

  const handleGetUserConsent = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    setRecorder(prev => {
      return {
        ...prev,
        stream: stream
      }
    })
  }

  const processMediaStream = () => {
    const blob = new Blob(audioChunks, { type: "audio/mp3" })
    ref.current.src = URL.createObjectURL(blob)

    console.log(blob, "BLOB!!")
  }

  const handleStartRecording = () => {
    const mediaRecorder = new MediaRecorder(recorder.stream);
    mediaRecorder.ondataavailable = evt => {
      audioChunks.push(evt.data)
      if (mediaRecorder.state === "inactive") {
        processMediaStream()
        // mediaRecorder.start();
      }
    }

    console.log(mediaRecorder.state, "befiore")

    // if (mediaRecorder?.state === "inactive") {
    //   mediaRecorder.start();
    // }

    // mediaRecorder.stop();
    console.log(mediaRecorder, mediaRecorder.state, "start!!", recorder, mediaRecorder?.current)
    // mediaRecorder.current.start();
    setRecorder(prev => ({ ...prev, begin: true, media: mediaRecorder }))
  }

  const handleStopRecording = () => {
    const mediaRecorder = recorder?.media;
    // mediaRecorder?.current?.stop();
    // mediaRecorder.stop();
    console.log(mediaRecorder, "stop!!", mediaRecorder?.state)

    if (mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }

    setRecorder(prev => ({ ...prev, begin: false }))
  }

  useEffect(() => {
    if (recorder?.media) {
      const mediaRecorder = recorder?.media;
      if (mediaRecorder?.state === "inactive") {
        mediaRecorder.start();
      }
    }
  }, [recorder?.media])

  useEffect(() => {
    handleGetUserConsent();
  }, [])

  console.log(recorder?.stream, recorder)

  return (
    <section>
      <div>Record Media</div>
      <audio ref={ref} controls={true} autoPlay={true} />
      <button
        onClick={recorder?.begin ? handleStopRecording : handleStartRecording}
      >{recorder?.begin ? "Record" : "Mic"}</button>
    </section>
  )
}











// export const RecordMedia = () => {
//   const [recorder, setRecorder] = useState({});

//   const ref = useRef()

//   const audioChunks = [];

//   const handleGetUserConsent = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

//     setRecorder(prev => {
//       return {
//         ...prev,
//         stream: stream
//       }
//     })
//   }

//   const processMediaStream = () => {
//     const blob = new Blob(audioChunks, { type: "audio/mp3" })
//     ref.current.src = URL.createObjectURL(blob)

//     console.log(blob, "BLOB!!")
//   }

//   const handleStartRecording = () => {
//     const mediaRecorder = new MediaRecorder(recorder.stream);
//     mediaRecorder.ondataavailable = evt => {
//       audioChunks.push(evt.data)
//       if (mediaRecorder.state === "inactive") {
//         processMediaStream()
//         // mediaRecorder.start();
//       }
//     }

//     console.log(mediaRecorder.state, "befiore")

//     if (mediaRecorder?.state === "inactive") {
//       mediaRecorder.start();
//     }

//     // mediaRecorder.stop();
//     console.log(mediaRecorder, mediaRecorder.state, "start!!", recorder, mediaRecorder?.current)
//     // mediaRecorder.current.start();
//     setRecorder(prev => ({ ...prev, begin: true, media: mediaRecorder }))
//   }

//   const handleStopRecording = () => {
//     const mediaRecorder = recorder?.media;
//     // mediaRecorder?.current?.stop();
//     // mediaRecorder.stop();
//     console.log(mediaRecorder, "stop!!", mediaRecorder?.state)

//     if (mediaRecorder.state === "recording") {
//       mediaRecorder.stop();
//     }

//     setRecorder(prev => ({ ...prev, begin: false }))
//   }

//   useEffect(() => {
//     handleGetUserConsent();
//   }, [])

//   console.log(recorder?.stream, recorder)

//   return (
//     <section>
//       <div>Record Media</div>
//       <audio ref={ref} controls={true} autoPlay={true} />
//       <button
//         onClick={recorder?.begin ? handleStopRecording : handleStartRecording}
//       >{recorder?.begin ? "Record" : "Mic"}</button>
//     </section>
//   )
// }

// export const RecordMedia = () => {
//   const [recorder, setRecorder] = useState({});

//   const handleBeginRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//     setRecorder(prev => {
//       return {
//         ...prev,
//         begin: true,
//         stream: stream
//       }
//     })
//   }

//   const handleStopRecording = () => {
//     // const mediaRecorder = recorder?.mediaRecorder;
//     // mediaRecorder.stop();
//     // console.log(mediaRecorder, "stop!!")

//     setRecorder(prev => ({ ...prev, begin: false }))
//   }

//   const beginRecording = () => {
//     const mediaRecorder = recorder.mediaRecorder;
//     let chunks = [];
//     if (mediaRecorder) {
//       if (mediaRecorder?.state === "inactive") {
//         mediaRecorder.start()
//       }

//       mediaRecorder.ondataavailable = evt => chunks.push(evt.data)

//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
//         // refreshing chunks
//         chunks = []

//         setRecorder(prev => {
//           if (prev.mediaRecorder) {
//             return {
//               ...prev,
//               audio: window.URL.createObjectURL(blob)
//             }
//           } 
//           // else {
//           //   return prev
//           // }
//         })
//       }
//     }
//   }

//   useEffect(() => {
//     beginRecording()
//   }, [recorder.mediaRecorder])


//   useEffect(() => {
//     if (recorder?.stream) {
//       setRecorder(prev => {
//         return {
//           ...prev,
//           mediaRecorder: new MediaRecorder(prev.stream)
//         }
//       })
//     }
//   }, [recorder.stream])

//   console.log(recorder?.stream, recorder)

//   return (
//     <section>
//       <div>Record Media</div>
//       <audio src={recorder?.stream} controls={true} />
//       <button onClick={recorder?.begin ? handleStopRecording : handleBeginRecording}>{recorder?.begin ? "Stop" : "Record"}</button>
//     </section>
//   )
// }
