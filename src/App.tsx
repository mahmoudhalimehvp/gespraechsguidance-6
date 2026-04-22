import React from 'react';
import AnfrageSitzlift from './components/AnfrageSitzlift';
import HostFrameSidebar from './components/HostFrameSidebar';
import HostFrameTopBar from './components/HostFrameTopBar';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <HostFrameTopBar />
      <div className="app-layout__body">
        <HostFrameSidebar />
        <div className="app-layout__main">
          <AnfrageSitzlift />
        </div>
      </div>
    </div>
  );
}

export default App;
