import React from 'react';
import Home from './pages/home';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sounds: []
    };
  }

  componentDidMount() {
    const req = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch('/api/sounds', req)
      .then(res => res.json())
      .then(sound => {
        this.setState({ sounds: sound });
      });
  }

  render() {
    const copy = this.state.sounds.slice();
    return (
      <div>
        <Home />
        <div className='display-flex flex-wrap'>
          {copy.map(sound => {
            const slice = sound.fileUrl.slice(22);
            const color = (
              sound.soundId === 0 || (sound.soundId - 7) % 7 === 0
                ? 'red-background'
                : sound.soundId === 1 || (sound.soundId - 7) % 7 === 1
                  ? 'blue-background'
                  : sound.soundId === 2 || (sound.soundId - 7) % 7 === 2
                    ? 'purple-background'
                    : sound.soundId === 3 || (sound.soundId - 7) % 7 === 3
                      ? 'green-background'
                      : sound.soundId === 4 || (sound.soundId - 7) % 7 === 4
                        ? 'yellow-background'
                        : sound.soundId === 5 || (sound.soundId - 7) % 7 === 5
                          ? 'orange-background'
                          : sound.soundId === 6 || (sound.soundId - 7) % 7 === 6
                            ? 'pink-background'
                            : 'black-background'
            );
            return (
              <div className='column-third margin-top' key={sound.soundId}>
                <div className='display-flex align-center justify-content-center flex-direction-column'>
                  <button className={`drop-shadow border-radius border-none justify-item-center ${color}`}/>
                  <a className='text-align-center margin-top'>{slice}</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
