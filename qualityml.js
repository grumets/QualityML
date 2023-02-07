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

//Preparo una funció per descarregar les dades JSON assincronament
//Extreta de: http://stackoverflow.com/questions/9838812/how-can-i-open-a-json-file-in-javascript-without-jquery
function loadJSON(path, success, error, extra_param)
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
					success(data, extra_param);
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
		    			error("JSON file: \""+ path + "\". Status: " + xhr.statusText + "\n\nURL: "+ path + ((xhr.getAllResponseHeaders && xhr.getAllResponseHeaders()) ? "\n\nResponse headers:\n"+xhr.getAllResponseHeaders() : "") + ((s) ? "\nResponse Body:\n"+s : ""), extra_param);
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
	loadJSON("/qualityml.json", PintaObjecteDeQualityMLjson, CantaErrorQualityMLjson, null);
}

function CantaErrorQualityMLjson(txt, extra_param)
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

function DonaDescriptorClasseDesDeId(qml, q_class_id)
{
	for(var i=0;i<qml.class.length;i++)
	{
		if (qml.class[i].id==q_class_id)
			return qml.class[i].name.eng;
	}
	return q_class_id;
}

function PintaMesuraDeQualityMLjson(qml, extra_param)
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
	document.getElementById("measure_name").innerHTML=(measure.name)?measure.name.eng:"";
	
	// noms alternatius
	var cadena_temp="";
	if(measure.alternativeName)
	{
		for(i=0;i<measure.alternativeName.length;i++)
		{
			if(measure.alternativeName[i].eng!="")
			{
				cadena_temp+=measure.alternativeName[i].eng;
				cadena_temp+=(i<measure.alternativeName.length-1)?", ":"";
			}
		}
	}
	document.getElementById("measure_alt_names").innerHTML=cadena_temp;
	
	// descripció
	document.getElementById("measure_desc").innerHTML=(measure.desc)?measure.desc.eng : "";
	
	// paràmetres
	cadena_temp="";
	if(measure.parameter)
	{
		for(i=0;i<measure.parameter.length;i++)
		{
			if(measure.parameter[i].id!="")
			{
				cadena_temp+=measure.parameter[i].id;
				if(measure.parameter[i].desc && measure.parameter[i].desc.eng)
				{
					cadena_temp+=(" ("+measure.parameter[i].desc.eng+")");	
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
	document.getElementById("measure_info").innerHTML=(measure.furtherInformation)?measure.furtherInformation.eng:"";
	return;
}

function PintaDominiDeQualityMLjson(qml, extra_param)
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
	document.getElementById("domain_name").innerHTML=(domain.name)?domain.name.eng:"";

	// noms alternatius
	var cadena_temp="";
	if(domain.alternativeName)
	{
		for(i=0;i<domain.alternativeName.length;i++)
		{
			if(domain.alternativeName[i].eng!="")
			{
				cadena_temp+=domain.alternativeName[i].eng;
				cadena_temp+=(i<domain.alternativeName.length-1)?", ":"";
			}
		}
	}
	document.getElementById("domain_alt_names").innerHTML=cadena_temp;
	
	// descripció
	document.getElementById("domain_desc").innerHTML=(domain.desc)?domain.desc.eng : "";
	
	// paràmetres
	cadena_temp="";
	if(domain.parameter)
	{
		for(i=0;i<domain.parameter.length;i++)
		{
			if(domain.parameter[i].id!="")
			{
				cadena_temp+=domain.parameter[i].id;
				if(domain.parameter[i].desc && domain.parameter[i].desc.eng)
				{
					cadena_temp+=(" ("+domain.parameter[i].desc.eng+")");	
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
		element.innerHTML=(domain.categories)?domain.categories.eng:"";
	}

	// altre info
	element=document.getElementById("domain_info");
	if(element)
	{
		element.innerHTML=(domain.furtherInformation)?domain.furtherInformation.eng:"";
	}
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
		element.innerHTML=(domain.ValueConstraints)?domain.ValueConstraints:"";		
	
	return;
}

function PintaMetricaDeQualityMLjson(qml, extra_param)
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
	document.getElementById("metric_name").innerHTML=(metric.name)?metric.name.eng:"";

	// noms alternatius
	var cadena_temp="";
	if(metric.alternativeName)
	{
		for(i=0;i<metric.alternativeName.length;i++)
		{
			if(metric.alternativeName[i].eng!="")
			{
				cadena_temp+=metric.alternativeName[i].eng;
				cadena_temp+=(i<metric.alternativeName.length-1)?", ":"";
			}
		}
	}
	document.getElementById("metric_alt_names").innerHTML=cadena_temp;
	
	// descripció
	document.getElementById("metric_desc").innerHTML=(metric.desc)?metric.desc.eng : "";
	
	// paràmetres
	cadena_temp="";
	if(metric.parameter)
	{
		for(i=0;i<metric.parameter.length;i++)
		{
			if(metric.parameter[i].id!="")
			{
				cadena_temp+=metric.parameter[i].id;
				if(metric.parameter[i].desc && metric.parameter[i].desc.eng)
				{
					cadena_temp+=(" ("+metric.parameter[i].desc.eng+")");	
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
		element.innerHTML=(metric.furtherInformation)?metric.furtherInformation.eng:"";	
		
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
		element.innerHTML=(metric.ValueConstraints)?metric.ValueConstraints:"";		
	
	return;
}



function DonaCadenaUnaFilaMatriu(metric_matrix, qml)
{
var cadena="";
var trobat;

	//indicator
	cadena="<tr><td align=\"center\">";
	//trobat=qml.indicator.find(CercaIdObjecte, metric_matrix.indicator);
	trobat=CercaObjectePerId(qml.indicator, metric_matrix.indicator);
	if(trobat)
		cadena+=trobat.name.eng;
	else
		cadena+=metric_matrix.indicator;
	//DQ_element
	cadena+=("</td><td align=\"center\">"+metric_matrix.DQ_Element);
	//measure
	cadena+="</td><td align=\"center\"><p><b>";				
	//trobat=qml.measure.find(CercaIdObjecte, metric_matrix.measure);
	trobat=CercaObjectePerId(qml.measure, metric_matrix.measure);
	if(trobat)
		cadena+=(trobat.name.eng+"</b></p><p><a href=1.0/measure/"+trobat.id+">measure/"+trobat.id+"</a>");
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
	trobat=CercaObjectePerId(qml.metric, metric_matrix.metric);
	if(trobat)
	{
		cadena+=("<a href=1.0/metrics/"+trobat.id+">metrics/"+trobat.id+"</a>");
		if(trobat.alternativeName && trobat.alternativeName.length)
		{
			cadena+="<br><i>Alternative names:</i>";
			for(var j=0; j<trobat.alternativeName.length;j++)
			{
				if (trobat.alternativeName[j].eng!="")
				cadena+=("<br>"+trobat.alternativeName[j].eng);
			}
		}
	}
	else
		cadena+=metric_matrix.metric;


	//observations
	cadena+=("</td><td align=\"center\">"+(metric_matrix.observations?metric_matrix.observations:""));			
	//origin
	cadena+=("</td><td>"+(metric_matrix.origin?metric_matrix.origin:"")+"</td></tr>");
	return cadena;
}

function DonaCadenaIniciTaulaMatriu(qml, i_metric_matrix)
{
	return "<p><a name=\"matrix_"+qml.MetricMatrix[i_metric_matrix].class+"\"></a>"+
		"<h4>Quality class: " + DonaDescriptorClasseDesDeId(qml, qml.MetricMatrix[i_metric_matrix].class) + "</h4>"+
		"<table border=\"1\" style=\"width: 100%;\">"+
		"<tr><th width=\"83\" align=\"center\" scope=\"col\">Quality indicator</th>\<th width=\"283\" align=\"center\" scope=\"col\">gmd:DQ_Element</th><th width=\"403\" align=\"center\" scope=\"col\">Quality measure</th><th width=\"211\" align=\"center\" scope=\"col\">Domain</th><th width=\"323\" align=\"center\" scope=\"col\">Metrics</th><th width=\"146\" align=\"center\" scope=\"col\">Observations</th><th width=\"69\" align=\"center\" scope=\"col\">Origin</th></tr>";
}

function DonaCadenaFiTaulaMatriu()
{
	return "</table>"+
		"<br>"+
		"<p align=\"center\"><a href=\"index.htm#Principi\"><img alt=\"Tornar\" height=\"23\" src=\"ArrowUp.jpg\" width=\"23\"/></a><br/>"+
		"<i>Back to top of page</i></p>";
}

function DonaCadenaInteriorTaulaURINomeParamSource(qml_array, subpath)
{
	var cadena="<tr bgcolor=\"#CCCCCC\"><th align=\"center\" scope=\"col\">URI</th><th align=\"center\" scope=\"col\">Name</th><th scope=\"col\">Parameters</th><th align=\"center\" scope=\"col\">Origin</th></tr>";
	for(i=0;i<qml_array.length;i++)
	{
		cadena+="<tr><td align=\"center\">";
		cadena+="<p><a href=\"http://www.qualityml.org/1.0/" + subpath + "/"+ qml_array[i].id +"\">"+ subpath + "/" + qml_array[i].id + "</a></p>";
		cadena+="</td><td align=\"center\"><b>";
		cadena+=qml_array[i].name.eng;
		cadena+="</b></td><td align=\"left\">";
		if (qml_array[i].parameter)
		{
			for(var j=0;j<qml_array[i].parameter.length;j++)
			{
				if (j!=0)
					cadena+="<br><br>";
				cadena+=qml_array[i].parameter[j].id;
				if (qml_array[i].parameter[j].desc && qml_array[i].parameter[j].desc.eng)
					cadena+=" ("+qml_array[i].parameter[j].desc.eng+")";
			}
		}
		cadena+="</td><td align=\"left\">";
		cadena+=qml_array[i].source;
		cadena+="</td></tr>";
	}
	return cadena;
}

function PintaPlanaPrincipal(qml, extra_param)
{
var cadena="";
var i;
var trobat;

	// Classes
	var classes=document.getElementById("taula_classes");
	if(classes && qml.class)
	{
		cadena="<tr bgcolor=\"#CCCCCC\"><th align=\"center\" scope=\"col\">Name</th><th scope=\"col\">Description</th></tr>";
		for(i=0;i<qml.class.length;i++)
		{
			cadena+="<tr><td align=\"center\"><b>";
			cadena+=qml.class[i].name.eng;
			cadena+="</b></td><td align=\"left\">";
			cadena+=qml.class[i].desc.eng;
			cadena+="</td></tr>";
		}
		classes.innerHTML=cadena;
	}
	
	// Indicadors
	var indicadors=document.getElementById("taula_indicadors");
	if(indicadors && qml.indicator)
	{
		cadena="<tr bgcolor=\"#CCCCCC\"><th align=\"center\" scope=\"col\">Quality class</th><th align=\"center\" scope=\"col\">Quality indicator</th><th scope=\"col\">Description</th></tr>";
		for(i=0;i<qml.indicator.length;i++)
		{
			cadena+="<tr><td align=\"center\"><b>";
			//trobat=qml.class.find(CercaIdObjecte, qml.indicator[i].class);
			trobat=CercaObjectePerId(qml.class, qml.indicator[i].class);
			if(trobat)
				cadena+=trobat.name.eng;
			else
				cadena+=qml.indicator[i].class;
			cadena+="</b></td><td align=\"center\"><b>";
			cadena+=qml.indicator[i].name.eng;
			cadena+="</b></td><td align=\"left\">";
			cadena+=qml.indicator[i].desc.eng;
			cadena+="</td></tr>";
		}
		indicadors.innerHTML=cadena;
	}

	// Dominis
	var dominis=document.getElementById("taula_dominis");
	if(dominis && qml.domain)
		dominis.innerHTML=DonaCadenaInteriorTaulaURINomeParamSource(qml.domain, "domain");

	// Metriques
	var metrics=document.getElementById("taula_metriques");
	if(metrics && qml.metric)
		metrics.innerHTML=DonaCadenaInteriorTaulaURINomeParamSource(qml.metric, "metrics");
	
	// Matrius de mesures x classe
	
	var matrius=document.getElementById("taules_quality_matrices");
	if(matrius && qml.MetricMatrix)
	{
		cadena="Tables:<ul>";
		for(i=0;i<qml.MetricMatrix.length;i++)
		{
			if (i==0 || qml.MetricMatrix[i].class!=qml.MetricMatrix[i-1].class)
			{
				cadena+="<li><a href=\"#matrix_"+qml.MetricMatrix[i].class+"\">"+ DonaDescriptorClasseDesDeId(qml, qml.MetricMatrix[i].class) + "</a>"
			}
		}

		cadena+="</ul>";
		for(i=0;i<qml.MetricMatrix.length;i++)
		{
			if (i==0 || qml.MetricMatrix[i].class!=qml.MetricMatrix[i-1].class)
			{
				if (i!=0)
					cadena+=DonaCadenaFiTaulaMatriu();
				cadena+=DonaCadenaIniciTaulaMatriu(qml, i);
			}
			cadena+=DonaCadenaUnaFilaMatriu(qml.MetricMatrix[i], qml);
		}
		cadena+=DonaCadenaFiTaulaMatriu()
		matrius.innerHTML=cadena;
	}
	return;
}


function PintaObjecteDeQualityMLjson(qml, extra_param)
{
var i;

	if (-1!=(i=location.pathname.toLowerCase().indexOf("/measure/")))
	{
		PintaMesuraDeQualityMLjson(qml, extra_param);
		return;
	}

	if (-1!=(i=location.pathname.toLowerCase().indexOf("/domain/")))
	{
		PintaDominiDeQualityMLjson(qml, extra_param);
		return;
	}
	
	if (-1!=(i=location.pathname.toLowerCase().indexOf("/metrics/")))
	{
		PintaMetricaDeQualityMLjson(qml, extra_param);
		return;
	}
	PintaPlanaPrincipal(qml, extra_param);
	return;
}
