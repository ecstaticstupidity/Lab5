// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
console.log(canvas);
const context = canvas.getContext('2d');
context.font = "30px Impact";
const subButton = document.querySelector("[type = 'submit']");
const resButton = document.querySelector("[type = 'reset']");
const readButton = document.querySelector("[type = 'button']");
console.log(subButton);
console.log(resButton);
console.log(readButton);


// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  context.clearRect(0, 0, canvas.width, canvas.height);

  subButton.disabled = false;
  resButton.disabled = true;
  readButton.disabled = true;

  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  var dimmensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  context.drawImage(img, dimmensions.startX, dimmensions.startY, dimmensions.width, dimmensions.height);
  
});


//input: image-input
const inpImg = document.querySelector("[type = 'file']");
console.log(inpImg);
inpImg.addEventListener('change', () => {
  var selectedImg = inpImg.files[0];
  var imgurl = URL.createObjectURL(selectedImg);
  console.log(imgurl);
  img.src = imgurl;
  img.alt = selectedImg.name;
  console.log(img.alt);
});


//form: submit code
const genner = document.getElementById('generate-meme');
console.log(genner);
genner.addEventListener('submit', () =>{
  event.preventDefault();
  var weLiveInASociety = document.getElementById('text-top').value;
  var bottomText = document.getElementById('text-bottom').value;
  context.fillStyle = "white";
  var dimmensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  context.fillText(weLiveInASociety, dimmensions.width/2, dimmensions.startY - 10);
  context.fillText(bottomText, dimmensions.width/2, dimmensions.height - 20)

});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
