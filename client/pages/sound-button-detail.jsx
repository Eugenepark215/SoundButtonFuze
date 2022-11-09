import React from 'react';
import NavBar from '../components/nav-bar';

export default class SoundButtonDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sounds: [],
      current: null
      // bookmarked: future feature
    };
  }

  render() {
    return (
      <div>
        <div>
          <NavBar />
        </div>
        <div>
          <h2>{this.state.current}</h2>
          <div>
            <button className='w-h175px border-radius-50 border-none'/>
            <button className='font-gray lucida-sans w200px-h40px cyan-background border-none'>Add to Bookmarks</button>
          </div>
        </div>
      </div>
    );
  }
}
