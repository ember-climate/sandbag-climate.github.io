
var server_url = "http://52.49.23.223:7474/db/data/transaction/commit"
var countries = [];
var sectors = [];
var periods = []; 
var lineChartData;
var lineChart;
var sectorsLoaded = false;
var countriesLoaded = false;
var currentChartMode = "line";

var line_chart_created = false;

getCountries(server_url, onGetCountries);
getSectors(server_url, onGetSectors);
getPeriods(server_url, onGetPeriods);

$('#multi_line_chart_button').click(changeToMultiLineChart);
$('#bar_chart_button').click(changeToBarChart);


function onLoad(){
	console.log("onload");
	$(document).ready(function(){
	   $('.combobox').combobox()
	});
}

function changeToMultiLineChart(){
	console.log("changeToMultiLineChart");
	createLineChart(lineChartData, "line");
}

function changeToBarChart(){
	console.log("changeToBarChart")
	createLineChart(lineChartData, "area");
}




function onGetCountries(){

  console.log("onGetCountries");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  var countriesData = results[0].data;


  for (var i = 0; i < countriesData.length; i++) {

  	var countryName = countriesData[i].row[0];
  	countries.push(countryName);

  	var option = document.createElement("option");
	option.value = countryName;
	option.innerHTML = countryName;

	var select = document.getElementById("countries_combobox");
	select.appendChild(option);
  };
  //console.log("countries", countries);   

  countriesLoaded = true;
  if(sectorsLoaded){
  	onComboBoxChange();
  }

}

function onGetSectors(){

  console.log("onGetSectors");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  var sectorsData = results[0].data;


  for (var i = 0; i < sectorsData.length; i++) {
  	var sectorName = sectorsData[i].row[0];
  	sectors.push(sectorName);

  	var option = document.createElement("option");
	option.value = sectorName;
	option.innerHTML = sectorName;

	var select = document.getElementById("sectors_combobox");
	select.appendChild(option);
  };
  //console.log("sectors", sectors);   

  sectorsLoaded = true;
  if(countriesLoaded){
  	onComboBoxChange();
  }     
}

function onGetPeriods(){

  console.log("onGetPeriods");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  var periodsData = results[0].data;


  for (var i = 0; i < periodsData.length; i++) {
  	var periodName = periodsData[i].row[0];
  	periods.push(periodName);

  	var option = document.createElement("option");
	option.value     = periodName;
	option.innerHTML = periodName;

	var select = document.getElementById("periods_combobox");
	select.appendChild(option);
  };
  //console.log("periods", periods);   
     
}

function onGetSurplusForAllPeriods(){

  console.log("onGetSurplusForAllPeriods");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  var tempData = results[0].data;

  var dataArray = [];


  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row;
  	//dataArray.push({"emissions":rows[0], "free_allocation":rows[1], "surplus_deficit":rows[2], "period":rows[3]});  
  	dataArray.push({"tonescarbon":rows[0], "type":"Verified_Emissions", "period":rows[3]});
  	dataArray.push({"tonescarbon":rows[1], "type":"Free_Allocation", "period":rows[3]});
  	dataArray.push({"tonescarbon":rows[2], "type":"Surplus_Deficit", "period":rows[3]});
  }; 

  createLineChart(dataArray, "line");

  //console.log(dataArray);
     
}

function createLineChart(data, mode){
   lineChartData = data; 

   if(!line_chart_created){
   	  var svg = dimple.newSvg("#line_chart", 800, 400);

   	  lineChart = new dimple.chart(svg, lineChartData);
   	  lineChart.setBounds(60, 30, 700, 300);

	  var x = lineChart.addCategoryAxis("x", "period");
	  x.addOrderRule("period");
	  lineChart.addMeasureAxis("y", "tonescarbon");
	  var series
	  if(mode == "area"){
	  	series = lineChart.addSeries("type", dimple.plot.bar);
	  }else if(mode == "line"){
	  	series = lineChart.addSeries("type", dimple.plot.line);
	  	series.lineMarkers = true;
	  	series.interpolation = "cardinal";
	  }	  
      
      lineChart.addLegend(60, 10, 500, 20, "right");
      
	  //var freeAllocationSeries = lineChart.addSeries("free_allocation", dimple.plot.line);

   	  line_chart_created = true;
   }else{

   	if(currentChartMode == "line" && mode == "area"){
   		lineChart.series.forEach(function(series){
		    series.shapes.remove();
		});
		series = lineChart.addSeries("type", dimple.plot.area);
		series.lineMarkers = true;
   	}else if(currentChartMode == "area" && mode == "line"){
   		series = lineChart.addSeries("type", dimple.plot.line);
	  	series.lineMarkers = true;
	  	series.interpolation = "cardinal";
   	}

   	currentChartMode = mode;

   	lineChart.data = lineChartData;
   }
   lineChart.draw(1000);
   
}

function onComboBoxChange(){
	//var selectPeriod = document.getElementById("periods_combobox");
	//var selectedPeriod = selectPeriod.options[selectPeriod.selectedIndex].text;

	var selectCountry = document.getElementById("countries_combobox");
	var selectedCountry = selectCountry.options[selectCountry.selectedIndex].text;

	var selectSector = document.getElementById("sectors_combobox");
	var selectedSector = selectSector.options[selectSector.selectedIndex].text;


	console.log("selectedCountry", selectedCountry);
	console.log("selectedSector", selectedSector);

	getSurplusForAllPeriods(server_url,selectedCountry, selectedSector, onGetSurplusForAllPeriods);

}



