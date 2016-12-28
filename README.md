# EU ETS dashboard

The EU ETS dashboard provides a user-friendly access to emission trading data extracted from the European Union Transaction Log (EUTL) together with other data integrated by Sandbag's team such as NACE codes and a more meaningful sectors aggregation.

* The ETS data shown in this tool was extracted from the European Commission’s [EUTL](http://ec.europa.eu/environment/ets/) on **June 20th 2016**. Such data is put in the public domain by the European Commission according to the Article 109 of the Commission Regulation 389/2013, which prescribes that the data defined in Annex XIV of the Regulation should be made public (points 1-4 and 7 of the Annex).
* Offsets data for periods 2013 onwards is not available with sectors granularity since the European Commission stopped sharing such information after 2012.
* When calculating offset values only those with unit types CER or ERU are used.

### Licensing

This software is 100% open source and released under AGPLv3 license.

### Developers

This tool was developed by:

* [Pablo Pareja](http://www.pablo-pareja.com) - Main developer and project leader.

### Contributors

The following Sandbag team members helped in the creation of this tool:

* Tricia Buckley - Data, testing and support.
* Boris Lagadinov - ETS expertise and data testing.
* Phil MacDonald - Campaigning expert.

## Technologies/resources used

### Back-end

* **Databases**
 * [Neo4j](http://www.neo4j.com) Graph database  - _A highly scalable native graph database that leverages data relationships as first-class entities_
* **Tool deployment**
 * [AWS - Amazon Web Services](http://https://aws.amazon.com/) 

### Front-end

* **Javascript libraries**:
 * **[D3.js](https://d3js.org/)** - _Data-Driven documents_
 * **[Dimple.js](http://dimplejs.org/)** - _An object-oriented API for business analytics powered by d3._
 * **[Bootstrap](http://getbootstrap.com/)** - _The most popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web._
 * **[jQuery](https://jquery.com/)** - _jQuery is a fast, small, and feature-rich JavaScript library_
 * **[bootstrap-select](http://silviomoreto.github.io/bootstrap-select/)** - _A jQuery plugin that utilizes Bootstrap's dropdown.js to style and bring additional functionality to standard select elements._
 * **[Leaflet](http://leafletjs.com/)** - _an open-source JavaScript library for mobile-friendly interactive maps._
 * **[Javascript Cookie](https://github.com/js-cookie/js-cookie)** - _A simple, lightweight JavaScript API for handling browser cookies_
 * **[Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)** - _Marker Clustering plugin for Leaflet_
 * **[Leaflet.Dialog](https://github.com/NBTSolutions/Leaflet.Dialog)**

* **Icons/Fonts**:
 * **[Icons8](https://icons8.com/)**
 * **[Font Awesome](http://fontawesome.io/)** 
