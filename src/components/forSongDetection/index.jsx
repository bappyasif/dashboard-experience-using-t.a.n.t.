import { shazamApiInterceptor } from "@/utils/interceptor"
import { useEffect, useRef, useState } from "react"
import { RenderSongDetails } from "./forRendering"
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai"
import { shazamApiDiyorInterceptor } from "@/utils/interceptor"
import { shazamApiDojoInterceptor } from "@/utils/interceptor"

export const RecordMedia = () => {
    const [shazamData, setShazamData] = useState(false)
    const [forMedia, setForMedia] = useState({})

    let audioChunks = [];
    const mediaRecorder = forMedia?.recorder;
    const ref = useRef();

    const lookForMatches = (blob) => {
        // const data = new FormData()
        // data.append("upload_file", blob)
        return shazamApiDojoInterceptor({ url: "/songs/detect", data: `${blob}`, method: "post" })
        // return shazamApiInterceptor({ url: "/recognize", data: data, method: "post" })
        // return shazamApiDiyorInterceptor({ url: "/shazam/recognize/", data: data, method: "post" })
        // return shazamApiDiyorInterceptor({ url: "/shazam/recognize/", data: data, method: "post", headers: {...blob.getHeaders()} })
    }

    const referenceCode = (blob) => {
        // const inputRawFile = ".../clinteastwood_portion_mono.raw";
        const byteArray = readFile(blob);
        const base64Str = Base64.getEncoder().encodeToString(byteArray);
        console.log(base64Str, "base64Str")
        // try (OutputStreamWriter out = new OutputStreamWriter(new FileOutputStream(".../clinteastwood_portion_mono.txt"), StandardCharsets.UTF_8)) { out.write(base64Str); }
    }

    const sendData = blob => {
        // const reader = new FileReader()
        // reader.readAsArrayBuffer(blob)
        // reader.onload = () => {
        //     console.log(reader.result)
        //     lookForMatches(reader.result).then(data => {
        //         console.log(data?.data?.result, data)
        //         // setShazamData(data?.data?.result)
        //     }).catch(err => console.log("error occured....", err))

        // }
        console.log(blob, "SEND DAT!!")
        updateStateVariable({ safeToSearch: false })
        blobToBase64(blob, lookForMatches).then((v) => {
            console.log(v, "!!")
            // lookForMatches(v)
            lookForMatches(v).then(data => {
                console.log(data?.data?.result, data)
                // setShazamData(data?.data?.result)
            }).catch(err => console.log("error occured....", err))
        })
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
        const rec = new MediaRecorder(stream, { mimeType: "", })
        updateStateVariable({ recorder: rec })
    }

    const getAccessToUserMediaDevice = () => {
        const constraints = {
            channelCount: 1,
            sampleRate: 44100,
            sampleSize: 16
        }
        // navigator.mediaDevices.getUserMedia({ audio: true})
        navigator.mediaDevices.getUserMedia({audio: constraints})
            .then(stream => {
                streamHandler(stream)
                // let track = stream.getAudioTracks()[0];
                // console.log(track.getCapabilities(), "capabilities");
            })
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

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

//   var blobToBase64 = function(blob, callback) {
//     var reader = new FileReader();
//     reader.onload = function() {
//         var dataUrl = reader.result;
//         var base64 = dataUrl.split(',')[1];
//         callback(base64);
//     };
//     reader.readAsDataURL(blob);
// };