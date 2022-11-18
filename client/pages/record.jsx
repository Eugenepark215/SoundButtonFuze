import React from 'react';
// import Redirect from '../components/redirect';
import AuthForm from '../components/auth-form';
import AppContext from '../lib/app-context';

export default class Recording extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recordingStatus: null,
      audios: '',
      name: '',
      account: null,
      submit: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.chunks = [];
    this.mediaRecorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };
  }

  start(event) {
    event.preventDefault();
    this.mediaRecorder.start(10);
    this.setState({ recordingStatus: true });
  }

  stop(event) {
    event.preventDefault();
    this.mediaRecorder.stop();
    this.setState({ recordingStatus: false });
    this.playAudio();
  }

  playAudio() {
    const blob = new Blob(this.chunks, { type: 'audio/mp3' });
    const audioURL = window.URL.createObjectURL(blob);
    const audios = audioURL;
    this.setState({ audios });
  }

  handleSubmit(event) {
    const formData = new FormData();
    const file = new File(this.chunks, 'sound.mp3', { type: 'audio/mp3' });
    const token = window.localStorage.getItem('react-context-jwt');
    formData.append('fileUrl', file);
    formData.append('soundName', this.state.name);
    formData.append('userId', this.context.user.userId);
    const req = {
      headers: {
        'X-Access-Token': token
      },
      method: 'POST',
      body: formData
    };
    fetch('/api/sounds', req);
    this.setState({ submit: true });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  modal(event) {
    if (this.state.account) {
      return this.setState({ account: null });
    }
    this.setState({ account: true });
  }

  handleModalClose(event) {
    this.setState({ account: null });
  }

  render() {
    // if (this.state.submit === true) {
    //   return <Redirect to="" />;
    // }
    const buttonType = this.context.user ? '' : 'submit';
    return (
      <div>
        <div>
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
                  <i onClick={event => this.modal(event)} className="fa-solid fa-bookmark white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div />
        <div className='flex-direction-column'>
          <h2 className='record-header text-align-center lucida-sans font-gray'>Record Your Sound</h2>
          <div className='align-center display-flex flex-direction-column'>
            {!this.state.recordingStatus && <button onClick={event => this.start(event)} className='single-button drop-shadow margin-top border-radius-50 border-none cyan-background'>
              <i className= 'icon-recording fa-solid fa-microphone white' />
            </button>}
            {this.state.recordingStatus && <button onClick={event => this.stop(event)} className='single-button drop-shadow margin-top border-radius-50 border-none cyan-background'>
              <i className='icon-recording fa-solid fa-square red' />
            </button>}
          </div>
          <div className='audio-player-column justify-content-center display-flex'>
            <audio ref={a => {
              this.audio = a;
            }} />
            {this.state.audios !== '' && <audio className='audio-player' src={this.state.audios} controls />}
          </div>
          {this.state.audios && <form onSubmit={this.handleSubmit} className='justify-content-center display-flex flex-direction-column'>
            <div className='record-input-container lucida-sans font-gray display-flex flex-direction-column'>
              <div className='display-flex flex-direction-column'>
                <label className='record-input-label lucida-sans gray' >Sound Name</label>
                <input required className='record-input lucida-sans' type='text' placeholder='New Name' value={this.state.name}
                onChange={this.handleNameChange} />
              </div>
            </div>
            <div className='submit-button-container'>
              <button type={buttonType} className='submit-button lucida-sans white cyan-background'>Submit</button>
            </div>
          </form>}
          {this.state.account && <AuthForm onClose={event => this.handleModalClose(event)} />}
        </div>
      </div>
    );
  }
}

Recording.contextType = AppContext;
