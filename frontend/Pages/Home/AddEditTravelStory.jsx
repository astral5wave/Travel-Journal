import React, { useState, useEffect } from "react";
import { MdAdd, MdClose, MdUpdate, MdDeleteOutline } from "react-icons/md";
import DateSelector from "../../src/components/input/DateSelector";
import ImageSelector from "../../src/components/input/ImageSelector";
import TagInput from "../../src/components/input/TagInput";
import axiosInstance from "../../src/utils/axiosInstance";
import moment from "moment";
import { toast } from "react-toastify";
import uploadImage from "../../src/utils/uploadImage";

const AddEditTravelStory = ({ type, getAllStories, storyInfo, onClose }) => {
  const [title, setTitle] = useState("");
  const [storyImg, setStoryImg] = useState(null);
  const [story, setStory] = useState("");
  const [visitedLocation, setVisitedLoaction] = useState([]);
  const [visitedDate, setVisitedDate] = useState(null);
  const [error, setError] = useState("");
  const [uploadedImgUrl, setUploadedImageUrl] = useState("");

  const setNull = () => {
    setTitle("");
    setStory("");
    setStoryImg(null);
    setVisitedDate(null);
    setVisitedLoaction([]);
  }
  //add travel story
  const addTravelStory = async () => {
    try {
      let imageUrl = "";
      if (storyImg) {
        const imageUploadData = await uploadImage(storyImg);
        imageUrl = imageUploadData.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
        visitedLocation,
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        getAllStories();
        closeModal();
        setNull();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      else {
        setError("An Unxpected Error occured while adding story")
      }
    }

  };

  //update travel story
  const updateTravelStory = async () => {
    try {
      let imageUrl = "";
      if (storyImg && typeof storyImg === "string" && storyImg === uploadedImgUrl) {
        imageUrl = storyImg;
      } else if (!storyImg || (storyImg && typeof storyImg === "object")) {
        const deleteResponse = await axiosInstance.delete("/delete-image/", {
          params: { imageUrl: uploadedImgUrl },
        });
        
        if (deleteResponse.data && deleteResponse.data.error === false) {
          console.log(deleteResponse.data.message);
        }

        if (storyImg) {
          const imageUploadData = await uploadImage(storyImg);
          imageUrl = imageUploadData.imageUrl || "";
        } else {
          imageUrl = ""; // Ensure backend handles this properly
        }
      }

      //if storyImg is url means already uploaded image is there in new update but if Object means fresh image is there to be updated

      const postData = {
        title,
        story,
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
        imageUrl,
      }

      const response = await axiosInstance.put("/edit-travel-story/" + storyInfo._id, postData);

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        getAllStories();
        closeModal();
        setUploadedImageUrl("");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      else {
        setError("An Unxpected Error occured while updating story")
      }
    }
  };

  const handleAddOrUpdateClick = async () => {
    if (!title.trim()) {
      setError("Title is required");
      setTitle("");
      return;
    }
    if (!story.trim()) {
      setError("Story is required");
      setStory("");
      return;
    }
    setError("");

    if (type === "edit") {
      updateTravelStory();
    }
    else {
      addTravelStory();
    }
  };

  const closeModal = () => {
    onClose();
    setError("");
  }

  useEffect(() => {
    setTitle(storyInfo?.title || "");
    setStory(storyInfo?.story || "");
    setStoryImg(storyInfo?.imageUrl || null);
    setVisitedDate(storyInfo?.visitedDate ? new Date(storyInfo.visitedDate) : null);
    setVisitedLoaction(storyInfo?.visitedLocation || []);
    setUploadedImageUrl(storyInfo?.imageUrl || "");
  }, [storyInfo]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-on-surface">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div>
          <div className="flex items-center gap-3 bg-white/5 rounded-lg p-2 border border-white/10">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" />
                ADD STORY
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdUpdate className="text-lg" />
                  UPDATE STORY
                </button>
              </>
            )}
            <button className="" onClick={closeModal}>
              <MdClose className="text-xl text-white/60 hover:text-white/90" />
            </button>
          </div>
        </div>
      </div>
  
      {error && <p className="text-xs text-red-500 text-right py-2">{error}</p>}
  
      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="input-label text-white/90">TITLE</label>
          <input
            type="text"
            className="text-2xl outline-none text-on-surface bg-surface px-2 py-1 placeholder:white/50"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={({ target }) => {
              setTitle(target.value);
            }}
          />
        </div>
  
        <div className="my-3">
          <DateSelector date={visitedDate} setDate={setVisitedDate} storyInfo={storyInfo} />
        </div>
  
        <ImageSelector
          image={storyImg}
          setImage={setStoryImg}
        />
  
        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label text-white/90">STORY</label>
          <textarea
            type="text"
            className="text-xs text-on-surface rounded outline-none p-2 bg-white/10 border border-white/20 placeholder:white/50"
            rows={10}
            placeholder="Your Story"
            value={story}
            onChange={({ target }) => setStory(target.value)}
          ></textarea>
        </div>
  
        <div className="pt-3">
          <label className="input-label text-white/90">VISITED LOCATIONS</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLoaction} />
        </div>
      </div>
    </div>
  );
  
};

export default AddEditTravelStory;
