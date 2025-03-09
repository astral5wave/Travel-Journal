import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";

const TagInput = ({ tags, setTags }) => {
  const [inputTag, setInputTag] = useState("");
  const addTags = () => {
    if (inputTag.trim() != "") {
      setTags([...tags, inputTag.trim()]);
      setInputTag("");
    } else {
      setInputTag("");
    }
  };

  const handelRemoveTag=(item)=>{
    setTags(tags.filter((tag)=>{
        return tag!=item;
    }));
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mt-2">
        {tags.length > 0 && 
          <div className="flex items-center gap-4 flex-wrap overflow-x-auto scrollbar py-2">
            {tags.map((item, index) => {
              return (
              <span className="flex items-center gap-2 bg-primary rouded-sm text-on-primary px-2 py-1 rounded-md" key={index}>
                <GrMapLocation className="text-sm" />
                {item}
                <button className="" onClick={() => handelRemoveTag(item)}>
                  <MdClose />
                </button>
              </span>
              )
            })}
          </div>
        
        }
        <div className="flex items-center gap-4 mt-2">
          <input
            type="text"
            className="text-xs text-on-surface border border-white/20 outline-none bg-transparent  p-2 rounded-md placeholder:white/50"
            placeholder="Add Location"
            onChange={({ target }) => {
              setInputTag(target.value);
            }}
            value={inputTag}
            onKeyDown={(event)=>{
                if(event.key==="Enter") addTags()
            }}
          />
          <button
            className="flex items-center justify-center border border-purple-600 rounded-md hover:border-none w-8 h-8 hover:bg-purple-600 hover:text-white text-purple-600"
            onClick={addTags}
          >
            <MdAdd className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagInput;
