import React, { useState } from "react";

const CustomFileInput = ({ onChange }) => {
  const [filename, setFilename] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFilename(file.name);
    onChange(file);
  };

  return (
    <label className="custom-file-input">
      <span className="custom-file-input-label">
        {filename || "Choissisez un fichier"}
      </span>
      <input
        type="file"
        accept="image/*"
        className="file-input"
        onChange={handleFileChange}
      />
      <span className="custom-file-input-icon">🖼️</span>{" "}
    </label>
  );
};

export default CustomFileInput;
