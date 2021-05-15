import './App.css';
import React, { useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

function App() {
  const [connectionState, setConnectionState] = useState(false);
  const [volume, setVolume] = useState(0);
  const [hubConection, setHubConnection] = useState(null);
  const [code, setCode] = useState('');

  const connectToHub = () => {
    const connect = new HubConnectionBuilder()
      .withUrl("http://192.168.0.100:5000/volumeRock?code=" + code, {
        headers: { "HeaderAuthorization": code }
      })
      //.withAutomaticReconnect()
      .build();
    setHubConnection(connect)
    connect.onclose(connection => setConnectionState(connection.connectionStarted));
    connect.onreconnecting(connection => setConnectionState(connection.connectionStarted));
    connect.onreconnected(connection => setConnectionState(connection.connectionStarted));

    connect
      .start()
      .then(() => {
        setConnectionState(connect.connectionStarted)
        connect.on("VolumeSet", (vol) => {
          setVolume(vol)
        });
        connect.on("disconnected", () => {
          setConnectionState(false)
        });
      });
  }

  const sendSetVolume = async (e) => {
    if (hubConection) await hubConection.send("SetVolume", parseInt(e.target.value));
  };

  return (
    <div className="App">
      <div className="login">
        <div className="mark" style={{backgroundColor: (connectionState ? "lime" : "red")}}></div>
        <input className="code" value={code} onChange={(e) => setCode(e.target.value)}></input>
        <br></br>
        <button onClick={connectToHub}>Connect</button>
      </div>
      <input className="slider" type="range" value={volume} onChange={sendSetVolume}></input>
    </div>
  );
}

export default App;
