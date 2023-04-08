import { shazamApiInterceptor } from '@/utils/interceptor';
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

    setRecorder(prev => {
      return {
        ...prev,
        blob: ref.current.src
      }
    })
    console.log(blob, "BLOB!!")
    // getDataFromShazam()
  }

  const handleRecorders = (mediaRecorder) => {
    mediaRecorder.ondataavailable = evt => {
      audioChunks.push(evt.data)
      if (mediaRecorder.state === "inactive") {
        processMediaStream()
        // mediaRecorder.start();
      }
    }
  }

  const handleStartRecording = () => {
    const mediaRecorder = new MediaRecorder(recorder.stream);
    
    const mediaRecorderChunkned = new MediaRecorder(recorder.stream);

    handleRecorders(mediaRecorder)

    // mediaRecorder.ondataavailable = evt => {
    //   audioChunks.push(evt.data)
    //   if (mediaRecorder.state === "inactive") {
    //     processMediaStream()
    //     // mediaRecorder.start();
    //   }
    // }

    // console.log(mediaRecorder.state, "befiore")

    // if (mediaRecorder?.state === "inactive") {
    //   mediaRecorder.start();
    // }

    // mediaRecorder.stop();
    // console.log(mediaRecorder, mediaRecorder.state, "start!!", recorder, mediaRecorder?.current)
    // mediaRecorder.current.start();
    setRecorder(prev => ({ ...prev, begin: true, media: mediaRecorder, mediaChunked: mediaRecorderChunkned }))
  }

  const handleStopRecording = () => {
    const mediaRecorder = recorder?.media;
    // mediaRecorder?.current?.stop();
    // mediaRecorder.stop();
    // console.log(mediaRecorder, "stop!!", mediaRecorder?.state)

    if (mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setRecorder(prev => ({ ...prev, begin: false }))
      // console.log("done!!")
    }

    // setRecorder(prev => ({ ...prev, begin: false }))
  }

  const getDataFromShazam = (...options) => {
    // shazamApiInterceptor({url: "/recognize", data: data, method: "post"})
    // console.log(options[0], "options!!")

    shazamApiInterceptor(options[0])
    .then(data => console.log(data)).catch(err => console.log(err))
  }

  const lookForSongMatches = () => {
    const mediaRecorderChunkned = recorder?.mediaChunked
    const data = new FormData();
    
    data.append("upload_file", recorder?.chunkedBlob)
    console.log(data, "!!data ready!!", recorder?.chunkedBlob)
    
    setRecorder(prev => {
      return {
        ...prev,
        chunkedBlob: null
      }
    })

    // getDataFromShazam({url: "/recognize", data: data, method: "post"})

    // return shazamApiInterceptor({url: "/recognize", data: data, method: "post"})
  }

  useEffect(() => {
    if(recorder?.chunkedBlob) {
      lookForSongMatches()
    }
  }, [recorder?.chunkedBlob])

  const runEverySixSeconds = () => {
    const mediaRecorderChunkned = recorder?.mediaChunked;
    const blob = new Blob(audioChunks, { type: "audio/mp3" })
    const data = URL.createObjectURL(blob);

    // mediaRecorder.stop();
    mediaRecorderChunkned.stop()

    setRecorder(prev => {
      return {
        ...prev,
        chunkedBlob: blob
      }
    })
    console.log(recorder?.media?.state,"new blob", data)
  }

  useEffect(() => {
    let timer = null
    // console.log(recorder?.media?.state)
    if(recorder?.begin) {
      // timer = setInterval(runEverySixSeconds, 4000)
      // console.log("!!running!!", recorder?.begin)
      timer = setInterval(() => {
        runEverySixSeconds()
        // setRecorder
        // console.log(recorder?.begin, "running!!", recorder?.media?.state)
      }, 2000)
      // return () => clearInterval(timer)
    } 
    // else if(recorder?.media?.state === "recording") {
    //   console.log("clear timer - I")
    //   clearInterval(timer)
    // }

    return () => {
      console.log("clear timer - II")
      clearInterval(timer)
    }

  }, [recorder?.begin])

  useEffect(() => {
    if(recorder?.mediaChunked) {
      const mediaRecorderChunkned = recorder?.mediaChunked;
      if(mediaRecorderChunkned?.state === "inactive") {
        mediaRecorderChunkned.start();
      }
    }
  }, [recorder?.mediaChunked])

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

  // console.log(recorder?.begin)

  return (
    <section>
      <div>Record Media</div>
      <audio ref={ref} controls={true} autoPlay={true} />
      <button
        onClick={recorder?.begin ? handleStopRecording : handleStartRecording}
      >{recorder?.begin ? "Stop" : "Record"}</button>
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
