import React from 'react'
import { getInitials } from '../../utils/helper'
const ProfileInfo = ({ userInfo, onLogout, profileDropdown, setProfileDropdown,setDeleteModal }) => {
  return (
    <div className='flex items-center gap-3'>
      <button
        onClick={() => setProfileDropdown(!profileDropdown)}
        className='flex items-center justify-center h-12 w-12 bg-primary rounded-full font-medium text-xl text-white border-white border-2'>
        {
          getInitials(userInfo ? userInfo.fullName : "")
        }
      </button>
      {profileDropdown && <ProfileDropdownMenu onLogout={onLogout} setDeleteModal={setDeleteModal}/>}
        <p className='text-sm text-on-surface underline-offset-2 underline font-medium'>{userInfo.fullName || ""}</p>
    </div>
  )
}
const ProfileDropdownMenu = ({onLogout,setDeleteModal}) => {
  return (
    <div className='min-w-[175px] absolute top-[3.8rem] right-12 rounded-md  flex flex-col items-center justify-evenly bg-zinc-700 text-2'>
      <button className=' text-secondary hover:text-white my-2 w-[80%] bg-white hover:bg-secondary py-1 rounded ' onClick={onLogout}>Logout</button>
      <hr></hr>
      <button className='bg-red-500 w-[80%] text-white rounded mb-2 hover:bg-white py-1 hover:text-red-500' onClick={()=>setDeleteModal(true)}>Delete Account</button>
    </div>
  )
}

export default ProfileInfo