
var canvas = document.querySelector("#scene"),
  ctx = canvas.getContext("2d"),
  particles = [],
  amount = 0,
  mouse = {x:0,y:0},
  radius = 1;

var colors = ["#FFF"];

var ww = canvas.width = window.innerWidth;
var wh = canvas.height = window.innerHeight;

function Particle(x,y){
  this.x =  Math.random()*ww;
  this.y =  Math.random()*wh;
  this.dest = {
    x : x,
    y: y
  };
  this.r =  Math.random()* (isPhone() ? 3 : 5) + 2;
  this.vx = (Math.random()-0.5)*20;
  this.vy = (Math.random()-0.5)*20;
  this.accX = 0;
  this.accY = 0;
  this.friction = Math.random()*0.05 + 0.8;

  this.color = colors[Math.floor(Math.random()*6)];
}

Particle.prototype.render = function() {


  this.accX = (this.dest.x - this.x)/100;
  this.accY = (this.dest.y - this.y)/100;
  this.vx += this.accX;
  this.vy += this.accY;
  this.vx *= this.friction;
  this.vy *= this.friction;

  this.x += this.vx;
  this.y +=  this.vy;

  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
  ctx.fill();

  var a = this.x - mouse.x;
  var b = this.y - mouse.y;

  var distance = Math.sqrt( a*a + b*b );
  if(distance<(radius*70)){
    this.accX = (this.x - mouse.x)/30;
    this.accY = (this.y - mouse.y)/30;
    this.vx += this.accX;
    this.vy += this.accY;
  }

}

function onMouseMove(e){
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function onTouchMove(e){
  if(e.touches.length > 0 ){
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
}

function onTouchEnd(e){
  mouse.x = -9999;
  mouse.y = -9999;
}

function initScene(){
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;

  var text = "Let's\nSportik!";

  if(ww < 900) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold "+(ww/4)+"px sans-serif";
    ctx.textAlign = "center";
    var lines = text.split("\n");
    var y = 0;
    for (var i = 0; i < lines.length; ++i) {
      ctx.fillText(lines[i], ww/2, wh/2.5 + y);
      var lineHeight = ctx.measureText("L").width * 1.4;
      y += lineHeight;
    }

    var data  = ctx.getImageData(0, 0, ww, wh).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "screen";


  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold "+(ww/8)+"px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, ww/2, wh/2);

    var data  = ctx.getImageData(0, 0, ww, wh).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "screen";
  }

  particles = [];

  const particleDensity = isPhone() ? 6 : 10;
  for(var i=0;i<ww;i+=particleDensity){
    for(var j=0;j<wh;j+=particleDensity){
      if(data[ ((i + j*ww)*4) + 3] > 150){
        particles.push(new Particle(i,j));
      }
    }
  }
  amount = particles.length;
}

function isPhone() {
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    return true;
  }
  return false;
}

function onMouseClick(){
  if(isPhone()) {
    radius++;
    if(radius ===3){
      radius = 0;
    }
  } else {
    radius++;
    if(radius ===5){
      radius = 0;
    }
  }
}

function render(a) {
  requestAnimationFrame(render);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < amount; i++) {
    particles[i].render();
  }
}

window.addEventListener("resize", function () {
  if(!isPhone()){
    initScene();
  }
});
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("click", onMouseClick);
window.addEventListener("click touchstart", onMouseClick);
window.addEventListener("touchend", onTouchEnd);
initScene();
requestAnimationFrame(render);

