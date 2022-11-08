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
            if (sound.soundId === 0 || (sound.soundId - 7) % 7 === 0) {
              const color = 'red-background';
              return (
                <div className='column-third margin-top' key={sound.soundId}>
                  <div className='display-flex align-center justify-content-center flex-direction-column'>
                    <button className={`drop-shadow border-radius border-none justify-item-center ${color}`} />
                    <a className='text-align-center margin-top'>{slice}</a>
                  </div>
                </div>
              );
            } else if (sound.soundId === 1 || (sound.soundId - 7) % 7 === 1) {
              const color = 'blue-background';
              return (
                <div className='column-third margin-top' key={sound.soundId}>
                  <div className='display-flex align-center justify-content-center flex-direction-column'>
                    <button className={`drop-shadow border-radius border-none justify-item-center ${color}`} />
                    <a className='text-align-center margin-top'>{slice}</a>
                  </div>
                </div>
              );
            } else if (sound.soundId === 2 || (sound.soundId - 7) % 7 === 2) {
              const color = 'purple-background';
              return (
                <div className='column-third margin-top' key={sound.soundId}>
                  <div className='display-flex align-center justify-content-center flex-direction-column'>
                    <button className={`drop-shadow border-radius border-none justify-item-center ${color}`} />
                    <a className='text-align-center margin-top'>{slice}</a>
                  </div>
                </div>
              );
            } else if (sound.soundId === 3 || (sound.soundId - 7) % 7 === 3) {
              const color = 'green-background';
              return (
                <div className='column-third margin-top' key={sound.soundId}>
                  <div className='display-flex align-center justify-content-center flex-direction-column'>
                    <button className={`drop-shadow border-radius border-none justify-item-center ${color}`} />
                    <a className='text-align-center margin-top'>{slice}</a>
                  </div>
                </div>
              );
            } else if (sound.soundId === 4 || (sound.soundId - 7) % 7 === 4) {
              const color = 'yellow-background';
              return (
                <div className='column-third margin-top' key={sound.soundId}>
                  <div className='display-flex align-center justify-content-center flex-direction-column'>
                    <button className={`drop-shadow border-radius border-none justify-item-center ${color}`} />
                    <a className='text-align-center margin-top'>{slice}</a>
                  </div>
                </div>
              );
            } else if (sound.soundId === 5 || (sound.soundId - 7) % 7 === 5) {
              const color = 'orange-background';
              return (
                <div className='column-third margin-top' key={sound.soundId}>
                  <div className='display-flex align-center justify-content-center flex-direction-column'>
                    <button className={`drop-shadow border-radius border-none justify-item-center ${color}`} />
                    <a className='text-align-center margin-top'>{slice}</a>
                  </div>
                </div>
              );
            } else if (sound.soundId === 6 || (sound.soundId - 7) % 7 === 6) {
              const color = 'pink-background';
              return (
                <div className='column-third margin-top' key={sound.soundId}>
                  <div className='display-flex align-center justify-content-center flex-direction-column'>
                    <button className={`drop-shadow border-radius border-none justify-item-center ${color}`} />
                    <a className='text-align-center margin-top'>{slice}</a>
                  </div>
                </div>
              );
            } else {
              const color = 'black-background';
              return (
                <div className='column-third margin-top' key={sound.soundId}>
                  <div className='display-flex align-center justify-content-center flex-direction-column'>
                    <button className={`drop-shadow border-radius border-none justify-item-center ${color}`} />
                    <a className='text-align-center margin-top'>{slice}</a>
                  </div>
                </div>
              );
            }
            // return (
            //   <div className='column-third margin-top' key={sound.soundId}>
            //     <div className='display-flex align-center justify-content-center flex-direction-column'>
            //       <button className={`drop-shadow border-radius border-none justify-item-center ${color}`}/>
            //       <a className='text-align-center margin-top'>{slice}</a>
            //     </div>
            //   </div>
            // );
          })}
        </div>
      </div>
    );
  }
}
