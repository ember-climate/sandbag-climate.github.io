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

function getVerifiedEmissionsForCountryAndSector(serverURL, countryName, sectorName, onLoadEnd ){
    var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY{name:'" + countryName + 
						"'})<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR{name:'" +
					   sectorName + "'}), (i)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD)" +
					   "RETURN sum(ve.value) AS Verified_Emissions, p.name ORDER BY p.name";

	console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}


function getOffsetsForCountryAndSector(serverURL, countryName, sectorName, onLoadEnd ){
    var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY{name:'" + countryName + 
						"'})<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR{name:'" +
					   sectorName + "'}), (i)-[off:OFFSETS]->(p:PERIOD) " +
					   "RETURN sum(off.value) AS Offsets, p.name ORDER BY p.name";

	console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}


function getFreeAllocationForCountryAndSector(serverURL, countryName, sectorName, onLoadEnd ){

	var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY{name:'" + countryName + 
						"'})<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR{name:'" +
					   sectorName + "'}), (i)-[fa:FREE_ALLOCATION]->(p:PERIOD) " +
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

function getSurplusFreeAllowancesForCountryAndSector(serverURL, countryName, sectorName, onLoadEnd ){

	var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY{name:'" + countryName + 
						"'})<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR{name:'" +
					   sectorName + "'}), (i)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD), (i)-[fa:FREE_ALLOCATION]->(p:PERIOD) " +  
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

function getSurplusWithOffsetsForCountryAndSector(serverURL, countryName, sectorName, onLoadEnd ){

	var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY{name:'" + countryName + 
						"'})<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR{name:'" +
					   sectorName + "'}),  (i)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD), (i)-[fa:FREE_ALLOCATION]->(p:PERIOD), " +
                        "(i)-[off:OFFSETS]->(p:PERIOD) " +
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

function getSurplusForAllPeriods(serverURL, countryName, sectorName, onLoadEnd ){

	var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY{name:'" + countryName + 
						"'})<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR{name:'" +
					   sectorName + "'}),  (i)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD), (i)-[fa:FREE_ALLOCATION]->(p:PERIOD), " +
                        "(i)-[off:OFFSETS]->(p:PERIOD) " +
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

