var pixels = [,];
var boxes = [,];
var colors = [];

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.height =  document.getElementById("inner_remaining").getBoundingClientRect().height;
canvas.width =  window.screen.width;

canvas.addEventListener("mousedown", mousedown);
canvas.addEventListener("mouseup", mouseup);

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generateDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "Black"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  pixels.forEach(pixel => {
    redrawPixel(pixel);
  })

  boxes = [,];
  colors = [];
  if (selectQaudtreeMethode.value == "Good") {
    generateQaudTree();
  } else {
    generateQaudTreeOld();
  }

  snackbar.open();
}

function generateRandomPoints() {
  pixels = [,];
  boxes = [,];
  colors = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "Black"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < document.getElementById("pixels").value; i++) {
    drawRandomPixel();
  }
  //console.log(pixels)
  if (selectQaudtreeMethode.value == "Good") {
    generateQaudTree();
  } else {
    generateQaudTreeOld();
  }


  snackbar.open();
}

function generateQaudTree() {
  console.time('Function #1');

  box = [0, 0, canvas.width, canvas.height, pixels]
  recusive(box)

  console.timeEnd('Function #1');
}

function recusive(box) {
  setTimeout(function () {
    drawBox(box)
    var amountPixelsInBox = 0
    var pixelInBox = []

    box[4].forEach(pixel => {

      if (box[0] <= pixel[0] && box[0] + box[2] > pixel[0] && box[1] <= pixel[1] && box[1] + box[3] > pixel[1]) {
        amountPixelsInBox++;
        pixelInBox.push(pixel)
      }
    })

    if (amountPixelsInBox <= document.getElementById("condition").value) {
      //console.log("Done")
      return
    } else {
      var x = box[0]
      var y = box[1]
      var width = box[2]
      var height = box[3]
      recusive([x, y, width / 2, height / 2, pixelInBox])
      recusive([x + width / 2, y, width / 2, height / 2, pixelInBox])
      recusive([x, y + height / 2, width / 2, height / 2, pixelInBox])
      recusive([x + width / 2, y + height / 2, width / 2, height / 2, pixelInBox])
    }
  }, document.getElementById("delay").value);

}

function generateQaudTreeOld() {
  console.time('Function #1');

  boxes = [,]

  divideQaudTree(0, 0, canvas.width, canvas.height)

  var count = 0;
  while (boxes.length != 0 && count < document.getElementById("levels").value) {

    if (selectQaudtreeMethode.value == "pixelPerPixel") {
      pixelPerPixel();
    } else if (selectQaudtreeMethode.value == "boxPerBox") {
      boxPerBox();
    }

    count++;
  }

  console.timeEnd('Function #1');
}

function boxPerBox() {
  boxes.forEach(box => {

    var amountPixelsInBox = 0;
    pixels.forEach(pixel => {
      //console.log(box,pixel, box[0] <= pixel[0] , box[0] + box[2] > pixel[0] , box[1] <= pixel[1] , box[1] + box[3] > pixel[1])

      if (box[0] <= pixel[0] && box[0] + box[2] > pixel[0] && box[1] <= pixel[1] && box[1] + box[3] > pixel[1]) {
        amountPixelsInBox++;
      }
    })
    //console.log(amountPixelsInBox)
    if (amountPixelsInBox <= 2) { // move up and break when Done better version
      //console.log("Done")
      const index = boxes.indexOf(box);
      if (index > -1) {
        boxes.splice(index, 1);
      }
      //boxes.remove(box);
    } else {
      divideQaudTree(box[0], box[1], box[2], box[3]);
    }
  });
}

function pixelPerPixel() {
  var amountPixelsInBoxes = []
  boxes.forEach(box => {
    amountPixelsInBoxes.push(0)
  })

  pixels.forEach(pixel => {
    boxes.forEach(box => {
      if (box[0] <= pixel[0] && box[0] + box[2] > pixel[0] && box[1] <= pixel[1] && box[1] + box[3] > pixel[1]) {
        amountPixelsInBoxes[boxes.indexOf(box) - 1]++;
      }
    })
  })

  //console.log(amountPixelsInBoxes)

  var counter = 0;
  amountPixelsInBoxes.forEach(amountPixelsInBox => {
    //console.log(amountPixelsInBox, boxes,counter)
    if (amountPixelsInBox <= document.getElementById("condition").value) {
      //console.log("Done")
      boxes.splice(counter, 1);
    } else {
      counter++;
      var box = boxes[counter]
      divideQaudTree(box[0], box[1], box[2], box[3]);
    }
  })
}

function divideQaudTree(x, y, width, height) {

  boxes.push([x, y, width / 2, height / 2]) // left-top
  drawBox(boxes[boxes.length - 1]);

  boxes.push([x + width / 2, y, width / 2, height / 2]) // right-top
  drawBox(boxes[boxes.length - 1]);

  boxes.push([x, y + height / 2, width / 2, height / 2]) //left-bottom
  drawBox(boxes[boxes.length - 1]);

  boxes.push([x + width / 2, y + height / 2, width / 2, height / 2]) //right-bottom
  drawBox(boxes[boxes.length - 1]);

}

function drawBox(x, y, width, height) {
  //console.log(x, y, width, height)
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
}

function drawBox(box) {

  if (selectColorMode.value == "RandomPerGeneration") {
    var generation = ((canvas.width / 2) / box[2]) - 1;
    if (colors.length > generation) {
      colors.push(getRandomColor())
    }
    ctx.fillStyle = colors[generation];
    ctx.fillRect(box[0], box[1], box[2], box[3]);

  } else if (selectColorMode.value == "RandomPerBox") {

    ctx.fillStyle = getRandomColor();
    ctx.fillRect(box[0], box[1], box[2], box[3]);

  }

  if (document.getElementById("outline").checked) {

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(box[0], box[1], box[2], box[3]);

  }
}

function drawRandomPixel() {
  var x = Math.random() * canvas.width;
  var y = Math.random() * canvas.height;
  ctx.fillStyle = "white";
  //ctx.arc(x, y, (Math.round(Math.random()*50)+20), 0, 2 * Math.PI);
  ctx.fillRect(x, y, 1, 1)
  pixels.push([x, y])
}

function redrawPixel(pixel) {
  ctx.fillStyle = "white";
  //ctx.arc(x, y, (Math.round(Math.random()*50)+20), 0, 2 * Math.PI);
  ctx.fillRect(pixel[0], pixel[1], 1, 1)
}

function drawPixel(x, y) {
  //console.log(x, y)
  ctx.fillStyle = "white";
  //ctx.arc(x, y, (Math.round(Math.random()*50)+20), 0, 2 * Math.PI);
  ctx.fillRect(x, y, 1, 1)
  pixels.push([x, y])
}

var xCursor = 0;
var yCursor = 0;
var mousedownBool = false;
document.onmousemove = handleMouseMove;

function handleMouseMove(event) {
  var eventDoc, doc, body;

  event = event || window.event; // IE-ism

  // If pageX/Y aren't available and clientX/Y are,
  // calculate pageX/Y - logic taken from jQuery.
  // (This is to support old IE)
  if (event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;

    event.pageX = event.clientX +
      (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
      (doc && doc.clientLeft || body && body.clientLeft || 0);
    event.pageY = event.clientY +
      (doc && doc.scrollTop || body && body.scrollTop || 0) -
      (doc && doc.clientTop || body && body.clientTop || 0);
  }

  // Use event.pageX / event.pageY here
  xCursor = event.pageX - canvas.offsetLeft;
  yCursor = event.pageY - canvas.offsetTop;

  if (mousedownBool) {
    drawPixel(xCursor, yCursor);
  }
}

function mousedown() {
  mousedownBool = true;
  drawPixel(xCursor, yCursor);
}

function mouseup() {
  mousedownBool = false;
}

function clearCanvas() {
  pixels = [,];
  boxes = [,];
  colors = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "Black"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}
