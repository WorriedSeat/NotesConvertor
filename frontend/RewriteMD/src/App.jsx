import './App.css'
import React from 'react';
import CmpFooter from './components/Footer/CmpFooter';
import CmpContent from './components/Content/CmpContent';
import CmpSider from './components/Sider/CmpSider';

function App() {
  return (
    <div className="layout">
      <CmpSider/>
      <CmpContent/>
      <CmpFooter/>
    </div>
  )
}

export default App
