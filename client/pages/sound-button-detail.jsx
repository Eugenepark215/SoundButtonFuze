import React from 'react';
import AuthForm from '../components/auth-form';
import AppContext from '../lib/app-context';
import ConnectionError from '../components/connection-error';
import LoadSpinner from '../components/load-spinner';
// import SignOut from '../components/sign-out';

export default class SoundButtonDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      playing: null,
      modal: null,
      error: false,
      loading: true,
      bookmark: null
    };
  }

  componentDidMount() {
    const token = window.localStorage.getItem('react-context-jwt');
    const req = {
      headers: {
        'X-Access-Token': token
      }
    };
    fetch(`api/sounds/${this.props.soundId}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          this.setState({ error: true });
        }
      })
      .then(sound => {
        fetch(`api/bookmarks/${this.props.soundId}`, req)
          .then(res => res.json())
          .then(data => {
            if (data.length !== 0) {
              this.setState({ bookmark: true, current: sound });
            } else {
              this.setState({ current: sound });
            }
          });
      });
  }

  addToBookmark(event) {
    const token = window.localStorage.getItem('react-context-jwt');
    const formData = new FormData();
    formData.append('userId', this.context.user.userId);
    formData.append('soundId', Number(this.props.soundId));
    const req = {
      headers: {
        'X-Access-Token': token
      },
      method: 'POST',
      body: formData
    };
    fetch('api/bookmarks', req)
      .then(res => {
        if (!res.ok) {
          this.setState({ error: true });
        }
        this.setState({ bookmark: true });
      });
  }

  removeFromBookmark(event) {
    const token = window.localStorage.getItem('react-context-jwt');
    const req = {
      headers: {
        'X-Access-Token': token
      },
      method: 'DELETE'
    };
    fetch(`api/bookmarks/${this.props.soundId}`, req)
      .then(res => {
        if (!res.ok) {
          this.setState({ error: true });
        }
        this.setState({ bookmark: false });
      });
  }

  audioPlay(event) {
    const sound = new Audio();
    if (this.state.playing && event.target.tagName === 'BUTTON') {
      this.state.playing.pause();
      this.setState({ playing: null });
    }
    sound.src = this.state.current.fileUrl;
    sound.play();
    this.setState({ playing: sound });
  }

  stop(event) {
    if (this.state.playing) {
      this.state.playing.pause();
    }
  }

  modal(event) {
    if (this.state.modal) {
      this.stop(event);
      return this.setState({ modal: null });
    }
    this.stop(event);
    this.setState({ modal: true });
  }

  handleModalClose(event) {
    this.setState({ modal: null });
  }

  render() {
    if (!this.state.current) return <LoadSpinner />;
    if (this.state.error === true) {
      return <ConnectionError />;
    }
    const color = this.props.colors[(this.props.soundId) % this.props.colors.length];
    return (
      <div>
        <div>
          <div className="container drop-shadow">
            <div className="row cyan-background">
              <div className="nav-header-column column-half">
                <a href='#' className='text-decoration-none'>
                  <h2 onClick={event => this.stop(event)} className='nav-bar-header white lucida-sans'>SoundButtonFuze</h2>
                </a>
              </div>
              <div className="icon-container row align-center justify-content-center">
                <div className="column-third text-align-center">
                  <a href='#'>
                    <i onClick={event => this.stop(event)} className="fa-solid fa-house white" />
                  </a>
                </div>
                <div className="column-third text-align-center">
                  {this.context.user && <a onClick={event => this.stop(event)} href='#record'>
                    <i className="fa-solid fa-microphone white" />
                    </a>}
                  {!this.context.user && <a onClick={event => this.modal(event)}>
                    <i className="fa-solid fa-microphone white" />
                    </a>}
                </div>
                <div className="column-third text-align-center">
                  {!this.context.user && <i onClick={event => this.modal(event)} className="fa-solid fa-bookmark white" />}
                  {this.context.user && <a onClick={event => this.stop(event)} href='#bookmarks'>
                    <i className="fa-solid fa-bookmark white" />
                    </a>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex-direction-column'>
          <h2 className='single-button-header lucida-sans font-gray text-align-center'>{this.state.current.soundName}</h2>
          <div className='align-center display-flex flex-direction-column'>
            <button onClick={event => this.audioPlay(event)} className={`single-button drop-shadow margin-top border-radius-50 border-none ${color}`} />
            {!this.state.bookmark && <button onClick={event => this.addToBookmark(event)} className='add-to-bookmarks drop-shadow border-radius-5px white lucida-sans cyan-background border-none'>Add to Bookmarks</button>}
            {!this.context.user && <button onClick={event => this.modal(event)} className='add-to-bookmarks drop-shadow border-radius-5px white lucida-sans cyan-background border-none'>Add to Bookmarks</button>}
            {this.state.bookmark && this.context.user && <button className='remove-from-bookmarks drop-shadow border-radius-5px white lucida-sans cyan-background border-none' onClick={event => this.removeFromBookmark(event)}>Remove</button>}
          </div>
        </div>
        {this.state.modal && <AuthForm onClose={event => this.handleModalClose(event)} />}
        {/* {this.context.user && <SignOut/>} */}
      </div>
    );
  }
}
SoundButtonDetail.contextType = AppContext;
