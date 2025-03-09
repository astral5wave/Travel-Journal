import React, { useEffect, useState } from "react";
import Navbar from "../../src/components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../src/utils/axiosInstance";
import TravelStoryCard from "../../src/components/cards/TravelStoryCard";
import { ToastContainer, toast } from "react-toastify";
import { MdAdd } from "react-icons/md";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import ModalTemplate from "../../src/components/modal/ModalTemplate";
import EmptyCard from "../../src/components/cards/EmptyCard";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../src/components/cards/FilterInfoTitle";
import { getEmptyCardImage, getEmptyCardMessage } from "../../src/utils/helper";
import DeleteModalTemplate from "../../src/components/modal/DeleteModalTemplate";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [allStories, setAllStories] = useState([]);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user); //now user data which incude name,email is sotred
      }
    } catch (error) {
      if (error.response.status == 401) {
        // it means either token was not there or it was invalid or user was deleted from the database.
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllStories = async () => {
    try {
      const response = await axiosInstance.get("/get-travel-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occured while retreiving stories");
    }
  };

  //handle story edit
  const handleEdit = (data) => {
    setTimeout(() => {
      setOpenAddEditModal((prevState) => ({ ...prevState, isShown: true, type: "edit", data: data }));
    }, 0);
  };

  //handle story click
  const handleViewStory = (data) => {
    setOpenViewModal({
      isShown: true,
      data,
    });
  };

  //handle update fvourite
  const updateIsFavourite = async (data) => {
    const dataId = data._id;
    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + dataId,
        {
          isFavourite: !data.isFavourite,
        }
      );
      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");

        if (filterType === "search" && searchQuery) {
          onSearchStory(searchQuery);
        }
        else if (filterType === "date") {
          filterStoriesByDate(dateRange);
        } else {
          getAllStories();
        }

      }
    } catch (error) {
      console.log("An unexpected error occured while Updating Favourite Story");
    }
  };

  //handle delete story
  const deleteTravelStory = async (data) => {
    try {
      const deleteStroy = await axiosInstance.delete("/delete-travel-story/" + data._id);
      if (deleteStroy.data && !deleteStroy.data.error) {
        toast.error("Story Deleted Successfully")
        getAllStories();
        setOpenViewModal({
          isShown: false,
          data: null,
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      else {
        setError("An Unxpected Error occured while deleting story");
      }
    }
  }

  //handle search story
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        }
      });
      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An Unexpected error occured during fetching stories");
    }
  }

  //handle clear search
  const handleClearSearch = () => {
    setFilterType("");
    getAllStories();
  }

  //handle filter stories by date
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-story/filter", {
          params: {
            startDate,
            endDate,
          }
        });

        if (response.data && response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (e) {
      console.log("An unexpected error occured while filtering stories");
    }
  }

  //handle date range select
  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  }

  //handle resetFilter
  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType("");
    getAllStories();
  }

  //delete Account
  const deleteAccount = async () => {
    const responsePromise = axiosInstance.delete("/delete-account");

    toast.promise(responsePromise, {
      pending: "Deleting Account is in progress",
      success: "Account deleted successfully",
      error: "Failed to delete account. Please try again."
    });

    try {
      await responsePromise;
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setDeleteModal(false); // Close the modal whether success or failure occurs
      localStorage.clear();
      setTimeout(() => {
        navigate("/signup");
      }, 3000);
    }
  };


  useEffect(() => {
    getUserInfo();
    getAllStories();
    return () => { };
  }, []);

  return (
    <>
      <div className="bg-dot-white/[0.1]">
        <Navbar
          userInfo={userInfo}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchNote={onSearchStory}
          handleClearSearch={handleClearSearch}
          profileDropdown={profileDropdown}
          setProfileDropdown={setProfileDropdown}
          setDeleteModal={setDeleteModal}
        />

        <div className="container mx-auto py-10 min-h-[calc(100vh-4rem)] ">
          <FilterInfoTitle
            filterType={filterType}
            filterDates={dateRange}
            onClear={() => {
              resetFilter();
            }}
          />
          <div className="flex gap-5">
            <div className="flex-1 ml-2">
              {allStories.length > 0 ? (
                <div className="grid gap-4 grid-cols-2">
                  {allStories.map((item) => {
                    return (
                      <TravelStoryCard
                        key={item._id}
                        imageUrl={item.imageUrl}
                        title={item.title}
                        story={item.story}
                        visitedDate={item.visitedDate}
                        visitedLocation={item.visitedLocation}
                        isFavourite={item.isFavourite}
                        onView={() => handleViewStory(item)}
                        onFavouriteClick={() => updateIsFavourite(item)}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyCard
                  imgSrc={getEmptyCardImage(filterType)}
                  message={getEmptyCardMessage(filterType)}
                />
              )}
            </div>


            <div className="w-[350px]">
              <div className="bg-surface border border-[rgba(255,255,255,0.1)] shadow-[0px_4px_12px_rgba(255,255,255,0.05)] rounded-lg flex items-center justify-center px-3">
                <div className="p-1 text-on-surface">
                  <DayPicker
                    captionLayout="dropdown-buttons"
                    mode="range"
                    selected={dateRange}
                    onSelect={handleDayClick}
                    pagedNavigation
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*Add and Edit modal*/}
        <ModalTemplate isOpen={openAddEditModal.isShown}>
          <AddEditTravelStory
            type={openAddEditModal.type}
            storyInfo={openAddEditModal.data}
            onClose={() =>
              setOpenAddEditModal({
                type: "add",
                data: null,
                isShown: false,
              })
            }
            getAllStories={getAllStories}
          />
        </ModalTemplate>

        {/*Story View modal*/}
        <ModalTemplate isOpen={openViewModal.isShown}>
          <ViewTravelStory
            storyData={openViewModal.data || null}
            onClose={() => setOpenViewModal({ isShown: false, data: null })}
            onUpdateClick={() => {
              setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
              handleEdit(openViewModal.data);
            }}
            onDeleteClick={() => {
              deleteTravelStory(openViewModal.data || null)
            }}
          />
        </ModalTemplate>

        <DeleteModalTemplate deleteAccount={deleteAccount} isOpen={deleteModal} setDeleteModal={setDeleteModal}>
          Delete Modal
        </DeleteModalTemplate>

        <button
          className="w-16 h-16 flex justify-center items-center rounded-full bg-secondary text-white hover:bg-yellow-300 fixed right-10 bottom-10"
          onClick={() => {
            setOpenAddEditModal({ isShown: true, type: "add", data: null });
          }}
        >
          <MdAdd className="text-[32px]" />
        </button>

        <ToastContainer
          theme="dark" />
      </div>
    </>

  );
};

export default Home;
