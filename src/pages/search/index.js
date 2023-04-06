import { ButtonElement, InputElement, SelectWhichSearchType } from '@/components/forSearch';
import { PrepareForDataRendering } from '@/components/forSearch/renderResults';
import React, { useState } from 'react'

const SearchThings = () => {
    const [searchFor, setSearchFor] = useState({ type: "-1" });
    const handleSearchText = (evt) => {
        // had to keep value of "ready" as false when "user" is chnaging query values while state of "ready is true" which was causing unnecessary refetching and updating dataset constatntly
        // now by keeping "ready" state as "false" making sure unless "search" button is clicked data wont be "fetched" for
        setSearchFor(prev => ({ ...prev, query: evt.target.value, ready: false }))
    }
    const handleWhichSearchType = (val) => setSearchFor(prev => ({ ...prev, type: val }))
    const handleSearch = () => {
        // console.log("WHY NOw?!?!")
        setSearchFor(prev => ({ ...prev, ready: !prev["ready"] }))
    }

    // const appCtx = useContext(AppContext);

    // console.log(searchFor, "searchFor!!", appCtx.searchedData)

    return (
        <main>
            <div>SearchThings</div>
            <div className='flex gap-4 text-4xl'>
                <SelectWhichSearchType handleWhichSearchType={handleWhichSearchType} />
                <InputElement handleSearchText={handleSearchText} searchType={searchFor?.type} />
                <ButtonElement handleClick={handleSearch} query={searchFor?.query} type={searchFor?.type} />
            </div>

            <PrepareForDataRendering query={searchFor?.query} type={searchFor?.type} handleSearch={handleSearch} ready={searchFor?.ready} />

            {/* {
                // (searchFor?.ready || appCtx?.searchedData?.length)
                (searchFor?.ready)
                    ? <PrepareForDataRendering query={searchFor?.query} type={searchFor?.type} handleSearch={handleSearch}  />
                    : null
            } */}
        </main>
    )
}

export default SearchThings