import React from 'react';

import SideBar from '../components/Sidebar'
import Chat from '../components/Chat'

function Home() {
  return (
    <div className="home">
        <div className="container">
            <SideBar />
            <Chat />
        </div>
    </div>
  )
}

export default Home