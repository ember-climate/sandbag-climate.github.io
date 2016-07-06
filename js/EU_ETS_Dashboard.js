var server_url = "http://52.208.154.95:7474/db/data/transaction/commit";
//var server_url = "http://localhost:7474/db/data/transaction/commit";
var countries = [];
var sectors = [];
var periods = [];

var euWideChartData = [];
var euWideChartDataBackup = [];
var euWideChart;
var euWideChartLegend;
var barSeriesEUWide;
var lineSeriesEUWide;
var surplusDataArrayEUWide = [];
var surplusAccumulatedDataArrayEUWide = [];

var lineChartDataBackup = [];
var lineChartData = [];
var lineChart;

var totalOffsetEntitlements = 0;
var totalOffsetsSoFar = 0;

var barSeries;
var lineSeries;
var stackedBarChart
var stackedBarChartData = [];
var stackedBarChartDataBackup = [];
var sectorsLoaded = false;
var countriesLoaded = false;

var verified_emissions_eu_wide_loaded = false;
var free_allocation_eu_wide_loaded = false;
var offsets_eu_wide_loaded = false;
var auctioned_eu_wide_loaded = false;
var legal_cap_eu_wide_loaded = false;
var offset_entitlements_eu_wide_loaded = false;

var verified_emissions_loaded = false;
var free_allocation_loaded = false;
var offsets_loaded = false;
var installations_loaded = false;

var line_chart_created = false;
var stacked_bar_chart_created = false;
var eu_wide_chart_created = false;

var EU_COUNTRIES_ARRAY = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
    "Iceland", "Ireland", "Italy", "Latvia", "Lithuania", "Liechtenstein",
    "Luxembourg", "Malta", "Netherlands", "Norway", "Poland", "Portugal",
    "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "United Kingdom"
];

var installations_map;
var marker_popups_ids = [];
var markers;

var countrySectorChartDisplayed = true;

//-----------MAP ICONS----
var ceramics_icon;
var aviation_icon;
var cement_and_lime_icon;
var chemicals_icon;
var coke_ovens_icon;
var combustion_icon;
var glass_icon;
var iron_and_steel_icon;
var metal_ore_roasting_icon;
var mineral_oil_icon;
var non_ferrous_metals_icon;
var other_icon;
var pulp_and_paper_icon;
//-------------------------


function initMainPage() {
    
    console.log("init main page...");
    
    //Navbar buttons active state handler
    $(".nav a").on("click", function(){
       $(".nav").find(".active").removeClass("active");
       $(this).parent().addClass("active");
    });

    //Handler for clicks outside of the dropdown menu to filter multi line chart
    $('body').on('click', function(e) {

        if (!$('#filter_line_chart_dropdown').is(e.target) && $('#filter_line_chart_dropdown').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
            $('#filter_line_chart_dropdown').parent().removeClass('open');
        }
    });

    //Handler for clicks outside of the dropdown menu to filter eu wide chart
    $('body').on('click', function(e) {

        if (!$('#filter_eu_wide_chart_dropdown').is(e.target) && $('#filter_eu_wide_line_chart_dropdown').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
            $('#filter_eu_wide_chart_dropdown').parent().removeClass('open');
        }
    });
    
    //Handler for clicks outside of the dropdown menu to filter stacked bar chart
    $('body').on('click', function(e) {

        if (!$('#filter_stacked_bar_chart_dropdown').is(e.target) && $('#filter_stacked_bar_chart_dropdown').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
            $('#filter_stacked_bar_chart_dropdown').parent().removeClass('open');
        }
    });


    $('#filter_line_chart_dropdown').on('click', function(event) {
        $(this).parent().toggleClass('open');
    });

    $('#filter_eu_wide_chart_dropdown').on('click', function(event) {
        $(this).parent().toggleClass('open');
    });
    
    $('#filter_stacked_bar_chart_dropdown').on('click', function(event) {
        $(this).parent().toggleClass('open');
    });


    window.onresize = function() {
        // As of 1.1.0 the second parameter here allows you to draw
        // without reprocessing data.  This saves a lot on performance
        // when you know the data won't have changed.
        //lineChart.draw(0, true);
        onResize();
    };
    
    initializeMapIcons();

    onGetEUCountries();
    getSandbagSectors(server_url, onGetSectors);
    getPeriods(server_url, onGetPeriods);

    loadEUWideData(true);

}

function initializeSurplusDataArrayEUWide() {
    //------INITIALIZING SURPLUS DATA ARRAY------
    for (var i = 2005; i <= 2015; i++) {
        surplusDataArrayEUWide[i] = 0;
    }
    //-------------------------------------------
}


function loadEUWideData(includeAviation) {

    initializeSurplusDataArrayEUWide();

    verified_emissions_eu_wide_loaded = false;
    free_allocation_eu_wide_loaded = false;
    offsets_eu_wide_loaded = false;
    auctioned_eu_wide_loaded = false;
    legal_cap_eu_wide_loaded = false;

    euWideChartDataBackup = [];
    euWideChartData = [];
    surplusAccumulatedDataArrayEUWide = [];
    
    totalOffsetEntitlements = 0;
    totalOffsetsSoFar = 0;

    $("#eu_wide_chart").addClass("grey_background");
    $("#eu_wide_spinner_div").show();

    getAuctionedForAllPeriods(server_url, onGetAuctionedForAllPeriods);
    getOffsetsForAllPeriods(server_url, onGetOffsetsForAllPeriods);
    getVerifiedEmissionsForAllPeriods(server_url, includeAviation, onGetVerifiedEmissionsForAllPeriods);
    getFreeAllocationForAllPeriods(server_url, includeAviation, onGetFreeAllocationForAllPeriods)
    getLegalCapForAllPeriods(server_url, includeAviation, onGetLegalCapForAllPeriods);
    getOffsetEntitlementsForAllPeriods(server_url, includeAviation, onGetOffsetEntitlementsForAllPeriods);
}

function noValueSelectedForCountriesOrSectors() {

}

function loadCountrySectorChart() {
    onComboBoxChange();
}

function initMenus() {
    
    $('.nav li a').click(function(e) {
        
        var tempId = e.currentTarget.getAttribute("id");
        
        if (tempId == "country_sector_chart_button") {
            
            e.preventDefault();
            $('#multi_line_chart_row').show();
            $('#countries_sectors_row').show();
            $('#about_row').hide();
            $('#periods_combo_box_row').hide();
            $('#stacked_bar_chart_row').hide();
            $('#eu_wide_chart_row').hide();
            $('#contact_us_row').hide();
            
            loadCountrySectorChart();
            
        }else if(tempId == "contact_us_button"){
            
            e.preventDefault();
            $('#multi_line_chart_row').hide();
            $('#countries_sectors_row').hide();
            $('#periods_combo_box_row').hide();
            $('#stacked_bar_chart_row').hide();
            $('#eu_wide_chart_row').hide();
            $('#about_row').hide();
            $('#contact_us_row').show();
            
        } else if (tempId == "stacked_bar_chart_button") {
            
            e.preventDefault();
            $('#multi_line_chart_row').hide();
            $('#countries_sectors_row').hide();
            $('#about_row').hide();
            $('#eu_wide_chart_row').hide();
            $('#contact_us_row').hide();
            $('#periods_combo_box_row').show();
            $('#stacked_bar_chart_row').show();            
                        
            onResize();
            
        } else if (tempId == "about_button") {
            
            e.preventDefault();
            $('#multi_line_chart_row').hide();
            $('#countries_sectors_row').hide();
            $('#periods_combo_box_row').hide();
            $('#stacked_bar_chart_row').hide();
            $('#contact_us_row').hide();
            $('#eu_wide_chart_row').hide();
            $('#about_row').show();
            
        } else if (tempId == "eu_wide_chart_button") {
            
            e.preventDefault();
            $('#multi_line_chart_row').hide();
            $('#countries_sectors_row').hide();
            $('#periods_combo_box_row').hide();
            $('#contact_us_row').hide();
            $('#stacked_bar_chart_row').hide();
            $('#about_row').hide();
            $('#eu_wide_chart_row').show();
            
            onResize();
            
        }

    });
}


function onLoad() {
    $('.selectpicker').selectpicker();
}

function onResize(){
    console.log("onResize()");
    if(euWideChart){
        euWideChart.draw(1000);
    }
    if(lineChart){
        lineChart.draw(1000);
    }
    if(stackedBarChart){
        stackedBarChart.draw(1000);
    }
}


function disableLineChartPanelAndDropDowns() {
    $("#line_chart").addClass("grey_background");
    $("#spinner_div_country_sector").show();

    $("#sectors_combobox").prop("disabled", true);
    $("#countries_combobox").prop("disabled", true);

}

function changeStackedBarChart(typeSt) {
    
        
    if (typeSt == "free allocation") {
        
        $('#offsets_warning_div').hide();

        $('#stackedBarChartPerPeriodTitleText').text("Free Allocation per period");

    } else if (typeSt == "offsets") {
        
        $('#offsets_warning_div').hide();

        $('#stackedBarChartPerPeriodTitleText').text("Offsets per period");

    } else if (typeSt == "verified emissions") {

        $('#stackedBarChartPerPeriodTitleText').text("Verified Emissions per period");

    }

    onPeriodsComboboxChange();
}

function includeAviationDataCheckboxClick() {
    var includeAviation = $('#include_aviation_data_eu_wide_checkbox:checked').length == 1;
    loadEUWideData(includeAviation);
}

function onExportEUWideButtonClick() {
    var dataString = "data:text/csv;charset=utf-8,Period,tCO2e,type\n";

    for (var i = 0; i < euWideChartData.length; i++) {
        var row = euWideChartData[i];
        dataString += row.period + "," + row.tCO2e + "," + row.type + "\n";
    }

    var encodedUri = encodeURI(dataString);
    window.open(encodedUri);
}

function onExportLineChartButtonClick() {
    //console.log("lineChartData",lineChartData);

    var dataString = "data:text/csv;charset=utf-8,Period,tCO2e,type\n";

    for (var i = 0; i < lineChartData.length; i++) {
        var row = lineChartData[i];
        dataString += row.period + "," + row.tCO2e + "," + row.type + "\n";
    }

    //console.log("dataString",dataString);

    var encodedUri = encodeURI(dataString);
    window.open(encodedUri);
}

function onChartViewButtonClick(){
    countrySectorChartDisplayed = true;
    $('#line_chart').show();
    lineChart.draw(1000);
    $('#map_div').hide();
}

function onMapButtonClick(){
    
    countrySectorChartDisplayed = false;
    
    $('#line_chart').hide();
    $('#map_div').show();
    
    loadDataForMapView();        
    
}

function loadDataForMapView(){
    
    if(!installations_map){
        installations_map = L.map('map_div').setView([47.540043, 7.603260], 3);
    
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'pablopareja.0e3lnp48',
            accessToken: 'pk.eyJ1IjoicGFibG9wYXJlamEiLCJhIjoiY2lwamxuaHY4MDA2M3Z4a3d4emRhMG00eCJ9.gKyvi9hMyE6wxa0o4-GDgQ'
        }).addTo(installations_map);
    } 
    
    
    if(installations_loaded == false){
        
        var selectedCountry = $("#countries_combobox").selectpicker('val');
        var selectedSector = $("#sectors_combobox").selectpicker('val');
        var selectedPowerFlag = $("#power_flag_combobox").selectpicker('val');

        if (selectedCountry != null && selectedSector != null) {

            var selectedSectorSt = "[";
            var selectedCountrySt = "[";

            for (var i = 0; i < selectedCountry.length; i++) {
                var currentValue = selectedCountry[i];
                selectedCountrySt += "'" + currentValue + "',";
            }
            for (var i = 0; i < selectedSector.length; i++) {
                var currentValue = selectedSector[i];
                selectedSectorSt += "'" + currentValue + "',";
            }

            selectedSectorSt = selectedSectorSt.slice(0, selectedSectorSt.length - 1);
            selectedSectorSt += "]";
            selectedCountrySt = selectedCountrySt.slice(0, selectedCountrySt.length - 1);
            selectedCountrySt += "]";

            getInstallationsForCountryAndSector(server_url,selectedCountrySt,selectedSectorSt, true, selectedPowerFlag,  onGetInstallationsForCountryAndSector);
            
            $("#map_div").addClass("grey_background");
            $("#spinner_div_installations_map").show();

        }    
    } 
}

function onExportVerifiedEmissionsChartButtonClick() {

    var dataString = "data:text/tsv;charset=utf-8,Verified Emissions\tCountry\tSector\n";

    for (var i = 0; i < stackedBarChartData.length; i++) {
        var row = stackedBarChartData[i];
        //console.log("row", row);
        dataString += row["tCO2e"] + "\t" + row.country + "\t" + row.sector + "\n";
    }

    var encodedUri = encodeURI(dataString);
    window.open(encodedUri);

}


function filterDataForLineChart() {
    lineChartData = lineChartDataBackup.filter(filterArrayBasedOnCheckboxesSelected);
    createLineChart(lineChartData);

}

function filterDataForEUWideChart() {
    euWideChartData = euWideChartDataBackup.filter(filterEUWideArrayBasedOnCheckboxesSelected);
    createEUWideChart(euWideChartData);
}

function filterDataForStackedBarChart() {
    stackedBarChartData = stackedBarChartDataBackup.filter(filterStackedBarArrayBasedOnCheckboxesSelected);
    createStackedBarChart(stackedBarChartData);
}


function calculateSurplusWithOffsets() {

    var offsetsSurplusDataArray = [];
    for (var i = 2008; i <= 2012; i++) {
        offsetsSurplusDataArray[i] = 0;
    }

    for (var i = 0; i < lineChartDataBackup.length; i++) {
        var period = lineChartDataBackup[i].period;
        var tCO2e = lineChartDataBackup[i].tCO2e;
        var type = lineChartDataBackup[i].type;

        if (period >= 2008 && period <= 2012) {

            console.log("\noffsetsSurplusDataArray[period](before)", offsetsSurplusDataArray[period]);
            console.log(period, tCO2e, type);

            if (type == "Verified_Emissions") {
                offsetsSurplusDataArray[period] -= tCO2e;
            } else if (type == "Free_Allocation" || type == "Offsets") {
                offsetsSurplusDataArray[period] += tCO2e;
            }

            console.log("offsetsSurplusDataArray[period](after)", offsetsSurplusDataArray[period]);
        }


    };

    for (var i = 2008; i <= 2012; i++) {
        lineChartDataBackup.push({
            "tCO2e": offsetsSurplusDataArray[i],
            "lines": "Surplus_With_Offsets",
            "period": i
        });
        //console.log(i,);
    }


}


function onGetEUCountries() {


    for (var i = 0; i < EU_COUNTRIES_ARRAY.length; i++) {

        var countryName = EU_COUNTRIES_ARRAY[i];
        countries.push(countryName);

        var option = document.createElement("option");
        option.value = countryName;
        option.innerHTML = countryName;
                
        option.setAttribute("data-content", "<img src='./images/icons/" + countryName + ".png'></img>    " + countryName);

        var select = document.getElementById("countries_combobox");
        select.appendChild(option);
    };
    //console.log("countries", countries);   

    //

    $("#countries_combobox").selectpicker('refresh');
    $("#countries_combobox").selectpicker('val', 'Austria');

    countriesLoaded = true;

}

function onGetSectors() {

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
        //option.innerHTML = sectorName;    
        
        option.setAttribute("data-content", "<img src='./images/icons/" + sectorName + ".png'></img>    " + sectorName);

        var select = document.getElementById("sectors_combobox");
        select.appendChild(option);
    };


    $("#sectors_combobox").selectpicker('refresh');
    $("#sectors_combobox").selectpicker('val', 'Cement and Lime');

    sectorsLoaded = true;

}

function onPeriodsComboboxChange() {
    
    $('#offsets_warning_div').hide();

    var textSt = $('#stackedBarChartPerPeriodTitleText').text();

    //console.log("textSt", "'" + textSt + "'");
    
    var periodSelected = $("#periods_combobox").selectpicker('val');

    if (textSt == "Free Allocation per period") {
        
        getFreeAllocationForPeriod(server_url, periodSelected, onGetFreeAllocationForPeriod);
        
    } else if (textSt == "Offsets per period") {
        
        if(periodSelected <= 2012){
            getOffsetsForPeriod(server_url, periodSelected, onGetOffsetsForPeriod);
        }else{
            stackedBarChartData = [];
            createStackedBarChart();
            $('#offsets_warning_div').show();
        }        
        
        
    } else if (textSt == "Verified Emissions per period") {
        
        getVerifiedEmissionsForPeriod(server_url, periodSelected, onGetVerifiedEmissionsForPeriod);
        
    }

}

function onGetPeriods() {

    console.log("onGetPeriods");
    var resultsJSON = JSON.parse(this.responseText);
    var results = resultsJSON.results;
    var errors = resultsJSON.errors;
    var periodsData = results[0].data;


    for (var i = 0; i < periodsData.length; i++) {
        var periodName = periodsData[i].row[0];
        //console.log("periodName'", periodName, "'");
        if (periodName != "2008to2020" && periodName >= 2008 && periodName <= 2015) {
            periods.push(periodName);

            //console.log("periodName",periodName);

            var option = document.createElement("option");
            option.value = periodName;
            option.innerHTML = periodName;

            var select = document.getElementById("periods_combobox");
            select.appendChild(option);
        }

    };
    //console.log("periods", periods);  

    $("#periods_combobox").selectpicker('refresh');
    $("#periods_combobox").selectpicker('val', '2005');
    onPeriodsComboboxChange();
}

function dataForPeriod(responseText) {
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

    stackedBarChartDataBackup = dataArray;
    
    filterDataForStackedBarChart();

}

function onGetFreeAllocationForAllPeriods() {
    console.log("onGetFreeAllocationForAllPeriods");
    //console.log(this.responseText);
    var resultsJSON = JSON.parse(this.responseText);
    var results = resultsJSON.results;
    var errors = resultsJSON.errors;
    var tempData = results[0].data;

    //console.log("this.responseText", this.responseText);

    for (var i = 0; i < tempData.length; i++) {
        var rows = tempData[i].row;
        var tempArray = [];
        var tempPeriod = rows[1];
        var tempValue = rows[0];

        tempArray["tCO2e"] = tempValue;
        tempArray["period"] = tempPeriod;
        tempArray["type"] = "Free Allocation";
        
        if(tempPeriod >= 2008){
            euWideChartDataBackup.push(tempArray);

            //---updating surplus data array EU wide---
            surplusDataArrayEUWide[tempPeriod] += tempValue;
            //-----------------------------------------
        }
        
        
    }

    free_allocation_eu_wide_loaded = true;

    if (allEUWideLoaded()) {
        filterDataForEUWideChart();
    }
}

function onGetOffsetEntitlementsForAllPeriods() {
    console.log("onGetOffsetEntitlementsForAllPeriods");
    //console.log("this.responseText", this.responseText);
    var resultsJSON = JSON.parse(this.responseText);
    var results = resultsJSON.results;
    var errors = resultsJSON.errors;
    var tempData = results[0].data;

    totalOffsetEntitlements = tempData[0].row[0];

    offset_entitlements_eu_wide_loaded = true;

    if (allEUWideLoaded()) {
        filterDataForEUWideChart();
    }

}

function onGetLegalCapForAllPeriods() {
    console.log("onGetLegalCapForAllPeriods");
    //console.log("this.responseText", this.responseText);
    var resultsJSON = JSON.parse(this.responseText);
    var results = resultsJSON.results;
    var errors = resultsJSON.errors;
    var tempData = results[0].data;


    for (var i = 0; i < tempData.length; i++) {
        var rows = tempData[i].row;
        var tempArray = [];
        var tempPeriod = rows[1];
        tempArray["tCO2e"] = rows[0];
        tempArray["period"] = tempPeriod;
        tempArray["type"] = "Legal Cap";
        
        if(tempPeriod >= 2008){
            euWideChartDataBackup.push(tempArray);
        }        
        
    }

    legal_cap_eu_wide_loaded = true;

    if (allEUWideLoaded()) {
        filterDataForEUWideChart();
    }
}

function onGetVerifiedEmissionsForAllPeriods() {
    console.log("onGetVerifiedEmissionsForAllPeriods");
    //console.log(this.responseText);
    var resultsJSON = JSON.parse(this.responseText);
    var results = resultsJSON.results;
    var errors = resultsJSON.errors;
    var tempData = results[0].data;

    for (var i = 0; i < tempData.length; i++) {

        var rows = tempData[i].row;
        var tempArray = [];
        var tempPeriod = rows[1];
        var tempValue = rows[0];

        tempArray["tCO2e"] = tempValue;
        tempArray["period"] = tempPeriod;
        tempArray["type"] = "Verified Emissions";
        
        if(tempPeriod >= 2008){
            euWideChartDataBackup.push(tempArray);

            //---updating surplus data array EU wide---
            surplusDataArrayEUWide[tempPeriod] -= tempValue;
            //-----------------------------------------
        }
        

    };


    verified_emissions_eu_wide_loaded = true;

    if (allEUWideLoaded()) {
        filterDataForEUWideChart();
    }

}

function onGetAuctionedForAllPeriods() {

    console.log("onGetAuctionedForAllPeriods");
    //console.log(this.responseText);
    var resultsJSON = JSON.parse(this.responseText);
    var results = resultsJSON.results;
    var errors = resultsJSON.errors;
    var tempData = results[0].data;

    //console.log("this.responseText", this.responseText);

    for (var i = 0; i < tempData.length; i++) {
        var rows = tempData[i].row;
        var tempPeriod = rows[1];
        var tempValue = rows[0];
        var tempArray = [];

        tempArray["tCO2e"] = tempValue;
        tempArray["period"] = tempPeriod;
        tempArray["type"] = "Auctioned";
        
        if(tempPeriod >= 2008){
            euWideChartDataBackup.push(tempArray);

            //---updating surplus data array EU wide---
            surplusDataArrayEUWide[tempPeriod] += tempValue;
            //-----------------------------------------
        }
        
        
    };

    auctioned_eu_wide_loaded = true;

    if (allEUWideLoaded()) {
        filterDataForEUWideChart();
    }

}

function onGetOffsetsForAllPeriods() {
    console.log("onGetOffsetsForAllPeriods");
    //console.log(this.responseText);
    var resultsJSON = JSON.parse(this.responseText);
    var results = resultsJSON.results;
    var errors = resultsJSON.errors;
    var tempData = results[0].data;

    //console.log("this.responseText", this.responseText);

    for (var i = 0; i < tempData.length; i++) {
        var rows = tempData[i].row;
        var tempArray = [];
        var tempPeriod = rows[1];
        var tempValue = rows[0];

        if (tempPeriod >= 2008) {
            totalOffsetsSoFar += tempValue;
        }

        tempArray["tCO2e"] = tempValue;
        tempArray["period"] = tempPeriod;
        tempArray["type"] = "Offsets";
        
        if(tempPeriod >= 2008){
            euWideChartDataBackup.push(tempArray);

            //---updating surplus data array EU wide---
            surplusDataArrayEUWide[tempPeriod] += tempValue;
            //-----------------------------------------
        }        

    };

    offsets_eu_wide_loaded = true;

    if (allEUWideLoaded()) {
        filterDataForEUWideChart();
    }
}

function onGetVerifiedEmissionsForPeriod() {
    console.log("onGetVerifiedEmissionsForPeriod");
    dataForPeriod(this.responseText);
}

function onGetFreeAllocationForPeriod() {
    console.log("onGetFreeAllocationForPeriod");
    dataForPeriod(this.responseText);
}

function onGetOffsetsForPeriod() {
    console.log("onGetOffsetsForPeriod");
    dataForPeriod(this.responseText);
}


function createStackedBarChart(data) {
    
    stackedBarChartData = data;

    if (!stacked_bar_chart_created) {
        var svg = dimple.newSvg("#stacked_bar_chart", "100%", "100%");

        stackedBarChart = new dimple.chart(svg, data);
        // Fix the margins
        stackedBarChart.setMargins("85px", "20px", "20px", "50px");
        stackedBarChart.addMeasureAxis("y", "tCO2e");
        stackedBarChart.addCategoryAxis("x", "country");
        //y.addOrderRule("Date");
        stackedBarChart.addSeries("sector", dimple.plot.bar);
        //stackedBarChart.addLegend(60, 10, 510, 20, "right");

        stacked_bar_chart_created = true;

    } else {
        stackedBarChart.data = data;
    }

    stackedBarChart.draw(1000);



}


function createEUWideChart(data) {

    $("#eu_wide_chart").removeClass("grey_background");
    $("#eu_wide_spinner_div").hide();

    euWideChartData = data;

    if (!eu_wide_chart_created) {
        var svg = dimple.newSvg("#eu_wide_chart", "100%", "100%");

        euWideChart = new dimple.chart(svg, euWideChartData);

        // Fix the margins
        euWideChart.setMargins("95px", "60px", "20px", "40px");

        var x = euWideChart.addCategoryAxis("x", "period");
        x.addOrderRule("period");
        var y = euWideChart.addMeasureAxis("y", "tCO2e");
        y.tickFormat = 's';
        y.overrideMin = -100000000;
        
        barSeriesEUWide = euWideChart.addSeries("type", dimple.plot.bar);

        lineSeriesEUWide = euWideChart.addSeries("type", dimple.plot.line);

        lineSeriesEUWide.lineMarkers = true;
        lineSeriesEUWide.interpolation = "cardinal";

        euWideChartLegend = euWideChart.addLegend(20, 10, "95%", 300, "left");
        
        eu_wide_chart_created = true;
    } else {

        euWideChart.data = euWideChartData;

    }
    barSeriesEUWide.data = dimple.filterData(data, "type", ["Free Allocation", "Offsets", "Auctioned", "Remaining Credit Entitlements"]);
    lineSeriesEUWide.data = dimple.filterData(data, "type", ["Verified Emissions", "Legal Cap", "Accumulated Balance"]);
    euWideChart.draw(1000);
    
}

function createLineChart(data) {
    lineChartData = data;

    if (!line_chart_created) {
        var svg = dimple.newSvg("#line_chart", "100%", "100%");

        lineChart = new dimple.chart(svg, lineChartData);

        // Fix the margins
        lineChart.setMargins("95px", "60px", "20px", "40px");

        var x = lineChart.addCategoryAxis("x", "period");
        x.addOrderRule("period");
        var y = lineChart.addMeasureAxis("y", "tCO2e");
        y.tickFormat = 's';           

        barSeries = lineChart.addSeries("type", dimple.plot.bar);


        lineSeries = lineChart.addSeries("type", dimple.plot.line);

        lineSeries.lineMarkers = true;
        lineSeries.interpolation = "cardinal";


        lineChart.addLegend(20, 10, "95%", 300, "left");


        line_chart_created = true;
    } else {

        lineChart.data = lineChartData;

    }
    barSeries.data = dimple.filterData(data, "type", ["Free_Allocation", "Offsets"]);
    lineSeries.data = dimple.filterData(data, "type", "Verified_Emissions");
    lineChart.draw(1000);
    

}

function onComboBoxChange() {


    var selectedCountry = $("#countries_combobox").selectpicker('val');

    var selectedSector = $("#sectors_combobox").selectpicker('val');
    
    var selectedPowerFlag = $("#power_flag_combobox").selectpicker('val');

    //    console.log("selectedCountry",selectedCountry);
    //    console.log("selectedSector",selectedSector);


    if (selectedCountry != null && selectedSector != null) {
        
        installations_loaded = false;
        marker_popups_ids = [];

        disableLineChartPanelAndDropDowns();

        var selectedSectorSt = "[";
        var selectedCountrySt = "[";

        for (var i = 0; i < selectedCountry.length; i++) {
            var currentValue = selectedCountry[i];
            selectedCountrySt += "'" + currentValue + "',";
        }
        for (var i = 0; i < selectedSector.length; i++) {
            var currentValue = selectedSector[i];
            selectedSectorSt += "'" + currentValue + "',";
        }

        selectedSectorSt = selectedSectorSt.slice(0, selectedSectorSt.length - 1);
        selectedSectorSt += "]";
        selectedCountrySt = selectedCountrySt.slice(0, selectedCountrySt.length - 1);
        selectedCountrySt += "]";

        //console.log("selectedSectorSt", selectedSectorSt);
        //console.log("selectedCountrySt", selectedCountrySt);
        
        if(countrySectorChartDisplayed != true){
            
            loadDataForMapView();            
            
        }
        
        lineChartDataBackup = [];

        verified_emissions_loaded = false;
        offsets_loaded = false;
        free_allocation_loaded = false;
        
        getVerifiedEmissionsForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, true, selectedPowerFlag, onGetVerifiedEmissionsForCountryAndSector);
        getOffsetsForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, true, selectedPowerFlag,  onGetOffsetsForCountryAndSector);
        getFreeAllocationForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, true, selectedPowerFlag,  onGetFreeAllocationForCountryAndSector);
        
        
    }

}

function dataForLineChartLoaded() {
    filterDataForLineChart();
    $("#line_chart").removeClass("grey_background");
    $("#spinner_div_country_sector").hide();
    $("#countries_combobox").prop("disabled", false);
    $("#sectors_combobox").prop("disabled", false);
    lineChart.draw(1000);
}

function onGetInstallationsForCountryAndSector(){
    console.log("onGetInstallationsForCountryAndSector");
    var resultsJSON = JSON.parse(this.responseText);
    var results = resultsJSON.results;
    var errors = resultsJSON.errors;
    //console.log("errors", errors);
    var tempData = results[0].data;
    
    //-----remove previous layers----
    if(markers){
        installations_map.removeLayer(markers);
    }    
    //-------------------------------

    //----Creating markers cluster-----
    markers = L.markerClusterGroup();
    
    for (var i = 0; i < tempData.length; i++) {
        
        var rows = tempData[i].row;
        var installationId = rows[0];
        var installationName = rows[1];
        var latitude = rows[2];
        var longitude = rows[3];
        var sector = rows[4];
        var city = rows[5];
        var address = rows[6];
        
        var locationArray = [latitude, longitude];
        
        marker_popups_ids.push(installationId);
        
        var marker = L.marker(locationArray); 
        
        marker.bindPopup("<div id=\"" + installationId + "\"><strong>Name:</strong> " + installationName + "<br><strong>ID:</strong> " + installationId + "<br><strong>Address:</strong> " + address + "<br><strong>City:</strong> " + city + "<br><strong>Sector:</strong> " + sector + "</div>");
        
        if(sector == "Cement and Lime"){
            marker.setIcon(cement_and_lime_icon);
        }else if(sector == "Aviation"){
            marker.setIcon(aviation_icon);
        }else if(sector == "Ceramics"){
            marker.setIcon(ceramics_icon);
        }else if(sector == "Chemicals"){
            marker.setIcon(chemicals_icon);
        }else if(sector == "Coke ovens"){
            marker.setIcon(coke_ovens_icon);
        }else if(sector == "Combustion"){
            marker.setIcon(combustion_icon);
        }else if(sector == "Glass"){
            marker.setIcon(glass_icon);
        }else if(sector == "Iron and steel"){
            marker.setIcon(iron_and_steel_icon);
        }else if(sector == "Metal ore roasting"){
            marker.setIcon(metal_ore_roasting_icon);
        }else if(sector == "Mineral oil"){
            marker.setIcon(mineral_oil_icon);
        }else if(sector == "Non ferrous metals"){
            marker.setIcon(non_ferrous_metals_icon);
        }else if(sector == "Other"){
            marker.setIcon(other_icon);
        }else if(sector == "Pulp and paper"){
            marker.setIcon(pulp_and_paper_icon);
        }
        
        marker.on("click", onMarkerClick);
        marker.installationId = installationId;
        markers.addLayer(marker);         
        //console.log("i", i);
        
    };
    
    
    installations_map.addLayer(markers);
    
    installations_map.setZoom(3);
    
    installations_loaded = true;
    
    $("#map_div").removeClass("grey_background");
    $("#spinner_div_installations_map").hide();
    

}

function onMarkerClick(){
    console.log(this);
    console.log("this.installationIdSt",this.installationId);
}

function onGetVerifiedEmissionsForCountryAndSector() {

    console.log("onGetVerifiedEmissionsForCountryAndSector");
    var resultsJSON = JSON.parse(this.responseText);
    var results = resultsJSON.results;
    var errors = resultsJSON.errors;
    //console.log("errors", errors);
    var tempData = results[0].data;

    for (var i = 0; i < tempData.length; i++) {
        var rows = tempData[i].row;
        lineChartDataBackup.push({
            "tCO2e": rows[0],
            "type": "Verified_Emissions",
            "period": rows[1]
        });
    };

    verified_emissions_loaded = true;
    if (verified_emissions_loaded && free_allocation_loaded && offsets_loaded) {
        dataForLineChartLoaded();
    }
}

function onGetOffsetsForCountryAndSector() {

    console.log("onGetOffsetsForCountryAndSector");
    var resultsJSON = JSON.parse(this.responseText);
    var results = resultsJSON.results;
    var errors = resultsJSON.errors;
    //console.log("errors", errors);
    var tempData = results[0].data;

    for (var i = 0; i < tempData.length; i++) {
        var rows = tempData[i].row;
        lineChartDataBackup.push({
            "tCO2e": rows[0],
            "type": "Offsets",
            "period": rows[1]
        });
    };

    offsets_loaded = true;
    if (verified_emissions_loaded && free_allocation_loaded && offsets_loaded) {
        dataForLineChartLoaded();
    }
}

function onGetFreeAllocationForCountryAndSector() {

    console.log("onGetFreeAllocationForCountryAndSector");
    var resultsJSON = JSON.parse(this.responseText);
    var results = resultsJSON.results;
    var errors = resultsJSON.errors;
    //console.log("errors", errors);
    var tempData = results[0].data;


    for (var i = 0; i < tempData.length; i++) {
        var rows = tempData[i].row;
        //console.log("aa: ",rows[0], rows[1]);
        lineChartDataBackup.push({
            "tCO2e": rows[0],
            "type": "Free_Allocation",
            "period": rows[1]
        });
    };

    free_allocation_loaded = true;
    if (verified_emissions_loaded && free_allocation_loaded && offsets_loaded) {
        dataForLineChartLoaded();
    }
}

function calculateCumulativeSurplusEUWide() {

    var accumulatedAmount = 0;

    for (i = 2008; i <= 2015; i++) {
        accumulatedAmount += surplusDataArrayEUWide[i];
        surplusAccumulatedDataArrayEUWide[i] = accumulatedAmount;

        var tempArray = [];
        tempArray["tCO2e"] = surplusAccumulatedDataArrayEUWide[i];
        tempArray["period"] = i;
        tempArray["type"] = "Accumulated Balance";

        euWideChartDataBackup.push(tempArray);

    }

}

function calculateRemainingCreditEntitlement() {

    var annualValue = (totalOffsetEntitlements - totalOffsetsSoFar) / 5; //2016 - 2020

    for (i = 2016; i <= 2020; i++) {

        var tempArray = [];
        tempArray["tCO2e"] = annualValue;
        tempArray["period"] = i;
        tempArray["type"] = "Remaining Credit Entitlements";

        euWideChartDataBackup.push(tempArray);
    }
}


function filterEUWideArrayBasedOnCheckboxesSelected(value) {
    //console.log("filterEUWideArrayBasedOnCheckboxesSelected");
    var includeVerifiedEmissions = $('#verified_emissions_eu_wide_checkbox:checked').length == 1;
    var includeOffsets = $('#offsets_eu_wide_checkbox:checked').length == 1;
    var includeFreeAllocation = $('#free_allocation_eu_wide_checkbox:checked').length == 1;
    var includeAuctioned = $('#auctioned_eu_wide_checkbox:checked').length == 1;
    var includeLegalCap = $('#legal_cap_eu_wide_checkbox:checked').length == 1;
    var includeAccumulatedBalance = $('#accumulated_balance_eu_wide_checkbox:checked').length == 1;
    var includeRemainingCreditEntitlements = $('#remaining_credit_entitlements_eu_wide_checkbox:checked').length == 1;

    var tempType = value.type;

    if (tempType == "Verified Emissions") {
        return includeVerifiedEmissions;
    } else if (tempType == "Free Allocation") {
        return includeFreeAllocation;
    } else if (tempType == "Offsets") {
        return includeOffsets;
    } else if (tempType == "Auctioned") {
        return includeAuctioned;
    } else if (tempType == "Legal Cap") {
        return includeLegalCap;
    } else if (tempType == "Accumulated Balance") {
        return includeAccumulatedBalance;
    } else if (tempType == "Remaining Credit Entitlements") {
        return includeRemainingCreditEntitlements;
    } else {
        return false;
    }
}

//array filtering functions
function filterArrayBasedOnCheckboxesSelected(value) {
    var includeVerifiedEmissions = $('#verified_emissions_checkbox:checked').length == 1;
    var includeOffsets = $('#offsets_checkbox:checked').length == 1;
    var includeFreeAllocation = $('#free_allocation_checkbox:checked').length == 1;

    var tempType = value.type;

    if (tempType == "Verified_Emissions") {
        return includeVerifiedEmissions;
    } else if (tempType == "Free_Allocation") {
        return includeFreeAllocation;
    } else if (tempType == "Offsets") {
        return includeOffsets;
    } else {
        return false;
    }
}

function filterStackedBarArrayBasedOnCheckboxesSelected(value) {
        
    var includeAviation = $('#aviation_checkbox:checked').length == 1;
    var includeCementAndLime = $('#cement_and_lime_checkbox:checked').length == 1;
    var includeCeramics = $('#ceramics_checkbox:checked').length == 1;
    var includeChemicals = $('#chemicals_checkbox:checked').length == 1;
    var includeCokeOvens = $('#coke_ovens_checkbox:checked').length == 1;
    var includeCombustion = $('#combustion_checkbox:checked').length == 1;
    var includeGlass = $('#glass_checkbox:checked').length == 1;
    var includeIronAndSteel = $('#iron_and_steel_checkbox:checked').length == 1;
    var includeMetalOreRoasting = $('#metal_ore_roasting_checkbox:checked').length == 1;
    var includeMineralOil = $('#mineral_oil_checkbox:checked').length == 1;
    var includeNonFerrousMetals = $('#non_ferrous_metals_checkbox:checked').length == 1;
    var includeOther = $('#other_checkbox:checked').length == 1;
    var includePulpAndPaper = $('#pulp_and_paper_checkbox:checked').length == 1;

    var tempType = value.sector;
    
    if (tempType == "Aviation") {
        return includeAviation;
    } else if (tempType == "Cement and Lime") {
        return includeCementAndLime;
    } else if (tempType == "Ceramics") {
        return includeCeramics;
    } else if (tempType == "Chemicals") {
        return includeChemicals;
    } else if (tempType == "Coke ovens") {
        return includeCokeOvens;
    } else if (tempType == "Combustion") {
        return includeCombustion;
    } else if (tempType == "Glass") {
        return includeGlass;
    } else if (tempType == "Iron and steel") {
        return includeIronAndSteel;
    } else if (tempType == "Metal ore roasting") {
        return includeMetalOreRoasting;
    } else if (tempType == "Mineral oil") {
        return includeMineralOil;
    } else if (tempType == "Non ferrous metals") {
        return includeNonFerrousMetals;
    } else if (tempType == "Other") {
        return includeOther;
    } else if (tempType == "Pulp and paper") {
        return includePulpAndPaper;
    } 
}

function allEUWideLoaded() {

    var everythingLoaded = verified_emissions_eu_wide_loaded == true && free_allocation_eu_wide_loaded == true &&
        offsets_eu_wide_loaded == true && auctioned_eu_wide_loaded == true && legal_cap_eu_wide_loaded == true &&
        offset_entitlements_eu_wide_loaded == true;

    if (everythingLoaded == true) {
        calculateCumulativeSurplusEUWide();
        calculateRemainingCreditEntitlement();
    }

    //console.log("everythingLoaded", everythingLoaded);

    return everythingLoaded;
}


function initializeMapIcons(){
    
    aviation_icon = L.icon({
        iconUrl: './images/icons/aviation.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [26, 26], // point of the icon which will correspond to marker's location        
        popupAnchor:  [26, -52] // point from which the popup should open relative to the iconAnchor
    });
    
    cement_and_lime_icon = L.icon({
        iconUrl: './images/icons/cement_and_lime.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [24, 24], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
    });
    
    ceramics_icon = L.icon({
        iconUrl: './images/icons/ceramics.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
    });
    
    chemicals_icon = L.icon({
        iconUrl: './images/icons/chemicals.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
    });
    
    coke_ovens_icon = L.icon({
        iconUrl: './images/icons/coke_ovens.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
    });
    
    combustion_icon = L.icon({
        iconUrl: './images/icons/combustion.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
    });
    
    glass_icon = L.icon({
        iconUrl: './images/icons/glass.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
    });
    
    iron_and_steel_icon = L.icon({
        iconUrl: './images/icons/iron_and_steel.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
    });
    
    mineral_oil_icon = L.icon({
        iconUrl: './images/icons/mineral_oil.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
    });
    
    non_ferrous_metals_icon = L.icon({
        iconUrl: './images/icons/non_ferrous_metals.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
    });
    
    other_icon = L.icon({
        iconUrl: './images/icons/other.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
    });
    
    pulp_and_paper_icon =  L.icon({
        iconUrl: './images/icons/pulp_and_paper.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
    });
    
    metal_ore_roasting_icon =  L.icon({
        iconUrl: './images/icons/metal_ore_roasting.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
    });
    
    
  }

function validateForm(){
    var spamCheckerVal = $('#InputReal').val();
    
    console.log("spamCheckerVal",spamCheckerVal);
    
    if(spamCheckerVal == '7'){
        $('#form_success_div').show();
        return true;
    }else{
        $('#form_success_div').hide();
        $('#form_error_spam_checker_div').show();    
        return false;
    }
    
}
 