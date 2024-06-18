 function parseDate(dateString) {
	const [day, month, year] = dateString.split('/');
	return new Date(year, month - 1, day);
}

function formatDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${day}/${month}/${year}`;
}
	