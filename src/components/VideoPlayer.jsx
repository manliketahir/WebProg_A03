import React from 'react';

export default function VideoPlayer() {
  // If you add a local video file at src/assets/sample.mp4 CRA will bundle it for dev
  const localVideo = '/assets/sample.mp4'; // place sample.mp4 into public/assets or src/assets and adjust
  const youtubeId = 'dQw4w9WgXcQ'; // sample id — replace with your chosen video

  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr', gap: '1rem'}}>
      <div>
        <h4>Featured Video</h4>
        <div style={{position:'relative', paddingBottom:'56.25%', height:0}}>
          <iframe
            title="YouTube"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>

    </div>
  );
}