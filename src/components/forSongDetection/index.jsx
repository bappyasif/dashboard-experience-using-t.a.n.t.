import { shazamApiInterceptor } from "@/utils/interceptor"
import { useEffect, useRef, useState } from "react"
import { RenderSongDetails } from "./forRendering"

export const RecordMedia = () => {
    const [shazamData, setShazamData] = useState(false)
    const [forMedia, setForMedia] = useState({})

    let audioChunks = [];
    const mediaRecorder = forMedia?.recorder;
    const ref = useRef();

    const lookForMatches = (blob) => {
        const data = new FormData()
        data.append("upload_file", blob)
        return shazamApiInterceptor({ url: "/recognize", data: data, method: "post" })
    }

    const sendData = blob => {
        console.log(blob, "SEND DAT!!")
        updateStateVariable({safeToSearch: false})
        // lookForMatches(blob).then(data => {
        //     console.log(data?.data?.result, data)
        //     setShazamData(data?.data?.result)
        // }).catch(err => console.log("error occured....", err))
    }

    const processMedia = () => {
        ref.current.src = URL.createObjectURL(forMedia?.blob);
        ref.current.controls = true;
        ref.current.autoplay = true;
    }

    const streamHandler = (stream) => {
        const rec = new MediaRecorder(stream)
        updateStateVariable({ recorder: rec })
    }

    const getAccessToUserMediaDevice = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => streamHandler(stream))
            .catch(err => console.log(err))
    }

    const onStart = () => {
        audioChunks = [];
        mediaRecorder.start(2000)
        updateStateVariable({ begin: false })
    }

    const onStop = () => {
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
        console.log("!!runing!! __ II", mediaRecorder?.state)
        // mediaRecorderChunked.stop()
        // processMedia()
        if (mediaRecorder?.state === "recording") {
            mediaRecorder.requestData();
            // mediaRecorder.stop()
            // mediaRecorder.ondataavailable()
            // mediaRecorder.start()
        }
    }

    const runPeriodically = () => {
        updateStateVariable({safeToSearch: true})
    }

    const runThisForMediaControlerEvents = () => {
        mediaRecorder.onstop = (e) => {
            console.log("data available after MediaRecorder.stop() called.");

            const blob = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });

            updateStateVariable({ blob })

            console.log("recorder stopped");
        };

        mediaRecorder.ondataavailable = (e) => {
            audioChunks.push(e.data);
        };
    }

    useEffect(() => {
        if (mediaRecorder) {
            runThisForMediaControlerEvents();
        }
    }, [mediaRecorder])

    useEffect(() => {
        if (forMedia?.blob) {
            processMedia()
            sendData(forMedia.blob)
        }
    }, [forMedia?.blob])

    useEffect(() => {
        if (forMedia?.begin === false) {
            const timer = setInterval(runThisEveryPeriodically, 2000)
            const timer2 = setInterval(runPeriodically, 20000)
            return () => {
                clearInterval(timer)
                clearInterval(timer2)
            }
        }
    }, [forMedia?.begin])

    useEffect(() => {
        getAccessToUserMediaDevice()
        updateStateVariable({ begin: true })
    }, [])

    console.log(shazamData, forMedia, audioChunks)

    return (
        <div className="w-full flex flex-col items-center">
            <section className='flex flex-col items-center'>
                <h2 className='text-3xl'>Record Your Music By giving Access To Your Microphone and Hit Record :)</h2>

                <h3 className={`${forMedia?.safeToSearch ? "none text-white" : "line-through"}`}>Safe Amount (at least 20 seconds) Has Been Recorded, Hit Stop To Begin Search</h3>

                <div className='flex justify-start gap-4 items-center'>
                    <audio className='my-4' ref={ref} src=""></audio>
                    <p className='flex gap-4 my-4'>
                        <button className={`${forMedia?.begin ? "animate-pulse" : null} bg text-2xl w-2/4 p-4 text-teal-900 ${forMedia?.begin ? "bg-blue-400" : "bg-slate-400"} rounded-lg hover:${!forMedia?.begin ? null : "text-white"}`} onClick={onStart} disabled={!forMedia?.begin}>Record</button>
                        <button className={`${!forMedia?.begin ? "animate-pulse" : null} text-2xl w-3/4 p-4 text-red-900 ${!forMedia?.begin ? "bg-yellow-200" : "bg-zinc-400"} rounded-lg hover:text-slate-600`} onClick={onStop} disabled={forMedia.begin}>Stop</button>
                    </p>
                </div>

                <hr />
            </section>
            {/* // checkout sections in shazam result dataset - options for bringin in video url and "lyrics"!! */}
            {
                shazamData
                    ? <RenderSongDetails data={shazamData} />
                    : null
            }
        </div>
    )
}