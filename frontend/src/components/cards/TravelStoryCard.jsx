import React from 'react'
import { FaHeart } from 'react-icons/fa6';
import { GrMapLocation } from 'react-icons/gr';
import moment from "moment";


const TravelStoryCard = ({
  imageUrl, title, story, visitedDate, visitedLocation, isFavourite, onView, onFavouriteClick
}) => {
  return (
    <div className='border border-[rgba(255,255,255,0.1)] bg-surface rounded-lg overflow-hidden hover:shadow-[0px_4px_12px_rgba(255,255,255,0.1)] transition-all ease-in-out relative cursor-pointer'>
      <img
        src={imageUrl}
        alt={title}
        className='w-full h-56 rounded-lg object-cover'
        onClick={onView}
      />

      <button
        className='h-12 w-12 flex items-center justify-center rounded-lg bg-white/20 border border-slate-400/50 p-2 absolute top-4 right-4 hover:bg-white/30 transition-all duration-300 shadow-md shadow-black/20'
        onClick={onFavouriteClick}
      >
        <FaHeart className={`icon-btn transition-all duration-50 ${isFavourite ? "text-red-500" : "text-white"}`} />
      </button>



      <div className='p-4' onClick={onView}>
        <div className='flex items-center gap-3'>
          <div className='flex-1'>
            <h6 className='text-sm text-on-surface font-medium'>{title}</h6>
            <span className='text-xs text-on-surface/70'>{visitedDate ? moment(visitedDate).format("DD MM YYYY") : "-"}</span>
          </div>
        </div>
        <p className="text-sm text-on-surface mt-2">{story ? story.slice(0, 60) + "..." : ""}</p>
        <div className='inline-flex items-center gap-2 text-[13px] text-on-primary bg-primary rounded mt-3 px-2 py-1'>
          <GrMapLocation className='text-sm' />
          {visitedLocation.join(", ")}
        </div>
      </div>

    </div>
  )
}

export default TravelStoryCard