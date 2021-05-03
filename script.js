// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

//instantiate canvas and context for it
const canvas = document.getElementById('user-image');
console.log(canvas);
const context = canvas.getContext('2d');
context.font = "30px Impact";

//vars to control buttons
const subButton = document.querySelector("[type = 'submit']");
const resButton = document.querySelector("[type = 'reset']");
const readButton = document.querySelector("[type = 'button']");


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

  //on submit, generate meme by grabbing text in two inputs. Add relevant text to canvas
  let weLiveInASociety = document.getElementById('text-top').value;
  let bottomText = document.getElementById('text-bottom').value;
  context.fillStyle = "white";
  context.textAlign = "center";

  let dimmensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);

  context.fillText(weLiveInASociety, canvas.width/2, 30);
  context.fillText(bottomText, canvas.width/2, canvas.height -10);

  //toggle relevant buttons
  subButton.disabled = true;
  resButton.disabled = false;
  readButton.disabled = false;
});

//button: clear
resButton.addEventListener('click', event => {
  //clear image and/or text present
  context.clearRect(0, 0, canvas.width, canvas.height);
  imgurl.revokeObjectURL();
  //toggle relevant buttons
  resButton.disabled = true;
  readButton.disabled = true;
  subButton.disabled = false;
});

//vars to control text to speech
var synth = window.speechSynthesis;
var voiceChooser = document.getElementById('voice-selection');
console.log(voiceChooser);
voiceChooser.disabled = false;
var synth = window.speechSynthesis;
var voices = [];



function populateVoiceList() {
  voices = synth.getVoices();
  for(let i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang +  ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceChooser.appendChild(option);
  }
}

populateVoiceList();
if(speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

//var vol = 1.0;

readButton.addEventListener('click', event => {
  var weLiveInASociety = document.getElementById('text-top').value;
  var bottomText = document.getElementById('text-bottom').value;
  var utterTop = new SpeechSynthesisUtterance(weLiveInASociety);
  var utterBot = new SpeechSynthesisUtterance(bottomText);
  var selectedOption = voiceChooser.selectedOptions[0].getAttribute('data-name');
  for(let i = 0; i < voices.length; i++) {
    if(voices[i].name === selectedOption) {
      utterTop.voice = voices[i];
      utterBot.voice = voices[i];
    }
  }

  utterTop.pitch = 1;
  utterBot.pitch = 1;
  utterTop.rate = 1;
  utterBot.rate = 1;
  utterTop.lang = 'English';
  utterBot.lang = 'English';
  //utterTop.volume = vol;
  //utterBot.volume = vol;
  synth.speak(utterTop);
  
  console.log(utterTop);
  synth.speak(utterBot);
  console.log(utterBot);
  console.log(synth);
}); 

var volControl = document.querySelector('[type = "range"]')
volControl.addEventListener('input', () => {
  synth.vol = volControl.value / 100;
  //utterBot.volume = volControl.value;

  var icon = document.getElementById('volume-group').getElementsByTagName("img")[0];
  if(volControl.value >= 67) {
    //use vol level 3
    icon.src = "icons/volume-level-3.svg";
    icon.alt = "Volume Level 3";
  }

  else if(volControl.value >= 34) {
    //use vol level 2
    icon.src = "icons/volume-level-2.svg";
    icon.alt = "Volume Level 2";
  }

  else if(volControl.value >= 1) {
    //use vol level 1
    icon.src = "icons/volume-level-1.svg";
    icon.alt = "Volume Level 1";
  }

  else {
    //use vol level 0
    icon.src = "icons/volume-level-0.svg";
    icon.alt = "Volume Level 0";
  }

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
