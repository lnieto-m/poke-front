import React, { useRef, useEffect, useState, ReactElement } from 'react';
import logo from './logo.svg';
import './App.css';
import MyDropZone from './component/customDropzoen';
import { gsap } from 'gsap';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { PopupActions } from 'reactjs-popup/dist/types';
import Toggle from 'react-toggle';
import "react-toggle/style.css"
import { FaSun, FaMoon } from 'react-icons/fa';

function App() {

  const ref = useRef<PopupActions>(null);
  const openToolTip = () => {
    ref?.current?.open()
    setLoading(false);
  };

  const [currentLink, setCurrentLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      // Send request and wait
      // Then trigger the popup
      setLoading(true)
      setTimeout(openToolTip, 2000);
    }
  }

  return (
    <div className="App">
      {console.log('render', loading)}
      {loading
        ? <div className="overlay"><img src={'https://media3.giphy.com/media/IQebREsGFRXmo/200.gif'}/></div>
        : <div></div>
      }

      <Popup
        modal
        nested
        ref={ref}>
        <div> <img className="pikachu" src={currentLink} /> </div>
        <p> This image most likely belongs to your face with a 0 percent confidence.</p>
      </Popup>

      <Toggle
        className="dark-mode-toggle"
        checked={isDark}
        onChange={({ target }) => setIsDark(target.checked)}
        icons={{ checked: <FaMoon />, unchecked: <FaSun />}}
      />

      <div>
        <img className="pikachu" src={'/pikachu.png'} />
      </div>

      {/* text input goes here */}
      
      <div>
        <input className="Text-input" type="text" value={currentLink} onChange={(e) => setCurrentLink(e.target.value)}
        onKeyDown={(e) => {
          handleKeyDown(e)
        }}/>
      </div>

      <div className="dropZoneWrapper">
        <MyDropZone />
      </div>
    </div>
  );
}

export default App;
