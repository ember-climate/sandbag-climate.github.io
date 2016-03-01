
var server_url = "http://52.49.23.223:7474/db/data/transaction/commit"
var countries = [];
var sectors = [];
var periods = []; 
var lineChartDataBackup;
var lineChartData;
var lineChart;
var sectorsLoaded = false;
var countriesLoaded = false;

var line_chart_created = false;

getCountries(server_url, onGetCountries);
getSectors(server_url, onGetSectors);
getPeriods(server_url, onGetPeriods);

window.onresize = function () {
    // As of 1.1.0 the second parameter here allows you to draw
    // without reprocessing data.  This saves a lot on performance
    // when you know the data won't have changed.
    lineChart.draw(0, true);
};

//Handler for clicks outside of the dropdown menu to filter line surpluses chart
$('body').on('click', function (e) {
    
    if (!$('#filter_line_chart_dropdown').is(e.target) 
        && $('#filter_line_chart_dropdown').has(e.target).length === 0 
        && $('.open').has(e.target).length === 0
    ) {
        $('#filter_line_chart_dropdown').parent().removeClass('open');
    }
});

$('#filter_line_chart_dropdown').on('click', function (event) {
    $(this).parent().toggleClass('open');
});


function onLoad(){
	
}



function filterDataForLineChart(){
    //alert("I need to filter data!");
    lineChartData = lineChartDataBackup.filter(filterArrayBasedOnCheckboxesSelected);
    createLineChart(lineChartData);
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
    console.log("errors", errors);
  var tempData = results[0].data;

  var dataArray = [];


  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
  	dataArray.push({"tonescarbon":rows[0], "type":"Verified_Emissions", "period":rows[5]});
  	dataArray.push({"tonescarbon":rows[1], "type":"Free_Allocation", "period":rows[5]});
    dataArray.push({"tonescarbon":rows[2], "type":"Offsets", "period":rows[5]});
  	dataArray.push({"tonescarbon":rows[3], "type":"Surplus_Free_Allowances", "period":rows[5]});
    dataArray.push({"tonescarbon":rows[4], "type":"Surplus_With_Offsets", "period":rows[5]});
      
  }; 
    
  lineChartDataBackup = dataArray.slice(0);

  filterDataForLineChart();

  //console.log(dataArray);
     
}

function createLineChart(data){
   lineChartData = data; 

   if(!line_chart_created){
   	  var svg = dimple.newSvg("#line_chart", "100%", "100%");

   	  lineChart = new dimple.chart(svg, lineChartData);
   	         
      // Fix the margins
      lineChart.setMargins("60px", "60px", "20px", "20px");

	  var x = lineChart.addCategoryAxis("x", "period");
	  x.addOrderRule("period");
	  lineChart.addMeasureAxis("y", "tonescarbon");
	  var series
	  
      series = lineChart.addSeries("type", dimple.plot.line);
	  series.lineMarkers = true;
	  series.interpolation = "cardinal";	  
      
      lineChart.addLegend(20, 10, "95%", 300, "left");
      
	  //var freeAllocationSeries = lineChart.addSeries("free_allocation", dimple.plot.line);

   	  line_chart_created = true;
   }else{

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


//array filtering functions
function filterArrayBasedOnCheckboxesSelected(value) {
    var includeVerifiedEmissions = $('#verified_emissions_checkbox:checked').length == 1;
    var includeOffsets = $('#offsets_checkbox:checked').length == 1;
    var includeFreeAllocation = $('#free_allocation_checkbox:checked').length == 1;
    var includeSurplusFreeAllowances = $('#surplus_free_allowances_checkbox:checked').length == 1;
    var includeSurplusWithOffsets = $('#surplus_with_offsets_checkbox:checked').length == 1;
    
    
//    console.log("includeVerifiedEmissions",includeVerifiedEmissions);
//    console.log("includeOffsets",includeOffsets);
//    console.log("includeFreeAllocation",includeFreeAllocation);
//    console.log("includeSurplusFreeAllowances",includeSurplusFreeAllowances);
//    console.log("includeSurplusWithOffsets",includeSurplusWithOffsets);
    
    
    var tempType =  value.type;
    if(tempType == "Verified_Emissions"){
        return includeVerifiedEmissions;
    }else if(tempType == "Free_Allocation"){
        return includeFreeAllocation;
    }else if(tempType == "Offsets"){
        return includeOffsets;
    }else if(tempType == "Surplus_With_Offsets"){
        return includeSurplusWithOffsets;
    }else if(tempType == "Surplus_Free_Allowances"){
        return includeSurplusFreeAllowances;
    }else{        
        return false;
    }
}


