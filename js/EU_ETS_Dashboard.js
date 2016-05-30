
var server_url = "http://52.50.32.206:7474/db/data/transaction/commit";
//var server_url = "http://localhost:7474/db/data/transaction/commit";
var countries = [];
var sectors = [];
var periods = []; 

var euWideChartData = [];
var euWideChartDataBackup = [];
var euWideChart;
var barSeriesEUWide;
var lineSeriesEUWide;

var lineChartDataBackup = [];
var lineChartData = [];
var lineChart;

var barSeries;
var lineSeries;
var stackedBarChart
var stackedBarChartData;
var sectorsLoaded = false;
var countriesLoaded = false;

var verified_emissions_eu_wide_loaded = false;
var free_allocation_eu_wide_loaded = false;
var offsets_eu_wide_loaded = false;
var auctioned_eu_wide_loaded = false;
var legal_cap_eu_wide_loaded = false;

var verified_emissions_loaded = false;
var free_allocation_loaded = false;
var offsets_loaded = false;

var line_chart_created = false;
var stacked_bar_chart_created = false;
var eu_wide_chart_created = false;

var EU_COUNTRIES_ARRAY = ["Austria","Belgium","Bulgaria","Croatia","Cyprus","Czech Republic",
                          "Denmark","Estonia","Finland","France","Germany","Greece","Hungary",
                          "Iceland","Ireland","Italy","Latvia","Lithuania","Liechtenstein",
                          "Luxembourg","Malta","Netherlands","Norway","Poland","Portugal",
                          "Romania","Slovakia","Slovenia","Spain","Sweden","United Kingdom"];

//console.log("hello hello!");

function initMainPage(){
    
    //Handler for clicks outside of the dropdown menu to filter multi line chart
    $('body').on('click', function (e) {

        if (!$('#filter_line_chart_dropdown').is(e.target) 
            && $('#filter_line_chart_dropdown').has(e.target).length === 0 
            && $('.open').has(e.target).length === 0
        ) {
            $('#filter_line_chart_dropdown').parent().removeClass('open');
        }
    });
    
    //Handler for clicks outside of the dropdown menu to filter eu wide chart
    $('body').on('click', function (e) {

        if (!$('#filter_eu_wide_chart_dropdown').is(e.target) 
            && $('#filter_eu_wide_line_chart_dropdown').has(e.target).length === 0 
            && $('.open').has(e.target).length === 0
        ) {
            $('#filter_eu_wide_chart_dropdown').parent().removeClass('open');
        }
    });


    $('#filter_line_chart_dropdown').on('click', function (event) {
        $(this).parent().toggleClass('open');
    });
    
    $('#filter_eu_wide_chart_dropdown').on('click', function (event) {
        $(this).parent().toggleClass('open');
    });
    
    
    window.onresize = function () {
        // As of 1.1.0 the second parameter here allows you to draw
        // without reprocessing data.  This saves a lot on performance
        // when you know the data won't have changed.
        lineChart.draw(0, true);
    };

    
    onGetEUCountries();
    getSandbagSectors(server_url, onGetSectors);
    getPeriods(server_url, onGetPeriods);
    
    getAuctionedForAllPeriods(server_url, onGetAuctionedForAllPeriods);
    getOffsetsForAllPeriods(server_url, onGetOffsetsForAllPeriods);
    getVerifiedEmissionsForAllPeriods(server_url, onGetVerifiedEmissionsForAllPeriods);
    getFreeAllocationForAllPeriods(server_url, onGetFreeAllocationForAllPeriods)
    getLegalCapForAllPeriods(server_url, onGetLegalCapForAllPeriods);
}

function noValueSelectedForCountriesOrSectors(){
    
}

function initMenus(){
    $('.nav li a').click(function (e) {
    
        if(e.currentTarget.getAttribute("id") == "multi_line_chart_button"){
            e.preventDefault();
            $('#multi_line_chart_row').show();
            $('#countries_sectors_row').show();
            $('#about_row').hide();
            $('#periods_combo_box_row').hide();
            $('#stacked_bar_chart_row').hide();
            $('#eu_wide_chart_row').hide();
            lineChart.draw(1000);
        }else if(e.currentTarget.getAttribute("id") == "stacked_bar_chart_button"){
            e.preventDefault();
            $('#multi_line_chart_row').hide();
            $('#countries_sectors_row').hide();
            $('#about_row').hide();
            $('#eu_wide_chart_row').hide();
            $('#periods_combo_box_row').show();
            $('#stacked_bar_chart_row').show();
            stackedBarChart.draw(1000);
        }else if(e.currentTarget.getAttribute("id") == "about_button"){
            e.preventDefault();
            $('#multi_line_chart_row').hide();
            $('#countries_sectors_row').hide();
            $('#periods_combo_box_row').hide();
            $('#stacked_bar_chart_row').hide();
            $('#eu_wide_chart_row').hide();
            $('#about_row').show();
        }else if(e.currentTarget.getAttribute("id") == "eu_wide_chart_button"){
            e.preventDefault();
            $('#multi_line_chart_row').hide();
            $('#countries_sectors_row').hide();
            $('#periods_combo_box_row').hide();
            $('#stacked_bar_chart_row').hide();
            $('#about_row').hide();
            $('#eu_wide_chart_row').show();
        }

    });
}


function onLoad(){
	$('.selectpicker').selectpicker();
}


function disableLineChartPanelAndDropDowns(){
    $("#line_chart").addClass("grey_background");
    $("#spinner_div").show();
    
    $("#sectors_combobox").prop("disabled", true);
    $("#countries_combobox").prop("disabled", true);
    
}

function changeStackedBarChart(typeSt){
    if(typeSt == "free allocation"){
        
        $('#stackedBarChartPerPeriodTitleText').text("Free Allocation per period");
        
    }else if(typeSt == "offsets"){
        
        $('#stackedBarChartPerPeriodTitleText').text("Offsets per period");
        
    }else if(typeSt == "verified emissions"){
        
        $('#stackedBarChartPerPeriodTitleText').text("Verified Emissions per period");

    }
    
    onPeriodsComboboxChange();
}

function onExportLineChartButtonClick(){
    //console.log("lineChartData",lineChartData);
    
    var dataString = "data:text/csv;charset=utf-8,Period,tCO2e,type\n";
    
    for(var i=0; i < lineChartData.length; i++){
        var row = lineChartData[i];
        dataString += row.period + "," + row.tCO2e + "," + row.type + "\n";
    }
    
    //console.log("dataString",dataString);
    
    var encodedUri = encodeURI(dataString);
    window.open(encodedUri);
}

function onExportVerifiedEmissionsChartButtonClick(){
    
    var dataString = "data:text/tsv;charset=utf-8,Verified Emissions\tCountry\tSector\n";
    
    for(var i=0; i < stackedBarChartData.length; i++){
        var row = stackedBarChartData[i];
        //console.log("row", row);
        dataString += row["Verified Emissions"] + "\t" + row.country + "\t" + row.sector + "\n";
    }
    
    var encodedUri = encodeURI(dataString);
    window.open(encodedUri);

}


function filterDataForLineChart(){    
    lineChartData = lineChartDataBackup.filter(filterArrayBasedOnCheckboxesSelected);
    createLineChart(lineChartDataBackup);
    
}

function filterDataForEUWideChart(){
    euWideChartData = euWideChartDataBackup.filter(filterEUWideArrayBasedOnCheckboxesSelected);
    createEUWideChart(euWideChartData);
}


function calculateSurplusWithOffsets(){
    
    var offsetsSurplusDataArray = [];
    for(var i=2008;i<=2012;i++){
        offsetsSurplusDataArray[i] = 0;
    }
    
    for (var i = 0; i < lineChartDataBackup.length; i++) {
        var period = lineChartDataBackup[i].period;
        var tCO2e = lineChartDataBackup[i].tCO2e;
        var type = lineChartDataBackup[i].type;
        
        if(period >= 2008 && period <= 2012){
            
            console.log("\noffsetsSurplusDataArray[period](before)",offsetsSurplusDataArray[period]);
            console.log(period, tCO2e, type);
            
            if(type == "Verified_Emissions"){
                offsetsSurplusDataArray[period] -= tCO2e;
            }else if(type == "Free_Allocation" || type ==  "Offsets"){                
                offsetsSurplusDataArray[period] += tCO2e;
            } 
            
            console.log("offsetsSurplusDataArray[period](after)",offsetsSurplusDataArray[period]);
        }
        
        
    };
    
    for(var i=2008;i<=2012;i++){
        lineChartDataBackup.push({"tCO2e":offsetsSurplusDataArray[i], "lines":"Surplus_With_Offsets", "period":i});
        //console.log(i,);
    }
    
    
}


function onGetEUCountries(){


  for (var i = 0; i < EU_COUNTRIES_ARRAY.length; i++) {

  	var countryName = EU_COUNTRIES_ARRAY[i];
  	countries.push(countryName);

  	var option = document.createElement("option");
	option.value = countryName;
	option.innerHTML = countryName;

	var select = document.getElementById("countries_combobox");
	select.appendChild(option);
  };
  //console.log("countries", countries);   
    
  //
    
  $("#countries_combobox").selectpicker('refresh');
  $("#countries_combobox").selectpicker('val','Austria');

  countriesLoaded = true;
//  if(sectorsLoaded){
//  	onComboBoxChange();
//  }

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
    
  console.log("lalalalal");  
    
  $("#sectors_combobox").selectpicker('refresh');
  $("#sectors_combobox").selectpicker('val','Cement and Lime');     

  sectorsLoaded = true;
//  if(countriesLoaded){
//  	onComboBoxChange();
//  }     
}

function onPeriodsComboboxChange(){
    
    var textSt = $('#stackedBarChartPerPeriodTitleText').text();
    
    //console.log("textSt", "'" + textSt + "'");
    
    if(textSt == "Free Allocation per period"){
        getFreeAllocationForPeriod(server_url,$("#periods_combobox").selectpicker('val'), onGetFreeAllocationForPeriod);  
        console.log("all");
    }else if(textSt == "Offsets per period"){
        console.log("off");
        getOffsetsForPeriod(server_url,$("#periods_combobox").selectpicker('val'), onGetOffsetsForPeriod);  
    }else if(textSt == "Verified Emissions per period"){        
        getVerifiedEmissionsForPeriod(server_url,$("#periods_combobox").selectpicker('val'), onGetVerifiedEmissionsForPeriod);      
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
    //console.log("periodName'", periodName, "'");
    if(periodName != "2008to2020"){
        periods.push(periodName);
      
        console.log("periodName",periodName);

        var option = document.createElement("option");
        option.value     = periodName;
        option.innerHTML = periodName;

        var select = document.getElementById("periods_combobox");
        select.appendChild(option);
    }
  	
  };
  //console.log("periods", periods);  
    
    $("#periods_combobox").selectpicker('refresh');
    $("#periods_combobox").selectpicker('val','2005'); 
    onPeriodsComboboxChange();
}

function dataForPeriod(responseText){
  var resultsJSON = JSON.parse(responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  
  var tempData = results[0].data;
    
  var dataArray = [];

  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
    var tempArray = [];
    tempArray["tCO2e"] = rows[0];
    tempArray["country"] = rows[1];
    tempArray["sector"] = rows[2];  
    dataArray.push(tempArray);
      
  	//dataArray.push({dataType:rows[0], "country":rows[1], "sector":rows[2]});      
  };
    
  stackedBarChartData = dataArray;

  createStackedBarChart();

}

function onGetFreeAllocationForAllPeriods(){
  console.log("onGetFreeAllocationForAllPeriods");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  var tempData = results[0].data;
    
  //console.log("this.responseText", this.responseText);
    
  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
    var tempArray = [];
    tempArray["tCO2e"] = rows[0];
    tempArray["period"] = rows[1];
    tempArray["type"] = "Free Allocation";
    euWideChartDataBackup.push(tempArray);        
  }
    
    free_allocation_eu_wide_loaded = true;
    
    if(allEUWideLoaded()){
        createEUWideChart(euWideChartDataBackup);
    }
}

function onGetLegalCapForAllPeriods(){
  console.log("onGetLegalCapForAllPeriods");    
    console.log("this.responseText", this.responseText);
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  var tempData = results[0].data;
    
  
    
  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
    var tempArray = [];
    tempArray["tCO2e"] = rows[0];
    tempArray["period"] = rows[1];
    tempArray["type"] = "Legal Cap";
    euWideChartDataBackup.push(tempArray);        
  }
    
    legal_cap_eu_wide_loaded = true;
    
    if(allEUWideLoaded()){
        createEUWideChart(euWideChartDataBackup);
    }
}

function onGetVerifiedEmissionsForAllPeriods(){
  console.log("onGetVerifiedEmissionsForAllPeriods");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  var tempData = results[0].data;
    
  //console.log("this.responseText", this.responseText);
    
  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
    var tempArray = [];
    tempArray["tCO2e"] = rows[0];
    tempArray["period"] = rows[1];
    tempArray["type"] = "Verified Emissions";
    euWideChartDataBackup.push(tempArray);        
  };
    
    
    verified_emissions_eu_wide_loaded = true;
    
    if(allEUWideLoaded()){
        createEUWideChart(euWideChartDataBackup);
    }
    
}

function onGetAuctionedForAllPeriods(){
    
  console.log("onGetAuctionedForAllPeriods");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  var tempData = results[0].data;
    
  //console.log("this.responseText", this.responseText);
    
  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
    var tempArray = [];
    tempArray["tCO2e"] = rows[0];
    tempArray["period"] = rows[1];
    tempArray["type"] = "Auctioned"; 
    euWideChartDataBackup.push(tempArray);        
  };
    
    auctioned_eu_wide_loaded = true;
    
    if(allEUWideLoaded()){
        createEUWideChart(euWideChartDataBackup);
    }
    
}

function onGetOffsetsForAllPeriods(){
  console.log("onGetOffsetsForAllPeriods");    
  var resultsJSON = JSON.parse(this.responseText);
  var results = resultsJSON.results;
  var errors = resultsJSON.errors;
  var tempData = results[0].data;
    
  //console.log("this.responseText", this.responseText);
    
  for (var i = 0; i < tempData.length; i++) {
  	var rows = tempData[i].row; 
    var tempArray = [];
    tempArray["tCO2e"] = rows[0];
    tempArray["period"] = rows[1];
    tempArray["type"] = "Offsets";
    euWideChartDataBackup.push(tempArray);
        
  };
    
    offsets_eu_wide_loaded = true;
    
    if(allEUWideLoaded()){
        createEUWideChart(euWideChartDataBackup);
    }
}

function onGetVerifiedEmissionsForPeriod(){
  console.log("onGetVerifiedEmissionsForPeriod");    
  dataForPeriod(this.responseText);
}
function onGetFreeAllocationForPeriod(){
  console.log("onGetFreeAllocationForPeriod");    
  dataForPeriod(this.responseText);
}
function onGetOffsetsForPeriod(){
  console.log("onGetOffsetsForPeriod");    
  dataForPeriod(this.responseText);
}


function createStackedBarChart(){
    
    if(!stacked_bar_chart_created){
        var svg = dimple.newSvg("#stacked_bar_chart", "100%", "100%");
    
        stackedBarChart = new dimple.chart(svg, stackedBarChartData);
        // Fix the margins
        stackedBarChart.setMargins("85px", "20px", "20px", "50px");
        stackedBarChart.addMeasureAxis("y", "tCO2e");
        stackedBarChart.addCategoryAxis("x", "country");
        //y.addOrderRule("Date");
        stackedBarChart.addSeries("sector", dimple.plot.bar);
        //stackedBarChart.addLegend(60, 10, 510, 20, "right");
        
        stacked_bar_chart_created = true;
        
    }else{
        stackedBarChart.data = stackedBarChartData;
    }
    
    stackedBarChart.draw(1000);
        
    
    
}


function createEUWideChart(data){
    
    //alert("createEUWideChart")
    euWideChartData = data;
    
    if(!eu_wide_chart_created){
   	  var svg = dimple.newSvg("#line_chart", "100%", "100%");

   	  euWideChart = new dimple.chart(svg, euWideChartData);
   	         
      // Fix the margins
      euWideChart.setMargins("95px", "60px", "20px", "40px");

	  var x = euWideChart.addCategoryAxis("x", "period");
	  x.addOrderRule("period");
	  var y = euWideChart.addMeasureAxis("y", "tCO2e");
      y.tickFormat = ',';
    
      barSeriesEUWide = euWideChart.addSeries("type", dimple.plot.bar);      
       
      lineSeriesEUWide = euWideChart.addSeries("type", dimple.plot.line);
      
	  lineSeriesEUWide.lineMarkers = true;
	  lineSeriesEUWide.interpolation = "cardinal";	
      
      euWideChart.addLegend(20, 10, "95%", 300, "left");      

   	  eu_wide_chart_created = true;
   }else{

   	euWideChart.data = euWideChartData;
       
   }
    barSeriesEUWide.data = dimple.filterData(data, "type", ["Free Allocation", "Offsets", "Auctioned"]);
    lineSeriesEUWide.data = dimple.filterData(data, "type", ["Verified Emissions", "Legal Cap"]);
   euWideChart.draw(1000);
}

function createLineChart(data){
   lineChartData = data; 

   if(!line_chart_created){
   	  var svg = dimple.newSvg("#line_chart", "100%", "100%");

   	  lineChart = new dimple.chart(svg, lineChartData);
   	         
      // Fix the margins
      lineChart.setMargins("95px", "60px", "20px", "40px");

	  var x = lineChart.addCategoryAxis("x", "period");
	  x.addOrderRule("period");
	  var y = lineChart.addMeasureAxis("y", "tCO2e");
      y.tickFormat = ',';
    
     barSeries = lineChart.addSeries("type", dimple.plot.bar);
      
       
    lineSeries = lineChart.addSeries("type", dimple.plot.line);
      
	  lineSeries.lineMarkers = true;
	  lineSeries.interpolation = "cardinal";	
      
      
       
     console.log(lineChart.series);
       
	  
       
      
      lineChart.addLegend(20, 10, "95%", 300, "left");
      

   	  line_chart_created = true;
   }else{

   	lineChart.data = lineChartData;
       
   }
    barSeries.data = dimple.filterData(data, "type", ["Free_Allocation", "Offsets"]);
       lineSeries.data = dimple.filterData(data, "type", "Verified_Emissions");
   lineChart.draw(1000);
   
}

function onComboBoxChange(){
	//var selectPeriod = document.getElementById("periods_combobox");
	//var selectedPeriod = selectPeriod.options[selectPeriod.selectedIndex].text;
    
    

	var selectedCountry = $("#countries_combobox").selectpicker('val');
	
	var selectedSector = $("#sectors_combobox").selectpicker('val');
    
//    console.log("selectedCountry",selectedCountry);
//    console.log("selectedSector",selectedSector);
    
    
    if(selectedCountry != null && selectedSector != null){
        
        disableLineChartPanelAndDropDowns();
        
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

        verified_emissions_loaded = false;
        offsets_loaded = false;
        free_allocation_loaded = false;

        getVerifiedEmissionsForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, true, onGetVerifiedEmissionsForCountryAndSector);
        getOffsetsForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, true, onGetOffsetsForCountryAndSector);
        getFreeAllocationForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, true, onGetFreeAllocationForCountryAndSector);
        
    }
    
    

}

function dataForLineChartLoaded(){
    //calculateSurplusWithOffsets();
    filterDataForLineChart(); 
    $("#line_chart").removeClass("grey_background");
    $("#spinner_div").hide();
    $("#countries_combobox").prop("disabled", false);
    $("#sectors_combobox").prop("disabled", false);
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
  if(verified_emissions_loaded && free_allocation_loaded && offsets_loaded){
      dataForLineChartLoaded();  
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
  if(verified_emissions_loaded && free_allocation_loaded && offsets_loaded){
      dataForLineChartLoaded();        
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
    //console.log("aa: ",rows[0], rows[1]);
  	lineChartDataBackup.push({"tCO2e":rows[0], "type":"Free_Allocation", "period":rows[1]});      
  }; 
    
  free_allocation_loaded = true;
  if(verified_emissions_loaded && free_allocation_loaded && offsets_loaded){
       dataForLineChartLoaded(); 
  }
}


function filterEUWideArrayBasedOnCheckboxesSelected(value){
    var includeVerifiedEmissions = $('#verified_emissions_eu_wide_checkbox:checked').length == 1;
    var includeOffsets = $('#offsets_eu_wide_checkbox:checked').length == 1;
    var includeFreeAllocation = $('#free_allocation_eu_wide_checkbox:checked').length == 1;
    var includeAuctioned = $('#auctioned_eu_wide_checkbox:checked').length == 1;
    var includeLegalCap = $('#legal_cap_eu_wide_checkbox:checked').length == 1;
    
    
    var tempType =  value.type;
        
    if(tempType == "Verified_Emissions"){
        return includeVerifiedEmissions;
    }else if(tempType == "Free_Allocation"){
        return includeFreeAllocation;
    }else if(tempType == "Offsets"){
        return includeOffsets;
    }else if(tempType == "Auctioned"){
        return includeAuctioned;
    }else if(tempType == "Legal Cap"){
        return includeLegalCap;
    }else{        
        return false;
    }
}

//array filtering functions
function filterArrayBasedOnCheckboxesSelected(value) {
    var includeVerifiedEmissions = $('#verified_emissions_eu_wide_checkbox:checked').length == 1;
    var includeOffsets = $('#offsets_eu_wide_checkbox:checked').length == 1;
    var includeFreeAllocation = $('#free_allocation_eu_wide_checkbox:checked').length == 1;
    
    
    var tempType =  value.type;
        
    if(tempType == "Verified_Emissions"){
        return includeVerifiedEmissions;
    }else if(tempType == "Free_Allocation"){
        return includeFreeAllocation;
    }else if(tempType == "Offsets"){
        return includeOffsets;
    }else{        
        return false;
    }
}

function allEUWideLoaded(){
    
    return verified_emissions_eu_wide_loaded == true && free_allocation_eu_wide_loaded == true &&
        offsets_eu_wide_loaded == true && auctioned_eu_wide_loaded == true && legal_cap_eu_wide_loaded == true;
}


