import { countriesCodes, countriesConversions } from '@/utils/data'
import React from 'react'

export const SelectCountry = ({ handleCountryChange }) => {
  const renderCountries = () => countriesConversions()?.map(country => <RenderOption key={country.code} country={country} />)
  return (
    <section className='text-9xl text-fuchsia-950'>
      <select className='bg-stone-600' onChange={handleCountryChange}>
        <option value="-1">Choose Country</option>
        {renderCountries()}
      </select>
    </section>
  )
}

const RenderOption = ({ country }) => {
  const { code, name } = country

  return <option value={code}>{name}</option>
}