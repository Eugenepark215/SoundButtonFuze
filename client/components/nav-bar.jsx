import React from 'react';

export default function NavBar(props) {
  return (
    <div className="container drop-shadow">
      <div className="row cyan-background">
        <div className="column-half padding-left">
          <h2 className='white lucida-sans text-align-center'>SoundButtonFuze</h2>
        </div>
        <div className="column-half row align-center justify-content-center padding-left padding-right">
          <div className="column-third text-align-center">
            <i className="fa-solid fa-house white" />
          </div>
          <div className="column-third text-align-center">
            <i className="fa-solid fa-microphone white" />
          </div>
          <div className="column-third text-align-center">
            <i className="fa-solid fa-bookmark white" />
          </div>
        </div>
      </div>
    </div>
  );
}
