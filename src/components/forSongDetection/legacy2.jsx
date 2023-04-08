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

  const getDataFromShazam = (blob) => {
    const data = new FormData();
    data.append("upload_file", blob);
    data.append("fuck", "off")

    const dataNew = {
      "upload_file": blob
    }

    const url = "/recognize";
    const method = "post";

    console.log("ready dayta", data, dataNew, blob)

    shazamApiInterceptor({ data: dataNew, url, method })
      .then(result => console.log(result)).catch(err => console.log(err))
  }

  const processMediaStream = () => {
    const blob = new Blob(audioChunks, { type: "audio/mp3" })
    ref.current.src = URL.createObjectURL(blob)

    getDataFromShazam(blob);
    console.log(blob, "BLOB!!")
  }

  const handleStartRecording = () => {
    const mediaRecorder = new MediaRecorder(recorder.stream);

    mediaRecorder.ondataavailable = evt => {
      audioChunks.push(evt.data)
      if (mediaRecorder.state === "inactive") {
        processMediaStream()
      }
    }

    setRecorder(prev => ({ ...prev, begin: true, media: mediaRecorder }))
  }

  const handleStopRecording = () => {
    const mediaRecorder = recorder?.media;

    if (mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setRecorder(prev => ({ ...prev, begin: false }))
    }
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

  // console.log(recorder?.stream, recorder)

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

const processRecordedAudioData = (blob) => {
  const reader = new FileReader()
  new Response(blob).text().then(text => console.log(text, "<<<<<WHATWHAT!!>>>>>>", text.toString())).catch(err => console.log("error....", err))
}