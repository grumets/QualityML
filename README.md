# QualityML
This is the source code of the QualityML website: https://www.qualityml.org

## How it works
QualityML is visualized as a main page with tables of all QualityML elements and as a collection of pages each one representing a measure, a domain or a metrics. However, internally a reverse proxy is used to redirect all URLs to the same template page (see the index.htm and the web.config in each subfolder). Most of the content is generated automatical by a [qualityml.js](qualityml.js) that reads a [qualityml.json](qualityml.json) that contains the actual content.

Adding a quality measure, domain or metrics can be done by editing the [qualityml.json](qualityml.json).

## how to collaborate
If you miss a quality indicator, measure, domain or metrics you can suggest its inclusion using the "issues" tab in this GitHbu repository for consideration.

QualityML is a a result of the GeoViQua project that has received funding from the European Union Seventh Framework Programme (FP7/2010-2013) under grant agreement no. 265178. The Grumets team continues maintaining it with contributions from other projects.
