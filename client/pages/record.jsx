import React from 'react';
import NavBar from '../components/nav-bar';
import Home from './home';

const colors = [
  'red-background',
  'blue-background',
  'purple-background',
  'green-background',
  'yellow-background',
  'orange-background',
  'pink-background',
  'black-background'];

export default class Recording extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recordingStatus: null,
      audios: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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
    formData.append('fileUrl', file);
    const req = {
      method: 'POST',
      body: formData
    };
    fetch('/api/sounds', req);
    this.setState({ audios: false });
  }

  render() {
    if (this.state.audios === false) {
      return <Home colors = {colors} />;
    }
    return (
      <div>
        <div>
          <NavBar />
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
          {this.state.audios && <button onClick={event => this.handleSubmit(event)}>Submit</button>}
        </div>
      </div>
    );
  }
}
