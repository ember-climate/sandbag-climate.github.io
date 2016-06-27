
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

	var statementSt = "MATCH (s:SECTOR) RETURN s.name ORDER BY s.name ASC";

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));

}

function getSandbagSectors(serverURL, onLoadEnd){
    var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (s:SANDBAG_SECTOR) RETURN s.name ORDER BY s.name ASC";

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

	var statementSt = "MATCH (p:PERIOD) RETURN p.name ORDER BY p.name ASC";

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));

}

function getVerifiedEmissionsForAllPeriods(serverURL, includeAviation, onLoadEnd){
    var query = {
	    "statements" : [ ]
	};
    
	var statementSt;
    
    if(includeAviation == true){
        statementSt = "MATCH ()-[ve:VERIFIED_EMISSIONS]->(p:PERIOD) " +
				      "RETURN sum(ve.value) AS Verified_Emissions, p.name AS Period ORDER BY p.name";
    }else{
        statementSt = "MATCH (i:INSTALLATION)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD) " +
				      "RETURN sum(ve.value) AS Verified_Emissions, p.name AS Period ORDER BY p.name";
    }    
    
    
	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getFreeAllocationForAllPeriods(serverURL, includeAviation, onLoadEnd){
    var query = {
	    "statements" : [ ]
	};

	var statementSt;
    
    if(includeAviation == true){
        statementSt = "MATCH ()-[aa:ALLOWANCES_IN_ALLOCATION]->(p:PERIOD) " +
				      "RETURN sum(aa.value) AS Free_Allocation, p.name AS Period ORDER BY p.name";
    }else{
        statementSt = "MATCH (i:INSTALLATION)-[aa:ALLOWANCES_IN_ALLOCATION]->(p:PERIOD) " +
				      "RETURN sum(aa.value) AS Free_Allocation, p.name AS Period ORDER BY p.name";
    }
    
	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getLegalCapForAllPeriods(serverURL, includeAviation, onLoadEnd){
    var query = {
	    "statements" : [ ]
	};

	var statementSt;
    
    if(includeAviation == true){
        statementSt = "MATCH (node)-[lc:LEGAL_CAP]->(p:PERIOD) " +
                    "WHERE node:COUNTRY OR (node:SANDBAG_SECTOR AND node.name = 'Aviation') " +
                    "RETURN sum(lc.amount) AS Legal_Cap, p.name AS Period ORDER BY p.name";
    }else{
        statementSt = "MATCH (:COUNTRY)-[lc:LEGAL_CAP]->(p:PERIOD) " +
                    "RETURN lc.amount AS Legal_Cap, p.name AS Period ORDER BY p.name";
    }   
    
    
	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}


function getOffsetsForAllPeriods(serverURL, includeAviation, onLoadEnd){
    var query = {
	    "statements" : [ ]
	};

	var statementSt;
    
    if(includeAviation == true){
        statementSt = "MATCH (o:OFFSET)-[:OFFSET_PERIOD]->(p:PERIOD) " +
                    "WHERE (o.unit_type = 'ERU' OR o.unit_type = 'CER') " +
                    "RETURN sum(o.amount) AS Offsets, p.name AS Period ORDER BY p.name";
    }else{
        statementSt = "MATCH (i:INSTALLATION)-[:OFFSETS]-(o:OFFSET)-[:OFFSET_PERIOD]->(p:PERIOD) " +
                    "WHERE (o.unit_type = 'ERU' OR o.unit_type = 'CER') " +
                    "RETURN sum(o.amount) AS Offsets, p.name AS Period ORDER BY p.name";
    }  
    
    
    //console.log("statement!", statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getOffsetEntitlementsForAllPeriods(serverURL, includeAviation, onLoadEnd){
    
    
    var query = {
	    "statements" : [ ]
	};

	if(includeAviation == true){
        statementSt = "MATCH ()-[r:OFFSET_ENTITLEMENT]->() RETURN sum(toFloat(r.value)) AS Total_Entitlements";
    }else{
        statementSt = "MATCH (:INSTALLATION)-[r:OFFSET_ENTITLEMENT]->() RETURN sum(toFloat(r.value)) AS Total_Entitlements";
    }
    
	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getAuctionedForAllPeriods(serverURL, onLoadEnd){
    var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)-[a:AUCTIONED]->(p:PERIOD) "+
					   "RETURN sum(a.amount) AS Auctioned, p.name AS Period ORDER BY p.name";
    
    //console.log("statement!", statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getVerifiedEmissionsForPeriod(serverURL, periodName, onLoadEnd){
    
    var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR)<-[:AGGREGATES_SECTOR]-(ss:SANDBAG_SECTOR)," +
                        "(i)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD) " +
                       "WHERE p.name = '" + periodName + "' " +
					   "RETURN sum(ve.value) AS Verified_Emissions, c.name, ss.name ORDER BY c.name, ss.name";
    
    //console.log("statement!", statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getFreeAllocationForPeriod(serverURL, periodName, onLoadEnd){
        
    var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR)<-[:AGGREGATES_SECTOR]-(ss:SANDBAG_SECTOR)," +
                        "(i)-[aa:ALLOWANCES_IN_ALLOCATION]->(p:PERIOD) " +
                       "WHERE p.name = '" + periodName + "' " +
					   "RETURN sum(aa.value) AS Free_Allocation, c.name, ss.name ORDER BY c.name, ss.name";
    
    //console.log("statement!", statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getOffsetsForPeriod(serverURL, periodName, onLoadEnd){
        
    var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR)<-[:AGGREGATES_SECTOR]-(ss:SANDBAG_SECTOR)," +
                        "(i)-[off:OFFSETS]->(o:OFFSET)-[:OFFSET_PERIOD]->(p:PERIOD) " +
                       "WHERE p.name = '" + periodName + "' " + " AND (o.unit_type = 'ERU' " +
					   "OR o.unit_type = 'CER') RETURN sum(o.amount) AS Offsets, c.name, ss.name ORDER BY c.name, ss.name";
    
    //console.log("statement!", statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getSurrenderedUnitsForPeriod(serverURL, periodName, onLoadEnd){
        
    var query = {
	    "statements" : [ ]
	};

	var statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY]-(i:INSTALLATION)-[:INSTALLATION_SECTOR]->(s:SECTOR)," +
                        "(i)-[su:SURRENDERED_UNITS]->(p:PERIOD) " +
                       "WHERE p.name = '" + periodName + "' " +
					   "RETURN sum(su.value) AS Surrendered_Units, c.name, s.name ORDER BY c.name, s.name";
    
    //console.log("statement!", statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getInstallationsForCountryAndSector(serverURL, countryNames, sectorNames, isSandbagSector, onLoadEnd){
    var query = {
	    "statements" : [ ]
	};
    
    var statementSt;
    
    if(isSandbagSector){
        statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY|AIRCRAFT_OPERATOR_COUNTRY]-(node)-[:INSTALLATION_SECTOR|AIRCRAFT_OPERATOR_SECTOR]->(s:SECTOR)<-[:AGGREGATES_SECTOR]-(ss:SANDBAG_SECTOR)" +                    
                       "WHERE c.name IN " + countryNames + " AND ss.name IN " + sectorNames + " AND (node:INSTALLATION OR node:AIRCRAFT_OPERATOR) AND node.latitude <> '0' AND node.latitude <> '' AND node.longitude <> '0' AND node.longitude <> '' " +
					   "RETURN node.id, node.name, node.latitude, node.longitude, ss.name, node.city, node.address";
    }else{
        statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY|AIRCRAFT_OPERATOR_COUNTRY]-(node)-[:INSTALLATION_SECTOR|AIRCRAFT_OPERATOR_SECTOR]->(s:SECTOR)" +
                       "WHERE c.name IN " + countryNames + " AND s.name IN " + sectorNames + " AND (node:INSTALLATION OR node:AIRCRAFT_OPERATOR) AND node.latitude <> '0' AND node.latitude <> '' AND node.longitude <> '0' AND node.longitude <> '' " +
					   "RETURN node.id, node.name, node.latitude, node.longitude, s.name, node.city, node.address";
    }	

	console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}

function getVerifiedEmissionsForCountryAndSector(serverURL, countryNames, sectorNames, isSandbagSector, onLoadEnd ){
    var query = {
	    "statements" : [ ]
	};
    
    var statementSt;
    
    if(isSandbagSector){
        statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY|AIRCRAFT_OPERATOR_COUNTRY]-(node)-[:INSTALLATION_SECTOR|AIRCRAFT_OPERATOR_SECTOR]->(s:SECTOR)<-[:AGGREGATES_SECTOR]-(ss:SANDBAG_SECTOR)," +
                        "(node)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD)" +
                       "WHERE c.name IN " + countryNames + " AND ss.name IN " + sectorNames + " AND (node:INSTALLATION OR node:AIRCRAFT_OPERATOR) " +
					   "RETURN sum(ve.value) AS Verified_Emissions, p.name ORDER BY p.name";
    }else{
        statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY|AIRCRAFT_OPERATOR_COUNTRY]-(node)-[:INSTALLATION_SECTOR|AIRCRAFT_OPERATOR_SECTOR]->(s:SECTOR)," +
                        "(node)-[ve:VERIFIED_EMISSIONS]->(p:PERIOD)" +
                       "WHERE c.name IN " + countryNames + " AND s.name IN " + sectorNames + " AND (node:INSTALLATION OR node:AIRCRAFT_OPERATOR) " +
					   "RETURN sum(ve.value) AS Verified_Emissions, p.name ORDER BY p.name";
    }

	

	//console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}


function getOffsetsForCountryAndSector(serverURL, countryNames, sectorNames, isSandbagSector, onLoadEnd ){
    var query = {
	    "statements" : [ ]
	};

	var statementSt;
    
    if(isSandbagSector){
        statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY|AIRCRAFT_OPERATOR_COUNTRY]-(node)-[:INSTALLATION_SECTOR|AIRCRAFT_OPERATOR_SECTOR]->(s:SECTOR)<-[:AGGREGATES_SECTOR]-(ss:SANDBAG_SECTOR)" +
					   ", (node)-[off:OFFSETS]->(o:OFFSET)-[:OFFSET_PERIOD]->(p:PERIOD) " +
                       "WHERE c.name IN " + countryNames + " AND ss.name IN " + sectorNames + " AND (o.unit_type = 'ERU' " +
					   "OR o.unit_type = 'CER') AND (node:INSTALLATION OR node:AIRCRAFT_OPERATOR) RETURN sum(o.amount) AS Offsets, p.name ORDER BY p.name";
    }else{
        statementSt = "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY|AIRCRAFT_OPERATOR_COUNTRY]-(node)-[:INSTALLATION_SECTOR|AIRCRAFT_OPERATOR_SECTOR]->(s:SECTOR)" +
					   ", (node)-[off:OFFSETS]->(o:OFFSET)-[:OFFSET_PERIOD]->(p:PERIOD) " +
                       "WHERE c.name IN " + countryNames + " AND s.name IN " + sectorNames + " AND (o.unit_type = 'ERU' " +
					   "OR o.unit_type = 'CER') AND (node:INSTALLATION OR node:AIRCRAFT_OPERATOR) RETURN sum(o.amount) AS Offsets, p.name ORDER BY p.name";
    }
    

	//console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}


function getFreeAllocationForCountryAndSector(serverURL, countryNames, sectorNames, isSandbagSector, onLoadEnd ){

	var query = {
	    "statements" : [ ]
	};

	var statementSt;
    
    if(isSandbagSector){
        statementSt= "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY|AIRCRAFT_OPERATOR_COUNTRY]-(node)-[:INSTALLATION_SECTOR|AIRCRAFT_OPERATOR_SECTOR]->(s:SECTOR)<-[:AGGREGATES_SECTOR]-(ss:SANDBAG_SECTOR)," +
                        "(node)-[fa:ALLOWANCES_IN_ALLOCATION]->(p:PERIOD) " +
                        "WHERE c.name IN " + countryNames + " AND ss.name IN " + sectorNames + " AND (node:INSTALLATION OR node:AIRCRAFT_OPERATOR) " +
					   "RETURN sum(fa.value) AS Free_Allocation, p.name ORDER BY p.name";
    }else{
        statementSt= "MATCH (c:COUNTRY)<-[:INSTALLATION_COUNTRY|AIRCRAFT_OPERATOR_COUNTRY]-(node)-[:INSTALLATION_SECTOR|AIRCRAFT_OPERATOR_SECTOR]->(s:SECTOR)," +
                        "(node)-[fa:ALLOWANCES_IN_ALLOCATION]->(p:PERIOD) " +
                        "WHERE c.name IN " + countryNames + " AND s.name IN " + sectorNames + " AND (node:INSTALLATION OR node:AIRCRAFT_OPERATOR) " +
					   "RETURN sum(fa.value) AS Free_Allocation, p.name ORDER BY p.name";
    }
    
    

	//console.log(statementSt);

	query.statements.push({"statement":statementSt});

	var xhr = new XMLHttpRequest();    
	xhr.onloadend = onLoadEnd;
	xhr.open("POST", serverURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(query));
}





