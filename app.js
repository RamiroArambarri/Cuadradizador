const inputFile = document.getElementById('input_file');
const inputFileLabel = document.getElementById('input_file_label');
const inputFileLabel2 = document.getElementById('input_file_label_2');
const btnRegenerate = document.getElementById('btn_regenerate');
const inputResolution = document.getElementById('input_resolution');
const inputBrightness = document.getElementById('input_brightness');
const inputContrast = document.getElementById('input_contrast');
const inputColor = document.getElementById('input_color');
const allowedTypes = ['image/png','image/jpeg',];
const lightOptions = document.getElementsByClassName('light_option');
const btnAdvancedOptions = document.getElementById('btn_advanced_options');
const btnSave = document.getElementById('btn_save');

let showOptions = false;
let imageSource;
let resolution = 45;
let squareSide;
let imageLoaded = false;
let img;
let randomArray = [];
let seed;
let addBrightness = 0;
let addContrast = 0;
let finalSize = 600;
let lightImage = false;
let selectedColor = '#ff802f';
let userSeed = -1;
let imageCompleted = false;
let thereIsRandomArray = false;


inputFile.addEventListener('input', e => {
    imageLoaded = false;
    imageCompleted = false;

    if (e.target.files[0]) {
        if(!allowedTypes.includes(e.target.files[0].type)){
            document.getElementById('file_rejected').style.visibility = 'visible';
            return 0;
        }
    
        document.getElementById('file_rejected').style.visibility = 'hidden';

        imageSource = URL.createObjectURL(e.target.files[0]);
        btnRegenerate.style.display = 'block';
        btnSave.style.display = 'block';
        inputFileLabel.style.display = 'none';
        inputFileLabel2.style.visibility = 'visible';
        generateRandomSeed();
        loadUserImage();
    }

});

btnRegenerate.addEventListener('click', () => {
    generateRandomSeed();
    imageCompleted = false;
});
inputResolution.addEventListener('input', () => {
    if(!(Number(inputResolution.value) < 101 && Number(inputResolution.value) > 9)){
        document.getElementById('resolution_rejected').style.visibility = 'visible';
        return 0;
    }
    document.getElementById('resolution_rejected').style.visibility = 'hidden';
    resolution = Number(inputResolution.value);
    generateRandomArray();
    imageCompleted = false;
});
inputBrightness.addEventListener('input', () => {
    addBrightness = Number(inputBrightness.value);
    imageCompleted = false;
});
inputContrast.addEventListener('input', () => {
    addContrast = Number(inputContrast.value);
    imageCompleted = false;
});
inputColor.addEventListener('input', () => {
    selectedColor = inputColor.value;
    imageCompleted = false;
});
btnSave.addEventListener('click', () => {
    save('cuadradización.png')
});
for(let i = 0; i < lightOptions.length; i++){
    lightOptions[i].addEventListener('click', () => {selectLightOption(i); imageCompleted = false;});
}

btnAdvancedOptions.addEventListener('click', advancedOptionsClicked);

function selectLightOption(number) {
    lightImage = number == 1 ? true : false;
    for(let j = 0; j < lightOptions.length; j++){
        lightOptions[j].classList.remove('active_option');
    }
    lightOptions[number].classList.add('active_option');
}

function advancedOptionsClicked() {
    showOptions = !showOptions;
    if(showOptions){
        document.getElementById('advanced_options').style.visibility = 'visible';
    } else {
        document.getElementById('advanced_options').style.visibility = 'hidden';
    }
}

function setup() {
    createCanvas(0, 0);
    rectMode(CENTER);
}

function loadUserImage() {
    while (!imageSource) {
    }
    img = loadImage(imageSource);
}

function draw() {
    if(!imageSource) return 0;
    if(imageCompleted) return 0;
    
    for(let i = 0; i < img.width; i ++){
        for(let j = 0; j < img.height; j ++){
            let sample = img.get(i, j);
            if(!(sample[0] == 0 && sample[1] == 0 && sample[2] == 0 &&
            sample[3] == 0)){
                imageLoaded = true;
                break;
            }
        }
        if(imageLoaded) break;
    }

    if(!imageLoaded) return 0;
    

    if (img.width < img.height) {
        img.resize(0, finalSize);

        squareSide = finalSize / resolution;
        let newWidth;
        newWidth = finalSize * img.width / img.height;
        newWidth = squareSide * floor(newWidth / squareSide);
        resizeCanvas(newWidth, finalSize);
    } else {
        img.resize(finalSize, 0);
        squareSide = finalSize / resolution;
        let newHeight;
        newHeight = finalSize * img.height / img.width;
        newHeight = squareSide * floor(newHeight / squareSide);
        resizeCanvas(finalSize, newHeight);
    }


    background(selectedColor);
    if (lightImage) {
        background('white');
    }

    if (squareSide != finalSize / resolution) return 0;
    if(!thereIsRandomArray) return 0;
    for (i = 0; i < resolution; i++) {
        for (j = 0; j < resolution; j++) {
            let col = img.get((i + randomArray[i][j][0]) * squareSide, (j + randomArray[i][j][1]) * squareSide);

            let b = constrain(((max(col[0], col[1], col[2])) + addBrightness - 127.5) * (2 ** addContrast) + 127.5, 0, 255);


            noStroke();
            fill(0);
            if (lightImage) {
                fill(selectedColor);
            }
            rect((i + 0.5) * squareSide, (j + 0.5) * squareSide, squareSide - squareSide * ((b-4) / 251), squareSide - squareSide * ((b-4) / 251));
        }

    }
    imageCompleted = true;
}

function generateRandomSeed() {
    thereIsRandomArray = false;
    userSeed = Number(document.getElementById('input_seed').value);
    if(isNaN(userSeed)){
        document.getElementById('seed_rejected').style.display = 'inline';
        document.getElementById('seed_expl').style.display = 'none'; 
        return 0;
    }
    document.getElementById('seed_rejected').style.display = 'none';
    document.getElementById('seed_expl').style.display = 'inline';
    seed = userSeed == -1 ? seed = floor(random(0, 1000000)) : userSeed;
    randomSeed(seed);
    document.getElementById('seed_feedback').innerHTML = 'semilla:' + seed;
    generateRandomArray();
}

function generateRandomArray() {
    for (let i = 0; i < resolution; i++) {
        randomArray[i] = [];
        for (let j = 0; j < resolution; j++) {
            randomArray[i][j] = [];
            randomArray[i][j][0] = random(1);
            randomArray[i][j][1] = random(1);
        }
    }
    thereIsRandomArray = true;
}

