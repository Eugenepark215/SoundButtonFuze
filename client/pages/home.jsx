import React from 'react';
import SoundButtonsHeader from '../components/sound-buttons-header';
import NavBar from '../components/nav-bar';

export default function Home(props) {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div>
        <SoundButtonsHeader />
      </div>
    </div>
  );
}
