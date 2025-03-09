import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="bg-white/10 border border-white/20 rounded-lg flex items-center px-5 mb-4">
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        type={isShowPassword ? "text" : "password"}
        className="bg-transparent w-full outline-none text-sm rounded-lg text-on-surface placeholder:text-white/50 py-3 mr-3"
      />
      {isShowPassword ? (
        <FaRegEye
          onClick={() => toggleShowPassword()}
          size={22}
          className="text-primary cursor-pointer"
        />
      ) : (
        <FaRegEyeSlash
          onClick={() => toggleShowPassword()}
          size={22}
          className="text-primary/50  cursor-pointer"
        />
      )}
    </div>
  );
};

export default PasswordInput;
