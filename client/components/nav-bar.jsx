import React from 'react';

export default function NavBar(props) {
  return (
    <div className="container drop-shadow">
      <div className="row cyan-background">
        <div className="nav-header-column column-half">
          <a href='#' className='text-decoration-none'>
            <h2 className='nav-bar-header white lucida-sans'>SoundButtonFuze</h2>
          </a>
        </div>
        <div className="icon-container row align-center justify-content-center">
          <div className="column-third text-align-center">
            <a href='#'>
              <i className="fa-solid fa-house white" />
            </a>
          </div>
          <div className="column-third text-align-center">
            <a href='#record'>
              <i className="fa-solid fa-microphone white" />
            </a>
          </div>
          <div className="column-third text-align-center">
            <i className="fa-solid fa-bookmark white" />
          </div>
        </div>
      </div>
    </div>
  );
}
