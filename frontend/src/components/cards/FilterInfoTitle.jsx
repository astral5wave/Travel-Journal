import React from 'react';
import moment from 'moment';
import {MdOutlineClose} from 'react-icons/md';

const FilterInfoTitle = ({filterType,filterDates,onClear}) => {
  const DateRangeChip=({date})=>{
    const startDate= date?.from ? moment(date.from).format("DD MMM YYYY"):"N/A";
    const endDate= date?.to ? moment(date.to).format("DD MMM YYYY"):"N/A";
    return (
      <div className='flex items-center gap-2 bg-primary border-white/20 border text-on-primary px-3 py-2 rounded'>
        <p className='text-xs font-medium'>
          {startDate}-{endDate}
        </p>
        <button onClick={onClear}>
          <MdOutlineClose/>
        </button>
      </div>
    );
  }

  
  return (
    filterType &&
    (<div className='mb-5 ml-3'>
      {filterType ==="search"?
      (
        <h3 className='text-lg text-on-surface font-medium'>
          Search Result
        </h3>
      )
      :
      (
        <div className='flex items-center gap-2'>
          <h3 className='text-lg text-on-background font-medium'>
            Travel Stories form
          </h3>
          <DateRangeChip date={filterDates}/>
        </div>
      )
      }
    </div>)
  )
}

export default FilterInfoTitle