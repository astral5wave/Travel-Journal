import moment from "moment";
import React from "react";
import { GrMapLocation } from "react-icons/gr";
import { MdUpdate,MdClose,MdDeleteOutline } from "react-icons/md"; 

const ViewTravelStory = ({
  storyData,
  onClose,
  onUpdateClick,
  onDeleteClick,
}) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-end my-2">
        <div>
          <div className="flex items-center gap-3 bg-white/5 rounded-lg p-2">
            <button className="btn-small" onClick={onUpdateClick}>
              <MdUpdate className="text-lg" />
              UPDATE
            </button>
            <button className="btn-small btn-delete" onClick={onDeleteClick}>
              <MdDeleteOutline className="text-lg" />
              DELETE
            </button>
            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-white/60 hover:text-white/90" />
            </button>
          </div>
        </div>
      </div>
      
      <h5 className="text-2xl text-on-surface font-medium my-2">
        {storyData?.title || ""}
      </h5>

      <div className="flex items-center justify-between my-4">
        <span className="text-sm text-white/90">
          {storyData? moment(storyData.visitedDate).format("Do MMM YYYY"):""}
        </span>
        <div className='inline-flex items-center gap-2 text-[13px] text-on-primary bg-primary rounded px-3 py-1'>
          <GrMapLocation className='text-sm'/>
          {storyData?.visitedLocation.join(", ") || ""}
        </div>
      </div>

      <img 
        src={storyData?.imageUrl ||""} 
        alt={storyData?.title||""} 
        className="w-full h-[320px] object-cover rounded-lg my-6"
      />

      <p className="text-sm text-on-surface leading-relaxed break-words w-full bg-white/10 px-2 py-4 rounded-lg relative">
        {storyData?.story ||""}    
      </p>

    </div>
  );
};

export default ViewTravelStory;
