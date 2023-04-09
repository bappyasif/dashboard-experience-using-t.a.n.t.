import { shazamApiInterceptor } from "@/utils/interceptor"
import { useEffect, useRef, useState } from "react"

export const RecordMedia = () => {
    const [shazamData, setShazamData] = useState(false)
    const [forMedia, setForMedia] = useState({})

    let audioChunks = [];
    // let chunks = [];
    const mediaRecorder = forMedia?.recorder;
    // const recorderChunked = forMedia?.recorderChunked
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

    const processMedia = (chunksData) => {
        const blob = new Blob(chunksData, { type: "audio/mp3" });

        ref.current.src = URL.createObjectURL(blob);
        ref.current.controls = true;
        ref.current.autoplay = true;

        updateStateVariable({ blob })
    }

    const onMediaDataAvailable = (mediaRecorder, chunksData) => {
        mediaRecorder.ondataavailable = evt => {
            chunksData.push(evt.data);
            if (mediaRecorder.state === "inactive") {
                processMedia(chunksData);
            }
        }
    }

    const beginRecordingUserVoice = () => {
        // const recorderChunked = forMedia?.recorderChunked;
        // onMediaDataAvailable(recorderChunked, chunks);

        onMediaDataAvailable(mediaRecorder, audioChunks);
    }

    const streamHandler = (stream) => {
        const rec = new MediaRecorder(stream)
        updateStateVariable({ recorder: rec })
        // updateStateVariable({recorder: rec, recorderChunked: rec})
        // const recDup = new MediaRecorder(stream)
        // updateStateVariable({recorder: rec, recorderChunked: recDup})
    }

    const getAccessToUserMediaDevice = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => streamHandler(stream))
            .catch(err => console.log(err))

        // no difference same "recording" state gets instilled
        // navigator.mediaDevices.getUserMedia({ audio: true })
        //     .then(stream => {
        //         const recDup = new MediaRecorder(stream);
        //         updateStateVariable({ recorderChunked: recDup })
        //     })
    }

    const onStart = () => {
        audioChunks = [];
        mediaRecorder.start()
        // recorderChunked.start()
        beginRecordingUserVoice();
        updateStateVariable({ begin: false })
    }

    const onStop = () => {
        audioChunks = [];
        mediaRecorder.stop()
        // recorderChunked.stop()
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

    const processMediaForChunked = () => {
        const blobChunked = new Blob(chunks, { type: "audio/mp3" })
        updateStateVariable({ blobChunked })
    }

    const runThisEveryPeriodically = () => {
        console.log("!!runing!! __ II")
        // const recorderChunked = forMedia?.recorderChunked

        // console.log(recorderChunked?.state, "!!chunk state!! -- before")
        console.log(mediaRecorder?.state, "!!chunk state!! -- before")

        // recorderChunked.stop()
        // recorderChunked.start()
        // processMedia(chunks)

        mediaRecorder.stop()
        processMedia(audioChunks)
        mediaRecorder.start();
        // processMediaForChunked();

        // recorderChunked.start();

        console.log(mediaRecorder?.state, "!!chunk state!! -- after")
    }

    useEffect(() => {
        if (forMedia?.blob) {
            sendData(forMedia.blob)
        } else if (forMedia?.blobChunked) {
            console.log("blob chunked----")
            sendData(forMedia.blobChunked)
        }
    }, [forMedia?.blob, forMedia?.blobChunked])

    useEffect(() => {
        if (forMedia?.begin === false) {
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