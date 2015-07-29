$(document).ready(function(){
	// Show / hide panels on the sidenav
	$("nav .header.toggle").click(function() {
		$(this).next().slideToggle();
	});
});