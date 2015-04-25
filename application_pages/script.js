function initXHR(x) {
	console.log(x); 
	if (x == 'envelopes') {
		retrieveEnvelopesFromServer('envelopes.json');
	}
}

function retrieveEnvelopesFromServer(url) {
	var xmlhttp = new XMLHttpRequest();
	var envelopeList;

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var envelopeList = JSON.parse(xmlhttp.responseText);
			populateTable('envelopes', envelopeList);
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function populateTable(envelopeTableId, envelopeList) {

	element = document.getElementById(envelopeTableId)
		.getElementsByTagName('tbody')[0];

	var tableRows = "";
	
	for (var i = 0; i < envelopeList.length; i++) {
		tableRows += "<tr>"; 
		tableRows += "<td>" + envelopeList[i].category  + "</td>";
		tableRows += "<td>" + envelopeList[i].amount  + "</td>";
		tableRows += "<td>" + envelopeList[i].spent  + "</td>";
		tableRows += "<td>" + envelopeList[i].balance  + "</td>";
		tableRows += "<td></td>";
		tableRows += "</tr>"
	}

	element.innerHTML = tableRows;
}