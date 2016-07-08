/**
 *	This is only for demo. Please delete this file in original project :).
 **/
var default_theme="teal";
var default_layout="full";
var default_bgpattern="bg-10";
var default_sidenavstyle="reveal";
var bg_pattern=['bg-3', 'bg-6', 'bg-7', 'bg-10', 'bg-11', 'bg-13', 'bg-16', 'bg-17', 'bg-18', 'bg-1', 'bg-2', 'bg-4', 'bg-5', 'bg-8', 'bg-9', 'bg-12', 'bg-14', 'bg-15'];4
var color_themes=['blue', 'purple', 'red', 'green', 'sky-blue', 'orange', 'brown', 'teal', 'maroon', 'dark-golden-rod'];
var color_theme_color=['rgb(80, 147, 208)','rgb(171, 80, 208)', 'rgb(208, 80, 114)', 'rgb(80, 208, 135)', 'rgb(80, 208, 203)', 'rgb(208, 124, 80)', 'rgb(255, 77, 0)', 'rgb(0, 128, 128)', 'rgb(128, 0, 0)', 'rgb(184, 134, 11)'];

var stStatus=0;
$("[data-toggle='style-switcher']").click(function(){
	toggleStyler();
})
$("section, .styler .close").not(".demo").click(function(){
	closeStyler();
})
function openStyler(){
	$(".styler").css("margin-left","250px");
	stStatus=1;
}
function closeStyler(){
	$(".styler").css("margin-left","0px");
	stStatus=0;
}
function toggleStyler(){
	if(stStatus==0)
		openStyler();
	else
		closeStyler();
}
function setTheme(theme){
	if(theme!=null){
		var link=$("link[href*='color-theme']").attr("href");
		$("link[href*='color-theme']").attr("href",link.substring(0,link.lastIndexOf("/"))+"/"+theme+".css");
		localStorage.setItem('relient-theme', theme);
	}
}
function setLayout(layout){
	if(layout=='boxed')
		$(".layout").removeClass("full-width").addClass("boxed");
	else if(layout=='full')
		$(".layout").removeClass("boxed").removeClass("full-width");
	localStorage.setItem('layout', layout);
}
function setSideBarStyle(style){
	if(style=='reveal')
		$("[data-toggle='side-nav']").attr('data-style','reveal');
	else if(style=='overlay')
		$("[data-toggle='side-nav']").attr('data-style','overlay');
	localStorage.setItem('side-menu', style);
}
function setBGImage(bgClass){
	if(bgClass!=null){
		$('body').removeClass(function(index, className) {
			return (className.match(/(^|\s)bg-\S+/g) || []).join(' ');
		});
		$("body").addClass(bgClass);
		localStorage.setItem('bg-img',bgClass);
	}
}
$("#layout1, #layout2, #side-menu-style1, #side-menu-style2").change(function(){
	if($("#layout1").is(":checked"))
		setLayout($(this).val());
	if($("#layout2").is(":checked"))
		setLayout($(this).val());
	if($("#side-menu-style1").is(":checked"))
		setSideBarStyle($(this).val());
	if($("#side-menu-style2").is(":checked"))
		setSideBarStyle($(this).val());
});
$("[data-toggle='header']").click(function(){
	var $this=$(this);
	$('.home-header').removeClass(function(index, className) {
		return (className.match(/(^|\s)header-\S+/g) || []).join(' ');
	}).addClass($this.attr('data-class'));
	$("[data-toggle='header']").removeClass('active');
	$this.addClass('active');
});
$(document).ready(function(){
	//openStyler();
	if(localStorage.getItem('layout')=='full'){
		$("#layout2").parent().removeClass("active");
		$("#layout1").prop('checked',true).parent().addClass("active");
	}
	else{
		$("#layout1").parent().removeClass("active");
		$("#layout2").prop('checked',true).parent().addClass("active");
	}
	if(localStorage.getItem('side-menu')=='overlay'){
		$("#side-menu-style1").parent().removeClass("active");
		$("#side-menu-style2").prop('checked',true).parent().addClass("active");
	}
	else{
		$("#side-menu-style2").parent().removeClass("active");
		$("#side-menu-style1").prop('checked',true).parent().addClass("active");
	}
	if(!$("#demo").hasClass("sp")){
		var layout=localStorage.getItem('layout');
		var sidenavstyle=localStorage.getItem('side-menu');
		var bgpattern=localStorage.getItem('bg-img');
		if(layout!=null)
			setLayout(layout);
		else
			setLayout(default_layout);
		if(sidenavstyle!=null)
			setSideBarStyle(sidenavstyle);
		else
			setSideBarStyle(default_sidenavstyle);
		if(bgpattern!=null)
			setBGImage(bgpattern);
		else
			setBGImage(default_bgpattern);
	}
	var theme=localStorage.getItem('relient-theme');
	if(theme!=null)
		setTheme(theme);
	else
		setTheme(default_theme);
	for(var i=0; i<color_themes.length; i++){
		var htm="<span style=\"background-color:"+color_theme_color[i]+";\" data-r-theme=\""+color_themes[i]+"\"></span>";
		$(".styler .color-themes").append(htm);
	}
	for(var i=0; i<bg_pattern.length; i++){
		$(".styler .bg-patterns").append("<span class=\""+bg_pattern[i]+"\" data-bpc-class=\""+bg_pattern[i]+"\"></span>");
		if(i==bg_pattern.length-1)
			$(".styler .bg-patterns").append("<p data-color=\"#fff\">To view Background Pattern please select `Boxed` layout.</p>")
	}
	$("[data-r-theme]").click(function(){
		setTheme($(this).attr('data-r-theme'));
	});
	$("[data-bpc-class]").click(function(){
		setBGImage($(this).attr('data-bpc-class'));
	});
});