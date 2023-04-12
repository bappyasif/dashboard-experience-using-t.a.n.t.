import { shazamApiDiyorInterceptor, shazamApiDojoInterceptor, shazamApiHubInterceptor, shazamApiInterceptor, shazamSongRecognitionInterceptor } from "@/utils/interceptor"
import { useEffect, useRef, useState } from "react"
import { RenderSongDetails } from "./forRendering"
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai"

export const RecordMedia = () => {
    const [shazamData, setShazamData] = useState(false)
    const [forMedia, setForMedia] = useState({})

    let audioChunks = [];
    const mediaRecorder = forMedia?.recorder;
    const ref = useRef();

    const lookForMatches = (blob) => {
        // const data = new FormData()
        // data.append('data', JSON.stringify(blob));
        // data.append("upload_file", blob)
        // data.append("data", blob)
        // data.append("key1", blob)
        // data.append("upload_file", fs.createReadStream(blob))
        // return shazamApiDiyorInterceptor({ url: "/shazam/recognize/", data: data, method: "POST" })
        // return shazamApiDojoInterceptor({ url: "/songs/v2/detect", data: data, method: "POST" })
        // return shazamApiDojoInterceptor({ url: "/songs/v2/detect", data: `${blob}`, method: "POST" })
        // return shazamApiHubInterceptor({ url: "/track/recognize", data: `${blob}`, method: "POST", headers: { "Content-Type": "application/octet-stream" } })
        // return shazamApiHubInterceptor({ url: "/track/recognize", data: `${data}`, method: "POST", headers: { "Content-Type": "text/plain" } })
        // return shazamApiDojoInterceptor({ url: "/songs/v2/detect", data: `${data}`, method: "POST", headers: { "Content-Type": "text/plain" } })
        return shazamApiDojoInterceptor({ url: "/songs/v2/detect", data: `${blob}`, method: "POST", headers: { "Content-Type": "text/plain" } })
        // return shazamApiDojoInterceptor({ url: "/songs/v2/detect", data, method: "POST" })
        // return shazamApiHubInterceptor({ url: "/track/recognize", data: {"key1" : blob}, method: "POST" })
        // return shazamApiInterceptor({ url: "/recognize", data: data, method: "post" })
    }

    const sendData = blob => {
        console.log(blob, "SEND DAT!!")
        updateStateVariable({ safeToSearch: false })

        // processRecordedAudioData(blob)
        // convertBlobToBase64(blob).then(v => {
        //     console.log(v)
        //     lookForMatches(v).then(data => {
        //         console.log(data?.data?.result, data)
        //         // setShazamData(data?.data?.result)
        //     }).catch(err => console.log("error occured....", err))
        // })

        // lookForMatches(blob).then(data => {
        //     console.log(data?.data?.result, data)
        //     // setShazamData(data?.data?.result)
        // }).catch(err => console.log("error occured....", err))

        // processRecordedAudioData(blob).then(text => {
        //     console.log(text, "TEST!!")
        //     lookForMatches(text).then(data => {
        //         console.log(data?.data?.result, data)
        //         // setShazamData(data?.data?.result)
        //     }).catch(err => console.log("error occured....", err))
        // })

        // const test = processRecordedAudioData(blob).then(text => {
        //     console.log(text, "TEST!!")
        //     lookForMatches(text).then(data => {
        //         console.log(data?.data?.result, data)
        //         // setShazamData(data?.data?.result)
        //     }).catch(err => console.log("error occured....", err))
        // })
        // console.log(test, "TEST!!")
        // lookForMatches(blob).then(data => {
        //     console.log(data?.data?.result, data)
        //     // setShazamData(data?.data?.result)
        // }).catch(err => console.log("error occured....", err))
    }

    const fetchForMatches = blob => {
        const data = new FormData();
        data.append("file", blob)
        // data.append("upload_file", blob)
        // return shazamApiHubInterceptor({ url: "/track/recognize", data: `${blob}`, method: "POST", headers: { "Content-Type": "application/octet-stream" } })
        // return shazamApiDojoInterceptor({ url: "/songs/v2/detect", data: `${blob}`, method: "POST", headers: { "Content-Type": "text/plain" } })
        // return shazamApiDiyorInterceptor({url: "/shazam/recognize/", data: data})
        return shazamSongRecognitionInterceptor({url: "/song/detect", data})
    }

    const beginFetch = (blob) => {
        updateStateVariable({ safeToSearch: false })
        
        convertBlobToBase64(blob).then(v => {
            console.log(v)
            // fetchForMatches(v).then(data => {
            //     console.log(data?.data?.result, data)
            //     // setShazamData(data?.data?.result)
            // }).catch(err => console.log("error occured....", err))
        })
        
        // fetchForMatches(blob).then(data => {
        //     console.log(data?.data?.result, data)
        //     // setShazamData(data?.data?.result)
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
        updateStateVariable({ safeToSearch: true })
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
            // sendData(forMedia.blob)
            beginFetch(forMedia.blob)
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

    const btns = [
        { name: "Start Recording", icon: <AiOutlineAudio />, actionFunction: onStart },
        { name: "Stop Recording", icon: <AiOutlineAudioMuted />, actionFunction: onStop }
    ]

    const renderButtons = () => btns?.map(item => <ActionButton key={item.name} item={item} forMedia={forMedia} />)

    // console.log(shazamData, forMedia, audioChunks)

    return (
        <div className="w-full flex flex-col items-center">
            <section className='flex flex-col items-center'>
                <h2 className='text-3xl'>Record Your Music By giving Access To Your Microphone and Hit Record :)</h2>

                <h3 className={`${forMedia?.safeToSearch ? "visible text-white" : "invisible"}`}>Safe Amount (at least 20 seconds) Has Been Recorded, Hit Stop To Begin Search</h3>

                <div className='flex justify-start gap-4 items-center'>
                    <audio className='my-4' ref={ref} src=""></audio>
                    <div className='flex gap-4 my-4'>
                        {renderButtons()}
                    </div>
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

const ActionButton = ({ item, forMedia }) => {
    const [tooltip, setTooltip] = useState("");

    const { name, icon, actionFunction } = item;

    const decideConditional = () => forMedia?.begin && name === "Start Recording" || !forMedia?.begin && name === "Stop Recording"

    const handleHoverIn = () => {
        if (decideConditional()) {
            setTooltip(name)
        }
    }

    const handleHoverOut = () => setTooltip("")

    useEffect(() => {
        setTooltip("")
    }, [item])

    return (
        <div
            onTouchStart={handleHoverIn}
            onTouchEnd={handleHoverOut}
            onMouseEnter={handleHoverIn}
            onMouseLeave={handleHoverOut}
        >
            <button
                className={
                    `${decideConditional() ? "animate-pulse" : ""} bg text-2xl w-2/4 p-4 
                  text-teal-900 ${decideConditional() ? "bg-blue-400" : "bg-slate-400"} 
                    rounded-lg flex items-baseline gap-4 w-fit relative`
                    // hover:${tooltip !== "" ? "text-yellow-400" : "text-white"}
                }
                onClick={actionFunction}
                disabled={!decideConditional()}
            >
                {/* <span>{name}</span> */}
                {icon}
            </button>
            {tooltip === name ? <p className="absolute px-2 bg-blue-200 rounded-sm">Click To {name}</p> : null}
        </div>
    )
}

export const convertBlobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});


const processRecordedAudioData = (blob) => {
    const reader = new FileReader()
    // reader.readAsBinaryString(blob) and use btoa(reader.result) to get the Base64 string
    // const buffers = reader.readAsArrayBuffer(blob);
    // const b64 = reader.result(buffers)
    // console.log(b64, "B^$!!!!!!!!!!!!!!!!")
    // reader.readAsArrayBuffer(blob)
    return new Response(blob).text().then(text => text.toString()).catch(err => console.log("error....", err))
    // new Response(blob).text().then(text => console.log(text, "<<<<<WHATWHAT!!>>>>>>", text.toString())).catch(err => console.log("error....", err))
}