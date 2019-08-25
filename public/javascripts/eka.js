//*
var console = function() {
    return({
        log: function(msg) {
          consoleDiv = document.getElementById('console');
          para = document.createElement('p');
          text = document.createTextNode(msg);
          para.appendChild(text);
          consoleDiv.appendChild(para);
        }
    });
}();
//*/
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var img = document.getElementById('myImg');
var myData;
var particles = [];
var pCount = 0;
var skip = 2;
var nParticles = 0;
var distRepulsion = 3000;
var cycleDist = 0;
var isDemo = true;
var rectCanvas;
var mouseX;
var mouseY;
var dirMouse = 1;


Particle = function(x,y,absPosition){ 
  this.initX = this.currentX = this.targetX = x;
  this.initY = this.currentY = this.targetY = y;
  this.vx = 0;
  this.vy = 0;
  this.inplace = true;
  
  this.repulse = function(cx,cy){
    var dx = (cx-this.currentX);
    var dy = (cy-this.currentY);
    var dist = Math.pow(dx,2) + Math.pow(dy,2);
    if (dist < distRepulsion){
      this.vx += -dx*.02;
      this.vy += -dy*.02;
    }else{
      this.vx += (this.initX - this.currentX)*.1;
      this.vy += (this.initY - this.currentY)*.1;
    }
    this.vx*=.85;
    this.vy*=.85;
    
    if (Math.abs(this.vx)<.1 && Math.abs(this.yv)<.1){
      this.vx = this.vy = 0;
      this.currentX = this.initX;
      this.currentY = this.initY;
      this.inplace = true;
    }else{
    	this.currentX = Math.round(this.currentX+this.vx);
    	this.currentY = Math.round(this.currentY+this.vy); 
      this.inplace = false;
    }
  }
}

window.onload = function() {
  document.onmousemove = handleMouseMove;
  context.drawImage(img, 0, 0 );
	myData = context.getImageData(0, 0, img.width, img.height);
  parseImage();
  rectCanvas = canvas.getBoundingClientRect();
	mouseX=0;
	mouseY=0;
  requestAnimationFrame(loop);
};


function handleMouseMove(event){
  
  if (!isDemo){
  	mouseX = event.clientX - rectCanvas.left;
  	mouseY = event.clientY - rectCanvas.top;  
  }
}

function parseImage(){
  var pix = myData.data;
	var n = pix.length;
  for (var i = 0 ; i < n; i += (4*skip)) {
  	if (pix[i+3] > 100){
    	var particle = new Particle(pCount%canvas.width, 			Math.floor(pCount/canvas.width),pCount);
    	particles.push(particle);
    }
    pCount+=skip;
	}
 nParticles = particles.length;
}

function loop() {
  cycleDist += .1;
  distRepulsion = 2500 + Math.sin(cycleDist)*1000; 
  var newData = context.createImageData(canvas.width, canvas.height);
  var needRender = false;
  
  if (isDemo){
    mouseX += dirMouse*2;
    mouseY += 2;
    if (mouseX > canvas.width){
      dirMouse = -1;
      mouseX = canvas.width;
    }
    if (mouseY > canvas.height){
      isDemo = false;
    }
  }
  
  for (var i=0; i<nParticles; i++ ){
   var p = particles[i];
    p.repulse(mouseX,mouseY);
    if (!p.inplace){
    	var pos = ((p.currentY*canvas.width)+p.currentX)*4;
      newData.data[pos] += 196;
      newData.data[pos+1] += 154;
      newData.data[pos+2] += 108;
      newData.data[pos+3] += 255;
      needRender = true;  
    }   
  }  
  if (needRender) { 
    context.putImageData(newData,0,0);
  }
  requestAnimationFrame(loop);
};


