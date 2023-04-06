import React from 'react'

export const SelectWhichSearchType = ({ handleWhichSearchType }) => {
    const renderTypes = () => types?.map(item => <RenderSearchTypeOption key={item.type} item={item} />)
    return (
        <>
            {/* <div>SelectWhichSearchType</div> */}
            <select className='bg-transparent outline-1 outline-blue-200 outline' onChange={e => handleWhichSearchType(e.target.value)} name="choose search type" id="search_type">
                <option value="-1">Choose Search Type</option>
                {renderTypes()}
            </select>
        </>
    )
}

const RenderSearchTypeOption = ({ item }) => {
    const { type } = item;

    return (
        <option value={type}>{type}</option>
    )
}

export const InputElement = ({handleSearchText, searchType}) => {
    const decidePlaceholderText = () => {
        const str = `Enter Your ${searchType != -1 ? searchType +" Name" : "Query"} Here`
        return str;
    }
    return (
        <input
            className={`${searchType == -1 ? "bg-red-200" : "bg-transparent"} outline-1 outline-blue-200 outline`} 
            type={"text"}
            onChange={e => handleSearchText(e)}
            placeholder={decidePlaceholderText()}
            disabled={searchType == -1 ? true : false}
        />
    )
}

export const ButtonElement = ({handleClick, query, type}) => {
    return (
        <button
            // className={`${!(query?.length >= 4 && type != -1) ? "bg-red-200" : "bg-blue-400"} p-1 px-4 rounded-lg`} 
            className={`${!(query && type != -1) ? "bg-red-200" : "bg-blue-400"} p-1 px-4 rounded-lg`} 
            // onClick={() => handleClick()}
            onClick={handleClick}
            disabled={!(query && type != -1) ? true : false} 
        >Search</button>
    )
}

const types = [
    {
        type: "Track"
    },
    {
        type: "Artist"
    }
]