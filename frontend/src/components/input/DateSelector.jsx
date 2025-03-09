import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import { MdClose, MdOutlineDateRange } from "react-icons/md";

const DateSelector = ({ date, setDate, storyInfo }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  useEffect(() => {
    setOpenDatePicker(false);
  }, [storyInfo])

  return (
    <div>
      <div>
        <button
          className="btn-small px-2 py-1"
          onClick={() => setOpenDatePicker(true)}
        >
          <MdOutlineDateRange className="text-lg" />
          {date
            ? moment(date).format("Do MMM YYYY")
            : moment().format("Do MMM YYYY")}
        </button>
      </div>

      {openDatePicker && <div
        className="p-5 bg-white/5 backdrop-blur-md rounded-lg relative pt-9 text-on-surface"
      >
        <button
          className="absolute w-10 h-10 top-2 right-2 flex items-center justify-center 
           bg-primary text-on-primary border border-primary/50 rounded-full "
          onClick={() => setOpenDatePicker(false)}
        >
          <MdClose className="text-xl" />
        </button>
          <DayPicker
  className={{
    dropdown: "bg-primary text-on-primary border border-primary/50 rounded-md px-2 py-1 cursor-pointer"
  }}
  selected={date}
  onSelect={setDate}
  captionLayout="dropdown"
  mode="single"
        />
      </div>}
    </div>
  );
};

export default DateSelector;
