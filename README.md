# EU ETS dashboard

The EU ETS dashboard provides a user-friendly access to emission trading data extracted from the European Union Transaction Log (EUTL) together with other data integrated by Sandbag's team such as NACE codes and a more meaningful sectors aggregation.

* The ETS data shown in this tool was extracted from the European Commission’s [EUTL](http://ec.europa.eu/environment/ets/) on **May 3rd 2016**.
* Aircraft operators data is not included or taken into account in any way for any of the charts made available as part of the interface.
* When calculating offset values only those with unit types CER or ERU are used.

### Licensing

This software is 100% open source and released under AGPLv3 license.

### Developers

This tool was developed by the following Sandbag team members:

* Pablo Pareja - Main developer and project leader.

## Technologies/resources used

### Back-end

* **Databases**
 * [Neo4j](http://www.neo4j.com) Graph database  - _A highly scalable native graph database that leverages data relationships as first-class entities_
* **Tool deployment**
 * [AWS - Amazon Web Services](http://https://aws.amazon.com/) 

### Front-end

* **Javascript libraries**:
 * **[D3.js]**(https://d3js.org/) - _Data-Driven documents_
 * **[Dimple.js]**(http://dimplejs.org/) - _An object-oriented API for business analytics powered by d3._
 * **[Bootstrap]**(http://getbootstrap.com/) - _The most popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web._
 * **[jQuery]**(https://jquery.com/) - _jQuery is a fast, small, and feature-rich JavaScript library_
 * **[bootstrap-select]**(http://silviomoreto.github.io/bootstrap-select/) - _A jQuery plugin that utilizes Bootstrap's dropdown.js to style and bring additional functionality to standard select elements._
