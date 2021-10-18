import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { PopupActions } from 'reactjs-popup/dist/types';
import Toggle from 'react-toggle';
import "react-toggle/style.css"
import { FaMoon } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Briefcase, Globe, Sun } from 'react-bootstrap-icons';
 
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

  const requestServer = async () => {
    if (currentLink === '') {
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
        ? <div className="overlay"><img alt="Loading Mew" src={'https://media3.giphy.com/media/IQebREsGFRXmo/200.gif'}/></div>
        : <div></div>
      }

      <Popup
        modal
        nested
        className="response-popup"
        ref={ref}>
        <div id="response-popup-content">
          <img alt="Ton pokemon fourni" className="pikachu" src={currentLink} />
          <p style={{ margin: '1em' }}> {serverResponse} </p>
        </div>
      </Popup>
      <div className="content">
        <div className="header">
          <div>
            <img alt="Detective Pikachu" className="pikachu" src={'/poke-front/pikachu.png'} />
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
        <div className="tldr">
          <article>
            <h2>Comment ça marche ? :</h2>
            <p>
              Copier l'URL de l'image d'un Pokémon de la 1re génération (Pokémon n°1 - Bulbizarre à 151 - Mew) dans le champ de recherche et cliquer sur Go.<br />
              L'image doit être "propre", c'est-à-dire qu'elle ne doit pas contenir trop de bruit visuel et que le Pokémon doit être seul et dans sa couleur d'origine.<br />
              Ensuite, un serveur en Python va récupérer l'image partagée, la redimensionner et la transformer en tableau. Le réseau de neurones va identifier les caractéristiques propres à ce Pokémon et les comparer à celles apprises pendant son entraînement pour donner en retour le nom d'un Pokémon et la probabilité que ce soit lui en pourcentage.<br />
            </p>
          </article>
          <article>
            <h2>Mise en garde :</h2>
            <p>
              - Le set d'images a été construit à partir de plusieurs sets différents, qui ont été nettoyés pour récupérer les images les plus fidèles.<br />
              - Il s'agit d'un projet de démo, c'est pourquoi il ne contient que la 1re génération de Pokémon.<br />
              - La probabilité de reconnaître un Pokémon dépends du nombre d'images différentes le représentant dans le set d'entraînement.<br />
            </p>
          </article>
          <article>
            <h2>Ce qui fait tourner le Pokédex :</h2>
            <p>
            - Python, TensorFlow et Keras (Librairies), Docker (Containers : 1 pour le réseau de neurones, 1 pour le serveur), GitHub, Heroku (hébergement).
            </p>
          </article>
        </div>

      </div>

      <footer className="App-footer">
        <div className="links">
          <a href="https://www.malt.fr/profile/oxpure"><Briefcase /></a>
          <a href="https://oxpure.tech/"><Globe /></a>
        </div>
        <p style={{ paddingTop: '0.6em' }}>Pokémon c'était pas mieux avant</p>
        <p className="copyright">©2021 - Frontpage made by <a className="linkMaker" href="https://github.com/lnieto-m"> Luis Nieto Munoz </a></p>
      </footer>
    </div>
  );
}

export default App;
