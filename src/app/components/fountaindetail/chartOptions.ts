import {
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexStroke,
    ApexTitleSubtitle,
    ApexTooltip
  } from 'ng-apexcharts';
  
  export interface ChartOptions {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
    tooltip: ApexTooltip;
  }
  
  export const defaultChartOptions: Partial<ChartOptions> = {
    series: [], // default to an empty array so it's never undefined
    chart: {
      height: 350,
      type: 'line'
    },
    xaxis: {
      categories: []
    },
    dataLabels: {
      enabled: true
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Radon Concentration Evolution',
      align: 'left'
    },
    tooltip: {
      enabled: true
    }
  };
  