import React from "react";

const VideoPlayer: React.FC = () => {
  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      <video controls width="100%">
        <source
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
