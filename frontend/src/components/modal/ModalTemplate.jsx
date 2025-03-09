import React, { useEffect } from "react";

const ModalTemplate = ({ children, isOpen }) => {
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
      } z-[999] top-0 left-0 w-full h-full bg-black/50  fixed pointer-events-auto`}
    >
      <div className="w-[80vw] h-[80vh] md:w-[40%] mx-auto mt-16 bg-surface rounded-xl  overflow-y-scroll scrollbar p-4">
        {children}
      </div>
    </div>
  );
};

export default ModalTemplate;
