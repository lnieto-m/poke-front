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
import { useMediaQuery } from 'react-responsive';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Linkedin, Github, Sun } from 'react-bootstrap-icons';
 
function App() {

  const ref = useRef<PopupActions>(null);
  const openToolTip = () => {
    ref?.current?.open()
    setLoading(false);
  };


  // https://www.pokepedia.fr/images/thumb/f/fa/Latios-RS.png/250px-Latios-RS.png
  const [currentLink, setCurrentLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [serverResponse, setResponse] = useState('');

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]); 

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      requestServer();
    }
  }

  const onClick = (e: React.MouseEventHandler<HTMLButtonElement>) => {
    requestServer();
  }

  const requestServer = async () => {
    if (currentLink == '') {
      return;
    }
    setLoading(true)
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ link: currentLink })
    }

    // TODO: Change l'url ici pour tes propres request
    const response = await fetch("https://pokedex-preproc.herokuapp.com/", requestOptions);
    const data = await response.json();
    console.log(data);
    setResponse(data?.response);
    openToolTip();
  }

  const systemPreferDark = useMediaQuery(
    {
      query: "(prefers-color-scheme: dark)"
    },
    undefined,
    (isSystemDark: boolean) => setIsDark(isSystemDark)
  );

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
        className="response-popup"
        ref={ref}>
        <div id="response-popup-content">
          <img className="pikachu" src={currentLink} />
          <p style={{ margin: '1em' }}> {serverResponse} </p>
        </div>
      </Popup>
      <div className="content">
        <div className="header">
          <div>
            <img className="pikachu" src={'/poke-front/pikachu.png'} />
          </div>
          <div className="toggle-position">
            <Toggle
              className="toggle-style"
              checked={isDark}
              onChange={({ target }) => setIsDark(target.checked)}
              icons={{ checked: <FaMoon />, unchecked: <Sun color="white" />}}
            />
          </div>
        </div>

        {/* text input goes here */}
        
        <div style={{ margin: "0.5em"}}>
          <input className="Text-input" type="text" value={currentLink} placeholder="Your link here..." onChange={(e) => setCurrentLink(e.target.value)}
          onKeyDown={(e) => {
            handleKeyDown(e)
          }}/>
          <Button variant="outline-primary" disabled={loading} onClick={(e) => { if (!loading) { requestServer(); }}}> {loading ? 'Loading...' : 'Go' } </Button>{' '}
        </div>
      </div>

      <footer className="App-footer">
        <div className="links">
          <a href="#"><Linkedin /></a>
          <a href="#"><Github /></a>
        </div>
        <p style={{ paddingTop: '0.6em' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        <p className="copyright">©2021 - Morbi tincidunt magna leo</p>
      </footer>
    </div>
  );
}

export default App;
