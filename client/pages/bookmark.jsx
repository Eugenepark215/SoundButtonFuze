import React from 'react';
import LoadSpinner from '../components/load-spinner';
import ConnectionError from '../components/connection-error';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class Bookmark extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sounds: [],
      error: false,
      loading: true,
      current: null,
      home: false,
      signOut: null,
      medley: []
    };
  }

  componentDidMount() {
    const token = window.localStorage.getItem('react-context-jwt');
    const req = {
      headers: {
        'X-Access-Token': token
      }
    };
    fetch('/api/bookmarks', req)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          this.setState({ error: true });
        }
      })
      .then(sound => {
        const medleyArray = [];
        for (let i = 0; i < sound.length; i++) {
          const sounds = new Audio();
          sounds.src = sound[i].fileUrl;
          medleyArray.push(sounds);
          this.setState({ sounds: sound, loading: false, medley: medleyArray });
        }
      });
  }

  audioPlay(event) {
    const sound = new Audio();
    if (this.state.current) {
      this.state.current.pause();
    }
    const { medley } = this.state;
    if (medley) {
      for (let i = 0; i < medley.length; i++) {
        medley[i].pause();
        medley[i].currentTime = 0;
      }
    }
    for (let i = 0; i < this.state.sounds.length; i++) {
      if (parseInt(event.target.id) === i) {
        sound.src = this.state.sounds[i].fileUrl;
        sound.play();
        this.setState({ current: sound });
      }
    }
  }

  returnToHome(event) {
    this.setState({ home: true });
  }

  signOut(event) {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({ signOut: true });
  }

  async playMedley(event) {
    const timer = millisecond => new Promise(resolve => setTimeout(resolve, millisecond));
    if (this.state.current) {
      this.state.current.pause();
    }
    for (let i = 0; i < this.state.medley.length; i++) {
      if (this.state.current) {
        break;
      }
      this.state.medley[i].play();
      await timer(500);
    }
    this.setState({ current: null });
  }

  render() {
    if (this.state.error) {
      return <ConnectionError />;
    }
    if (this.state.home || !this.context.user) {
      return <Redirect to ='#'/>;
    }
    return (
      <div>
        <div>
          <div className="container drop-shadow">
            <div className="row cyan-background">
              <div className="nav-header-column column-half">
                <a onClick={event => this.audioPlay(event)} href='#' className='text-decoration-none'>
                  <h2 className='nav-bar-header white lucida-sans'>SoundButtonFuze</h2>
                </a>
              </div>
              <div className="icon-container row align-center justify-content-center">
                <div className="column-third text-align-center">
                  <a onClick={event => this.audioPlay(event)} href='#'>
                    <i className="fa-solid fa-house white" />
                  </a>
                </div>
                <div className="column-third text-align-center">
                  <a onClick={event => this.audioPlay(event)} href='#record'>
                    <i className="fa-solid fa-microphone white" />
                  </a>
                </div>
                <div className="column-third text-align-center">
                  <i onClick={event => this.audioPlay(event)} className="fa-solid fa-bookmark white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className='text-align-center lucida-sans font-gray'>Bookmarks</h2>
        </div>
        <div className='button-container display-flex flex-wrap lucida-sans'>
          {this.state.sounds.map((sound, index) => {
            const color = this.props.colors[sound.soundId % this.props.colors.length];
            return (
              <div className='button-column' key={sound.soundId}>
                <div className='display-flex align-center justify-content-center flex-direction-column'>
                  <button id={index} onClick={event => this.audioPlay(event)} className={`sound-button drop-shadow border-radius-50 border-none justify-item-center ${color}`} />
                  <a href={`#bookmark?soundId=${sound.soundId}`} onClick={event => this.audioPlay(event)} className='font-gray lucida-sans text-align-center margin-top'>{sound.soundName}</a>
                </div>
              </div>
            );
          })}
        </div>
        {this.state.sounds.length !== 0 && <div className='display-flex align-center justify-content-center'>
          <button onClick={event => this.playMedley(event)} className='play-medley drop-shadow border-radius-5px white lucida-sans cyan-background border-none'>Play Medley</button>
        </div>}
        {this.state.sounds.length === 0 && <div className='bookmark-text-holder display-flex justify-content-center lucida-sans'>
          <div>
            <h1 className='font-gray text-align-center'>No sounds bookmarked!</h1>
            <div className='display-flex justify-content-center'>
              <button onClick={event => this.returnToHome(event)} className='return-to-home drop-shadow border-radius-5px white lucida-sans cyan-background border-none'>Return to Home</button>
            </div>
          </div>
        </div>
        }
        {this.state.loading && <LoadSpinner />}
      </div>
    );
  }
}

Bookmark.contextType = AppContext;
