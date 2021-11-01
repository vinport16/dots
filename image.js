var img = new Image();
img.crossOrigin = "anonymous"
//img.src = "https://psmag.com/.image/t_share/MTI3NTgxOTY5OTczMzI0NDE5/chess-board.jpg";// document.getElementById("image").src;
img.src = "https://psmag.com/.image/t_share/MTI3NTgyNTE5NDYwNzk1NjY2/marshall-mcluhan.jpg";
var imgCanvas = document.createElement('canvas');
//imgCanvas.style.display = "none";
document.body.append(imgCanvas);
var imgCtx = imgCanvas.getContext('2d');
// match width and height of dot canvas
imgCanvas.width = canvas.width;
imgCanvas.height = canvas.height;

let lightnessMap = [];

function rgb(r,g,b){
  return "#"+(r).toString(16)+(g).toString(16)+(b).toString(16);
}

img.onload = function(){
  imgCtx.drawImage(img, 0, 0);

  let w = imgCanvas.width;
  let h = imgCanvas.height;
  let data = imgCtx.getImageData(0,0, w, h).data;

  for(let x = 0; x < canvas.width; x++){
    for(let y = 0; y < canvas.height; y++){
      let l = (data[(4*x)+(4*y*w)] + data[1+(4*x)+(4*y*w)] + data[2+(4*x)+(4*y*w)])/(3*256);
      lightnessMap[x+(y*w)] = l;
    }
  }

};


// p is a point on the image, return brightness there
function lightnessAt(p) {
  let x = Math.floor(p.x);
  let y = Math.floor(p.y);
  if(lightnessMap[x+ y*canvas.width] != undefined){
    return lightnessMap[x+ y*canvas.width];
  }else{
    return 1;
  }
}

