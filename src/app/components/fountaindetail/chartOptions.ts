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
  
  export const defaultChartOptions: ChartOptions = {
    series: [] as ApexAxisChartSeries,
    chart: {
      height: 350,
      type: 'line'
    } as ApexChart,
    xaxis: {
      categories: []
    } as ApexXAxis,
    dataLabels: {
      enabled: true
    } as ApexDataLabels,
    stroke: {
      curve: 'smooth'
    } as ApexStroke,
    title: {
      text: 'Evolução dos niveis Radão nesta fonte',
      align: 'left'
    } as ApexTitleSubtitle,
    tooltip: {
      enabled: true
    } as ApexTooltip
  };
  