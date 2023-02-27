<script>
	let currentDate = new Date()
	let month = (currentDate.getMonth() + 1);
	let day = currentDate.getDate();
	let year = currentDate.getFullYear();
	
	
	const dateString = [month, day, year].join('/');
	export const date = dateString;
</script>

