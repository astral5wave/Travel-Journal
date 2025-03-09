import React from "react";
import LOGO from "/LOGO.jpg";
import ProfileInfo from "./cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "./input/SearchBar";


const Navbar = ({ userInfo,searchQuery,setSearchQuery,onSearchNote,handleClearSearch,profileDropdown,setProfileDropdown,setDeleteModal}) => {
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch=()=>{
    if(searchQuery){
      onSearchNote(searchQuery);
    }
  }

  const onClearSearch=()=>{
    handleClearSearch();
    setSearchQuery("");
  }

  return (
    <div className="bg-surface flex items-center justify-between px-4 py-1 h-[4.2rem] drop-shadow-sm sticky top-0 z-10">
      <img src={LOGO} alt="Travel Blog Logo" className="h-14 rounded-md" />
      {userInfo && 
      (<>
        <SearchBar
          value={searchQuery} 
          onChange={({target})=>{
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} profileDropdown={profileDropdown} setProfileDropdown={setProfileDropdown} setDeleteModal={setDeleteModal}/>
      </>)}
    </div>
  );
}

export default Navbar;
