var server_url = "http://52.208.154.95:7474/db/data/transaction/commit";
//var server_url = "http://localhost:7474/db/data/transaction/commit";

var doNotShowWelcomeDialogAgainCookieName = "no_welcome_dialog";

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
var dataPerPeriodChart;
var dataPerPeriodChartSvg;
var dataPerPeriodChartCategoryAxis;
var dataPerPeriodChartData = [];
var dataPerPeriodChartDataBackup = [];
var dataPerPeriodChartCurrentType = 'bar';
var sectorsLoaded = false;
var countriesLoaded = false;
var periodsLoaded = false;

var verified_emissions_eu_wide_loaded = false;
var free_allocation_eu_wide_loaded = false;
var offsets_eu_wide_loaded = false;
var auctioned_eu_wide_loaded = false;
var legal_cap_eu_wide_loaded = false;
var offset_entitlements_eu_wide_loaded = false;

var verified_emissions_loaded = false;
var free_allocation_loaded = false;
var offsets_loaded = false;

var line_chart_created = false;
var data_per_period_chart_created = false;
var eu_wide_chart_created = false;

var EU_COUNTRIES_ARRAY = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
    "Iceland", "Ireland", "Italy", "Latvia", "Lithuania", "Liechtenstein",
    "Luxembourg", "Malta", "Netherlands", "Norway", "Poland", "Portugal",
    "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "United Kingdom"
];

var SECTORS_ARRAY = ["Aviation", "Cement and Lime", "Ceramics", "Chemicals", "Coke ovens", "Combustion",
                    "Glass", "Iron and steel", "Metal ore roasting", "Mineral oil", "Non ferrous metals",
                    "Other", "Pulp and paper"];

var  EU_WIDE_LEGEND_VALUES = {"Free Allocation": "Permits issued by the European Commission every<br> year to each stationary installation and aircraft operator.", "Auctioned": "Auctioned", "Offsets": "Offsets", "Remaining Credit Entitlements": "This series represents an estimation of<br> how the remaining credit entitlements could be<br> distributed across the years", "Verified Emissions": "Tones of carbon emitted by the <br>different stationary installations and <br>aircraft operators", "Accumulated Balance":"Accumulated surplus calculated as follows: <br>Accumulated Verified Emissions - ( Accumulated Auctioned <br>+ Accumulated Offsets + Accumulated Free Allocation)", "Legal Cap": "Legal Cap stated by the European Commission"};

var INSTALLATIONS_MAP_INITIAL_ZOOM = 3;

var installations_map;
var marker_popups_ids = [];
var markers;
var welcomeMapViewDialog;

var countrySectorChartDisplayed = false;
var installationsMapDisplayed = false;
var noInternetConnection = false;

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

var formatNumber = d3.format(".4s");
var formatNumberEUWideChart = d3.format(".5s");
var formatNumberDataPerPeriod = d3.format(".5s");
var formatNumberCountrySector = d3.format(".5s");
var formatNumberAddCommas = d3.format(",");

var MARKERS_SIZE_RANGE = [40,80];

var map_color_scale;
var map_size_scale;
                                                     

var map_opened_for_the_first_time = true;
var euWideLegendTip;
var map_legend;

var firstSectionToLoad = "euwide";
var loadFirstSectionFlag = false;

function loadFirstSection(){
    
    console.log("loadFirstSection");
    console.log("firstSectionToLoad",firstSectionToLoad);
    
    if(firstSectionToLoad == "map"){
        loadMapView();
    }else if(firstSectionToLoad == "trends"){
        loadDataPerPeriodView();
    }else if(firstSectionToLoad == "sectors"){
        loadCountrySectorsView();        
    }else if(firstSectionToLoad == "euwide"){
        loadEUWideView();
    }
    
}


function initMainPage(argument) {
    
    firstSectionToLoad = argument;
    
    console.log("init main page...");
    
    
    //Welcome dialog
    
    if(Cookies.get(doNotShowWelcomeDialogAgainCookieName) != "true"){
        $('#welcome_modal').modal('show');
    }    
    
    
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
    
    /* Initialize tooltip */
    euWideLegendTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .direction("s")
      .html(function(d) {
        //console.log("d",d);
        return "<span style='color:black'>" + EU_WIDE_LEGEND_VALUES[d.key] + "</span>";
      });
    
    
    initializeMapIcons();

    initCountries();
        
    
    if(argument == "euwide"){
        
        var includeAviation = $('#include_aviation_combobox').selectpicker('val');
        loadEUWideData(includeAviation);
        
    }else if(argument == "map" || argument == "trends" || argument == "sectors") {
        
        loadFirstSectionFlag = true;
        
    }else if(argument == "contact"){
        
        loadContactUsView();
        
    }
    
    getSandbagSectors(server_url, onGetSectors);
    getPeriods(server_url, onGetPeriods);
    
}

function initializeSurplusDataArrayEUWide() {
    //------INITIALIZING SURPLUS DATA ARRAY------
    for (var i = 2005; i <= 2015; i++) {
        surplusDataArrayEUWide[i] = 0;
    }
    //-------------------------------------------
}

function updateWelcomeDialogCookie(){
    var notShowAgain = $('#do_not_show_welcome_dialog_again_checkbox:checked').length == 1;
    console.log("setting cookie value...");
    if(notShowAgain){
        Cookies.set(doNotShowWelcomeDialogAgainCookieName, "true");
    }else{
        Cookies.set(doNotShowWelcomeDialogAgainCookieName, "false");
    }
    console.log("getting cookie value...", Cookies.get(doNotShowWelcomeDialogAgainCookieName));
}

function loadEUWideData(includeAviation) {
    
    console.log("loadEUWideData");
    console.log("includeAviation",includeAviation);

    initializeSurplusDataArrayEUWide();
    resetEUWideDataLoadedText();

    verified_emissions_eu_wide_loaded = false;
    free_allocation_eu_wide_loaded = false;
    offsets_eu_wide_loaded = false;
    auctioned_eu_wide_loaded = false;
    legal_cap_eu_wide_loaded = false;
    offset_entitlements_eu_wide_loaded = false;
    

    euWideChartDataBackup = [];
    euWideChartData = [];
    surplusAccumulatedDataArrayEUWide = [];
    
    totalOffsetEntitlements = 0;
    totalOffsetsSoFar = 0;

    $("#eu_wide_chart").addClass("grey_background");
    $("#eu_wide_spinner_div").show();

    getAuctionedEUWide(server_url, includeAviation, onGetAuctionedEUWide);
    getOffsetsEUWide(server_url, includeAviation, onGetOffsetsEUWide);
    getVerifiedEmissionsEUWide(server_url, includeAviation, onGetVerifiedEmissionsEUWide);
    getFreeAllocationEUWide(server_url, includeAviation, onGetFreeAllocationEUWide)
    getLegalCapEUWide(server_url, includeAviation, onGetLegalCapEUWide);
    getOffsetEntitlementsEUWide(server_url, includeAviation, onGetOffsetEntitlementsEUWide);
}

function noValueSelectedForCountriesOrSectors() {

}

function loadCountrySectorChart() {
    onComboBoxChange();
}

function loadCountrySectorsView(){
    $('#multi_line_chart_row').show();
    $('#countries_sectors_row').show();
    $('#about_row').hide();
    $('#periods_combo_box_row').hide();
    $('#stacked_bar_chart_row').hide();
    $('#eu_wide_chart_row').hide();
    $('#contact_us_row').hide();
    $('#installations_row').hide();
    
    //deselecting other buttons and selecting appropriate button
    $(".nav").find(".active").removeClass("active");
    $('#country_sector_chart_button').parent().addClass("active");

    countrySectorChartDisplayed = true;
    installationsMapDisplayed = false;
    loadCountrySectorChart();
}

function loadErrorView(){
    $('#error_row').show();
    $('#about_row').hide();
    $('#contact_us_row').hide();
}

function loadMapView(){
    $('#multi_line_chart_row').hide();            
    $('#about_row').hide();    
    $('#stacked_bar_chart_row').hide();
    $('#eu_wide_chart_row').hide();
    $('#contact_us_row').hide();
    $('#countries_sectors_row').hide();
    $('#periods_combo_box_row').show();
    $('#installations_row').show();
    
    //deselecting other buttons and selecting appropriate button
    $(".nav").find(".active").removeClass("active");
    $('#installations_button').parent().addClass("active");

    installationsMapDisplayed = true;
    $("#periods_combobox").selectpicker('val', '2015');
    loadDataForMapView();
}

function loadAboutView(){
    $('#multi_line_chart_row').hide();
    $('#countries_sectors_row').hide();
    $('#periods_combo_box_row').hide();
    $('#stacked_bar_chart_row').hide();
    $('#contact_us_row').hide();
    $('#installations_row').hide();
    $('#eu_wide_chart_row').hide();
    $('#error_row').hide();
    $('#about_row').show();
    
    //deselecting other buttons and selecting appropriate button
    $(".nav").find(".active").removeClass("active");
    $('#about_button').parent().addClass("active");
            
    countrySectorChartDisplayed = false;
    installationsMapDisplayed = false;
}

function loadDataPerPeriodView(){
    console.log("loadDataPerPeriodView");
    $('#multi_line_chart_row').hide();
    $('#countries_sectors_row').hide();
    $('#about_row').hide();
    $('#eu_wide_chart_row').hide();
    $('#contact_us_row').hide();
    $('#installations_row').hide();
    $('#periods_combo_box_row').show();
    $('#stacked_bar_chart_row').show();  

    //deselecting other buttons and selecting appropriate button
    $(".nav").find(".active").removeClass("active");
    $('#stacked_bar_chart_button').parent().addClass("active");
        
    countrySectorChartDisplayed = false; 
    installationsMapDisplayed = false;
    $("#periods_combobox").selectpicker('val', '2008');
    onDataPerPeriodComboboxChange();
    onResize();
}

function loadEUWideView(){
    $('#multi_line_chart_row').hide();
    $('#countries_sectors_row').hide();
    $('#periods_combo_box_row').hide();
    $('#contact_us_row').hide();
    $('#stacked_bar_chart_row').hide();
    $('#about_row').hide();
    $('#installations_row').hide();
    $('#eu_wide_chart_row').show();
    
    //deselecting other buttons and selecting appropriate button
    $(".nav").find(".active").removeClass("active");
    $('#eu_wide_chart_button').parent().addClass("active");

    var includeAviation = $('#include_aviation_combobox').selectpicker('val');
    loadEUWideData(includeAviation);
    countrySectorChartDisplayed = false;
    installationsMapDisplayed = false;
    onResize();
}

function loadContactUsView(){
    $('#multi_line_chart_row').hide();
    $('#countries_sectors_row').hide();
    $('#periods_combo_box_row').hide();
    $('#stacked_bar_chart_row').hide();
    $('#eu_wide_chart_row').hide();
    $('#about_row').hide();
    $('#installations_row').hide();
    $('#error_row').hide();
    $('#contact_us_row').show();
    
    //deselecting other buttons and selecting appropriate button
    $(".nav").find(".active").removeClass("active");
    $('#contact_us_button').parent().addClass("active");
    
    countrySectorChartDisplayed = false;
    installationsMapDisplayed = false;
}

function initMenus() {
    
    $('.nav li a').click(function(e) {
        
        var tempId = e.currentTarget.getAttribute("id");        
        
        if (tempId == "country_sector_chart_button" ) {
            
            if(noInternetConnection == false){
                
                e.preventDefault();
                loadCountrySectorsView();
                
            }else{
                loadErrorView();                
            }           
            
            
        }else if (tempId == "installations_button") {
            
            if(noInternetConnection == false){
                
                e.preventDefault();
                loadMapView();
                
            }else{
                loadErrorView();     
            }
            
            
        }else if(tempId == "contact_us_button"){
            
            e.preventDefault();
            loadContactUsView();
            
            
        } else if (tempId == "stacked_bar_chart_button") {
            
            if(noInternetConnection == false){
                
                e.preventDefault();
                loadDataPerPeriodView();
                
            }else{
                loadErrorView();     
            }
                        
            
        } else if (tempId == "about_button") {
                        
            e.preventDefault();
            loadAboutView();
            
            
        } else if (tempId == "eu_wide_chart_button" && noInternetConnection == false) {
            
            if(noInternetConnection == false){
                
                e.preventDefault();
                loadEUWideView();
                
            }else{
                loadErrorView();     
            }         
            
        }

    });
}


function onLoad() {
    $('.selectpicker').selectpicker();
}

function onResize(){
    console.log("onResize()");
    if(euWideChart){
        createEUWideChart(euWideChartData);
        //euWideChart.draw(1000);
    }
    if(lineChart){
        lineChart.draw(1000);
    }
    if(dataPerPeriodChart){
        dataPerPeriodChart.draw(1000);
    }
}


function disableCountrySectorDropDowns() {    

    $("#sectors_combobox").prop("disabled", true);
    $("#sectors_combobox").selectpicker('refresh');
    $("#countries_combobox").prop("disabled", true);
    $("#countries_combobox").selectpicker('refresh');
    $("#power_flag_combobox").prop("disabled", true);
    $("#power_flag_combobox").selectpicker('refresh');
}
function enableCountrySectorDropDowns(){
    
    $("#sectors_combobox").prop("disabled", false);
    $("#sectors_combobox").selectpicker('refresh');
    $("#countries_combobox").prop("disabled", false);
    $("#countries_combobox").selectpicker('refresh');
    $("#power_flag_combobox").prop("disabled", false);
    $("#power_flag_combobox").selectpicker('refresh');
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

    onDataPerPeriodComboboxChange();
}

function onIncludeAviationComboboxChange() {
    var includeAviation = $('#include_aviation_combobox').selectpicker('val');
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

    var dataString = "data:text/csv;charset=utf-8,Period,tCO2e,type\n";

    for (var i = 0; i < lineChartData.length; i++) {
        var row = lineChartData[i];
        dataString += row.period + "," + row.tCO2e + "," + row.type + "\n";
    }

    var encodedUri = encodeURI(dataString);
    window.open(encodedUri);
}


function loadDataForMapView(){
    
    console.log("loadDataForMapView");
    
    if(!installations_map){
        installations_map = L.map('map_div').setView([47.540043, 7.603260], 3);
        
        installations_map.on("click",onInstallationsMapClick);
    
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'pablopareja.0e3lnp48',
            accessToken: 'pk.eyJ1IjoicGFibG9wYXJlamEiLCJhIjoiY2lwamxuaHY4MDA2M3Z4a3d4emRhMG00eCJ9.gKyvi9hMyE6wxa0o4-GDgQ'
        }).addTo(installations_map);           
    } 

        
    var selectedCountry = $("#countries_filter_combobox").selectpicker('val');
    var selectedSector = $("#sectors_filter_combobox").selectpicker('val');
    var selectedPowerFlag = $("#power_flag_combobox_data_per_period").selectpicker('val');
    var periodSelected = $("#periods_combobox").selectpicker('val');
    

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
        
        var periodSelectedSt = "[";

        for (var i = 0; i < periodSelected.length; i++) {
            var currentValue = periodSelected[i];
            periodSelectedSt += "'" + currentValue + "',";
        }

        periodSelectedSt = periodSelectedSt.slice(0, periodSelectedSt.length - 1);
        periodSelectedSt += "]";

        getInstallationsForCountryAndSector(server_url,selectedCountrySt,selectedSectorSt, true, selectedPowerFlag, periodSelectedSt, onGetInstallationsForCountryAndSector);
            
        $("#map_div").addClass("grey_background");
        $("#spinner_div_installations").show();

    }    
    
}

function onInstallationsMapClick(){
    if(welcomeMapViewDialog){
        welcomeMapViewDialog.close();
    }
}

function onExportVerifiedEmissionsChartButtonClick() {

    var dataString = "data:text/tsv;charset=utf-8,Verified Emissions\tCountry\tSector\n";

    for (var i = 0; i < dataPerPeriodChartData.length; i++) {
        var row = dataPerPeriodChartData[i];
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
    }

}


function initCountries() {


    for (var i = 0; i < EU_COUNTRIES_ARRAY.length; i++) {

        var countryName = EU_COUNTRIES_ARRAY[i];
        countries.push(countryName);

        var option = document.createElement("option");
        option.value = countryName;
        option.innerHTML = countryName;
                
        option.setAttribute("data-content", "<img src='./images/icons/" + countryName + ".png'></img>    " + countryName);
        
        var select = document.getElementById("countries_combobox");
        select.appendChild(option);
        
        var option2 = document.createElement("option");
        option2.value = countryName;
        option2.innerHTML = countryName;
                
        option2.setAttribute("data-content", "<img src='./images/icons/" + countryName + ".png'></img>    " + countryName);
        
        var select2 = document.getElementById("countries_filter_combobox");
        select2.appendChild(option2);
    };

    $("#countries_combobox").selectpicker('refresh');
    $("#countries_combobox").selectpicker('val', EU_COUNTRIES_ARRAY);
    
    $("#countries_filter_combobox").selectpicker('refresh');
    $("#countries_filter_combobox").selectpicker('val', EU_COUNTRIES_ARRAY);

    countriesLoaded = true;

}

function onGetSectors() {

    console.log("onGetSectors");
    var responseSt = this.responseText;
    
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
    
        var results = resultsJSON.results;
        var errors = resultsJSON.errors;
        var sectorsData = results[0].data;


        for (var i = 0; i < sectorsData.length; i++) {
            var sectorName = sectorsData[i].row[0];
            sectors.push(sectorName);

            var option = document.createElement("option");
            option.value = sectorName;
            option.setAttribute("data-content", "<img src='./images/icons/" + sectorName + ".png'></img>    " + sectorName);

            var select = document.getElementById("sectors_combobox");
            select.appendChild(option);

            var option2 = document.createElement("option");
            option2.value = sectorName; 
            option2.setAttribute("data-content", "<img src='./images/icons/" + sectorName + ".png'></img>    " + sectorName);

            var select2 = document.getElementById("sectors_filter_combobox");
            select2.appendChild(option2);
        };


        $("#sectors_combobox").selectpicker('refresh');
        $("#sectors_combobox").selectpicker('val', "Cement and Lime");

        $("#sectors_filter_combobox").selectpicker('refresh');
        $("#sectors_filter_combobox").selectpicker('val', SECTORS_ARRAY);

        sectorsLoaded = true;
        
        if(periodsLoaded && loadFirstSectionFlag){
            loadFirstSection();
        }
        
    }else{
        problemWithRequests();
    }  

}

function problemWithRequests(){
    $('#error_row').show();
    $('#multi_line_chart_row').hide();
    $('#countries_sectors_row').hide();
    $('#about_row').hide();
    $('#periods_combo_box_row').hide();
    $('#stacked_bar_chart_row').hide();
    $('#eu_wide_chart_row').hide();
    $('#contact_us_row').hide();
    $('#installations_row').hide();
    
    noInternetConnection = true;
}

function onDataPerPeriodComboboxChange() {
    
    $('#offsets_warning_div').hide();

    var textSt = $('#stackedBarChartPerPeriodTitleText').text();
    var valuesSelectedAfter2012 = false;
    var periodSelected = $("#periods_combobox").selectpicker('val');
    
    if(periodSelected.length > 0){
        
        var periodSelectedSt = "[";

        for (var i = 0; i < periodSelected.length; i++) {
            var currentValue = periodSelected[i];
            if(currentValue > 2012){
                valuesSelectedAfter2012 = true;
            }
            periodSelectedSt += "'" + currentValue + "',";
        }

        periodSelectedSt = periodSelectedSt.slice(0, periodSelectedSt.length - 1);
        periodSelectedSt += "]";

        var powerFlagValue = $("#power_flag_combobox_data_per_period").selectpicker('val');

        var offsetsAfter2012 = false;

        console.log("installationsMapDisplayed", installationsMapDisplayed);

        if(installationsMapDisplayed){

            loadDataForMapView();

        }else{

            if (textSt == "Free Allocation per period") {

                getFreeAllocationForPeriod(server_url, periodSelectedSt, powerFlagValue, onGetFreeAllocationForPeriod);

            } else if (textSt == "Offsets per period") {

                if(valuesSelectedAfter2012  == false){
                    getOffsetsForPeriod(server_url, periodSelectedSt, powerFlagValue, onGetOffsetsForPeriod);
                }else{
                    offsetsAfter2012 = true;
                    dataPerPeriodChartData = [];
                    createDataPerPeriodChart([],dataPerPeriodChartCurrentType);
                    $('#offsets_warning_div').show();
                }        


            } else if (textSt == "Verified Emissions per period") {

                getVerifiedEmissionsForPeriod(server_url, periodSelectedSt, powerFlagValue, onGetVerifiedEmissionsForPeriod);

            }

            if(offsetsAfter2012 == false){
                $("#data_per_period_chart").addClass("grey_background");
                $("#data_per_period_spinner_div").show();
                $("#periods_combobox").prop("disabled", true);
                $("#periods_combobox").selectpicker('refresh');
            }   
        } 
    } 

}


function filterDataForDataPerPeriodChart(){    
    
    if(installationsMapDisplayed){
        onDataPerPeriodComboboxChange();
    }else{
        dataPerPeriodChartData = dataPerPeriodChartDataBackup.filter(filterdataPerPeriodChartDataByCountry);
        createDataPerPeriodChart(dataPerPeriodChartData, dataPerPeriodChartCurrentType);
    }   
    
}

function filterdataPerPeriodChartDataByCountry(value){
        
    var tempCountry = value.country;
    var tempSector = value.sector;    
    
    var selectedCountry = $("#countries_filter_combobox").selectpicker('val');
    var selectedSector = $("#sectors_filter_combobox").selectpicker('val');
    
    if(selectedCountry && selectedSector){
        var countryFilterPassed = selectedCountry.includes(tempCountry);    
        var sectorFilterPassed = selectedSector.includes(tempSector);
        return (countryFilterPassed && sectorFilterPassed);
    }else{
        return false;
    }
        
}


function onGetPeriods() {

    console.log("onGetPeriods");
    var responseSt = this.responseText;
    
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
        var results = resultsJSON.results;
        var errors = resultsJSON.errors;
        var periodsData = results[0].data;


        for (var i = 0; i < periodsData.length; i++) {
            var periodName = periodsData[i].row[0];
            if (periodName != "2008to2020" && periodName >= 2008 && periodName <= 2015) {
                periods.push(periodName);

                var option = document.createElement("option");
                option.value = periodName;
                option.innerHTML = periodName;

                var select = document.getElementById("periods_combobox");
                select.appendChild(option);
            }

        };

        $("#periods_combobox").selectpicker('refresh');
        $("#periods_combobox").selectpicker('val', '2008');
        
        periodsLoaded = true;
        
        if(sectorsLoaded && loadFirstSectionFlag){
            loadFirstSection();
        }
    
    }else{
        problemWithRequests();
    }
    
    
}

function dataForPeriod(responseText) {
    
    var responseSt = responseText;
        
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
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
            tempArray["period"] = rows[3];
            dataArray.push(tempArray);

        };

        dataPerPeriodChartDataBackup = dataArray;

        filterDataForDataPerPeriodChart();   
        
        $("#data_per_period_chart").removeClass("grey_background");
        $("#data_per_period_spinner_div").hide();
        $("#periods_combobox").prop("disabled", false);
        $("#periods_combobox").selectpicker('refresh');
                
    }else{
        
        problemWithRequests();
        
    }        

}

function onGetFreeAllocationEUWide() {
    console.log("onGetFreeAllocationEUWide");
    
    var responseSt = this.responseText;
    
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
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
            tempArray["type"] = "Free Allocation";

            if(tempPeriod >= 2008){
                euWideChartDataBackup.push(tempArray);

                //---updating surplus data array EU wide---
                surplusDataArrayEUWide[tempPeriod] += tempValue;
                //-----------------------------------------
            }
        }

        free_allocation_eu_wide_loaded = true;
        
        updateEUWideDataLoadedText("Free Allocation");

        if (allEUWideLoaded()) {            
            calculateCumulativeSurplusEUWide();
            calculateRemainingCreditEntitlement();    
            filterDataForEUWideChart();
        }
        
    }else{
        problemWithRequests();
    }
    
}

function onGetOffsetEntitlementsEUWide() {
    console.log("onGetOffsetEntitlementsEUwide");
    
    var responseSt = this.responseText;
    
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
        var results = resultsJSON.results;
        var errors = resultsJSON.errors;
        var tempData = results[0].data;

        totalOffsetEntitlements = tempData[0].row[0];

        offset_entitlements_eu_wide_loaded = true;
        
        updateEUWideDataLoadedText("Offset Entitlements");

        if (allEUWideLoaded()) {
            calculateCumulativeSurplusEUWide();
            calculateRemainingCreditEntitlement(); 
            filterDataForEUWideChart();
        }
        
    }else{
        problemWithRequests();
    }   

}

function onGetLegalCapEUWide() {
    console.log("onGetLegalCapEUWide");
    
    var responseSt = this.responseText;
    
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
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
                //temporal hack so that just the legal cap for installations only is shown.
                //Legal cap for aviation only or aviation + stationary installations cannot 
                //be displayed since the exact values for aviation are not accurate enough
                var includeAviation = $('#include_aviation_combobox').selectpicker('val');
                if(includeAviation == 'Exclude Aviation'){
                    euWideChartDataBackup.push(tempArray);
                }                
            }        

        }

        legal_cap_eu_wide_loaded = true;
        
        updateEUWideDataLoadedText("Legal Cap");

        if (allEUWideLoaded()) {
            calculateCumulativeSurplusEUWide();
            calculateRemainingCreditEntitlement(); 
            filterDataForEUWideChart();
        }
        
    }else{
        problemWithRequests();
    }  
    
}

function onGetVerifiedEmissionsEUWide() {
    console.log("onGetVerifiedEmissionsEUwide");
    
    var responseSt = this.responseText;    
    
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
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
        
        updateEUWideDataLoadedText("Verified Emissions");

        if (allEUWideLoaded()) {
            calculateCumulativeSurplusEUWide();
            calculateRemainingCreditEntitlement(); 
            filterDataForEUWideChart();
        }
        
    }else{
        problemWithRequests();
    }   

}

function onGetAuctionedEUWide() {
    console.log("onGetAuctionedEUWide");
    
    var responseSt = this.responseText;
        
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
        var results = resultsJSON.results;
        var errors = resultsJSON.errors;
        var tempData = results[0].data;

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
        
        updateEUWideDataLoadedText("Auctions");

        if (allEUWideLoaded()) {
            calculateCumulativeSurplusEUWide();
            calculateRemainingCreditEntitlement(); 
            filterDataForEUWideChart();
        }
        
    }else{
        
        problemWithRequests();
    }
}

function onGetOffsetsEUWide() {
    console.log("onGetOffsetsEUWide");
    
    var responseSt = this.responseText;
    
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
        var results = resultsJSON.results;
        var errors = resultsJSON.errors;
        var tempData = results[0].data;

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
        
        updateEUWideDataLoadedText("Offsets");

        if (allEUWideLoaded()) {
            calculateCumulativeSurplusEUWide();
            calculateRemainingCreditEntitlement(); 
            filterDataForEUWideChart();
        }
        
    }else{
        problemWithRequests();
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


function createDataPerPeriodChart(data, type) {
    
    dataPerPeriodChartData = data;        

    if (!data_per_period_chart_created) {
        
        dataPerPeriodChartSvg = dimple.newSvg("#data_per_period_chart", "100%", "100%");

        dataPerPeriodChart = new dimple.chart(dataPerPeriodChartSvg, data);
        // Fix the margins
        dataPerPeriodChart.setMargins("85px", "20px", "20px", "110px");
        var y = dataPerPeriodChart.addMeasureAxis("y", "tCO2e");       
        y.tickFormat = 's';
                
        if(type == "line"){
            
            dataPerPeriodChartCategoryAxis = dataPerPeriodChart.addCategoryAxis("x", "period");
            
            var countrySeries = dataPerPeriodChart.addSeries("country", dimple.plot.line);
            countrySeries.lineMarkers = true;
            countrySeries.getTooltipText = function (e) {     
                return ["Sector: " + e.aggField[0], "Period: " + e.x , "tCO2e: " +  formatNumberDataPerPeriod(e.y)];
            };
            
            dataPerPeriodChartCurrentType = "line";
            
        }else if(type == "bar"){
            
            dataPerPeriodChartCategoryAxis = dataPerPeriodChart.addCategoryAxis("x", "country");
            var sectorSeries = dataPerPeriodChart.addSeries("sector", dimple.plot.bar);
            sectorSeries.getTooltipText = function (e) {     
                return ["Type: " + e.aggField[0], "Period: " + e.x , "tCO2e: " +  formatNumberEUWideChart(e.yValue),
                   "Aggregated tCO2e: " + formatNumberEUWideChart(e.y)];
            };
            
            dataPerPeriodChartCurrentType = "bar";
        }        

        data_per_period_chart_created = true;

    } else {
        
        dataPerPeriodChart.data = data;
        
        if(type == "line"){
            
            if(dataPerPeriodChartCurrentType == "bar"){
            
               $("#data_per_period_chart").children("svg").remove();
                
               dataPerPeriodChartSvg = dimple.newSvg("#data_per_period_chart", "100%", "100%");
               dataPerPeriodChart = new dimple.chart(dataPerPeriodChartSvg, data);
               // Fix the margins
               dataPerPeriodChart.setMargins("85px", "20px", "20px", "110px");    
               var y = dataPerPeriodChart.addMeasureAxis("y", "tCO2e");  
               y.tickFormat = 's';
               dataPerPeriodChart.addCategoryAxis("x", "period");
               var countrySeries = dataPerPeriodChart.addSeries("country", dimple.plot.line);
               countrySeries.lineMarkers = true;
               countrySeries.getTooltipText = function (e) {       
                    return ["Country: " + e.aggField[0], "Period: " + e.x , "tCO2e: " +  formatNumberDataPerPeriod(e.y)];
               };
               dataPerPeriodChartCurrentType = "line";
            }
            
            
            
            
        }else if(type == "bar"){
            
            if(dataPerPeriodChartCurrentType == "line"){
                
                $("#data_per_period_chart").children("svg").remove();                
        
                dataPerPeriodChartSvg = dimple.newSvg("#data_per_period_chart", "100%", "100%");
                dataPerPeriodChart = new dimple.chart(dataPerPeriodChartSvg, data);
                // Fix the margins
                dataPerPeriodChart.setMargins("85px", "20px", "20px", "110px");
                var y = dataPerPeriodChart.addMeasureAxis("y", "tCO2e");
                y.tickFormat = 's';
                dataPerPeriodChart.addCategoryAxis("x", "country");
                var sectorSeries = dataPerPeriodChart.addSeries("sector", dimple.plot.bar);
                sectorSeries.getTooltipText = function (e) {      
                    return ["Sector: " + e.aggField[0], "Period: " + e.x , "tCO2e: " +  formatNumberDataPerPeriod(e.y)];
                };
                dataPerPeriodChartCurrentType = "bar";
            }
            
        }
    }

    dataPerPeriodChart.draw(1000);

}


function createEUWideChart(data) {

    $("#eu_wide_chart").removeClass("grey_background");
    $("#eu_wide_spinner_div").hide();

    if (!eu_wide_chart_created) {
        var svg = dimple.newSvg("#eu_wide_chart", "100%", "100%");

        euWideChart = new dimple.chart(svg, data);        
        
        // Fix the margins
        if(window.chrome){
            euWideChart.setMargins("95px", "60px", "20px", "40px");
        }else{
            euWideChart.setMargins("95px", "60px", "20px", "80px");
        }        

        var x = euWideChart.addCategoryAxis("x", "period");
        x.addOrderRule("period");
        var y = euWideChart.addMeasureAxis("y", "tCO2e");
        y.tickFormat = 's';
        y.overrideMin = -100000000;      
        
        barSeriesEUWide = euWideChart.addSeries("type", dimple.plot.bar);        
        barSeriesEUWide.getTooltipText = function (e) {  
            return ["Type: " + e.aggField[0], "Period: " + e.x , "tCO2e: " +  formatNumberEUWideChart(e.yValue),
                   "Aggregated tCO2e: " + formatNumberEUWideChart(e.y)];
        };

        lineSeriesEUWide = euWideChart.addSeries("type", dimple.plot.line);
        lineSeriesEUWide.lineMarkers = true;
        lineSeriesEUWide.interpolation = "cardinal";
        lineSeriesEUWide.getTooltipText = function (e) { 
            return ["Type: " + e.aggField[0], "Period: " + e.x , "tCO2e: " +  formatNumberEUWideChart(e.yValue)];
        };
        
        
        euWideChartLegend = euWideChart.addLegend(20, 10, "95%", 300, "left");
                
        eu_wide_chart_created = true;
        
    }
    
    var tempWidth = $("#eu_wide_chart").outerWidth();
    console.log("tempWidth",tempWidth);
    
    if(tempWidth < 600 && tempWidth >= 410){
        euWideChart.setMargins("60px", "80px", "20px", "50px");
    }else if(tempWidth < 410){
        euWideChart.setMargins("60px", "150px", "20px", "70px");
    }else{
        euWideChart.setMargins("60px", "60px", "20px", "50px");
    }
    
    barSeriesEUWide.data = dimple.filterData(data, "type", ["Free Allocation", "Offsets", "Auctioned", "Remaining Credit Entitlements"]);
    lineSeriesEUWide.data = dimple.filterData(data, "type", ["Verified Emissions", "Legal Cap", "Accumulated Balance","Accumulated Balance"]);   
    euWideChart.draw(1000);
     
    initEUWideLegendTooltips();    
    
      
}

function initEUWideLegendTooltips(){    
    
    euWideChartLegend.shapes.selectAll("*").call(euWideLegendTip);
    euWideChartLegend.shapes.selectAll("text").
                on('mouseover', euWideLegendTip.show)
                .on('mouseout', euWideLegendTip.hide);
    euWideChartLegend.shapes.selectAll("rect").
                on('mouseover', euWideLegendTip.show)
                .on('mouseout', euWideLegendTip.hide);
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
        barSeries.getTooltipText = function (e) {  
            return ["Type: " + e.aggField[0], "Period: " + e.x , "tCO2e: " +  formatNumberEUWideChart(e.yValue),
                   "Aggregated tCO2e: " + formatNumberEUWideChart(e.y)];
        };

        lineSeries = lineChart.addSeries("type", dimple.plot.line);
        lineSeries.getTooltipText = function (e) {     
            return ["Type: " + e.aggField[0], "Period: " + e.x , "tCO2e: " +  formatNumberCountrySector(e.y)];
        };

        lineSeries.lineMarkers = true;
        lineSeries.interpolation = "cardinal";


        lineChart.addLegend(20, 10, "95%", 300, "left");


        line_chart_created = true;
    } else {

        lineChart.data = lineChartData;

    }
    barSeries.data = dimple.filterData(data, "type", ["Free_Allocation", "Offsets (2008-2012)"]);
    lineSeries.data = dimple.filterData(data, "type", "Verified_Emissions");
    lineChart.draw(1000);
    

}

function onComboBoxChange() {

    var selectedCountry = $("#countries_combobox").selectpicker('val');

    var selectedSector = $("#sectors_combobox").selectpicker('val');
    
    var selectedPowerFlag = $("#power_flag_combobox").selectpicker('val');

    if (selectedCountry != null && selectedSector != null) {
        
        installations_loaded = false;
        marker_popups_ids = [];

        disableCountrySectorDropDowns();

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
        
        $("#line_chart").addClass("grey_background");
        $("#spinner_div_country_sector").show();
            
        resetCountrySectorDataLoadedText();
            
        lineChartDataBackup = [];

        verified_emissions_loaded = false;
        offsets_loaded = false;
        free_allocation_loaded = false;

        getVerifiedEmissionsForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, true, selectedPowerFlag, 2008, onGetVerifiedEmissionsForCountryAndSector);
            
        getOffsetsForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, true, selectedPowerFlag, 2008,  onGetOffsetsForCountryAndSector);
            
        getFreeAllocationForCountryAndSector(server_url, selectedCountrySt, selectedSectorSt, true, selectedPowerFlag, 2008,  onGetFreeAllocationForCountryAndSector);         
    }
}

function dataForLineChartLoaded() {
    filterDataForLineChart();
    $("#line_chart").removeClass("grey_background");
    $("#spinner_div_country_sector").hide();
    enableCountrySectorDropDowns();
    lineChart.draw(1000);
}


function onGetInstallationsForCountryAndSector(){
    
    console.log("onGetInstallationsForCountryAndSector");
    
    var responseSt = this.responseText;
    
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
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
        markers = L.markerClusterGroup({
                maxClusterRadius: 40,
                spiderfyOnMaxZoom: true,
                iconCreateFunction: function (cluster) {
                    var markers = cluster.getAllChildMarkers();
                    var total_emissions = 0;
                    for (var i = 0; i < markers.length; i++) {
                        total_emissions += markers[i].emissions;
                    }                
                    var totalNumber = formatNumber(total_emissions);

                    var tempSize = map_size_scale(total_emissions);
                    var tempColor = map_color_scale(total_emissions);
                    var tempPaddingTop = tempSize/2 - 10;
                                        
                    var tempHTML = '<div class="mapcluster" style="border-radius: ' + tempSize + 'px; width: ' + tempSize + 'px; height: ' + tempSize + 'px; background-color: ' + tempColor + '; padding-top: ' + tempPaddingTop +  'px;"><strong>' + totalNumber + "</strong></div>"; 
                    return L.divIcon({html: tempHTML, className: 'mapcluster', iconSize: L.point(45, 45) });
                }
            });
        
        var min_emissions = 9999999999;
        var aggregated_emissions = 0;
        
        for (var i = 0; i < tempData.length; i++) {

            var rows = tempData[i].row;
            var installationId = rows[0];
            var installationName = rows[1];
            var latitude = rows[2];
            var longitude = rows[3];
            var sector = rows[4];
            var city = rows[5];
            var address = rows[6];
            var emissionsValue = rows[7];
            
            if(emissionsValue < min_emissions){
                min_emissions = emissionsValue;
            }
            aggregated_emissions += emissionsValue;
            

            var locationArray = [latitude, longitude];

            marker_popups_ids.push(installationId);

            var marker = L.marker(locationArray); 

            var etsURL = "http://ec.europa.eu/environment/ets/ohaDetails.do?buttonAction=all&permitIdentifier=&languageCode=en&form=oha&installationName=&accountHolder=&installationIdentifier=" + installationId.substring(2) + "&account.registryCodes=" + installationId.substring(0,2) +  "&searchType=oha&mainActivityType=-1&currentSortSettings=";
            
            marker.bindPopup("<div id=\"" + installationId + "\"><strong>Name:</strong> " + installationName + "<br><strong>ID:<a target='_blank' href='" + etsURL + "'></strong> " + installationId + "<br><strong></a>Address:</strong> " + address + "<br><strong>City:</strong> " + city + "<br><strong>Sector:</strong> " + sector + "<br><strong>Emissions</strong>: " + formatNumberAddCommas(emissionsValue) + " tCO2e</div>");
            //"<br><button class=\"pull-right\" onclick=\"onDownloadInstallationButtonClick(this)\">Download</button><br></div>");

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
            marker.emissions = emissionsValue;        
            markers.addLayer(marker);         

        };
        
        map_size_scale = d3.scale.linear().domain([min_emissions, aggregated_emissions]).range(MARKERS_SIZE_RANGE);
        map_color_scale = d3.scale.linear().domain([min_emissions, aggregated_emissions]).range(['beige', 'red']);

        //-----------------------------------------------------------
        //--------------------MAP LEGEND-----------------------------
        
        if(map_legend){
            map_legend.removeFrom(installations_map);
        }
        map_legend = L.control({position: 'bottomright'});        
        
		map_legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [aggregated_emissions*0.2, aggregated_emissions*0.4, aggregated_emissions*0.6, 
                          aggregated_emissions*0.8,aggregated_emissions],
				labels = [],
				from, to;
                        
            labels.push(
					'<i style="background:' + map_color_scale(min_emissions) + '"></i> ' +
					formatNumber(min_emissions) + ( formatNumber(grades[0]) ? '&ndash;' + formatNumber(grades[0]) : '+') + " tCO2e");

			for (var i = 0; i < grades.length -1; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + map_color_scale(grades[i]) + '"></i> ' +
					formatNumber(from) + ( formatNumber(to) ? '&ndash;' + formatNumber(to) : '+') + " tCO2e");
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};

		map_legend.addTo(installations_map);        
        
        installations_map.addLayer(markers);

        installations_map.setZoom(INSTALLATIONS_MAP_INITIAL_ZOOM);

        if(map_opened_for_the_first_time){
            map_opened_for_the_first_time = false;

            var outerWidth = $('#map_div').outerWidth();
            var leftPadding = outerWidth / 5;

            //creating welcome dialog
            welcomeMapViewDialog = L.control.dialog({size: [300,180], anchor: [80,leftPadding]}).setContent("<h4>Welcome to the Map View!</h4><p>Values displayed in circles correspond to the <strong>aggregation of emissions</strong> generated by the installations included in the circle for the <strong>year selected in the drop down menu</strong></p><p>Hover your mouse pointer over a circle to see the area aggregated. Single installations are indicated by an icon for their main activity sector.</p>").addTo(installations_map);
                        
        }

        $("#map_div").removeClass("grey_background");
        $("#spinner_div_installations").hide();
        enableCountrySectorDropDowns();
        
    }else{
        problemWithRequests();
    }
}

function onDownloadInstallationButtonClick(value){
    var tempID = value.parentElement.getAttribute("id");
    getInstallationData(server_url, tempID, onGetInstallationData);
}

function onGetInstallationData(){
    console.log("onGetInstallationData");
    
    var dataString = "data:text/csv;charset=utf-8,Period,tCO2e,type\n";

    var encodedUri = encodeURI(dataString);
    window.open(encodedUri); 
}

function onMarkerClick(){   
}

function onGetVerifiedEmissionsForCountryAndSector() {

    console.log("onGetVerifiedEmissionsForCountryAndSector");
    
    var responseSt = this.responseText;
    
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
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

        updateCountrySectorDataLoadedText("Verified Emissions");

        verified_emissions_loaded = true;
        if (verified_emissions_loaded && free_allocation_loaded && offsets_loaded) {
             dataForLineChartLoaded();
        }
        
    }else{
        problemWithRequests();
    }    
    
}

function onGetOffsetsForCountryAndSector() {

    console.log("onGetOffsetsForCountryAndSector");
    
    var responseSt = this.responseText;
    
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
        var results = resultsJSON.results;
        var errors = resultsJSON.errors;
        var tempData = results[0].data;

        for (var i = 0; i < tempData.length; i++) {
            var rows = tempData[i].row;
            lineChartDataBackup.push({
                "tCO2e": rows[0],
                "type": "Offsets (2008-2012)",
                "period": rows[1]
            });
        };
        
        updateCountrySectorDataLoadedText("Offsets");

        offsets_loaded = true;
        if (verified_emissions_loaded && free_allocation_loaded && offsets_loaded) {
            dataForLineChartLoaded();
        }
        
    }else{
        problemWithRequests();
    }       
}

function onGetFreeAllocationForCountryAndSector() {

    console.log("onGetFreeAllocationForCountryAndSector");
    
    var responseSt = this.responseText;
    
    if(responseSt && responseSt.length > 0){
        
        var resultsJSON = JSON.parse(responseSt);
        var results = resultsJSON.results;
        var errors = resultsJSON.errors;
        var tempData = results[0].data;

        for (var i = 0; i < tempData.length; i++) {
            var rows = tempData[i].row;
            lineChartDataBackup.push({
                "tCO2e": rows[0],
                "type": "Free_Allocation",
                "period": rows[1]
            });
        };
        
        updateCountrySectorDataLoadedText("Free Allocation");

        free_allocation_loaded = true;
        if (verified_emissions_loaded && free_allocation_loaded && offsets_loaded) {
            dataForLineChartLoaded();
        }
    }else{
        problemWithRequests();
    }
    
}

function calculateCumulativeSurplusEUWide() {

    var accumulatedAmount = 0;
    
    console.log("calculateCumulativeSurplusEUWide");
    
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
    
    if(annualValue < 0){
        annualValue = 0;
    }
    
    for (i = 2016; i <= 2020; i++) {

        var tempArray = [];
        tempArray["tCO2e"] = annualValue;
        tempArray["period"] = i;
        tempArray["type"] = "Remaining Credit Entitlements";

        euWideChartDataBackup.push(tempArray);
    }
}


function filterEUWideArrayBasedOnCheckboxesSelected(value) {
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
    } else if (tempType == "Offsets (2008-2012)") {
        return includeOffsets;
    } else {
        return false;
    }
}

function allEUWideLoaded() {

    return everythingLoaded = verified_emissions_eu_wide_loaded == true && free_allocation_eu_wide_loaded == true &&
        offsets_eu_wide_loaded == true && auctioned_eu_wide_loaded == true && legal_cap_eu_wide_loaded == true &&
        offset_entitlements_eu_wide_loaded == true;
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

function updateCountrySectorDataLoadedText(value){
    var checkHtml = '<i class="fa fa-fw fa-check"></i>';
    
    if(value == "Verified Emissions"){
        $('#verified_emissions_country_sector_item').html("Verified Emissions " + checkHtml);
    }else if(value == "Offsets"){
        $('#offsets_country_sector_item').html("Offsets " + checkHtml);
    }else if(value == "Free Allocation"){
        $('#free_allocation_country_sector_item').html("Free Allocation " + checkHtml);
    }
}

function resetCountrySectorDataLoadedText(){
    $('#verified_emissions_country_sector_item').html("Verified Emissions ");
    $('#offsets_country_sector_item').html("Offsets ");
    $('#free_allocation_country_sector_item').html("Free Allocation ");
}

function updateEUWideDataLoadedText(value){    
    
    var checkHtml = '<i class="fa fa-fw fa-check"></i>';
    
    if(value == "Verified Emissions"){
        $('#verified_emissions_eu_wide_item').html("Verified Emissions " + checkHtml);
    }else if(value == "Legal Cap"){
        $('#legal_cap_eu_wide_item').html("Legal Cap " + checkHtml);
    }else if(value == "Free Allocation"){
        $('#free_allocation_eu_wide_item').html("Free Allocation " + checkHtml);
    }else if(value == "Offset Entitlements"){
        $('#offset_entitlements_eu_wide_item').html("Offset Entitlements " + checkHtml);
    }else if(value == "Offsets"){
        $('#offsets_eu_wide_item').html("Offsets " + checkHtml);
    }else if(value == "Auctions"){
        $('#auctions_eu_wide_item').html("Auctions " + checkHtml);
    }    
    
}

function resetEUWideDataLoadedText(){
    $('#verified_emissions_eu_wide_item').html("Verified Emissions ");
    $('#legal_cap_eu_wide_item').html("Legal Cap ");
    $('#free_allocation_eu_wide_item').html("Free Allocation ");
    $('#offset_entitlements_eu_wide_item').html("Offset Entitlements ");
    $('#offsets_eu_wide_item').html("Offsets ");
    $('#auctions_eu_wide_item').html("Auctions ");
}

function onSwitchChartDataPerPeriod(value){
    var buttonText = $('#swith_chart_data_per_period_button').html();
        
    if(buttonText == "Switch to line chart"){
        createDataPerPeriodChart(dataPerPeriodChartData, "line");
        $('#swith_chart_data_per_period_button').html("Switch to bar chart");
        
    }else if(buttonText == "Switch to bar chart"){
        createDataPerPeriodChart(dataPerPeriodChartData, "bar");
        $('#swith_chart_data_per_period_button').html("Switch to line chart");
    }
}


 