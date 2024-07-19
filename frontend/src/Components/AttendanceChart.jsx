import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import ReactDOM from 'react-dom';

const AttendanceChart = ({ userDetails }) => {
    let present = Number(userDetails?.attendancePercentage);
    console.log("userDetails", userDetails);

    const [series, setSeries] = useState([present, 100 - present]);
    const [options, setOptions] = useState({
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: ['Present', 'Absent',],
        colors: ['#37B7C3', '#FF6969'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                },
            }
        }],
        
    });

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="pie" width={380} />
            </div>
            <div id="html-dist"></div>
        </div>
    );
};

export default AttendanceChart;
