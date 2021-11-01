
function randomPosition(){
  return {x:Math.random()*canvas.width, y:Math.random()*canvas.height}
}

function drawPoints(points){
  for(let p = 0; p < points.length; p++){
    let size = Math.floor(15-(charge(points[p])/10));
    drawPoint(points[p].x, points[p].y, size);
  }
}

function boundaryCharge(){
  return 500;
}

function charge(p){
  return 10 + 70 * lightnessAt(p) * Math.exp(lightnessAt(p));
}

function mass(p){
  return 7;
}

function forceBetween(p1, c1, p2, c2){
  return Math.abs(c1*c2)/(distance(p1,p2)**2);
}

function forceBoundary(p){
  f = {x:0,y:0};

  z = {x:0,y:0};
  m = {x:canvas.width,y:canvas.height};

  chargeComponenet = Math.abs(charge(p)*boundaryCharge())

  f.x = chargeComponenet/p.x**2 - chargeComponenet/(m.x-p.x)**2;
  f.y = chargeComponenet/p.y**2 - chargeComponenet/(m.y-p.y)**2;

  // if point goes over:
  if(p.x < 0){
    f = add(f, {x:Math.abs(p.x) ,y:0});
  }
  if(p.x > canvas.width){
    f = add(f, {x:-1*(p.x-canvas.width) ,y:0});
  }
  if(p.y < 0){
    f = add(f, {x:0 ,y:Math.abs(p.y)});
  }
  if(p.y > canvas.height){
    f = add(f, {x:0 ,y:-1*(p.y-canvas.height)});
  }

  return f;
}

function getCharges(points){
  let charges = [];
  for(let p = 0; p < points.length; p++){
    charges[p] = charge(points[p]);
  }
  return charges;
}

function movePoints(points){
  
  // move any stray points back into range
  for(let p = 0; p < points.length; p++){
    if(isNaN(points[p].x) || isNaN(points[p].y)){
      points[p] = randomPosition();
      console.log("REDIRECTED!");
    }
  }

  let charges = getCharges(points);
  let forces = [];

  for(let p = 0; p < points.length; p++){
    forces[p] = {x:0,y:0};
  }

  // force on each other
  for(let a = 0; a < points.length-1; a++){
    for(let b = a+1; b < points.length; b++){
      f = forceBetween(points[a], charges[a], points[b], charges[b]);
      directionFromBtoA = unitVector(subtract(points[a], points[b]));
      forceOnA = multiply(directionFromBtoA, f);
      // equal and opposite
      forceOnB = multiply(forceOnA, -1);

      forces[a] = add(forces[a], forceOnA);
      forces[b] = add(forces[b], forceOnB);
    }
  }

  // force from boundary
  for(let p = 0; p < points.length; p++){
    forces[p] = add(forces[p], forceBoundary(points[p]));
  }

  // move
  for(let p = 0; p < points.length; p++){
    points[p] = add(points[p], divide(forces[p], mass(p)));
  }

}

points = []

for(let i = 0; i < 500; i++){
  points.push(randomPosition());
}


drawPoints(points);


var running = false;

async function animate(){
  while(true){
    await sleep(100);
    if(running){
      movePoints(points);
      clearCanvas();
      drawPoints(points);
      console.log("step!");
    }
  }
}

animate();

canvas.addEventListener("click", function(event){

  let position = {x:event.clientX, y:event.clientY};
  running = !running;
  
});