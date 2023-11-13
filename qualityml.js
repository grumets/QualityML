var msg_backToTop=({eng:"Back to top of page", cat:"Torna a l'inici", spa:"Volver al inicio"});
var msg_uri={eng:"URI",cat:"URI", spa:"URI"};
var msg_name={eng:"Name",cat:"Nom", spa:"Nombre"};
var msg_altName={eng:"Alternative names",cat:"Noms alternatius", spa:"Nombres alternativos"};
var msg_def={eng:"Definition",cat:"Definició", spa:"Definición"};
var msg_form={eng:"Formula",cat:"Fórmula", spa:"Fórmula"};
var msg_param={eng:"Parameters",cat:"Paràmetres", spa:"Parámetros"};
var msg_source={eng:"Source",cat:"Font", spa:"Fuente"};
var msg_catego={eng:"Categories",cat:"Categories", spa:"Categorías"};
var msg_class={eng:"Classes",cat:"Classes", spa:"Clases"};
var msg_info={eng:"Further information",cat:"Més informació", spa:"Más información"};
var msg_19139_xml_example={eng:"19139 XML example (recommended)",cat:"Exemple XML 19139 (recomanat)", spa:"Ejemplo XML 19139 (recomendado)"};
var msg_xml_schema={eng:"Extended XML schema",cat:"Esquema XML estès", spa:"Esquema XML extendido"};
var msg_xml_example={eng:"Extended XML example (not recommended)",cat:"Exemple XML estès (no recomanat)", spa:"Ejemplo XML extendido (no recomendado)"};
var msg_json_example={eng:"JSON example",cat:"Exemple JSON", spa:"Ejemplo JSON"};
var msg_api_example={eng:"API example",cat:"Exemple API", spa:"Ejemplo API"};
var msg_valConst={eng:"Value constraints",cat:"Restriccions de valor", spa:"Restricciones de valor"};
var msg_description={eng:"Description", cat:"Descripció", spa:"Descripción"};
var msg_qualityind={eng:"Quality indicator", cat:"Indicador de Qualitat", spa:"Indicador de Calidad"};
var msg_qualityclass={eng:"Quality class", cat:"Classe de Qualitat", spa:"Clase de Calidad"};
var msg_origin={eng:"Origin", cat:"Origen", spa:"Origen"};
var msg_metagreg={eng:"Metrics aggregation", cat:"Agregació de mètriques", spa:"Agregación de métricas"};
var msg_elements={eng:"Elements", cat:"Elements", spa:"Elementos"};
var msg_meaning={eng:"Meaning", cat:"Significat", spa:"Significado"};
var msg_qualitymeas={eng:"Quality measure", cat:"Mesura de qualitat", spa:"Medida de calidad"};
var msg_domain={eng:"Domain", cat:"Domini", spa:"Domini"};
var msg_metrics={eng:"Metrics", cat:"Mètriques", spa:"Métriques"};
var msg_observation={eng:"Observations", cat:"Observacions", spa:"Observaciones"};

function CheckHttps()
{
	//https://gist.github.com/ProProgrammer/9828955
	if (window.location.protocol.toLowerCase()=="http:")
		document.location.protocol = 'https:';
}

function arrayBufferToString(buffer){
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    return str;
}

//variable global que en diu en quin idioma es mostra la pàigna. Per defecte Anglés.
var Lang="eng";

function setLang(){
	//Canviem el valor de la variable global d'idioma en funció de la selecció de l'usuari
	Lang=document.getElementById("sel_language").value;
	CarregaQualityMLjson();
}

//funció copiada i modificada de Nmmblang.js
function DonaCadenaJSON(s)
{
	if (Lang=="cat")
		return s.cat;
	else if (Lang=="spa")
		return s.spa;
	else //if (Lang=="eng")
		return s.eng;		
}

//Preparo una funció per descarregar les dades JSON assincronament
//Extreta de: http://stackoverflow.com/questions/9838812/how-can-i-open-a-json-file-in-javascript-without-jquery
function loadJSON(path, success, error, lang, extra_param)
{
var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
        	if (xhr.readyState === XMLHttpRequest.DONE) 
		{
	            	if (xhr.status === 200) 
			{
                		if (success)
				{
					var data;
					try {
						data = JSON.parse(xhr.responseText);
					} 
					catch (e) {
		                		if (error)
							return error("JSON file: \""+ path + "\". " + e);
					}
					success(data, lang, extra_param);
				}
			} 
			else 
			{
                		if (error)
				{
					var s=null;
					if (xhr.response)
					{
						var s=arrayBufferToString(xhr.response);
						if (-1!=s.indexOf("<body>"))
							s=s.substring(s.indexOf("<body>"));
					}
		    			error("JSON file: \""+ path + "\". Status: " + xhr.statusText + "\n\nURL: "+ path + ((xhr.getAllResponseHeaders && xhr.getAllResponseHeaders()) ? "\n\nResponse headers:\n"+xhr.getAllResponseHeaders() : "") + ((s) ? "\nResponse Body:\n"+s : ""), lang, extra_param);
				}
			}
		}
	};
	xhr.open("GET", path, true);
	//xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=ISO-8859-1');
	//xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send();
}

function CarregaQualityMLjson()
{
	loadJSON("/qualityml.json", PintaObjecteDeQualityMLjson, CantaErrorQualityMLjson, Lang, null);
	
	PintaIdiomaGeneralTaules();

	if (-1!=(i=location.pathname.toLowerCase().indexOf("/qualitycollection/")))
	{
		PintaQualityCollection(Lang);
		return;
	}
	if (-1!=(i=location.pathname.toLowerCase().indexOf("/qualitycomposition/")))
	{
		PintaQualityComposition(Lang);
		return;
	}
	if (-1!=(i=location.pathname.toLowerCase().indexOf("/values/")))
	{
		PintaValues(Lang);
		return;
	}
	
}

function CantaErrorQualityMLjson(txt, lang, extra_param)
{
	alert(txt);
}

function CercaIdObjecte(objecte)
{
	return objecte.id.toLowerCase()==this.toLowerCase();
}

function CercaObjectePerId(llista_objs, identificador)
{
var objecte_trobat=null;	

	if(!llista_objs ||  llista_objs.length<1)
		return objecte_trobat;
	try
	{						
		objecte_trobat=llista_objs.find(CercaIdObjecte, identificador);
	}
	catch(ex)
	{								
		// En funció de la versió potser que no existeixi la funció find()
		var id_min=identificador.toLowerCase();
		for(var i=0; i<llista_objs.length; i++)
		{
			if(llista_objs[i].id.toLowerCase()==id_min)
				return objecte_trobat=llista_objs[i];			
		}
	}
	return objecte_trobat;
}

function DonaDescriptorClasseDesDeId(qml, q_class_id, lang)
{
	for(var i=0;i<qml.class.length;i++)
	{
		if (qml.class[i].id==q_class_id)
			return qml.class[i].name[lang];
	}
	return q_class_id;
}

function PintaMesuraDeQualityMLjson(qml, lang, extra_param)
{
var i;

	if (-1==(i=location.pathname.toLowerCase().indexOf("/measure/")))
	{
		alert("Cannot find '/measure/' in the URL");
		return;
	}
	var array_s=location.pathname.substring(i+1).split("/");
	if (array_s.length<2)
	{
		alert("Cannot find '/measure/' in the URL");
		return;
	}
	//var measure=qml.measure.find(CercaIdObjecte, array_s[1]);
	var measure=CercaObjectePerId(qml.measure, array_s[1]);
	if (!measure)
	{
		alert("Cannot find '/measure/' in the /qualityml.json");
		return;
	}
	
	// identificador
	document.getElementById("measure_uri").innerHTML="<a href=\"http://www.qualityml.org/1.0/measure/"+measure.id+"\">http://www.qualityml.org/1.0/measure/"+measure.id+"</a>";
	
	// nom de la mesura
	document.getElementById("measure_name").innerHTML=(measure.name)?measure.name[lang]:"";
	
	// noms alternatius
	var cadena_temp="";
	if(measure.alternativeName)
	{
		for(i=0;i<measure.alternativeName.length;i++)
		{
			if(measure.alternativeName[i][lang]!="")
			{
				cadena_temp+=measure.alternativeName[i][lang];
				cadena_temp+=(i<measure.alternativeName.length-1)?", ":"";
			}
		}
	}
	document.getElementById("measure_alt_names").innerHTML=cadena_temp;
	
	// descripció
	document.getElementById("measure_desc").innerHTML=(measure.desc)?measure.desc[lang] : "";
	
	// paràmetres
	cadena_temp="";
	if(measure.parameter)
	{
		for(i=0;i<measure.parameter.length;i++)
		{
			if(measure.parameter[i].id!="")
			{
				cadena_temp+=measure.parameter[i].id;
				if(measure.parameter[i].desc && measure.parameter[i].desc[lang])
				{
					cadena_temp+=(" ("+measure.parameter[i].desc[lang]+")");	
				}
				cadena_temp+=(i<measure.parameter.length-1)?", ":"";
			}
		}
	}	
	document.getElementById("measure_params").innerHTML=cadena_temp;
	
	// font
	document.getElementById("measure_source").innerHTML=(measure.source)?measure.source:"";

	// classes
	cadena_temp="";
	if(measure.classes)
	{
		for(i=0;i<measure.classes.length;i++)
		{
			if(measure.classes[i]!="")
			{
				cadena_temp+=measure.classes[i];
				cadena_temp+=(i<measure.classes.length-1)?", ":"";
			}
		}
	}
	document.getElementById("measure_classes").innerHTML=cadena_temp;

	//measure_example
	var example=document.getElementById("measure_example");
	if(example)
		example.innerHTML=(measure.example)?measure.example:"";

	// altre info
	document.getElementById("measure_info").innerHTML=(measure.furtherInformation)?measure.furtherInformation[lang]:"";
	// 19139 XML Example
	element=document.getElementById("measure_19139_xml_exemple");
	if(element)
		element.innerHTML=(measure.XML_19139_Example)?measure.XML_19139_Example:"";	
	return;
}

function PintaDominiDeQualityMLjson(qml, lang, extra_param)
{
var i;

	if (-1==(i=location.pathname.toLowerCase().indexOf("/domain/")))
	{
		alert("Cannot find '/domain/' in the URL");
		return;
	}
	var array_s=location.pathname.substring(i+1).split("/");
	if (array_s.length<2)
	{
		alert("Cannot find '/domain/' in the URL");
		return;
	}
	//var domain=qml.domain.find(CercaIdObjecte, array_s[1]);
	var domain=CercaObjectePerId(qml.domain, array_s[1]);
	if (!domain)
	{
		alert("Cannot find '/domain/' in the /qualityml.json");
		return;
	}
	
	// identificador
	document.getElementById("domain_uri").innerHTML="<a href=\"http://www.qualityml.org/1.0/domain/"+domain.id+"\">http://www.qualityml.org/1.0/domain/"+domain.id+"</a>";
	
	// nom del domini
	document.getElementById("domain_name").innerHTML=(domain.name)?domain.name[lang]:"";

	// noms alternatius
	var cadena_temp="";
	if(domain.alternativeName)
	{
		for(i=0;i<domain.alternativeName.length;i++)
		{
			if(domain.alternativeName[i][lang]!="")
			{
				cadena_temp+=domain.alternativeName[i][lang];
				cadena_temp+=(i<domain.alternativeName.length-1)?", ":"";
			}
		}
	}
	document.getElementById("domain_alt_names").innerHTML=cadena_temp;
	
	// descripció
	document.getElementById("domain_desc").innerHTML=(domain.desc)?domain.desc[lang] : "";
	// fórmula
	document.getElementById("domain_form").innerHTML=(domain.form)?domain.form[lang] : "";

	// paràmetres
	cadena_temp="";
	if(domain.parameter)
	{
		for(i=0;i<domain.parameter.length;i++)
		{
			if(domain.parameter[i].id!="")
			{
				cadena_temp+=domain.parameter[i].id;
				if(domain.parameter[i].desc && domain.parameter[i].desc[lang])
				{
					cadena_temp+=(" ("+domain.parameter[i].desc[lang]+")");	
				}
				cadena_temp+=(i<domain.parameter.length-1)?", ":"";
			}
		}
	}	
	document.getElementById("domain_params").innerHTML=cadena_temp;
	
	// font
	document.getElementById("domain_source").innerHTML=(domain.source)?domain.source:"";
	
	//categories
	var element=document.getElementById("domain_cats");
	if(element)
	{
		element.innerHTML=(domain.categories)?domain.categories[lang]:"";
	}

	// altre info
	element=document.getElementById("domain_info");
	if(element)
	{
		element.innerHTML=(domain.furtherInformation)?domain.furtherInformation[lang]:"";
	}
	// 19139 XML Example
	element=document.getElementById("domain_19139_xml_exemple");
	if(element)
		element.innerHTML=(domain.XML_19139_Example)?domain.XML_19139_Example:"";	
	// XML schema
	element=document.getElementById("domain_xml_schema");
	if(element)
		element.innerHTML=(domain.XMLSchema)?domain.XMLSchema:"";	
		
	// XML example
	element=document.getElementById("domain_xml_example");
	if(element)
		element.innerHTML=(domain.XMLExample)?domain.XMLExample:"";	
	
	// JSON example
	element=document.getElementById("domain_json_example");
	if(element)
		element.innerHTML=(domain.JSONExample)?domain.JSONExample:"";	
		
	// API example
	element=document.getElementById("domain_api_example");
	if(element)
		element.innerHTML=(domain.APIExample)?domain.APIExample:"";	
		
	// Value constraints
	element=document.getElementById("domain_value_constraints");
	if(element)
		element.innerHTML=(domain.ValueConstraints)?domain.ValueConstraints[lang]:"";		
	
	return;
}

function PintaMetricaDeQualityMLjson(qml, lang, extra_param)
{
var i;

	if (-1==(i=location.pathname.toLowerCase().indexOf("/metrics/")))
	{
		alert("Cannot find '/metrics/' in the URL");
		return;
	}
	var array_s=location.pathname.substring(i+1).split("/");
	if (array_s.length<2)
	{
		alert("Cannot find '/metrics/' in the URL");
		return;
	}
	//var metric=qml.metric.find(CercaIdObjecte, array_s[1]);
	var metric=CercaObjectePerId(qml.metric, array_s[1]);
	if (!metric)
	{
		alert("Cannot find '/metrics/' in the /qualityml.json");
		return;
	}
	
	// identificador
	document.getElementById("metric_uri").innerHTML="<a href=\"http://www.qualityml.org/1.0/metrics/"+metric.id+"\">http://www.qualityml.org/1.0/metrics/"+metric.id+"</a>";
	
	// nom de la mètrica
	document.getElementById("metric_name").innerHTML=(metric.name)?metric.name[lang]:"";

	// noms alternatius
	var cadena_temp="";
	if(metric.alternativeName)
	{
		for(i=0;i<metric.alternativeName.length;i++)
		{
			if(metric.alternativeName[i][lang]!="")
			{
				cadena_temp+=metric.alternativeName[i][lang];
				cadena_temp+=(i<metric.alternativeName.length-1)?", ":"";
			}
		}
	}
	document.getElementById("metric_alt_names").innerHTML=cadena_temp;
	
	// descripció
	document.getElementById("metric_desc").innerHTML=(metric.desc)?metric.desc[lang] : "";

	//formula
	document.getElementById("metric_formula").innerHTML=(metric.form && metric.form[lang]) ? metric.form[lang] : "";
	
	// paràmetres
	cadena_temp="";
	if(metric.parameter)
	{
		for(i=0;i<metric.parameter.length;i++)
		{
			if(metric.parameter[i].id!="")
			{
				cadena_temp+=metric.parameter[i].id;
				if(metric.parameter[i].desc && metric.parameter[i].desc[lang])
				{
					cadena_temp+=(" ("+metric.parameter[i].desc[lang]+")");	
				}
				cadena_temp+=(i<metric.parameter.length-1)?", ":"";
			}
		}
	}	
	document.getElementById("metric_params").innerHTML=cadena_temp;
	
	// font
	document.getElementById("metric_source").innerHTML=(metric.source)?metric.source:"";

	//Classes
	cadena_temp="";
	var element=document.getElementById("metric_class");
	if(element && metric.classes)
	{
		for(i=0;i<metric.classes.length;i++)
		{
			if(metric.classes[i].id!="")
			{
				cadena_temp+=metric.classes[i];
				cadena_temp+=(i<metric.classes.length-1)?", ":"";
			}
		}
		element.innerHTML=cadena_temp;
	}	

	// altre info
	element=document.getElementById("metric_info");
	if(element)
		element.innerHTML=(metric.furtherInformation)?metric.furtherInformation[lang]:"";	
	// 19139 XML Example
	element=document.getElementById("metric_19139_xml_exemple");
	if(element)
		element.innerHTML=(metric.XML_19139_Example)?metric.XML_19139_Example:"";	
		
	// XML schema
	element=document.getElementById("metric_xml_schema");
	if(element)
		element.innerHTML=(metric.XMLSchema)?metric.XMLSchema:"";	
		
	// XML example
	element=document.getElementById("metric_xml_example");
	if(element)
		element.innerHTML=(metric.XMLExample)?metric.XMLExample:"";	
	
	// JSON example
	element=document.getElementById("metric_json_example");
	if(element)
		element.innerHTML=(metric.JSONExample)?metric.JSONExample:"";	
		
	// API example
	element=document.getElementById("metric_api_example");
	if(element)
		element.innerHTML=(metric.APIExample)?metric.APIExample:"";	
		
	// Value constraints
	element=document.getElementById("metric_value_constraints");
	if(element)
		element.innerHTML=(metric.ValueConstraints)?metric.ValueConstraints[lang]:"";		
	
	return;
}



function DonaCadenaUnaFilaMatriu(metric_matrix, qml, lang)
{
var cadena="";
var trobat;

	//indicator
	cadena="<tr><td align=\"center\">";
	//trobat=qml.indicator.find(CercaIdObjecte, metric_matrix.indicator);
	trobat=CercaObjectePerId(qml.indicator, metric_matrix.indicator);
	if(trobat)
		cadena+=trobat.name[lang];
	else
		cadena+=metric_matrix.indicator;
	//DQ_element
	cadena+=("</td><td align=\"center\">"+metric_matrix.DQ_Element);
	//measure
	cadena+="</td><td align=\"center\"><p><b>";				
	//trobat=qml.measure.find(CercaIdObjecte, metric_matrix.measure);
	trobat=CercaObjectePerId(qml.measure, metric_matrix.measure);
	if(trobat)
		cadena+=(trobat.name[lang]+"</b></p><p><a href=1.0/measure/"+trobat.id+">measure/"+trobat.id+"</a>");
	else
		cadena+=(metric_matrix.measure+"</b>");				
	if( metric_matrix.measure_obs)
		cadena+=("<br>("+metric_matrix.measure_obs+")");
	//domain
	cadena+="</p></td><td align=\"center\">";
	if(metric_matrix.domain)
	{
		for(var j=0; j<metric_matrix.domain.length;j++)
		{
			//trobat=qml.domain.find(CercaIdObjecte, metric_matrix.domain[j]);
			trobat=CercaObjectePerId(qml.domain, metric_matrix.domain[j]);
			if(trobat)
				cadena+=("<a href=1.0/domain/"+trobat.id+">domain/"+trobat.id+"</a>");
			else
				cadena+=metric_matrix.domain[j];
			if(j<metric_matrix.domain.length-1)
				cadena+=",<br>";
		}
	}
	if( metric_matrix.domain_obs)
		cadena+=("<br>("+metric_matrix.domain_obs+")");

	//metrics
	cadena+="</p></td><td align=\"center\">";
	//trobat=qml.metric.find(CercaIdObjecte, metric_matrix.metric);
	if(metric_matrix.metric)
	{
		trobat=CercaObjectePerId(qml.metric, metric_matrix.metric);
		if(trobat)
		{
			cadena+=("<a href=1.0/metrics/"+trobat.id+">metrics/"+trobat.id+"</a>");
			if(trobat.alternativeName && trobat.alternativeName.length)
			{
				cadena+="<br><i>"+DonaCadenaJSON(msg_altName)+":</i>";
				for(var j=0; j<trobat.alternativeName.length;j++)
				{
					if (trobat.alternativeName[j][lang]!="")
					cadena+=("<br>"+trobat.alternativeName[j][lang]);
				}
			}
		}
		else
			cadena+=metric_matrix.metric;
	}


	//observations
	cadena+=("</td><td align=\"center\">"+(metric_matrix.observations?metric_matrix.observations:""));			
	//origin
	cadena+=("</td><td>"+(metric_matrix.origin?metric_matrix.origin:"")+"</td></tr>");
	return cadena;
}

function DonaCadenaIniciTaulaMatriu(qml, i_metric_matrix, lang)
{
	return "<p><a name=\"matrix_"+qml.MetricMatrix[i_metric_matrix].class+"\"></a>"+
		"<h4>"+DonaCadenaJSON(msg_qualityclass)+": " + DonaDescriptorClasseDesDeId(qml, qml.MetricMatrix[i_metric_matrix].class, lang) + "</h4>"+
		"<table border=\"1\" style=\"width: 100%;\">"+
		"<tr><th width=\"83\" align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_qualityind)+"</th>\<th width=\"283\" align=\"center\" scope=\"col\">gmd:DQ_Element</th><th width=\"403\" align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_qualitymeas)+"</th><th width=\"211\" align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_domain)+"</th><th width=\"323\" align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_metrics)+"</th><th width=\"146\" align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_observation)+"</th><th width=\"69\" align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_origin)+"</th></tr>";
}

function DonaCadenaFiTaulaMatriu()
{
	return "</table>"+
		"<br>"+
		"<p align=\"center\"><a href=\"index.htm#Principi\"><img alt=\"Tornar\" height=\"23\" src=\"ArrowUp.jpg\" width=\"23\"/></a><br/>"+
		"<i>"+DonaCadenaJSON(msg_backToTop)+"</i></p>";
}

function DonaCadenaInteriorTaulaURINomeParamSource(qml_array, subpath, lang)
{
	var cadena="<table border=\"1\" bordercolor=\"#CCCCCC\"><tr bgcolor=\"#CCCCCC\"><th align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_uri)+"</th><th align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_name)+"</th><th scope=\"col\">"+DonaCadenaJSON(msg_param)+"</th><th align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_origin)+"</th></tr>";
	for(i=0;i<qml_array.length;i++)
	{
		cadena+="<tr><td align=\"center\">";
		cadena+="<p><a href=\"http://www.qualityml.org/1.0/" + subpath + "/"+ qml_array[i].id +"\">"+ subpath + "/" + qml_array[i].id + "</a></p>";
		cadena+="</td><td align=\"center\"><b>";
		cadena+=qml_array[i].name[lang];
		cadena+="</b></td><td align=\"left\">";
		if (qml_array[i].parameter)
		{
			for(var j=0;j<qml_array[i].parameter.length;j++)
			{
				if (j!=0)
					cadena+="<br><br>";
				cadena+=qml_array[i].parameter[j].id;
				if (qml_array[i].parameter[j].desc && qml_array[i].parameter[j].desc[lang])
					cadena+=" ("+qml_array[i].parameter[j].desc[lang]+")";
			}
		}
		cadena+="</td><td align=\"left\">";
		cadena+=(qml_array[i].source)?qml_array[i].source:"";
		cadena+="</td></tr>";
	}
	cadena+="</table>";
	cadena+="<br></br>";
	cadena+='<p align="center"><a href="index.htm#Principi"><img alt="Tornar" height="23" src="ArrowUp.jpg" width="23"/></a><br/>'+
	'<i>'+DonaCadenaJSON(msg_backToTop)+'</i></p>';

	return cadena;
}

function PintaPlanaPrincipal(qml, lang, extra_param)
{

PintaPlanaPrincipalMultiidoma(lang);

var cadena="";
var i;
var trobat;

	// Classes
	var classes=document.getElementById("taula_classes");
	if(classes && qml.class)
	{
		cadena="<table border=\"1\"><tr bgcolor=\"#CCCCCC\"><th align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_name)+"</th><th scope=\"col\">"+DonaCadenaJSON(msg_description)+"</th></tr>";
		for(i=0;i<qml.class.length;i++)
		{
			cadena+="<tr><td align=\"center\"><b>";
			cadena+=qml.class[i].name[lang];
			cadena+="</b></td><td align=\"left\">";
			cadena+=qml.class[i].desc[lang];
			cadena+="</td></tr>";
		}
		cadena+="</table><br>";
		cadena+='<p align="center"><a href="index.htm#Principi"><img alt="Tornar" height="23" src="ArrowUp.jpg" width="23"/></a><br/>'+
		'<i>'+DonaCadenaJSON(msg_backToTop)+'</i></p>';
		classes.innerHTML=cadena;
	}
	
	// Indicadors
	var indicadors=document.getElementById("taula_indicadors");
	if(indicadors && qml.indicator)
	{
		cadena="<table border=\"1\"><tr bgcolor=\"#CCCCCC\"><th align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_qualityclass)+"</th><th align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_qualityind)+"</th><th scope=\"col\">"+DonaCadenaJSON(msg_description)+"</th></tr>";
		for(i=0;i<qml.indicator.length;i++)
		{
			cadena+="<tr><td align=\"center\"><b>";
			//trobat=qml.class.find(CercaIdObjecte, qml.indicator[i].class);
			trobat=CercaObjectePerId(qml.class, qml.indicator[i].class);
			if(trobat)
				cadena+=trobat.name[lang];
			else
				cadena+=qml.indicator[i].class;
			cadena+="</b></td><td align=\"center\"><b>";
			cadena+=qml.indicator[i].name[lang];
			cadena+="</b></td><td align=\"left\">";
			cadena+=qml.indicator[i].desc[lang];
			cadena+="</td></tr>";
		}
		cadena+="</table><br>";
		cadena+='<p align="center"><a href="index.htm#Principi"><img alt="Tornar" height="23" src="ArrowUp.jpg" width="23"/></a><br/>'+
		'<i>'+DonaCadenaJSON(msg_backToTop)+'</i></p>';
		indicadors.innerHTML=cadena;
	}

	//taula indicadors hydrography
	var hydro=document.getElementById("taula_hydro");
	if(hydro && qml.indicator)
	{
		cadena="<table border=\"1\"><tr bgcolor=\"#CCCCCC\"><th align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_qualityclass)+"</th><th align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_qualityind)+"</th><th scope=\"col\">"+DonaCadenaJSON(msg_description)+"</th></tr>";
		for(i=0;i<qml.indicator.length;i++)
		{
			if ((qml.indicator[i].id=="DQ_CompletenessCommission")||(qml.indicator[i].id=="DQ_CompletenessOmission")||(qml.indicator[i].id=="DQ_ConceptualConsistency")||(qml.indicator[i].id=="DQ_DomainConsistency")||(qml.indicator[i].id=="DQ_TopologicalConsistency")||(qml.indicator[i].id=="DQ_AbsoluteExternalPositionalAccuracy")||(qml.indicator[i].id=="DQ_RelativeInternalPositionalAccuracy")||(qml.indicator[i].id=="DQ_NonQuantitativeAttributeAccuracy")||(qml.indicator[i].id=="DQ_QuantitativeAttributeAccuracy"))
			{
				cadena+="<tr><td align=\"center\"><b>";
				//trobat=qml.class.find(CercaIdObjecte, qml.indicator[i].class);
				trobat=CercaObjectePerId(qml.class, qml.indicator[i].class);
				if(trobat)
					cadena+=trobat.name[lang];
				else
					cadena+=qml.indicator[i].class;
				cadena+="</b></td><td align=\"center\"><b>";
				cadena+=qml.indicator[i].name[lang];
				cadena+="</b></td><td align=\"left\">";
				cadena+=qml.indicator[i].desc[lang];
				cadena+="</td></tr>";
			}
		}
		cadena+="</table><br>";
		cadena+='<p align="center"><a href="index.htm#Principi"><img alt="Tornar" height="23" src="ArrowUp.jpg" width="23"/></a><br/>'+
		'<i>'+DonaCadenaJSON(msg_backToTop)+'</i></p>';
		hydro.innerHTML=cadena;
	}

	// Dominis
	var dominis=document.getElementById("taula_dominis");
	if(dominis && qml.domain)
		dominis.innerHTML=DonaCadenaInteriorTaulaURINomeParamSource(qml.domain, "domain", lang);

	// Mètriques
	var metrics=document.getElementById("taula_metriques");
	if(metrics && qml.metric)
		metrics.innerHTML=DonaCadenaInteriorTaulaURINomeParamSource(qml.metric, "metrics", lang);
	
	// Matrius de mesures x classe
	var matrius=document.getElementById("taules_quality_matrices");
	if(matrius && qml.MetricMatrix)
	{
		cadena=DonaCadenaJSON({eng:"Tables", cat:"Taules", spa:"Tablas"})+":<ul>";
		for(i=0;i<qml.MetricMatrix.length;i++)
		{
			if (i==0 || qml.MetricMatrix[i].class!=qml.MetricMatrix[i-1].class)
			{
				cadena+="<li><a href=\"#matrix_"+qml.MetricMatrix[i].class+"\">"+ DonaDescriptorClasseDesDeId(qml, qml.MetricMatrix[i].class, lang) + "</a>"
			}
		}

		cadena+="</ul>";
		for(i=0;i<qml.MetricMatrix.length;i++)
		{
			if (i==0 || qml.MetricMatrix[i].class!=qml.MetricMatrix[i-1].class)
			{
				if (i!=0)
					cadena+=DonaCadenaFiTaulaMatriu();
				cadena+=DonaCadenaIniciTaulaMatriu(qml, i, lang);
			}
			cadena+=DonaCadenaUnaFilaMatriu(qml.MetricMatrix[i], qml, lang);
		}
		cadena+=DonaCadenaFiTaulaMatriu()
		matrius.innerHTML=cadena;
	}

	//Matrius mètriques agragades
	var agregmet=document.getElementById("t_QualMetSets");
	if(agregmet && qml.metricsAggregation)
	{
		cadena="<table  width=\"90%\" border=\"1\"><tr bgcolor=\"#CCCCCC\"><th align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_uri)+"</th><th align=\"center\" scope=\"col\">"+DonaCadenaJSON(msg_metagreg)+"</th><th scope=\"col\">"+DonaCadenaJSON(msg_elements)+"</th><th align=\"center\">"+DonaCadenaJSON(msg_origin)+"</th></tr>";
		for(i=0;i<qml.metricsAggregation.length;i++)
		{
				cadena+="<tr><td>";
				cadena+='<div align="center"><a href="https://www.qualityml.org/1.0/metricsAggregation/'+qml.metricsAggregation[i].id+'\">metricsAggregation\\'+qml.metricsAggregation[i].id+'</a></div>';
				cadena+="</td><td><div align=\"center\"><b>";
				cadena+=qml.metricsAggregation[i].id;
				cadena+="</b></div></td><td>";
				for(n=0;n<qml.metricsAggregation[i].elements.length;n++)
					cadena+='<a href="https://www.qualityml.org/1.0/metrics/'+qml.metricsAggregation[i].elements[n]+'\">metrics\\'+qml.metricsAggregation[i].elements[n]+'</a></br>';
				cadena+="</td><td><div  align=\"center\">";
				cadena+=qml.metricsAggregation[i].source;
				cadena+="</div></td></tr>";
		}
		cadena+="</table><br>";
		cadena+='<p align="center"><a href="index.htm#Principi"><img alt="Tornar" height="23" src="ArrowUp.jpg" width="23"/></a><br/>'+
		'<i>'+DonaCadenaJSON(msg_backToTop)+'</i></p>';
		agregmet.innerHTML=cadena;
	}


	return;
}


function PintaObjecteDeQualityMLjson(qml, lang, extra_param)
{
var i;

	if (-1!=(i=location.pathname.toLowerCase().indexOf("/measure/")))
	{
		PintaMesuraDeQualityMLjson(qml, lang, extra_param);
		return;
	}

	if (-1!=(i=location.pathname.toLowerCase().indexOf("/domain/")))
	{
		PintaDominiDeQualityMLjson(qml, lang, extra_param);
		return;
	}
	
	if (-1!=(i=location.pathname.toLowerCase().indexOf("/metrics/")))
	{
		PintaMetricaDeQualityMLjson(qml, lang, extra_param);
		return;
	}
	PintaPlanaPrincipal(qml, lang, extra_param);
	return;
}

//aquesta funció fa multiidiomàtiques les etiquetes dels registres de les taules de mètriques, dominis, mesures, valors, etc.
function PintaIdiomaGeneralTaules()
{
	if (document.getElementById("t_uri"))
		document.getElementById("t_uri").innerHTML=DonaCadenaJSON(msg_uri)+":";
	if (document.getElementById("t_name"))
		document.getElementById("t_name").innerHTML=DonaCadenaJSON(msg_name)+":";	
	if (document.getElementById("t_altName"))
		document.getElementById("t_altName").innerHTML=DonaCadenaJSON(msg_altName)+":";
	if (document.getElementById("t_def"))
		document.getElementById("t_def").innerHTML=DonaCadenaJSON(msg_def)+":";	
	if (document.getElementById("t_form"))
		document.getElementById("t_form").innerHTML=DonaCadenaJSON(msg_form)+":";	
	if (document.getElementById("t_param"))
		document.getElementById("t_param").innerHTML=DonaCadenaJSON(msg_param)+":";	
	if (document.getElementById("t_source"))
		document.getElementById("t_source").innerHTML=DonaCadenaJSON(msg_source)+":";
	if (document.getElementById("t_catego"))
		document.getElementById("t_catego").innerHTML=DonaCadenaJSON(msg_catego)+":";
	if (document.getElementById("t_class"))
		document.getElementById("t_class").innerHTML=DonaCadenaJSON(msg_class)+":";
	if (document.getElementById("t_info"))
		document.getElementById("t_info").innerHTML=DonaCadenaJSON(msg_info)+":";
	if (document.getElementById("t_19139_xml_example"))
		document.getElementById("t_19139_xml_example").innerHTML=DonaCadenaJSON(msg_19139_xml_example)+":";
	if (document.getElementById("t_xml_schema"))
		document.getElementById("t_xml_schema").innerHTML=DonaCadenaJSON(msg_xml_schema)+":";
	if (document.getElementById("t_xml_example"))
		document.getElementById("t_xml_example").innerHTML=DonaCadenaJSON(msg_xml_example)+":";
	if (document.getElementById("t_json_example"))
		document.getElementById("t_json_example").innerHTML=DonaCadenaJSON(msg_json_example)+":";
	if (document.getElementById("t_api_example"))
		document.getElementById("t_api_example").innerHTML=DonaCadenaJSON(msg_api_example)+":";
	if (document.getElementById("t_valConst"))
		document.getElementById("t_valConst").innerHTML=DonaCadenaJSON(msg_valConst)+":";

}

//funció que fa multiidioma la taula qualityCollection
function PintaQualityCollection(lang, extra_param)
{

	if (document.getElementById("c_uri"))
		document.getElementById("c_uri").innerHTML='<a href="http://www.qualityml.org/1.0/qualityCollection">http://www.qualityml.org/1.0/qualityCollection</a>';
	if (document.getElementById("c_name"))
		document.getElementById("c_name").innerHTML=DonaCadenaJSON({eng:"Quality collection", cat:"Col·lecció de qualitat", spa:"Colección de calidad"});	
	//if (document.getElementById("c_altName"))
	//	document.getElementById("c_altName").innerHTML=DonaCadenaJSON(); // --> el camp es queda blanc
	if (document.getElementById("c_def"))
		document.getElementById("c_def").innerHTML=DonaCadenaJSON({eng:"Variable that is decomposed in components or parameters", cat:"Variable que es descomposa en components o paràmetres", spa:"Variable que se descompone en componentes o parámetros"});
	if (document.getElementById("c_source"))
		document.getElementById("c_source").innerHTML="WMQ-Q";

}

//funció que fa multiidioma la taula qualityComposition
function PintaQualityComposition(lang, extra_param)
{
	if (document.getElementById("c_uri"))
		document.getElementById("c_uri").innerHTML='<a href="	http://www.qualityml.org/1.0/qualityComposition">	http://www.qualityml.org/1.0/qualityComposition</a>';
	if (document.getElementById("c_name"))
		document.getElementById("c_name").innerHTML=DonaCadenaJSON({eng:"Quality composition", cat:"Composició de qualitat", spa:"Composición de calidad"});	
	//if (document.getElementById("c_altName"))
	//	document.getElementById("c_altName").innerHTML=DonaCadenaJSON(); // --> el camp es queda blanc
	if (document.getElementById("c_def"))
		document.getElementById("c_def").innerHTML=DonaCadenaJSON({eng:"Component that represents a composition of other components for visualization purposes", cat:"Component que representa una composició d'altres components amb finalitats de visualització", spa:"Componente que representa una composición de otros componentes con fines de visualización"});
	if (document.getElementById("c_source"))
		document.getElementById("c_source").innerHTML="WMQ-Q";

}

//funció que fa multiidioma la taula values
function PintaValues(lang, extra_param)
{
	if (document.getElementById("c_uri"))
	document.getElementById("c_uri").innerHTML='<a href="	http://www.qualityml.org/1.0/values">	http://www.qualityml.org/1.0/values</a>';
	if (document.getElementById("c_name"))
		document.getElementById("c_name").innerHTML=DonaCadenaJSON({eng:"Values", cat:"Valors", spa:"Valores"});	
	//if (document.getElementById("c_altName"))
	//	document.getElementById("c_altName").innerHTML=DonaCadenaJSON(); // --> el camp es queda blanc
	if (document.getElementById("c_def"))
		document.getElementById("c_def").innerHTML=DonaCadenaJSON({eng:"Parameter or component that more closely represent the actual values measured", cat:"Paràmetre o component que representa amb més fidelitat els valors reals mesurats", spa:"Parámetro o componente que representa más fielmente los valores reales medidos"});
	if (document.getElementById("c_source"))
		document.getElementById("c_source").innerHTML="WMQ-Q";
}


//funció que fa multiidioma els textos de la pàgina principal
function PintaPlanaPrincipalMultiidoma(lang, extra_param)
{
	//títol principal
	if (document.getElementById("title_h1"))
		document.getElementById("title_h1").innerHTML=DonaCadenaJSON({
			eng:"<img  src="+'"qualityml_big.png"'+"><br>Quality Indicators Dictionary and Markup Language",
			cat:"<img  src="+'"qualityml_big.png"'+"><br>Diccionari i Llenguatge Etiquetat d'Indicadors de Qualitat",
			spa:"<img  src="+'"qualityml_big.png"'+"><br>Diccionario y Lenguaje Etiquetado de Indicadores de Calidad"
		})

	//paràgrafs introducció
	if (document.getElementById("intro_p_01"))
		document.getElementById("intro_p_01").innerHTML=DonaCadenaJSON({
			eng:"The scenario of rapidly growing geodata catalogues requires tools focused on facilitate users the choice of products. Having quality fields populated in metadata allow the users to rank and then select the best fit-for-purpose products. In this direction, QualityML is a dictionary that contains hierarchically structured concepts to precisely define and relate quality levels: from quality classes to quality measurements. These levels are used to encode quality semantics for geospatial data by mapping them to the corresponding metadata schemas. The benefits of having encoded quality semantics, in the case of data producers, are related with improvements in their product discovery and better transmission of their characteristics. In the case of data users, they would better compare quality and uncertainty measures to take the best selection of data as well as to perform dataset intercomparison. Also, it allows other components (such as visualization, discovery, or comparison tools) to be quality-aware and interoperable.",
			cat:"L'escenari de ràpid creixement dels catàlegs de geodades requereix eines enfocades a facilitar als usuaris l'elecció dels productes. Tenir camps de qualitat emplenats a les metadades permet als usuaris classificar i seleccionar els productes més adequats per als seus objectius. En aquest sentit, QualityML és un diccionari que conté conceptes estructurats jeràrquicament per definir i relacionar amb precisió els nivells de qualitat: des de classes de qualitat fins a mesures de qualitat. Aquests nivells s'utilitzen per codificar la semàntica de qualitat de les dades geoespacials mapejant-les als esquemes de metadades corresponents. Els beneficis de tenir una semàntica de qualitat codificada, en el cas dels productors de dades, estan relacionats amb la millora en el descobriment de productes i una millor transmissió de les seves característiques. En el cas dels usuaris de dades, podrien comparar millor les mesures de qualitat i incertesa per fer la millor selecció de dades, així com per realitzar una intercomparació de conjunts de dades. A més, permet que altres components (com ara eines de visualització, descobriment o comparació) siguin conscients de la qualitat i siguin interoperables.",
			spa:"El escenario de rápido crecimiento de los catálogos de geodatos requiere herramientas enfocadas a facilitar a los usuarios la elección de los productos. Tener campos de calidad cumplimentados en los metadatos permite a los usuarios clasificar y seleccionar los productos más adecuados para sus objetivos. En este sentido, QualityML es un diccionario que contiene conceptos estructurados jerárquicamente para definir y relacionar con precisión los niveles de calidad: desde clases de calidad hasta medidas de calidad. Estos niveles se utilizan para codificar la semántica de calidad de los datos geoespaciales mapeándolos en los esquemas de metadatos correspondientes. Los beneficios de tener una semántica de calidad codificada, en el caso de los productores de datos, están relacionados con la mejora en el descubrimiento de productos y una mejor transmisión de sus características. En el caso de los usuarios de datos, podrían comparar mejor las medidas de calidad e incertidumbre para realizar la mejor selección de datos, así como para realizar una intercomparación de conjuntos de datos. Además permite que otros componentes (como herramientas de visualización, descubrimiento o comparación) sean conscientes de la calidad y sean interoperables."	
		});
	if (document.getElementById("intro_p_02"))
		document.getElementById("intro_p_02").innerHTML=DonaCadenaJSON({
			eng:"On one hand, the QualityML is a profile of the ISO geospatial metadata standards (e.g. ISO 19157) providing a set of rules for precisely documenting quality measure parameters that is structured in 5 levels. On the other hand, QualityML includes semantics and vocabularies for the quality concepts. Whenever possible, it uses statistic expressions from the UncertML dictionary (<a href="+'"https://web.archive.org/web/20161029215452/http://uncertml.org"'+">http://www.uncertml.org</a>) encoding. However, it also extends UncertML to provide a list of alternative metrics that are commonly used to quantify quality beyond the uncertainty concept. Unfortunately, the website of UncertML was shut down in 2016. It still can be queried from the <a href="+'"https://web.archive.org/web/20161029215452/http://uncertml.org"'+">Web Archive project</a>. Given the situation, in 2018 QualityML decided to duplicate all UncertML records that were used at that time.",
			cat:"D'una banda, QualityML és un perfil dels estàndards de metadades geoespacials ISO (per exemple, ISO 19157) estrcturat en 5 nivells que proporciona un conjunt de regles per documentar amb precisió els paràmetres de les mesures de qualitat. D'altra banda, QualityML inclou semàntica i vocabularis per als conceptes de qualitat. Sempre que és possible, utilitza expressions estadístiques del diccionari UncertML (<a href="+'"https://web.archive.org/web/20161029215452/http://uncertml.org"'+">http://www.uncertml.org</a>). Tanmateix, també amplia UncertML per proporcionar una llista de mètriques alternatives que s'utilitzen habitualment per quantificar la qualitat més enllà del concepte d'incertesa. Malauradament, el lloc web d'UncertML es va tancar el 2016. Encara es pot consultar des del <a href="+'"https://web.archive.org/web/20161029215452/http://uncertml.org"'+">Web Archive project</a>. Donada la situació, el 2018 QualityML va decidir duplicar tots els registres UncertML que s'utilitzaven en aquell moment.",
			spa:"Por un lado, QualityML es un perfil de los estándares de metadatos geoespaciales ISO (por ejemplo, ISO 19157) estructurado en 5 niveles que proporciona un conjunto de reglas para documentar con precisión los parámetros de las medidas de calidad. Por su parte, QualityML incluye semántica y vocabularios para los conceptos de calidad. Siempre que sea posible, utiliza expresiones estadísticas del diccionario UncertML (<a href="+'"https://web.archive.org/web/20161029215452/http://uncertml.org"'+">http://www.uncertml.org</a>). Sin embargo, también amplía UncertML para proporcionar una lista de métricas alternativas que se utilizan habitualmente para cuantificar la calidad más allá del concepto de incertidumbre. Desgraciadamente, el sitio web de UncertML se cerró en 2016. Todavía se puede consultar desde el <a href="+'"https://web.archive.org/web/20161029215452/http://uncertml.org"'+">Web Archive project</a>. Dada la situación, en 2018 QualityML decidió duplicar todos los registros UncertML que se utilizaban en ese momento."
		});
	if (document.getElementById("intro_p_03"))
		document.getElementById("intro_p_03").innerHTML=DonaCadenaJSON({
			eng:"Finally, keep in mind that QualityML is not just suitable for encoding geospatial dataset level quality but also considers pixel and object level uncertainties. This is done by linking the  metadata quality descriptions with layers representing not just the data, but the uncertainty values associated with each geospatial element.",
			cat:"Finalment, tingueu en compte que QualityML no només és adequat per codificar la qualitat a nivell de conjunt de dades geoespacials, sinó que també té en compte les incerteses a nivell de cel·la i objecte. Això es fa enllaçant les descripcions de la qualitat de les metadades amb capes que representen no només les dades, sinó també els valors d'incertesa associats a cada element geoespacial.",
			spa:"Por último, tenga en cuenta que QualityML no sólo es adecuado para codificar la calidad a nivel de conjunto de datos geoespaciales, sino que también tiene en cuenta las incertidumbres a nivel de celda y objeto. Esto se hace enlazando las descripciones de la calidad de los metadatos con capas que representan no sólo los datos, sino también los valores de incertidumbre asociados a cada elemento geoespacial."
		});
	if (document.getElementById("intro_p_04"))
		document.getElementById("intro_p_04").innerHTML=DonaCadenaJSON({
			eng:"This page is structured in the following sections:",
			cat:"Aquesta pàgina s'estructura en les següents seccions",
			spa:"Esta página se estructura en las siguientes secciones"
		});
	if (document.getElementById("intro_p_05"))
		document.getElementById("intro_p_05").innerHTML=DonaCadenaJSON({
			eng:"A URI is defined for each <i>measure</i>, <i>domain</i> and <i>metric</i>.",
			cat:"Es defineix una URI per a cada <i>mesura</i>, <i>domini</i> i <i>mètrica</i>",
			spa:"Se define una URI para cada <i>medida</i>, <i>dominio</i> y <i>métrica</i>"
		});
	if (document.getElementById("intro_p_06"))
		document.getElementById("intro_p_06").innerHTML=DonaCadenaJSON({
			eng:"<b>All relative URIs in this page refer to <a href="+'"https://www.qualityml.org/1.0/"'+">https://www.qualityml.org/1.0/</a></b>",
			cat:"<b>Totes les URIs relatives en aquesta pàgina fan referència a <a href="+'"https://www.qualityml.org/1.0/"'+">https://www.qualityml.org/1.0/</a></b>",
			spa:"<b>Todas las URIs relativas en esta página hacen referencia a <a href="+'"https://www.qualityml.org/1.0/"'+">https://www.qualityml.org/1.0/</a></b>"
		});
	if (document.getElementById("intro_p_07"))
		document.getElementById("intro_p_07").innerHTML=DonaCadenaJSON({
			eng:"The research leading to these results has been carried out in several projects that have received funding from the European Union: GeoViQua (Seventh Framework Programme, grant agreement no. 265178), WQeMS  (Horizon 2020, grant agreement no. 101004157), EIFFEL (Horizon 2020, grant agreement no. 101003518) and CitiObs (Horizon Europe, grant agreement no. 101086421).",
			cat:"La recerca que ha portat a aquests resultats s'ha dut a terme en diversos projectes que han rebut finançament de la Unió Europea: GeoViQua (Setè Programa Marc, acord de subvenció núm. 265178), WQeMS (Horizon 2020, acord de subvenció núm. 101004157), EIFFEL (Horizon 2020, acord de subvenció núm. 101003518) i CitiObs (Horizon Europe, conveni de subvenció núm. 101086421).",
			spa:"La investigación que ha llevado a estos resultados se ha llevado a cabo en varios proyectos que han recibido financiación de la Unión Europea: GeoViQua (Séptimo Programa Marco, acuerdo de subvención núm. 265178), WQeMS (Horizon 2020, acuerdo de subvención núm. 101004157), EIFFEL (Horizon 2020, acuerdo de subvención núm. 101003518) y CitiObs (Horizon Europe, convenio de subvención núm. 101086421)."
		});
	
	var GenQualElem=({eng:"Generic Quality element", cat:"Element generic Qualitat", spa:"Elemento genérico Calidad"});
	var QualClas=({eng:"Quality classes", cat:"Classes de Qualitat", spa:"Clases de Calidad"});
	var QualInd=({eng:"Quality indicators", cat:"Indicadors de Qualitat", spa:"Indicadores de Calidad"});
	var QualDom=({eng:"Quality domains", cat:"Dominis de Qualitat", spa:"Dominios de Calidad"});
	var QualMet=({eng:"Quality metrics", cat:"Mètriques de Qualitat", spa:"Métricas de Calidad"});
	var QualMetSets=({eng:"Quality metrics sets", cat:"Conjunts de mètriques de Qualitat", spa:"Conjuntos de métricas de Calidad"});
	var ResWords=({eng:"Reserved words", cat:"Paraules reservades", spa:"Palabras reservadas"});
	var XMLcode=({eng:"XML encoding", cat:"Codificació XML", spa:"Codificación XML"});

	//llista de seccions
	if (document.getElementById("sect_GenQualElem"))
		document.getElementById("sect_GenQualElem").innerHTML=DonaCadenaJSON(GenQualElem);
	if (document.getElementById("sect_QualClas"))
		document.getElementById("sect_QualClas").innerHTML=DonaCadenaJSON(QualClas);
	if (document.getElementById("sect_QualInd"))
		document.getElementById("sect_QualInd").innerHTML=DonaCadenaJSON(QualInd);
	if (document.getElementById("sect_QualIndHydro"))
		document.getElementById("sect_QualIndHydro").innerHTML=DonaCadenaJSON({eng:"Hydrology INSPIRE quality indicators", cat:"Indicadors de Qualitat d'Hidrologia (INSPIRE)", spa:"Indicadores de Calidad de Hidrología (INSPIRE)"});
	if (document.getElementById("sect_QualMeas"))
		document.getElementById("sect_QualMeas").innerHTML=DonaCadenaJSON({eng:"Quality measures by quality class (linked to classes, indicators, domains and matrices)", cat:"Mesures de qualitat per classe de qualitat (vinculades a classes, indicadors, dominis i matrius)", spa:"Medidas de calidad por clase de calidad (vinculadas a clases, indicadores, dominios y matrices)"});
	if (document.getElementById("sect_QualDom"))
		document.getElementById("sect_QualDom").innerHTML=DonaCadenaJSON(QualDom);
	if (document.getElementById("sect_QualMet"))
		document.getElementById("sect_QualMet").innerHTML=DonaCadenaJSON(QualMet);
	if (document.getElementById("sect_QualMetSets"))
		document.getElementById("sect_QualMetSets").innerHTML=DonaCadenaJSON(QualMetSets);
	if (document.getElementById("sect_ResWords"))
		document.getElementById("sect_ResWords").innerHTML=DonaCadenaJSON(ResWords);
	if (document.getElementById("sect_XMLcode"))
		document.getElementById("sect_XMLcode").innerHTML=DonaCadenaJSON(XMLcode);

	
	//títols seccions
	if (document.getElementById("title_h2_GenQualElem"))
		document.getElementById("title_h2_GenQualElem").innerHTML=DonaCadenaJSON(GenQualElem);
	if (document.getElementById("title_h2_QualClas"))
		document.getElementById("title_h2_QualClas").innerHTML=DonaCadenaJSON(QualClas);
	if (document.getElementById("title_h2_QualInd"))
		document.getElementById("title_h2_QualInd").innerHTML=DonaCadenaJSON(QualInd);
	if (document.getElementById("title_h2_QualMtx"))
		document.getElementById("title_h2_QualMtx").innerHTML=DonaCadenaJSON({eng:"Quality measures matrices", cat:"Matrius de les mesures de qualitat", spa:"Matrices de las medidas de calidad"});
	if (document.getElementById("title_h2_QualDom"))
		document.getElementById("title_h2_QualDom").innerHTML=DonaCadenaJSON(QualDom);
	if (document.getElementById("title_h2_QualMet"))
		document.getElementById("title_h2_QualMet").innerHTML=DonaCadenaJSON(QualMet);
	if (document.getElementById("title_h2_QualMetSets"))
		document.getElementById("title_h2_QualMetSets").innerHTML=DonaCadenaJSON(QualMetSets);
	if (document.getElementById("title_h2_ResWords"))
		document.getElementById("title_h2_ResWords").innerHTML=DonaCadenaJSON(ResWords);
	if (document.getElementById("title_h2_XMLcode"))
		document.getElementById("title_h2_XMLcode").innerHTML=DonaCadenaJSON(XMLcode);

	//subtítols seccions
	if (document.getElementById("title_h3_QualIndHydro"))
		document.getElementById("title_h3_QualIndHydro").innerHTML=DonaCadenaJSON({eng:"Data quality elements recommended by INSPIRE spatial data theme Hydrography", cat:"Elements de qualitat per a dades recomenats per INSPIRE en la temàtica d'Hidrografia", spa:"Elementos de calidad para datos recomendados por INSPIRE en la temàtica de Hidrografía"});

	//Generic Quality Element
	if (document.getElementById("GenQualElem_p_01"))
		document.getElementById("GenQualElem_p_01").innerHTML=DonaCadenaJSON({
			eng:"A Quality element is a combination of a <i>quality class</i>, a <i>quality indicator</i>, a <i>quality domain</i>, a <i>quality metric</i> (which include a metrics <i>name</i>, metrics <i>description</i>, metrics <i>parameters</i>, its <i>values</i> and <i>units of measure</i>). The combination of a quality domain and a quality metrics are commonly known as <i>quality measures</i>. We suggest 2 ways to map the QualityML concepts to ISO 19139 and ISO 19115-3. The first way makes a simple use of the ISO values keeping the structure of <i>Record</i> as simple as possible. The second one extends <i>Record</i> using QualityML XML schemas to allow a more structured encoding:",
			cat:"Un element de qualitat és una combinació d'una <i>classe de qualitat</i>, un <i>indicador de qualitat</i>, un <i>domini de qualitat</i>, una <i>mètrica de qualitat</i> (que inclou un <i>nom</i> de mètrica, una <i>descripció</i> de mètrica, <i>paràmetres</i> de mètrica, els seus <i>valors</i> i <i>unitats de mesura </i>). La combinació d'un domini de qualitat i una mètrica de qualitat es coneix habitualment com a <i>mesura de qualitat</i>. Suggerim dues maneres d'assignar els conceptes de QualityML a ISO 19139 i ISO 19115-3. La primera manera fa un ús senzill dels valors ISO mantenint l'estructura de <i>Record</i> tan senzilla com sigui possible. La segona amplia <i>Record</i> mitjançant esquemes XML de QualityML per permetre una codificació més estructurada:",
			spa:"Un elemento de calidad es una combinación de una <i>clase de calidad</i>, un <i>indicador de calidad</i>, un <i>dominio de calidad</i>, una <i>métrica de calidad</i> (que incluye un <i>nombre</i> de métrica, una <i>descripción</i> de métrica, <i>parámetros</i> de métrica, sus <i>valores </i> y <i>unidades de medida </i>). La combinación de un dominio de calidad y una métrica de calidad se conoce habitualmente como <i>medida de calidad</i>. Sugerimos dos formas de asignar los conceptos de QualityML a ISO 19139 e ISO 19115-3. El primer modo hace un uso sencillo de los valores ISO manteniendo la estructura de <i>Record</i> lo más sencilla posible. La segunda amplia <i>Record</i> mediante esquemas XML de QualityML para permitir una codificación más estructurada:"
		});
	
	if (document.getElementById("GenQualElem_p_02"))
		document.getElementById("GenQualElem_p_02").innerHTML=DonaCadenaJSON({
			eng:"Without extending <i>Record</i>. RECOMMENDED as implementation does not support extending the XML encoding. See the complete XML encoding of this example<a href="+'"#xmlencoding-1"'+"> here</a>",
			cat:"Sense estendre <i>Record</i>. RECOMANAT perquè la implementació no admet l'extensió de la codificació XML. Vegeu la codificació XML completa d'aquest exemple<a href="+'"#xmlencoding-1"'+"> aquí</a>",
			spa:"Sin extender <i>Record</i>. RECOMENDADO ya que la implementación no admite la extensión de la codificación XML. Vea la codificación XML completa de este ejemplo<a href="+'"#xmlencoding-1"'+"> aquí</a>",
		});


	var concept=({eng:"Concept", cat:"Concepte", spa:"Concepto"});
	var iso_19139_map=({eng:"ISO 19139 mapping", cat:"mapeig ISO 19139", spa:"mapeo ISO 19139"});
	var iso_19115_map=({eng:"ISO 19115 mapping", cat:"mapeig ISO 19115", spa:"mapeo ISO 19115"});
	var example=({eng:"Example", cat:"Exemple", spa:"Ejemplo"});
	var qcqi=({eng:"Quality class and quality indicator", cat:"Classe de qualitat i indicadors de qualitat", spa:"Clase de calidad e indicadores de calidad"});
	var qmn=({eng:"Quality measure name", cat:"Nom de la mesura de qualitat", spa:"Nombre de la medida de calidad"});
	var qdn=({eng:"Quality domain name", cat:"Nom del domini de qualitat", spa:"Nombre del dominio de calidad"});
	var qmid=({eng:"Quality measure identification", cat:"Identificador de la mesura de qualitat", spa:"Identificador de la medida de calidad"});
	var domid=({eng:"domain identification", cat:"identificador del domini", spa:"identificador del dominio"});
	var metid=({eng:"Metrics identifier", cat:"Identificador de la mètrica", spa:"Identificador de la métrica"});
	var qmd=({eng:"Quality measure description", cat:"Descrició de la mesura de qualitat", spa:"Descripción de la medida de calidad"});
	var qdom=({eng:"Quality domain", cat:"Domini de qualitat", spa:"Dominio de calidad"});
	var qdompar=({eng:"Quality domain parameters", cat:"Paràmetres del domini de qualitat", spa:"Parámetros del dominio de calidad"});
	var metpar=({eng:"Metrics parameters", cat:"Paràmetres de la mètrica", spa:"Parámetros de la métrica"});
	var mdesc=({eng:"Metrics description", cat:"Descripció de la mètrica", spa:"Descripción de la métrica"});
	var metval=({eng:"Metrics value", cat:"Valor de la mètrica", spa:"Valor de la métrica"});
	var unitmes=({eng:"Units of measure", cat:"Unitats de mesura", spa:"Unidades de medida"});

	//taula 1 Generic Quality Element
	if(document.getElementById("t_GenQualElem_01")){
			var s;
			
			s='<table border="1">'+
			'<tr>'+
			'<td bgcolor="#CCCCCC" align="center" scope="col"><b>'+DonaCadenaJSON(concept)+'</b></td>'+
			'<td bgcolor="#CCCCCC" align="center" scope="col"><b>'+DonaCadenaJSON(iso_19139_map)+'</b></td>'+
			'<td bgcolor="#CCCCCC" align="center" scope="col"><b>'+DonaCadenaJSON(iso_19115_map)+'</b></td>'+
			'<td bgcolor="#CCCCCC" align="center" scope="col"><b>'+DonaCadenaJSON(example)+'</b></td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(qcqi)+'</td>'+
			'<td align="left">'+DonaCadenaJSON({eng:"Name of the ", cat:"Nom del ", spa:"Nombre del "})+'DQ_Element</td>'+
			'<td align="left">'+DonaCadenaJSON({eng:"Name of the ", cat:"Nom del ", spa:"Nombre del "})+'DQ_Element</td>'+
			'<td align="left"><i>ISO 19139:</i> gmd:DQ_CompletenessCommission<br>'+
				'<i>ISO 19115-3:</i> mdq:DQ_CompletenessCommission</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(qmn)+','+DonaCadenaJSON(qdn)+'</td>'+
			'<td align="left">gmd:nameOfMeasure</td>'+
			'<td align="left">mdq:nameOfMeasure</td>'+
			'<td align="left">Excess,NonConformance</td>'+
		'</tr>'+
		'<tr>'+
		'<td align="center">'+DonaCadenaJSON(qmid)+','+DonaCadenaJSON(domid)+'</td>'+
		'<td align="left">gmd:measureIdentification/gmd:MD_Identifier/<br>gmd:code/gmx:Anchor@xlink:href</td>'+
		'<td align="left">mdq:measureIdentification/mcc:MD_Identifier/mcc:code/gcx:Anchor@xlink:href<br>'+
		'mdq:measureIdentification/mcc:MD_Identifier/mcc:codeSpace/gcx:Anchor@xlink:href<br>'+
		'mdq:measureIdentification/mcc:MD_Identifier/mcc:version</td>'+
		'<td align="left">https://www.qualityml.org/1.0/measure/Excess?domain=NonConformance<br>'+
		'https://www.qualityml.org <i>('+DonaCadenaJSON({eng:"Only in", cat:"Només a", spa:"Sólo en"})+' ISO 19115-3)</i><br>'+
		'1.0 <i>('+DonaCadenaJSON({eng:"Only in", cat:"Només a", spa:"Sólo en"})+' ISO 19115-3)</i></td></tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON({eng:"Quality measure and domain description (domain value list if necessary)", cat:"Mesura de qualitat i descripció del domini (llista de valors del domini, si cal)", spa:"Medida de calidad y descripción del dominio (lista de valores del dominio, cuando sea necesaria)"})+'</td>'+
			'<td align="left">gmd:measureDescription</td>'+
			'<td align="left">mdq:measureDescription</td>'+
			'<td align="left">'+DonaCadenaJSON({
				eng:"Elements within the dataset or sample that should not have been present. The conformance or non-conformance can be expressed as a boolean, count or rate. </br>Non conformance field of measurement",
				cat:"Elements dins del conjunt de dades que no haurien d'estar presents. La conformitat o la no conformitat es pot expressar com a booleà, recompte o taxa. </br>Camp de mesura de no conformitat",
				spa:"Elementos dentro del conjunto de datos que no deberían estar presentes. La conformidad o no conformidad podrá expresarse como booleano, recuento o tasa. </br>Campo de medida de no conformidad"
			})+'</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON({eng:"Metrics identifier and parameters", cat:"Identificador de mètriques i paràmetres", spa:"Identificador de métricas y parámetros"})+'</td>'+
			'<td align="left">gmd:result/gmd:DQ_QuantitativeResult/gmd:errorStatistic</td>'+
			'<td align="left">mdq:result/mdq:DQ_QuantitativeResult/mdq:errorStatistic</td>'+
			'<td align="left">https://www.qualityml.org/1.0/metrics/Items?subtype=rate&max=100</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON({eng:"Metrics value type", cat:"Tipus de valor de les mètriques", spa:"Tipo de valor de las métricas"})+'</td>'+
			'<td align="left">gmd:result/gmd:DQ_QuantitativeResult/gmd:ValueType</td>'+
			'<td align="left">mdq:result/mdq:DQ_QuantitativeResult/mdq:ValueType</td>'+
			'<td align="left">'+DonaCadenaJSON({eng:"Double precision real", cat:"Real de doble precissió", spa:"Real de doble precisión"})+'</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(metval)+'</td>'+
			'<td align="left">gmd:value/gco:Record</td>'+
			'<td align="left">mdq:value/gco:Record</td>'+
			'<td align="left">3</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(unitmes)+'</td>'+
			'<td align="left">gmd:valueUnit@xlink:href</td>'+
			'<td align="left">mdq:valueUnit@xlink:href</td>'+
			'<td align="left">urn:ogc:def:uom:OGC:1.0:percent</td>'+
		'</tr>'+
		'</table>'+
		'<br>'+
		'<p align="center"><a href="index.htm#Principi"><img alt="Tornar" height="23" src="ArrowUp.jpg" width="23"/></a><br/>'+
		'<i>'+DonaCadenaJSON(msg_backToTop)+'</i></p>';

		document.getElementById("t_GenQualElem_01").innerHTML=s;
	}
	
	if (document.getElementById("GenQualElem_p_03"))
		document.getElementById("GenQualElem_p_03").innerHTML=DonaCadenaJSON({
		eng:"With an extension of <i>Record</i>. Not commonly supported by implementations.",
		cat:"Amb una extensió de <i>Record</i>. Generalment no suportat en implementacions.",
		spa:"Con una extensión de <i>Record</i>. Generalment no soportado en implementaciones.",
	});

	//taula 2 Generic Quality Element
	if(document.getElementById("t_GenQualElem_02"))
	{
		var s;

		s='<table border="1">'+
		'<tr>'+
			'<td bgcolor="#CCCCCC" align="center" scope="col"><b>'+DonaCadenaJSON(concept)+'</b></td>'+
			'<td bgcolor="#CCCCCC" align="center" scope="col"><b>'+DonaCadenaJSON(iso_19139_map)+'</b></td>'+
			'<td bgcolor="#CCCCCC" align="center" scope="col"><b>'+DonaCadenaJSON(iso_19115_map)+'</b></td>'+
			'<td bgcolor="#CCCCCC" align="center" scope="col"><b>'+DonaCadenaJSON(example)+'</b></td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(qcqi)+'</td>'+
			'<td align="left">'+DonaCadenaJSON({eng:"Name of the ", cat:"Nom del ", spa:"Nombre del "})+'DQ_Element</td>'+
			'<td align="left">'+DonaCadenaJSON({eng:"Name of the ", cat:"Nom del ", spa:"Nombre del "})+'DQ_Element</td>'+
			'<td align="left"><i>ISO 19139:</i> gmd:DQ_CompletenessCommission<br><i>ISO 19115-3:</i> mdq:DQ_CompletenessCommission</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(qmn)+'</td>'+
			'<td align="left">gmd:nameOfMeasure</td>'+
			'<td align="left">mdq:nameOfMeasure</td>'+
			'<td align="left">'+DonaCadenaJSON({eng:"Excees", cat:"Excés", spa:"Exceso"})+'</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(qmid)+'</td>'+
			'<td align="left">gmd:measureIdentification/gmd:MD_Identifier/<br>gmd:code/gmx:Anchor@xlink:href</td>'+
			'<td align="left">mdq:measureIdentification/mcc:MD_Identifier/mcc:code/gcx:Anchor@xlink:href<br>'+
		'mdq:measureIdentification/mcc:MD_Identifier/mcc:codeSpace/gcx:Anchor@xlink:href<br>'+
		'mdq:measureIdentification/mcc:MD_Identifier/mcc:version</td>'+
			'<td align="left">https://www.qualityml.org/1.0/measure/Excess<br>'+
		'https://www.qualityml.org <i>('+DonaCadenaJSON({eng:"Only in", cat:"Només a", spa:"Sólo en"})+' ISO 19115-3)</i><br>'+
		'1.0 <i>('+DonaCadenaJSON({eng:"Only in", cat:"Només a", spa:"Sólo en"})+' ISO 19115-3)</i></td></tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(qmd)+'</td>'+
			'<td align="left">gmd:measureDescription</td>'+
			'<td align="left">mdq:measureDescription</td>'+
			'<td align="left">'+DonaCadenaJSON({
				eng:"Elements within the dataset or sample that should not have been present. The conformance or non-conformance can be expressed as a boolean, count or rate. </br>Non conformance field of measurement",
				cat:"Elements dins del conjunt de dades que no haurien d'estar presents. La conformitat o la no conformitat es pot expressar com a booleà, recompte o taxa. </br>Camp de mesura de no conformitat",
				spa:"Elementos dentro del conjunto de datos que no deberían estar presentes. La conformidad o no conformidad podrá expresarse como booleano, recuento o tasa. </br>Campo de medida de no conformidad"
			})+'</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(qdom)+'</td>'+
			'<td align="left">gmd:value/gco:Record/*</td>'+
			'<td align="left">mdq:value/gco:Record/*</td>'+
			'<td align="left">qml:NonConformance</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(qdompar)+'</td>'+
			'<td align="left">gmd:value/gco:Record/<FONT COLOR="gray">qml:NonConformance</font>/*<br>'+
		'qml:range/qml:min <i>'+DonaCadenaJSON({eng:"and/or", cat:"i/o", spa:"y/o"})+'</i> qml:range/qml:max <i>'+DonaCadenaJSON({eng:"and/or", cat:"i/o", spa:"y/o"})+'</i> qml:rule</td>'+
			'<td align="left">mdq:value/gco:Record/<FONT COLOR="gray">qml:NonConformance</font>/*<br>'+
		'qml:range/qml:min <i>'+DonaCadenaJSON({eng:"and/or", cat:"i/o", spa:"y/o"})+'</i> qml:range/qml:max <i>'+DonaCadenaJSON({eng:"and/or", cat:"i/o", spa:"y/o"})+'</i> qml:rule</td>'+
			'<td align="left"><i>qml:rule</i>: '+DonaCadenaJSON({
				eng:"Indication of excess items<br><i>Usually parameters for the domain are not needed</i>",
				cat:"Indicació dels elements en excés<br><i>Normalment no es necessiten paràmetres per al domini</i>",
				spa:"Indicación de los elementos en exceso<br><i>Normalmente no se necesitan parámetros para el dominio</i>"
			
			})+'</i></td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(mdesc)+'</td>'+
			'<td align="left">gmd:valueType/gco:RecordType</td>'+
			'<td align="left">mdq:valueRecordType/gco:RecordType</td>'+
			'<td align="left">'+DonaCadenaJSON({eng:"Excess items", cat:"Elements en excés", spa:"Elementos en exceso"})+'</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(metid)+'</td>'+
			'<td align="left">gmd:valueType/gco:RecordType@xlink:href</td>'+
			'<td align="left">mdq:valueRecordType/gco:RecordType@xlink:href</td>'+
			'<td align="left">https://www.qualityml.org/1.0/metrics/items</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(metpar)+'</td>'+
			'<td align="left">gmd:value/gco:Record/<FONT COLOR="gray">qml:Items</font>/*</td>'+
			'<td align="left">mdq:value/gco:Record/<FONT COLOR="gray">qml:Items</font>/*</td>'+
			'<td align="left">qml:rate <i>'+DonaCadenaJSON({eng:"and", cat:"i", spa:"y"})+'</i> qml:max<br><i>"qml:indicator" '+DonaCadenaJSON({eng:"or", cat:"o", spa:"o"})+' "qml:count" '+DonaCadenaJSON({eng:"are also options", cat:"també son opcions", spa:"también son opciones"})+'</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(metval)+'</td>'+
			'<td align="left">gmd:value/gco:Record/<FONT COLOR="gray">qml:Items</font>/<FONT COLOR="gray">qml:rate</font><br>'+
		'gmd:value/gco:Record/<FONT COLOR="gray">qml:Items</font>/<FONT COLOR="gray">qml:rate@max</font></td>'+
			'<td align="left">mdq:value/gco:Record/<FONT COLOR="gray">qml:Items</font>/<FONT COLOR="gray">qml:rate</font><br>'+
		'mdq:value/gco:Record/<FONT COLOR="gray">qml:Items</font>/<FONT COLOR="gray">qml:rate@max</font></td>'+
			'<td align="left">66<br>100</td>'+
		'</tr>'+
		'<tr>'+
			'<td align="center">'+DonaCadenaJSON(unitmes)+'</td>'+
			'<td align="left">gmd:valueUnit@xlink:href</td>'+
			'<td align="left">mdq:valueUnit@xlink:href</td>'+
			'<td align="left">urn:ogc:def:uom:OGC:1.0:percent</td>'+
		'</tr>'+
		'</table>'+
		'<br>'+
		'<p align="center"><a href="index.htm#Principi"><img alt="Tornar" height="23" src="ArrowUp.jpg" width="23"/></a><br/>'+
		'<i>'+DonaCadenaJSON(msg_backToTop)+'</i></p>';

	document.getElementById("t_GenQualElem_02").innerHTML=s;
	}

	if (document.getElementById("GenQualElem_p_04"))
		document.getElementById("GenQualElem_p_04").innerHTML=DonaCadenaJSON({
			eng:'The section about <a href="#xmlencoding">XML encodings</a> provides some examples on how to encode the QualityML concepts in ISO 19139 or 19115-3 documents.',
			cat:'La secció <a href="#xmlencoding"> Codificació XML</a> ofereix alguns exemple sobre com codificar els conceptes del QualityML als documents ISO 19139 o 19115-3.',
			spa:'La sección <a href="#xmlencoding"> Codificación XML</a> ofrece algunos ejemplos sobre como codificar los conceptos de QualityML en los documentos ISO 19139 o 19115-3.',
		});

	//Quality classes
	if (document.getElementById("QualClas_p_01"))
		document.getElementById("QualClas_p_01").innerHTML=DonaCadenaJSON({
			eng:'The <i>ISO 19157:2013 Geographic information - Data quality</i> defines 7 data quality elements (or classes) describing a certain aspect of the quality of geographic data in which quality elements can be classified. In 2022, we added a new class called "certainty" that is applicable to decision ready information. This class provide simple indicators for decision makers in an standardized language and it is inspired by the IPCC',
			cat:'La <i>ISO 19157:2013 Geographic information - Data quality</i> defineix 7 elements (o classes) de qualitat de les dades que descriuen aspectes determinats de la qualitat de les dades geogràfiques en què es poden classificar els elements de qualitat. El 2022 vam afegir una nova classe anomenada "certesa" que s\'aplica a la informació per a la presa de decisions. Aquesta classe ofereix indicadors senzills per a la presa de decisions en un llenguatge estandarditzat i està inspirada en l\'IPCC',
			spa:'La <i>ISO 19157:2013 Geographic information - Data quality</i> define 7 elementos (o clases) de calidad de los datos que describen aspectos determinados de la calidad de los datos geográficos en los que se pueden clasificar los elementos de calidad. En 2022 añadimos una nueva clase llamada "certidumbre" que se aplica a la información para la toma de decisiones. Esta clase ofrece sencillos indicadores para la toma de decisiones en un lenguaje estandarizado y está inspirada en el IPCC'
		});
	
	//Quality indicators
	if (document.getElementById("QualInd_p_01"))
		document.getElementById("QualInd_p_01").innerHTML=DonaCadenaJSON({
			eng:"The <i>ISO 19157:2013 Geographic information - Data quality</i> defines 18 quality indicators (or sub-classes) in which quality elements can be classified.",
			cat:"La <i>ISO 19157:2013 Geographic information - Data quality</i> defineix 18 indicadors (o sub-classes) de qualitat en què classificar els elements de qualitat.",
			spa:"La <i>ISO 19157:2013 Geographic information - Data quality</i> define 18 indicadores (o sub-clases) de calidad en los que clasificar los elementos de calidad.",
		});

	if (document.getElementById("QualInd_p_02"))
		document.getElementById("QualInd_p_02").innerHTML=DonaCadenaJSON({
			eng:"<i>source: <a href=\"https://inspire.ec.europa.eu/file/1729/download?token=LfNVPj1X\">INSPIRE Data Specification on Hydrography – Technical Guidelines (pdf, 3.77 MB)</a></i>",
			cat:"<i>font: <a href=\"https://inspire.ec.europa.eu/file/1729/download?token=LfNVPj1X\">INSPIRE Data Specification on Hydrography – Technical Guidelines (pdf, 3.77 MB)</a></i>",
			spa:"<i>fuente: <a href=\"https://inspire.ec.europa.eu/file/1729/download?token=LfNVPj1X\">INSPIRE Data Specification on Hydrography – Technical Guidelines (pdf, 3.77 MB)</a></i>",
		});

	if (document.getElementById("QualInd_p_03"))
			document.getElementById("QualInd_p_03").innerHTML=DonaCadenaJSON({
			eng:"<b>INSPIRE recommendation</b>",
			cat:"<b>Recomanació INSPIRE</b>",
			spa:"<b>Recomendación INSPIRE</b>",
		});

	if (document.getElementById("QualInd_p_04"))
		document.getElementById("QualInd_p_04").innerHTML=DonaCadenaJSON({
			eng:"Where it is impossible to express the evaluation of a data quality element in a quantitative way, the evaluation of the element should be expressed with a textual statement as a data quality descriptive result.",
			cat:"Quan sigui impossible expressar l'avaluació d'un element de qualitat de les dades d'una manera quantitativa, l'avaluació de l'element s'ha d'expressar amb una declaració textual com a resultat descriptiu de la qualitat de les dades.",
			spa:"Cuando sea imposible expresar la evaluación de un elemento de calidad de los datos de manera cuantitativa, la evaluación del elemento debe expresarse con una declaración textual como resultado descriptivo de la calidad de los datos.",
		});

	//Quality Measures matrices
	if (document.getElementById("QualMtx_p_01"))
		document.getElementById("QualMtx_p_01").innerHTML=DonaCadenaJSON({
			eng:"We provide a matrix of the combinations of indicators, measures and metrics commonly used for each quality class. Both ISO 19157 and ISO 19138 have a list of metrics in the Annex D and share the same identifier (last field in the tables). Actually ISO 19157 supersedes ISO 19138 and contains all metrics in ISO 19138 but adds the new Id. 119 (<i>Physical structure conflicts</i>), Id. 128 (<i>Bias of positions</i>), Id. 159 (<i>Chronological error</i>) and Ids. 101 to 104 (<i>Aggregation Measures</i>).",
			cat:"Oferim una matriu amb les combinacions d'indicadors, mesures i mètriques utilitzades habitualment per a cada classe de qualitat. Tant la ISO 19157 com la ISO 19138 tenen una llista de mètriques a l'annex D que comparteixen el mateix identificador (últim camp de les taules). En realitat, la ISO 19157 substitueix la ISO 19138 i conté totes les mètriques de la ISO 19138, però afegeix nous Id. 119 (<i>Conflictes d'estructura física</i>), Id. 128 (<i>Biaix de posicions</i>), Id. 159 (<i>Error cronològic</i>) i Ids. 101 a 104 (<i>Mesures d'agregació</i>).",
			spa:"Ofrecemos una matriz con las combinaciones de indicadores, medidas y métricas utilizadas habitualmente para cada clase de calidad. Tanto la ISO 19157 como la ISO 19138 tienen una lista de métricas en el anexo D que comparten el mismo identificador (último campo de las tablas). En realidad, la ISO 19157 sustituye a la ISO 19138 y contiene todas las métricas de la ISO 19138, pero añade nuevos Id. 119 (<i>Conflictos de estructura física</i>), Id. 128 (<i>Sesgo de posiciones</i>), Id. 159 (<i>Error cronológico</i>) e Ids. 101 a 104 (<medidas de agregación</i>)."

	});

	//Quality domains
	if (document.getElementById("QualDom_p_01"))
		document.getElementById("QualDom_p_01").innerHTML=DonaCadenaJSON({
			eng:"This section contains the definition of the domain where quality metrics are applied (including link to the schema).",
			cat:"Aquesta secció conté la definició del domini on s'apliquen les mètriques de qualitat (inclòs l'enllaç a l'esquema).",
			spa:"Esta sección contiene la definición del dominio donde se aplican las métricas de calidad (incluido el enlace al esquema)."
		});

	//Quality metrics
	if (document.getElementById("QualMet_p_01"))
		document.getElementById("QualMet_p_01").innerHTML=DonaCadenaJSON({
			eng:"Whenever possible, UncertML statistics are used. When needed new metrics are defined here based on uncertml basic types. In some sense QualityML extends <a href=\"https://web.archive.org/web/20161029215452/statistics\">UncertML</a>.",
			cat:"Sempre que sigui possible, s'utilitzen estadístiques de UncertML. Quan sigui necessari, es defineixen noves mètriques basades en tipus bàsics d'UncertML. En cert sentit, QualityML estén <a href=\"https://web.archive.org/web/20161029215452/statistics\">UncertML</a>.",
			spa:"Siempre que sea posible, se utilizan estadísticas de UncertML. Cuando sea necesario se definen nuevas métricas basadas en tipos básicos de UncertML. En cierto sentido, QualityML extiende <a href=\"https://web.archive.org/web/20161029215452/statistics\">UncertML</a>."
		});
	
	if (document.getElementById("QualMet_p_02"))
		document.getElementById("QualMet_p_02").innerHTML=DonaCadenaJSON({
			eng:"<a href=\"schemas\">XML schemas and examples are available here</a> (for convenience a exact copy of UncertML is included).",
			cat:"<a href=\"schemas\">Els esquemes XML i alguns exemples es troben disponibles aquí</a> (per comoditat, s'inclou una còpia exacta d'UncertML).",
			spa:"<a href=\"schemas\">Los esquemas XML y algunos ejemplos están disponibles aquí</a> (por comodidad, se incluye una copia exacta de UncertML)."
		});

	//Quality Metrics sets
	if (document.getElementById("QualMetSets_p_01"))
		document.getElementById("QualMetSets_p_01").innerHTML=DonaCadenaJSON({
			eng:"This table provides a way to aggregate some quality metrics in a single element that can group them. This is particularly useful when using several related metrics in the ISO 19139 encoding.",
			cat:"Aquesta taula ofereix una manera d'agregar algunes mètriques de qualitat en un sol element que pugui agrupar-les. Això és especialment útil quan s'utilitzen diverses mètriques relacionades a la codificació ISO 19139.",
			spa:"Esta tabla proporciona una manera de agregar algunas métricas de calidad en un solo elemento que pueda agruparlas. Esto es particularmente útil cuando se utilizan varias métricas relacionadas en la codificación ISO 19139."
		});
	
	
	if (document.getElementById("ResWords_p_01"))
		document.getElementById("ResWords_p_01").innerHTML=DonaCadenaJSON({
			eng:"This table provides a list of keywords that are useful for the WMS-Q specification.",
			cat:"Aquesta taula proporciona una llista de paraules clau que són útils per a l'especificació WMS-Q.",
			spa:"Esta tabla proporciona una lista de palabras clave que son útiles para la especificación WMS-Q."
		});

	if (document.getElementById("t_ResWords"))
	{
		var s='<table width="90%" border="1">'+
		'<tr bordercolor="#CCCCCC" bgcolor="#CCCCCC">'+
		  '<td align="center" scope="col"><div align="center">'+DonaCadenaJSON(msg_uri)+'</div></td>'+
		  '<td align="center" scope="col">'+DonaCadenaJSON(msg_name)+'</td>'+
		  '<td align="center" scope="col"><div align="center">'+DonaCadenaJSON(msg_meaning)+'</div></td>'+
		'</tr>'+
		'<tr>'+
		  '<td><div align="center"><a href="https://www.qualityml.org/1.0/values">values</a></div></td>'+
		  '<td><div align="center"><strong>'+DonaCadenaJSON({eng:"Values", cat:"Valors", spa:"Valores"})+'</strong></div></td>'+
		  '<td>'+DonaCadenaJSON({
			eng:"Parameter or component that more closely represent the actual values measured",
			cat:"Paràmetre o component que representa millor els valors reals mesurats",
			spa:"Parámetro o componente que representa mejor los valores reales medidos."
			})+'</td>'+
		'</tr>'+
		'<tr>'+
		  '<td><div align="center"><a href="https://www.qualityml.org/1.0/qualityCollection">qualityCollection</a></div></td>'+
		  '<td><div align="center"><strong>'+DonaCadenaJSON({eng:"Quality collection", cat:"Col·lecció de qualitat", spa:"Colección de calidad"})+'</strong></div></td>'+
		  '<td>'+DonaCadenaJSON({
			eng:"Variable that is decomposed in components or parameters",
			cat:"Variable que es descomposa en components o paràmetres",
			spa:"Variable que se descompone en componentes o parámetros"
		  })+'</td>'+
		'</tr>'+
		'<tr>'+
		  '<td><div align="center"><a href="https://www.qualityml.org/1.0/qualityComposition">qualityComposition</a></div></td>'+
		  '<td><div align="center"><strong>'+DonaCadenaJSON({eng:"Quality composition", cat:"Composició de qualitat", spa:"Composición de calidad"})+'</strong></div></td>'+
		  '<td>'+DonaCadenaJSON({
			eng:"Component that represents a composition of other components for visualization purposes",
			cat:"Component que representa una composició d'altres components amb finalitats de visualització",
			spa:"Componente que representa una composición de otros componentes con fines de visualización"
		  })+'</td>'+
		'</tr>'+
	  '</table><br>'+
	  '<p align="center"><a href="index.htm#Principi"><img alt="Tornar" height="23" src="ArrowUp.jpg" width="23"/></a><br/>'+
	  '<i id="backToTop">'+DonaCadenaJSON(msg_backToTop)+'</i></p>'+
	  '<br>';

	  document.getElementById("t_ResWords").innerHTML=s;
	};

	//XMLcode
	if (document.getElementById("XMLcode_p_01"))
		document.getElementById("XMLcode_p_01").innerHTML=DonaCadenaJSON({
			eng:"Here, some examples on how to encode quality metadata in ISO 19139 metadata documents using the qualityML framework and the qualityML URIs are presented. These examples show only the \"gmd:dataQualityInfo\", but a couple of complete metadata examples can be found <a target=\"_blank\" href=\"examples/Index.htm\">here</a>.",
			cat:"Aquí es presenten alguns exemples sobre com codificar metadades de qualitat als documents de metadades ISO 19139 mitjançant el marc qualityML i les URI de qualityML. Aquests exemples només mostren \"gmd:dataQualityInfo\", però es poden trobar un parell d'exemples complets de metadades <a target=\"_blank\" href=\"examples/Index.htm\">aquí</a>.",
			spa:"Aquí se presentan algunos ejemplos sobre cómo codificar metadatos de calidad en documentos de metadatos ISO 19139 utilizando el marco de qualityML y las URI de qualityML. Estos ejemplos muestran solo \"gmd:dataQualityInfo\", pero se pueden encontrar un par de ejemplos completos de metadatos <a target=\"_blank\" href=\"examples/Index.htm\">aquí</a>."
		});


	if (document.getElementById("XMLcode_h4_01"))
		document.getElementById("XMLcode_h4_01").innerHTML=DonaCadenaJSON({
			eng:"Example using QualityML in an ISO metadata, without extending <i>Record</i> (so, without the need for the qml or uml namespace) for dataset level quality (Recommended: e.g. a GeoNetwork record using ISO 19115:2003 template)",
			cat:"Exemple d'ús de QualityML en metadades ISO, sense estendre <i>Records</i> (per tant, sense necessitat de l'espai de noms qml o uml) per a la qualitat a nivell de conjunt de dades (recomanat: per exemple, un registre de GeoNetwork que utilitza la plantilla ISO 19115:2003)",
			spa:"Ejemplo de uso de QualityML en metadatos ISO, sin extender <i>Recuerdos</i> (por tanto, sin necesidad del espacio de nombres qml o uml) para la calidad a nivel de conjunto de datos (recomendado: por ejemplo, un registro de GeoNetwork que utiliza la plantilla ISO 19115:2003)"
		});

	if (document.getElementById("XMLcode_h4_02"))
		document.getElementById("XMLcode_h4_02").innerHTML=DonaCadenaJSON({
			eng:"Example using QualityML in an ISO metadata, without extending <i>Record</i> (so, without the need for the qml or uml namespace) for dataset level quality (Recommended: e.g. a GeoNetwork record using ISO 19115:2003 template) with conventional units of measure",
			cat:"Exemple d'ús de QualityML en metadades ISO, sense estendre <i>Records</i> (per tant, sense necessitat de l'espai de noms qml o uml) per a la qualitat a nivell de conjunt de dades (recomanat: per exemple, un registre de GeoNetwork que utilitza la plantilla ISO 19115:2003) amb unitats de mesura convencionals",
			spa:"Ejemplo de uso de QualityML en metadatos ISO, sin extender <i>Recuerdos</i> (por tanto, sin necesidad del espacio de nombres qml o uml) para la calidad a nivel de conjunto de datos (recomendado: por ejemplo, un registro de GeoNetwork que utiliza la plantilla ISO 19115:2003) con unidades de medida convencionales"
		});

	if (document.getElementById("XMLcode_li_01"))
	document.getElementById("XMLcode_li_01").innerHTML=DonaCadenaJSON({
		eng:'Note that:'+
		'<ul>'+
		'<li>List of UoM (vocabulary) <a href="https://ucum.org/ucum#section-Base-Units">Unified Code for Units of Measure (UCUM)</a>, also in https://github.com/ucum-org/ucum'+
		'<li>How to encode UoM <i>namespace</i>: https://confluence.csiro.au/display/seegrid/OGC+URN+Scheme'+
		'<li><i>Base units</i> are the fundamental units defined in the international system'+
		'<li><i>Conventional units</i> are units derived from other units by conversion factors (eg: a minute is derive from 60 seconds)'+
		'<li><i>Derived units</i> are units derived from combination of basic units (e.g. an acceleration is derived from m and s squared: m/s<sup>2</sup>)'+
		'<li>You can find more details about how to encode units in XML in this <a href="DocumentingUnitsinXML.htm">page</a></li>'+
		'</ul>',
		cat:'Noteu que:'+
		'<ul>'+
		'<li>Llista de UoM (vocabulari) <a href="https://ucum.org/ucum#section-Base-Units">Unified Code for Units of Measure (UCUM)</a>, també a https://github.com/ucum-org/ucum'+
		'<li>Com codificar <i>l\'espai de noms</i> UoM: https://confluence.csiro.au/display/seegrid/OGC+URN+Scheme'+
		'<li>Les <i>unitats básiques</i> són les unitats fonamentals definides al sistema internacional'+
		'<li>Les <i>unitats convencionals</i> són unitats derivades d\'altres unitats mitjançant factors de conversió (per exemple: un minut deriva de 60 segons)'+
		'<li>Les <i>unitats derivades</i> són unitats derivades de la combinació d\'unitats bàsiques (per exemple, l\'acceleració es deriva del metres i els segons al quadrat: m/s<sup>2</sup>)'+
		'<li>Podeu trobar més detalls sobre com codificar les unitats en XML en aquesta <a href="DocumentingUnitsinXML.htm">pàgina</a></li>'+
		'</ul>',
		spa:'Note que:'+
		'<ul>'+
		'<li>Lista de UoM (vocabulario) <a href="https://ucum.org/ucum#section-Base-Units">Unified Code for Units of Measure (UCUM)</a>, también en https: //github.com/ucum-org/ucum'+
		'<li>Cómo codificar el <i>espacio de nombres</i> UoM: https://confluence.csiro.au/display/seegrid/OGC+URN+Scheme'+
		'<li>Las <i>unidades básicas</i> son las unidades fundamentales definidas en el sistema internacional'+
		'<li>Las <i>unidades convencionales</i> son unidades derivadas de otras unidades mediante factores de conversión (por ejemplo: un minuto deriva de 60 segundos)'+
		'<li>Las <i>unidades derivadas</i> son unidades derivadas de la combinación de unidades básicas (por ejemplo, la aceleración se deriva de los metros y los segundos al cuadrado: m/s<sup>2 </sup>)'+
		'<li>Puede encontrar más detalles sobre cómo codificar las unidades en XML en esta <a href="DocumentingUnitsinXML.htm">página</a></li>'+
		'</ul>',
	})+
	'<p align="center"><a href="index.htm#Principi"><img alt="Tornar" height="23" src="ArrowUp.jpg" width="23"/></a><br/>'+
	'<i id="backToTop">'+DonaCadenaJSON(msg_backToTop)+'</i></p>'+
	'<br></br>';

	if (document.getElementById("XMLcode_h4_03"))
		document.getElementById("XMLcode_h4_03").innerHTML=DonaCadenaJSON({
			eng:"Example using UncertML in an ISO metadata extending \"Record\" (extending XML is not commonly supported by implementations)",
			cat:"Exemple d'utilització d'UncertML en metadades ISO que estenen \"Record\" (les implementacions no admeten habitualment l'extensió de XML)",
			spa:"Ejemplo de uso de UncertML en metadatos ISO que extienden \"Record\" (las implementaciones no admiten habitualmente la extensión de XML)"
		});
	
	if (document.getElementById("XMLcode_h4_04"))
		document.getElementById("XMLcode_h4_04").innerHTML=DonaCadenaJSON({
			eng:"Example using QualityML in an ISO metadata extending \"Record\" for dataset level quality (extending XML is not commonly supported by implementations)",
			cat:"Exemple d'ús de QualityML en metadades ISO que estenen \"Record\" per a la qualitat a nivell de conjunt de dades (les implementacions no admeten habitualment l'extensió de XML)",
			spa:"Ejemplo de uso QualityML en metadatos ISO que extienden \"Record\" para la calidad a nivel de conjunto de datos (las implementaciones no admiten habitualmente la extensión de XML)"
		});
	
	if (document.getElementById("XMLcode_h4_05"))
		document.getElementById("XMLcode_h4_05").innerHTML=DonaCadenaJSON({
			eng:"Example using QualityML in an ISO metadata extending \"Record\" at pixel level quality (extending XML is not commonly supported by implementations)",
			cat:"Exemple d'ús de QualityML en metadades ISO que estenen \"Record\" per a la qualitat de nivell de píxel (les implementacions no admeten habitualment l'extensió de XML)",
			spa:"Ejemplo de uso de QualityML en metadatos ISO que extienden \"Record\" para la calidad de nivel de píxel (las implementaciones no admiten habitualmente la extensión de XML)"
		});

	if (document.getElementById("XMLcode_btt_01"))
		document.getElementById("XMLcode_btt_01").innerHTML='<p align="center"><a href="index.htm#Principi"><img alt="Tornar" height="23" src="ArrowUp.jpg" width="23"/></a><br/>'+
		'<i id="backToTop">'+DonaCadenaJSON(msg_backToTop)+'</i></p>'+
		'<br></br>';

	if (document.getElementById("XMLcode_btt_02"))
		document.getElementById("XMLcode_btt_02").innerHTML='<p align="center"><a href="index.htm#Principi"><img alt="Tornar" height="23" src="ArrowUp.jpg" width="23"/></a><br/>'+
		'<i id="backToTop">'+DonaCadenaJSON(msg_backToTop)+'</i></p>'+
		'<br></br>';

	if (document.getElementById("XMLcode_btt_03"))
		document.getElementById("XMLcode_btt_03").innerHTML='<p align="center"><a href="index.htm#Principi"><img alt="Tornar" height="23" src="ArrowUp.jpg" width="23"/></a><br/>'+
		'<i id="backToTop">'+DonaCadenaJSON(msg_backToTop)+'</i></p>'+
		'<br></br>';
}