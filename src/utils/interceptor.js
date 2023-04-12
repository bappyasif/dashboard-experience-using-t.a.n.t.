const { default: axios } = require("axios");

export const shazamApiInterceptor = ({...options}) => {
    const client = axios.create({baseURL: "https://shazam-song-recognizer.p.rapidapi.com"})
    
    // client.defaults.headers.common["X-RapidAPI-Key"] = process.env.NEXT_PUBLIC_RAPID_API_KEY
    // client.defaults.headers.common["X-RapidAPI-Host"] = "shazam-song-recognizer.p.rapidapi.com"

    // const onSuccess = response => response

    // const onError = error => error

    // return client(options).then(onSuccess).catch(onError)

    return externalApiHedersAndCallBacks(client, "shazam-song-recognizer.p.rapidapi.com", options)
}

const externalApiHedersAndCallBacks = (client, hostUrl, options) => {
    client.defaults.headers.common["X-RapidAPI-Key"] = process.env.NEXT_PUBLIC_RAPID_API_KEY
    client.defaults.headers.common["X-RapidAPI-Host"] = hostUrl

    const onSuccess = response => response

    const onError = error => error

    return client(options).then(onSuccess).catch(onError)
}

export const shazamApiDojoInterceptor = ({...options}) => {
    const client = axios.create({baseURL: "https://shazam.p.rapidapi.com"});
    return externalApiHedersAndCallBacks(client, "shazam.p.rapidapi.com", options)
}

export const shazamApiHubInterceptor = ({...options}) => {
    // const client = axios.create({baseURL: "https://shazam8.p.rapidapi.com", headers: {"Content-Type": "application/octet-stream"}});
    const client = axios.create({baseURL: "https://shazam8.p.rapidapi.com"});
    return externalApiHedersAndCallBacks(client, "shazam8.p.rapidapi.com", options)
}

export const shazamApiDiyorInterceptor = ({...options}) => {
    const client = axios.create({baseURL: "https://shazam-api6.p.rapidapi.com"});
    return externalApiHedersAndCallBacks(client, "shazam-api6.p.rapidapi.com", options)
}

export const shazamSongRecognitionInterceptor = ({...options}) => {
    const client = axios.create({baseURL: "https://song-recognition.p.rapidapi.com"});
    return externalApiHedersAndCallBacks(client, "song-recognition.p.rapidapi.com", options)
}

export const internalApiRequest = ({...options}) => {
    const client = axios.create({baseURL: "http://localhost:3000/api"})
    
    // client.defaults.headers.common["Content-Type"] = "application/json";

    const onSuccess = response => response;
    
    const onError = error => error
    
    return client(options).then(onSuccess).catch(onError)
}