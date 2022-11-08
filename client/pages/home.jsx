import React from 'react';
import SoundButtons from '../components/sound-buttons';
import NavBar from '../components/nav-bar';

export default function Home(props) {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div>
        <SoundButtons />
      </div>
    </div>
  );
}
