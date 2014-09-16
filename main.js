////////////////////////////////////
/// vars and requires
////////////////////////////////////
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var dir = '/';
var areas = [];
var editareas = [];
var curxPos;
var curyPos;
var lasxPos;
var lasyPos;
var list = document.getElementById('list');
fechadiv=0;

/////////////////////////////////
// get config from localstorage
///////////////
var dirstr='';
var isroot='s';
var curimg='';
if (localStorage.curimg != null) curimg = localStorage.curimg;
if (localStorage.isroot != null) isroot = localStorage.isroot;
if (isroot == 's') {curimg='root.jpg';}
if (localStorage.dir != null) dir = localStorage.dir;
//if (localStorage.dirstr != null) dirstr = localStorage.dirstr;
//dirstr=dirstr.replace(/\\/g,'/');
//dirs=dirstr.split(';');
if (localStorage.zoom != null) {
    if (localStorage.zoom == 'NaN') {localStorage.zoom = '20';} 
    var zoom = parseInt(localStorage.zoom);
    if (zoom < 0) {zoom = 20;}
} else { var zoom = 100;}
console.log('zoom = '+zoom);
////////////////////////////////////
/// startup
////////////////////////////////////
list.style.width=zoom+'%';
list.innerHTML='carregando...';

fs.readdir(dir, opendir);

ldirs=document.getElementById('dirs');
//ldirs.innerHTML=ldirs.innerHTML+dir;
if (fs.existsSync(dir+'/roots.die')) {
    roots = fs.readFileSync(dir+'/roots.die').toString().split("\n");
} else { roots = [];}
for (i in roots) {
	leroot=roots[i];
	ldirs.innerHTML=ldirs.innerHTML+"<a class='button' href='javascript:void(0)' onclick='changeroot(\""+leroot+"\")'>"+leroot+"</a>";
}
////////////////////////////////////
/// callbacks
////////////////////////////////////
function opendir (err, files) {
	if (err) { //throw err;
		files=[]; };
	list.innerHTML='';
	console.log("files: " + files);
	len = files.length;
    /*if (isroot === 'n'){
        list.innerHTML=list.innerHTML+
			//"<a class='buttond' href='javascript:void(0)' onclick='launch(\""+files[i]+"\")'><img src='"+dir+'/'+files[i]+"'></a>\n";
            '<img id="ri" src="'+dir+'/'+curimg+'" usemap="#m" onclick="getClickPosition(event)" />';
    }
    if (isroot === 's'){
        list.innerHTML=list.innerHTML+
			//"<a class='buttond' href='javascript:void(0)' onclick='launch(\""+files[i]+"\")'><img src='"+dir+'/'+files[i]+"'></a>\n";
            '<img id="ri" src="'+dir+'/root.jpg" usemap="#m" onclick="getClickPosition(event)" />';
    }*/    
    list.innerHTML=list.innerHTML+
			'<img id="ri" src="'+dir+'/'+curimg+'" usemap="#m" onclick="getClickPosition(event)" />';
    
    if (fs.existsSync(dir+'/'+curimg+'.die')) {
        areas = fs.readFileSync(dir+'/'+curimg+'.die').toString().split("\n");
    } else { areas = '';}
    //list.innerHTML=list.innerHTML+"<map name='m' id='map'></map>";
    //map = document.getElementById('map');
    //for(i in areas) {
    //map.innerHTML='';
    ratio = 1;
    i1 = document.getElementById('ri');
    i2 = new Image();
    i2.onload = function() {
        ratio = document.getElementById('ri').offsetWidth / i2.width;
        console.log('inw = '+document.getElementById('list').offsetWidth + ' imgw = '+i2.width);
        console.log('ratio = '+ratio);
        
        for (i=0;i<areas.length;i++) {
            console.log('areas = '+areas[i]);
            mapi = areas[i].substring(6,areas[i].indexOf(':'));
            console.log('mapi = '+mapi);
            mapii = mapi.substring(mapi.indexOf('*')+1);
            pareas = areas[i].substring(areas[i].indexOf(':')+1);
            pareas = pareas.split(',');
            //for (j in pareas) { pareas[j] = pareas[j]*ratio; }
            //area = pareas.join(',');
            pareas[0] = (pareas[0]*ratio);//+i1.offsetLeft;
            pareas[2] = (pareas[2]*ratio);//+i1.offsetLeft;
            pareas[1] = (pareas[1]*ratio);//+i1.offsetTop;
            pareas[3] = (pareas[3]*ratio);//+i1.offsetTop;
            absarea = pareas.join(',');
            //map.innerHTML=map.innerHTML+"<area shape='rect' coords='"+area+"' href='javascript:void(0)' onclick='changeroot(\""+mapi+".JPG\")'>";
            list.innerHTML=list.innerHTML+
              "<a style='left:"+pareas[0]+"px;top:"+pareas[1]+"px;width:"+(pareas[2]-pareas[0])+"px;height:"+(pareas[3]-pareas[1])+"px;'"+
              " href='javascript:void(0)' onclick='changeroot(\""+mapi+"\")'></a>";
            //console.log('rel_area = '+area);
            console.log('abs_area = '+absarea);
        }
    }
    i2.src = i1.src;
    /*for (i=0;i = 1;i++) {		
		if ((files[i].substr(files[i].length-3) === 'jpg')  | (files[i].substr(files[i].length-3) === 'JPG')){
			list.innerHTML=list.innerHTML+
			//"<a class='buttond' href='javascript:void(0)' onclick='launch(\""+files[i]+"\")'><img src='"+dir+'/'+files[i]+"'></a>\n";
            "<img src='"+dir+'/'+files[i]+"'>";
        }
	}*/
}

function puts(error, stdout, stderr) { console.log(stdout) }

function getClickPosition(evt) {
    lasxPos = curxPos;
    lasyPos = curyPos;
    curxPos = evt.layerX;
    curyPos = evt.layerY;
    console.log('clicou x='+curxPos+' y='+curyPos+' em '+i1.id);
    console.log('curx='+curxPos+' cury='+curyPos+' lasx='+lasxPos+' lasy='+lasyPos);
    if (fechadiv == 1) {
        var tempd = document.createElement("div");
        tempd.style.cssText = "position:absolute;border:solid #abc 1px;left:"+lasxPos+"px;top:"+lasyPos+"px;width:"+(curxPos-lasxPos)+"px;height:"+(curyPos-lasyPos)+"px;";
        tempd.setAttribute('id','retdiv');
        list.appendChild(tempd);
        console.log('append_div fechadiv == 1');
        fechadiv = 0;
    } else {
        console.log('fechadiv != 1 - remove_div');
        if (document.getElementById('retdiv') != null) { list.removeChild(document.getElementById('retdiv')); }
        fechadiv = 1;
    }
}
////////////////////////////////////
/// proper functions
////////////////////////////////////
function chooseFile(name) {
	    	var chooser = document.querySelector(name);
	    	chooser.addEventListener("change", function(evt) {
				dirv=this.value;
				console.log('adding dir '+dirv);
				//dirs.push(dirv);
                //dirs.splice(0,dirs.length-1);
				//localStorage.dirstr=dirs.join(';');
                changedir(dirv);
				//log.innerHTML=log.innerHTML+'<br>added directory: '+dirv;
			}, false);
			chooser.click();
			//location.reload();
}

function launch(filename){
	hlog=document.getElementById('hlog');
    hlog.innerHTML=hlog.innerHTML+'<br>launching '+filename;
	emu_exec = 'echo';
	emu_exec = exe[ext.indexOf(filename.substr(filename.length-3))];
	hlog.innerHTML=hlog.innerHTML+'<br>execline: '+emu_exec+" \""+dir+"/"+filename+"\"";
	exec(emu_exec+" \""+dir+"/"+filename+"\"", puts);
}

function changedir(ledir){
    localStorage.isroot = 's';
	localStorage.dir=ledir;
	location.reload();
}
function changeroot(leroot){
	localStorage.isroot='n';
    localStorage.curimg=leroot;
	location.reload();
}
function addroot(name) {
    var chooser = document.querySelector(name);
    chooser.addEventListener("change", function(evt) {
        roota=this.value.split('/');
        roota=roota[roota.length-1].split("\\");
        root=roota[roota.length-1];
        roots.push(root);
        console.log('add root '+root);
        rootsave = roots.join('\n');
        fs.writeFileSync(dir+'/roots.die',rootsave,'utf8');
        location.reload();
    }, false);
	chooser.click();    
}
function newarea(name) {
    var chooser = document.querySelector(name);
    chooser.addEventListener("change", function(evt) {
        mapia=this.value.split('/');
        mapia=mapia[mapia.length-1].split("\\");
        mapi=mapia[mapia.length-1];
        console.log('add foto '+mapi);
        var editpareas = 'level='+mapi+':'+lasxPos/ratio+','+lasyPos/ratio+','+curxPos/ratio+','+curyPos/ratio;
        editareas.push(editpareas);
        var newa = document.createElement("a");
        newa.style.cssText = "left:"+lasxPos+"px;top:"+lasyPos+"px;width:"+(curxPos-lasxPos)+"px;height:"+(curyPos-lasyPos)+"px;";
        newa.href = 'javascript:void(0)';
        newa.innerHTML=mapi;
        newa.setAttribute('onclick',"changeroot(\""+mapi+"\")");
        list.appendChild(newa);
        console.log('<a> = '+newa.innerHTML+' '+editpareas);
        
    }, false);
	chooser.click();    
}
function savearea() {
    if (areas.length > 0) { areas = areas.concat(editareas) ;} else { areas = editareas;}
    dietext = areas.join('\n');
    console.log("a salvar -> \n"+dietext);
    fs.writeFileSync(dir+'/'+curimg+'.die',dietext,'utf8');
    //changeroot(curimg);
    location.reload();
}
function zoomout(){
    localStorage.zoom = zoom - 20;
    location.reload();
}
function zoomin(){
    localStorage.zoom = zoom + 20;
    location.reload();
}
