import React from 'react';
import Chart from './chart.js'; // Update the path accordingly

const DashboardCard = (props) => {
  // Use the Chart component with the desired title and data source
  return (
    <Chart
      title={props.title}
      dataSource={props.dataSource}
    />
  );
};

export default DashboardCard;
