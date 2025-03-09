import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';

const SearchBar = ({ onChange, value, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center bg-white/10 border border-white/20 px-4 rounded-md">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full bg-transparent py-[11px] outline-none text-xs text-white placeholder-white/50"
        value={value}
        onChange={onChange}
        onKeyDown={({key})=>{
          if(key==="Enter"){
            handleSearch();
          }
        }}
      />
      {value && (
        <IoMdClose
          className="text-lg text-white/50 hover:text-white cursor-pointer mr-3"
          onClick={onClearSearch}
        />
      )}
      <FaMagnifyingGlass
        className="text-white/50 hover:text-white cursor-pointer"
        onClick={handleSearch}
      />
    </div>
  );
};


export default SearchBar