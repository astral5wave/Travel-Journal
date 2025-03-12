import React, { useState, useEffect } from "react";
import { MdAdd, MdClose, MdUpdate, MdDeleteOutline } from "react-icons/md";
import DateSelector from "../../src/components/input/DateSelector";
import ImageSelector from "../../src/components/input/ImageSelector";
import TagInput from "../../src/components/input/TagInput";
import axiosInstance from "../../src/utils/axiosInstance";
import moment from "moment";
import { toast } from "react-toastify";
import uploadImage from "../../src/utils/uploadImage";
import { useNavigate } from "react-router-dom";

const AddEditTravelStory = ({ type, getAllStories, storyInfo, onClose }) => {
  const [title, setTitle] = useState("");
  const [storyImg, setStoryImg] = useState(null);
  const [imageId, setImageId] = useState("")
  const [story, setStory] = useState("");
  const [visitedLocation, setVisitedLoaction] = useState([]);
  const [visitedDate, setVisitedDate] = useState(null);
  const [error, setError] = useState("");
  const [uploadedImgUrl, setUploadedImageUrl] = useState("");
  const navigate = useNavigate();
  const setNull = () => {
    setTitle("");
    setStory("");
    setStoryImg(null);
    setVisitedDate(null);
    setVisitedLoaction([]);
  }
  const addTravelStory = async () => {
    try {
      const combinedPromise = new Promise(async (resolve, reject) => {
        let imageUrl = "";
        let image_public_id = "";

        try {
          if (storyImg) {
            const imageUploadData = await uploadImage(storyImg);
            imageUrl = imageUploadData.imageUrl || "";
            image_public_id = imageUploadData.image_public_id || "";
          }

          const response = await axiosInstance.post("/add-travel-story", {
            title,
            story,
            imageUrl: imageUrl || "",
            image_public_id: image_public_id || "",
            visitedDate: visitedDate
              ? moment(visitedDate).valueOf()
              : moment().valueOf(),
            visitedLocation,
          });

          if (response.data && response.data.story) {
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      });

      await toast.promise(combinedPromise, {
        pending: "Adding story... Please wait",
        success: "Story added successfully!",
        error: "Failed to add story. Please try again."
      });

      getAllStories();
      closeModal();
      setNull();

    } catch (error) {
      if (
        error.response?.status === 401 &&
        (error.response.data.code === "INVALID_TOKEN" ||
          error.response.data.code === "ACCOUNT_DELETED")
      ) {
        localStorage.clear();
        navigate("/login");
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred while adding the story.");
      }
    }
  };

  //update travel story
  const updateTravelStory = async () => {
    try {
      const combinedPromise = new Promise(async (resolve, reject) => {
        let imageUrl = "";
        let image_public_id = "";

        try {
          // Condition 1: If the uploaded image is the same, keep existing URL & ID
          if (storyImg && typeof storyImg === "string" && storyImg === uploadedImgUrl) {
            imageUrl = storyImg;
            image_public_id = imageId;
          }
          // Condition 2: If a new image is uploaded or no image is provided
          else if (!storyImg || (storyImg && typeof storyImg === "object")) {
            if (imageId !== "placeholderImageID") {
              const deleteResponse = await axiosInstance.delete("/delete-image/", {
                params: { image_public_id: imageId },
              });

              if (deleteResponse.data && deleteResponse.data.error === false) {
                console.log(deleteResponse.data.message);
              }
            }

            if (storyImg) {
              const imageUploadData = await uploadImage(storyImg);
              imageUrl = imageUploadData.imageUrl || "";
              image_public_id = imageUploadData.image_public_id || "";
            } else {
              imageUrl = "";
              image_public_id = "";
            }
          }

          const postData = {
            title,
            story,
            visitedLocation,
            visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            imageUrl,
            image_public_id,
          };

          const response = await axiosInstance.put(`/edit-travel-story/${storyInfo._id}`, postData);

          if (response.data && response.data.story) {
            resolve("Story updated successfully!");
          } else {
            reject("Failed to update story.");
          }
        } catch (error) {
          reject(error);  // ➡️ Ensures the error is caught in toast and setError
        }
      });

      await toast.promise(combinedPromise, {
        pending: "Updating story... Please wait",
        success: "Story updated successfully!",
        error: "Failed to update story. Please try again."
      });

      getAllStories();
      closeModal();
      setUploadedImageUrl("");
      setImageId("");

    } catch (error) {
      if (
        error.response?.status === 401 &&
        (error.response.data.code === "INVALID_TOKEN" ||
          error.response.data.code === "ACCOUNT_DELETED")
      ) {
        localStorage.clear();
        navigate("/login"); // Redirect user to login if account is deleted or token is invalid
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred while updating the story.");
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
    setImageId(storyInfo?.image_public_id || "");
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
