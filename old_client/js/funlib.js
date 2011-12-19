var output;

function $(id)
{
	return document.getElementById(id);
}

function writeToScreen(message)
{
	output = $("output");
	var pre = $("p");
	pre.style.wordWrap = "break-word";
	pre.innerHTML = message;
	output.appendChild(pre);
}
