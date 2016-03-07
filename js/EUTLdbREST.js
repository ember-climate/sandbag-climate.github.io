console.log("REST!");

function getCountries(serverURL, onLoadEnd) {

	var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY) RETURN c.name";

	query.statements.push({"statement": statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));

}

function getSectors(serverURL, onLoadEnd){

	var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (s:SECTOR) RETURN s.name";

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));

}

function getPeriods(serverURL, onLoadEnd){

	var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (p:PERIOD) RETURN p.name";

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));

}

function getVerifiedEmissionsForPeriod(serverURL, periodName, onLoadEnd){
    
    console.log("hola!");
    
    var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR)," +
                        "(i)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD) " +
                       "WHERE p.name = '" + periodName + "' " +
					   "RETURN sum(ve.value) AS Verified_Emissions, c.name, s.name ORDER BY c.name, s.name";
    
    console.log("statement!", statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getVerifiedEmissionsForCountryAndSector(serverURL, countryNames, sectorNames, onLoadEnd ){
    var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR)," +
                        "(i)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD)" +
                       "WHERE c.name IN " + countryNames + " AND s.name IN " + sectorNames + " " +
					   "RETURN sum(ve.value) AS Verified_Emissions, p.name ORDER BY p.name";

	//console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}


function getOffsetsForCountryAndSector(serverURL, countryNames, sectorNames, onLoadEnd ){
    var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR)" +
					   ", (i)-[off:OFFSETS]->(p:PERIOD) " +
                       "WHERE c.name IN " + countryNames + " AND s.name IN " + sectorNames + " " +
					   "RETURN sum(off.value) AS Offsets, p.name ORDER BY p.name";

	//console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}


function getFreeAllocationForCountryAndSector(serverURL, countryNames, sectorNames, onLoadEnd ){

	var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR)," +
                        "(i)-[fa:FREE_ALLOCATION]->(p:PERIOD) " +
                        "WHERE c.name IN " + countryNames + " AND s.name IN " + sectorNames + " " +
					   "RETURN sum(fa.value) AS Free_Allocation, p.name ORDER BY p.name";

	console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getSurplusFreeAllowancesForCountryAndSector(serverURL, countryNames, sectorNames, onLoadEnd ){

	var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR)," +
                        "(i)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD), (i)-[fa:FREE_ALLOCATION]->(p:PERIOD) " +
                        "WHERE c.name IN " + countryNames + " AND s.name IN " + sectorNames + " " +
					   "RETURN sum(fa.value) - sum(ve.value) AS Surplus_Free_Allowances, p.name ORDER BY p.name";

	console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getTotalSuplyForCountryAndSector(serverURL, countryNames, sectorNames, onLoadEnd ){

	var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR),"+
                        "(i)-[off:OFFSETS]->(p:PERIOD), (i)-[fa:FREE_ALLOCATION]->(p:PERIOD) " +  
                        "WHERE c.name IN " + countryNames + " AND s.name IN " + sectorNames + " " +
					   "RETURN sum(fa.value) + sum(off.value) AS Total_Suply, p.name ORDER BY p.name";

	console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getSurplusWithOffsetsForCountryAndSector(serverURL, countryNames, sectorNames, onLoadEnd ){

	var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR)," +
                        "(i)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD), (i)-[fa:FREE_ALLOCATION]->(p:PERIOD), " +
                        "(i)-[off:OFFSETS]->(p:PERIOD) " +
                        "WHERE c.name IN " + countryNames + " AND s.name IN " + sectorNames + " " +
					   "RETURN sum(fa.value) + sum(off.value) - sum(ve.value) AS Surplus_With_Offsets, p.name ORDER BY p.name";

	console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getSurplusForAllPeriods(serverURL, countryNames, sectorNames, onLoadEnd ){

	var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR)," +
                        "(i)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD), (i)-[fa:FREE_ALLOCATION]->(p:PERIOD), " +
                        "(i)-[off:OFFSETS]->(p:PERIOD) " +
                        "WHERE c.name IN " + countryNames + " AND s.name IN " + sectorNames + " " +
					   "RETURN sum(ve.value) AS Verified_Emissions, sum(fa.value) AS Free_Allocation, sum(off.value) AS Offsets, " +
                       "sum(fa.value) - sum(ve.value) AS Surplus_Free_Allowances, " +
                       "sum(fa.value) + sum(off.value) - sum(ve.value) AS Surplus_With_Offsets, p.name ORDER BY p.name";

	console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

