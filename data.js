
function getInputData() {
	return `
30/05/2001 | 27/04/2006 | Governo Berlusconi II e III | destra 
28/04/2006 | 08/05/2008 | Governo Prodi II | sinistra		
09/05/2008 | 16/11/2011 | Governo Berlusconi IV | destra
17/11/2011 | 27/04/2013 | Governo Monti | tecnico
28/04/2013 | 21/02/2014 | Governo Letta | sinistra
22/02/2014 | 12/12/2016 | Governo Renzi | sinistra
13/12/2016 | 01/06/2018 | Governo Gentiloni | sinistra
02/06/2018 | 04/09/2019 | Governo Conte | destra
05/09/2019 | 13/02/2021 | Governo Conte II | sinistra
14/02/2021 | 22/10/2022 | Governo Draghi | tecnico
23/10/2022 | ongoing | Governo Meloni | destra`;
}

function calculateAndRender(startingDate) {
	    const inputData = getInputData();

        const lines = inputData.split('\n');
        const today = new Date();

        let alignments = {};

		const governments = [];
		
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.length === 0) {
				continue;
			}
			

            const [startDate, endDate, description, politicalAlignment] = line.split(' | ');
            const end = endDate === 'ongoing' ? today : parseDate(endDate);
			
			if (end < startingDate) {
				continue;
			}
			
			let start = parseDate(startDate);
			if (start <= startingDate && end >= startingDate) {
				start = startingDate;
			}
			
			const duration = moment(end).diff(moment(start), 'days'); 
			const government = { startDate : start, endDate : end, description : description, politicalAlignment : politicalAlignment, durationInDays: duration };
			governments.push(government);            
        }
		
		if (governments.length > 0) {
		
			// Calculate the percentage for each political alignment
			const totalDuration = governments.reduce((sum, data) => sum + data.durationInDays, 0);

			governments.forEach(({ politicalAlignment, durationInDays }) => {
				alignments[politicalAlignment] = alignments[politicalAlignment] ? alignments[politicalAlignment] + durationInDays : durationInDays;
			});
			
			const sortedArray = Object.entries(alignments).sort((a, b) => {
				const duration1 = parseInt(a[1]);
				const duration2 = parseInt(b[1]);
				return duration2 - duration1;
			});
			
			alignments = Object.fromEntries(sortedArray);

			governments.forEach(({ startDate, endDate, description, politicalAlignment, durationInDays }) => {
				const row = document.createElement('tr');
				row.innerHTML = `
					<td>${formatDate(startDate)}</td>
					<td>${endDate > today ? 'In corso' : formatDate(endDate)}</td>
					<td>${description}</td>
					<td>${politicalAlignment}</td>
					<td>${durationInDays}</td>
				`;
				document.getElementById('data-table').appendChild(row);
			});

			Object.entries(alignments).forEach(([alignment, durationInDays]) => {
				const percentage = (durationInDays / totalDuration) * 100;
				const row = document.createElement('tr');
				row.innerHTML = `<td>${alignment}</td><td>${Math.round(percentage * 100) / 100}%</td>`;
				document.getElementById('result-table').getElementsByTagName('tbody')[0].appendChild(row);
			});
		}
		else {
			alert('Could not resolve any government matching provided startDate' + today);

		}
}
		