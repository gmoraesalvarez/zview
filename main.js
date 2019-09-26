const dialog = require('electron').remote.dialog;
const fs = require('fs');

cur_img = 'null';
cur_path = '/';
areas = [['area','x','y','img']];
areaname = 'null.0.txt';
areaparent = 'null.txt';
addarea = false;
rootimgdiv = document.getElementById('root_img');
hlogdiv = document.getElementById('hlog');

rootimgdiv.addEventListener('click', e => {
    console.log(e.offsetX + ' ' + e.offsetY + ' ' + addarea);
    if (addarea == true) {
        addarea = false;
        areas.push([cur_img+areas.length,e.offsetX,e.offsetY]);
        console.log(areas);
        newitem = document.createElement('p');newitem.innerHTML=
            '<a class="button" href="javascript:void(0)" onclick="opennext(\''+cur_img+(areas.length-1)+'\',\''+areaname+'\');">-></a>'
            +cur_img+' '+(areas.length-1)+' '+e.offsetX+','+e.offsetY;
        hlogdiv.appendChild(newitem);
    }
});
function newroot(fileName){
    rootimgdiv.innerHTML = 'Abriu '+fileName;
    rootimgdiv.style.background = '#ffffff url("'+fileName+'") no-repeat';
    rootimgdiv.style.backgroundSize = 'contain';
    areas[0] = ['areaname','x','y',cur_img];
    console.log('path '+cur_path);
}
function addroot(fromarea = false){
    if (fromarea == false){
        rootimg = dialog.showOpenDialogSync({ properties: ['openFile'],
            filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]} );
        cur_img = rootimg[0].substr(rootimg[0].lastIndexOf('/')+1);
        cur_path = rootimg[0].slice(0,rootimg[0].lastIndexOf('/')+1);
        areaname = cur_img+'.0.txt';
        newroot(rootimg[0]);
    } else {
        newroot(cur_path+cur_img);
        hlogdiv.innerHTML='';
        for (i=1;i<areas.length;i++){
            newitem = document.createElement('p');newitem.innerHTML=
            '<a class="button" href="javascript:void(0)" onclick="opennext(\''+cur_img+'.'+(i)+'.txt\',\''+areaname+'\');">-></a>'
            +cur_img+' '+(i)+' '+areas[i][1]+','+areas[i][2];
            hlogdiv.appendChild(newitem);
        }
    }    
}
function newarea(){
    addarea = true;
}
function openarea(){
    txt = dialog.showOpenDialogSync({ properties: ['openFile'],
        filters: [{ name: 'Areas', extensions: ['txt','json'] }]} );
    console.log('Abriu '+txt);
    cur_path = txt[0].slice(0,txt[0].lastIndexOf('/')+1);
    rootimgdiv.style.background = '#ffffff';            
    cur_txt = txt[0].substr(txt[0].lastIndexOf('/')+1);
    cur_path = txt[0].slice(0,txt[0].lastIndexOf('/')+1);
    fs.readFile(txt[0], 'utf8', function(err,data){
        areaname = cur_txt;
        areas = JSON.parse(data);
        console.log('areas0,3 = '+areas[0][3]+' curpath='+cur_path);
        areaparent = areas[0][0];
        cur_img = areas[0][3];
        addroot(true);
    });
}
function opennext(next,parent){
    console.log('next is '+next+' and parent is '+parent);
    areaname = next;
    areaparent = parent;
    cur_img = '';
    hlogdiv.innerHTML='';
    rootimgdiv.innerHTML = '';
    rootimgdiv.style.background = '#fafafa';
    fs.readFile(cur_path+next, 'utf8', function (err, data) {
        if (err) {
            areas = [[areaparent,'x','y','null']];
            fs.writeFileSync(cur_path+next, JSON.stringify(areas), 'utf-8');
            return console.log(err);            
        } else {
            areas = JSON.parse(data);
            areaparent = areas[0][0];
            cur_img = areas[0][3];
            addroot(true);
        }
        // data is the contents of the text file we just read
      });
}
function addimg(){
    rootimg = dialog.showOpenDialogSync({ properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]} );
    cur_img = rootimg[0].substr(rootimg[0].lastIndexOf('/')+1);
    rootimgdiv.style.background = '#ffffff url("'+cur_path+cur_img+'") no-repeat';
    rootimgdiv.style.backgroundSize = 'contain';
    areas[0] = [areaparent,'x','y',cur_img];
}
function savearea(){
    fs.writeFileSync(cur_path+areaname, JSON.stringify(areas), 'utf-8');
}
function back(){
    console.log('parent is '+areaparent+', areaname is '+areaname);
    opennext(areaparent,areaname);
}