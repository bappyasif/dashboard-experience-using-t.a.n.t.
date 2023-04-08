import { shazamApiInterceptor } from "@/utils/interceptor"
import { useEffect, useRef, useState } from "react"

export const RecordMedia = () => {
    const [shazamData, setShazamData] = useState(false)
    const [forMedia, setForMedia] = useState({})

    let audioChunks = [];
    const mediaRecorder = forMedia?.recorder;
    const ref = useRef()

    const lookForMatches = (blob) => {
        const data = new FormData()
        data.append("upload_file", blob)
        console.log(data, "DATA")
        return shazamApiInterceptor({ url: "/recognize", data: data, method: "post" })
    }

    const sendData = blob => {
        console.log(blob, "SEND DAT!!")
        // lookForMatches(blob).then(data => {
        //     console.log(data?.data?.result, data)
        //     setShazamData(data?.data?.result)
        // }).catch(err => console.log("error occured....", err))
    }

    const processMedia = () => {
        const blob = new Blob(audioChunks, { type: "audio/mp3" });
        
        ref.current.src = URL.createObjectURL(blob);
        ref.current.controls = true;
        ref.current.autoplay = true;

        updateStateVariable({blob})
    }

    const onMediaDataAvailable = (mediaRecorder, chunks) => {
        mediaRecorder.ondataavailable = evt => {
            chunks.push(evt.data);
            if (mediaRecorder.state === "inactive") {
                processMedia();
            }
        }
    }

    const beginRecordingUserVoice = () => {
        const mediaRecorder = forMedia?.recorder;
        onMediaDataAvailable(mediaRecorder, audioChunks);
    }

    const streamHandler = (stream) => {
        const rec = new MediaRecorder(stream)
        updateStateVariable({recorder: rec})
    }

    const getAccessToUserMediaDevice = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => streamHandler(stream))
            .catch(err => console.log(err))
    }

    const onStart = () => {
        audioChunks = [];
        mediaRecorder.start(2000)
        beginRecordingUserVoice();
        updateStateVariable({ begin: false })
    }

    const onStop = () => {
        audioChunks = [];
        mediaRecorder.stop()
        updateStateVariable({ begin: true })
    }

    const updateStateVariable = (data) => {
        setForMedia(prev => {
            return {
                ...prev,
                ...data
            }
        })
    }

    const runThisEveryPeriodically = () => {
        console.log("!!runing!! __ II")
        // mediaRecorderChunked.stop()
        // processMedia()
    }

    useEffect(() => {
        if (forMedia?.blob) {
            sendData(forMedia.blob)
        }
    }, [forMedia?.blob])

    useEffect(() => {
        if(forMedia?.begin === false) {
            const timer = setInterval(runThisEveryPeriodically, 2000)

            return () => clearInterval(timer)
        }
    }, [forMedia?.begin])

    useEffect(() => {
        getAccessToUserMediaDevice()
        updateStateVariable({ begin: true })
    }, [])

    console.log(shazamData, forMedia)

    return (
        <section className='flex flex-col items-center ml-56'>
            <h2 className='text-3xl'>Record Your Music By giving Access To Your Microphone and Hit Record :)</h2>

            <div className='flex justify-start gap-4 items-center'>
                <audio className='my-4' ref={ref} src=""></audio>
                <p className='flex gap-4 my-4'>
                    <button className={`${forMedia?.begin ? "animate-pulse" : null} bg text-2xl w-2/4 p-4 text-teal-900 ${forMedia?.begin ? "bg-blue-400" : "bg-slate-400"} rounded-lg hover:${!forMedia?.begin ? null : "text-white"}`} onClick={onStart} disabled={!forMedia?.begin}>Record</button>
                    <button className={`${!forMedia?.begin ? "animate-pulse" : null} text-2xl w-3/4 p-4 text-red-900 ${!forMedia?.begin ? "bg-yellow-200" : "bg-zinc-400"} rounded-lg hover:text-slate-600`} onClick={onStop} disabled={forMedia.begin}>Stop</button>
                </p>
            </div>

            <hr />
        </section>
        // checkout sections in shazam result dataset - options for bringin in video url and "lyrics"!!
    )
}