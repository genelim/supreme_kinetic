document.getElementById('search_desktop').onkeypress = function(e){
	if (!e) e = window.event;
		var keyCode = e.keyCode || e.which;
	if (keyCode == '13'){
  		alert('You are searching for '+e.target.value);
  		return false;
	}
}
document.getElementById('search_mobile').onkeypress = function(e){
	if (!e) e = window.event;
		var keyCode = e.keyCode || e.which;
	if (keyCode == '13'){
  		alert('You are searching for '+e.target.value);
  		return false;
	}
}