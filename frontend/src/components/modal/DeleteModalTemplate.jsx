import React, { useEffect } from "react";
import { GoAlert } from "react-icons/go";

const DeleteModalTemplate = ({deleteAccount,isOpen,setDeleteModal}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);
  return (
    <div
      className={`${
        isOpen ? "visible" : "invisible"
      } z-[999] top-0 left-0 w-full h-full bg-black/10 flex items-center justify-center fixed pointer-events-auto`}
    >
      <div className="w-[30vh] bg-surface rounded-xl p-4 md:w-[40%]">
        <div className="flex justify-around items-center">
            <GoAlert className="text-yellow-500 text-8xl"/>
            <div className="flex flex-col items-start w-9/12 justify-self-auto">
                <h3 className="text-on-surface text-md font-medium">Are you sure you want to delete your account?</h3>
                <p className="text-on-surface/80 text-xs mt-1 font-normal">Deleting your account will permanently erase all your travel stories and saved preferences. This action cannot be undone. If you're sure, please proceed.</p>
                <div className="flex w-full items-center justify-around gap-10 py-5">
                    <button className="bg-red-500 hover:bg-white text-white hover:text-red-500 h-12 w-40 rounded-md"
                    onClick={deleteAccount}>
                        Delete
                    </button>
                    <button className="bg-white text-yellow-500 hover:text-white hover:bg-yellow-500 rounded-md h-12 w-40"
                    onClick={()=>setDeleteModal(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
        
      </div>
    </div>
  );
};

export default DeleteModalTemplate;
