import React, { useEffect, useState } from "react";

function CloudinaryUploadButton() {
  const showWidget = () => {
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "deruncuzv",
        uploadPreset: "jedjicbi",
        cropping: true,
        croppingAspectRatio: 1,
        multiple: false,
        maxFiles: 1,
        maxImageFileSize: 10000000,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log(result.info.url);
        }
      }
    );
    widget.open();
  };

  return (
    <div>
      <button onClick={() => showWidget()}> Upload Image </button>
    </div>
  );
}

export default CloudinaryUploadButton;
