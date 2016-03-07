
var server_url = "http://52.49.23.223:7474/db/data/transaction/commit"
var countries = [];
var sectors = [];
var periods = []; 
var lineChartDataBackup;
var lineChartData;
var lineChart;
var stackedBarChart
var stackedBarChartData;
var sectorsLoaded = false;
var countriesLoaded = false;

var verified_emissions_loaded = false;
var free_allocation_loaded = false;
var offsets_loaded = false;
var surplus_with_offsets_loaded = false;
var surplus_free_allowances_loaded = false;
var total_suply_loaded = false;

var line_chart_created = false;
var stacked_bar_chart_created = false;

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

$('#countries_combobox').on('changed.bs.select', function(){
    var selectedValue = $('#countries_combobox').selectpicker('val');
    //console.log("selectedValue",selectedValue);
});

$('#filter_line_chart_dropdown').on('click', function (event) {
    $(this).parent().toggleClass('open');
});


function onLoad(){
	$('.selectpicker').selectpicker();
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
    
  $("#countries_combobox").selectpicker('refresh');
  $("#countries_combobox").selectpicker('val','Austria');

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
    
  $("#sectors_combobox").selectpicker('refresh');
  $("#sectors_combobox").selectpicker('val','Cement and Lime');

  sectorsLoaded = true;
  if(countriesLoaded){
  	onComboBoxChange();
  }     
}

function onPeriodsComboboxChange(){
    getVerifiedEmissionsForPeriod(server_url,$("#periods_combobox").selectpicker('val'), onGetVerifiedEmissionsForPeriod);
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
      
    //console.log("periodName",periodName);

  	var option = document.createElement("option");
	option.value     = periodName;
	option.innerHTML = periodName;

	var select = document.getElementById("periods_combobox");
	select.appendChild(option);
  };
  //console.log("periods", periods);  
    
    $("#periods_combobox").selectpicker('refresh');
    $("#periods_combobox").selectpicker('val','2012'); 
    onPeriodsComboboxChange();
}

function onGetVerifiedEmissionsForPeriod(){
  console.log("onGetVerifiedEmissionsForPeriod");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  
  var tempData = results[0].data;
    
  var dataArray = [];

  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
  	dataArray.push({"Verified Emissions":rows[0], "country":rows[1], "sector":rows[2]});      
  }; 
    
  stackedBarChartData = dataArray;

  createStackedBarChart();
}

function createStackedBarChart(){
    
    if(!stacked_bar_chart_created){
        var svg = dimple.newSvg("#stacked_bar_chart", "100%", "100%");
    
        stackedBarChart = new dimple.chart(svg, stackedBarChartData);
        // Fix the margins
        stackedBarChart.setMargins("85px", "60px", "20px", "40px");
        stackedBarChart.addMeasureAxis("y", "Verified Emissions");
        stackedBarChart.addCategoryAxis("x", "country");
        //y.addOrderRule("Date");
        stackedBarChart.addSeries("sector", dimple.plot.bar);
        stackedBarChart.addLegend(60, 10, 510, 20, "right");
        
        stacked_bar_chart_created = true;
        
    }else{
        stackedBarChart.data = stackedBarChartData;
    }
    
    stackedBarChart.draw(1000);
        
    
    
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
  	dataArray.push({"tCO2e":rows[0], "type":"Verified_Emissions", "period":rows[5]});
  	dataArray.push({"tCO2e":rows[1], "type":"Free_Allocation", "period":rows[5]});
    dataArray.push({"tCO2e":rows[2], "type":"Offsets", "period":rows[5]});
  	dataArray.push({"tCO2e":rows[3], "type":"Surplus_Free_Allowances", "period":rows[5]});
    dataArray.push({"tCO2e":rows[4], "type":"Surplus_With_Offsets", "period":rows[5]});
      
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
      lineChart.setMargins("85px", "60px", "20px", "40px");

	  var x = lineChart.addCategoryAxis("x", "period");
	  x.addOrderRule("period");
	  var y = lineChart.addMeasureAxis("y", "tCO2e");
      y.tickFormat = ',.4r';
	  var series = lineChart.addSeries("type", dimple.plot.line);
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

	var selectedCountry = $("#countries_combobox").selectpicker('val');
	
	var selectedSector = $("#sectors_combobox").selectpicker('val');
    
    var selectedSectorSt = "[";
    var selectedCountrySt = "[";
    
    for (var i=0;i<selectedCountry.length;i++){
        var currentValue = selectedCountry[i];
        selectedCountrySt += "'" + currentValue + "',";
    }
    for (var i=0;i<selectedSector.length;i++){
        var currentValue = selectedSector[i];
        selectedSectorSt += "'" + currentValue + "',";
    }
    
    selectedSectorSt = selectedSectorSt.slice(0, selectedSectorSt.length -1);
    selectedSectorSt += "]";
    selectedCountrySt = selectedCountrySt.slice(0, selectedCountrySt.length -1);
    selectedCountrySt += "]";
    
    console.log("selectedSectorSt",selectedSectorSt);
    console.log("selectedCountrySt",selectedCountrySt);
    
    lineChartDataBackup = [];
    
    total_suply_loaded = false;
    verified_emissions_loaded = false;
    offsets_loaded = false;
    offsets_loaded = false;
    surplus_free_allowances_loaded = false;
    surplus_with_offsets_loaded = false;
    
    getVerifiedEmissionsForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, onGetVerifiedEmissionsForCountryAndSector);
    getOffsetsForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, onGetOffsetsForCountryAndSector);
    getFreeAllocationForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, onGetFreeAllocationForCountryAndSector);
    getTotalSuplyForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, onGetTotalSuplyForCountryAndSector);
    getSurplusFreeAllowancesForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, onGetSurplusFreeAllowancesForCountryAndSector);
    getSurplusWithOffsetsForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, onGetSurplusWithOffsetsForCountryAndSector);    

	//getSurplusForAllPeriods(server_url,selectedCountry, selectedSector, onGetSurplusForAllPeriods);

}

function onGetVerifiedEmissionsForCountryAndSector(){

  console.log("onGetVerifiedEmissionsForCountryAndSector");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  //console.log("errors", errors);
  var tempData = results[0].data;

  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
  	lineChartDataBackup.push({"tCO2e":rows[0], "type":"Verified_Emissions", "period":rows[1]});      
  };
    
  verified_emissions_loaded = true;
  if(verified_emissions_loaded && free_allocation_loaded && offsets_loaded && 
     surplus_free_allowances_loaded && surplus_with_offsets_loaded && total_suply_loaded){
        filterDataForLineChart();   
  }
}

function onGetTotalSuplyForCountryAndSector(){

  console.log("onGetTotalSuplyForCountryAndSector");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  //console.log("errors", errors);
  var tempData = results[0].data;

  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
  	lineChartDataBackup.push({"tCO2e":rows[0], "type":"Total_Suply", "period":rows[1]});      
  };
    
  total_suply_loaded = true;
  if(verified_emissions_loaded && free_allocation_loaded && offsets_loaded && 
     surplus_free_allowances_loaded && surplus_with_offsets_loaded && total_suply_loaded){
        filterDataForLineChart();   
  }
}

function onGetOffsetsForCountryAndSector(){

  console.log("onGetOffsetsForCountryAndSector");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  //console.log("errors", errors);
  var tempData = results[0].data;

  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
  	lineChartDataBackup.push({"tCO2e":rows[0], "type":"Offsets", "period":rows[1]});      
  }; 
    
  offsets_loaded = true;
  if(verified_emissions_loaded && free_allocation_loaded && offsets_loaded && 
     surplus_free_allowances_loaded && surplus_with_offsets_loaded && total_suply_loaded){
        filterDataForLineChart();   
  }
}

function onGetFreeAllocationForCountryAndSector(){

  console.log("onGetFreeAllocationForCountryAndSector");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  //console.log("errors", errors);
  var tempData = results[0].data;


  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
  	lineChartDataBackup.push({"tCO2e":rows[0], "type":"Free_Allocation", "period":rows[1]});      
  }; 
    
  free_allocation_loaded = true;
  if(verified_emissions_loaded && free_allocation_loaded && offsets_loaded && 
     surplus_free_allowances_loaded && surplus_with_offsets_loaded && total_suply_loaded){
        filterDataForLineChart();   
  }
}

function onGetSurplusFreeAllowancesForCountryAndSector(){

  console.log("onGetSurplusFreeAllowancesForCountryAndSector");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  //console.log("errors", errors);
  var tempData = results[0].data;

  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
  	lineChartDataBackup.push({"tCO2e":rows[0], "type":"Surplus_Free_Allowances", "period":rows[1]});      
  }; 
    
  surplus_free_allowances_loaded = true;
  if(verified_emissions_loaded && free_allocation_loaded && offsets_loaded && 
     surplus_free_allowances_loaded && surplus_with_offsets_loaded && total_suply_loaded){
        filterDataForLineChart();   
  }
}

function onGetSurplusWithOffsetsForCountryAndSector(){

  console.log("onGetSurplusWithOffsetsForCountryAndSector");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  //console.log("errors", errors);
  var tempData = results[0].data;

  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
  	lineChartDataBackup.push({"tCO2e":rows[0], "type":"Surplus_With_Offsets", "period":rows[1]});      
  }; 
    
  surplus_with_offsets_loaded = true;
  if(verified_emissions_loaded && free_allocation_loaded && offsets_loaded && 
     surplus_free_allowances_loaded && surplus_with_offsets_loaded && total_suply_loaded){
        filterDataForLineChart();   
  }
}

//array filtering functions
function filterArrayBasedOnCheckboxesSelected(value) {
    var includeVerifiedEmissions = $('#verified_emissions_checkbox:checked').length == 1;
    var includeOffsets = $('#offsets_checkbox:checked').length == 1;
    var includeFreeAllocation = $('#free_allocation_checkbox:checked').length == 1;
    var includeSurplusFreeAllowances = $('#surplus_free_allowances_checkbox:checked').length == 1;
    var includeSurplusWithOffsets = $('#surplus_with_offsets_checkbox:checked').length == 1;
    var includeSurplusTotalSuply = $('#total_suply_checkbox:checked').length == 1;
    
    
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
    }else if(tempType == "Total_Suply"){
        return includeSurplusTotalSuply;
    }else{        
        return false;
    }
}


