import React from 'react';
import NavBar from '../components/nav-bar';

export default class Hi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sounds: [],
      current: null
    };
  }

  componentDidMount() {
    fetch(`api/sounds/${this.props.soundId}`)
      .then(res => res.json())
      .then(sound => {
        this.setState({ current: sound });
      });
  }

  render() {
    if (!this.state.current) return null;
    const color = this.props.colors[(this.props.soundId - 1) % this.props.colors.length];
    return (
      <div>
        <div>
          <NavBar />
        </div>
        <div className='flex-direction-column'>
          <h2 id='single-button-header' className='margin-top lucida-sans font-gray text-align-center'>{this.state.current.soundName}</h2>
          <div className='align-center display-flex flex-direction-column'>
            <button id='single-button' className={`drop-shadow margin-top w-h175px border-radius-50 border-none ${color}`} />
            <button id='add-to-bookmarks' className='drop-shadow margin-top border-radius-5px white lucida-sans w200px-h40px cyan-background border-none'>Add to Bookmarks</button>
          </div>
        </div>
      </div>
    );
  }
}
