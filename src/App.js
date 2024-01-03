import React from 'react';
import './App.scss';
import DashboardCard from './DashboardCard';
import data from './data.json'

function App() {
  return (
    <div className="App">
      <DashboardCard title="Chart 1" dataSource={data} />
      <DashboardCard title="Chart 2" dataSource={data} />
      <DashboardCard title="Chart 3" dataSource={data}/>
      <DashboardCard title="Chart 4" dataSource={data}/>
      
    </div>
  );
}

export default App;
