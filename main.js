const bigCanvas = document.getElementById('drawing-board');
const smallCanvas = document.getElementById("small-canvas")
const overlay = document.getElementById('overlay');
const eraseButton = document.getElementById('erase_button');
const guessText = document.getElementById("guess-text")


//Setting up Canvas
const overlayCanvas = overlay.getContext('2d')
const ctx = bigCanvas.getContext('2d');
const smallBox = smallCanvas.getContext('2d');

const class_names = ['aircraft_carrier', 'airplane', 'alarm_clock', 'ambulance', 'angel', 'animal_migration', 'ant', 'anvil', 'apple', 'arm', 'asparagus', 'axe', 'backpack', 'banana', 'bandage', 'barn', 'baseball', 'baseball_bat', 'basket', 'basketball', 'bat', 'bathtub', 'beach', 'bear', 'beard', 'bed', 'bee', 'belt', 'bench', 'bicycle', 'binoculars', 'bird', 'birthday_cake', 'blackberry', 'blueberry', 'book', 'boomerang', 'bottlecap', 'bowtie', 'bracelet', 'brain', 'bread', 'bridge', 'broccoli', 'broom', 'bucket', 'bulldozer', 'bus', 'bush', 'butterfly', 'cactus', 'cake', 'calculator', 'calendar', 'camel', 'camera', 'camouflage', 'campfire', 'candle', 'cannon', 'canoe', 'car', 'carrot', 'castle', 'cat', 'ceiling_fan', 'cell_phone', 'cello', 'chair', 'chandelier', 'church', 'circle', 'clarinet', 'clock', 'cloud', 'coffee_cup', 'compass', 'computer', 'cookie', 'cooler', 'couch', 'cow', 'crab', 'crayon', 'crocodile', 'crown', 'cruise_ship', 'cup', 'diamond', 'dishwasher', 'diving_board', 'dog', 'dolphin', 'donut', 'door', 'dragon', 'dresser', 'drill', 'drums', 'duck', 'dumbbell', 'ear', 'elbow', 'elephant', 'envelope', 'eraser', 'eye', 'eyeglasses', 'face', 'fan', 'feather', 'fence', 'finger', 'fire_hydrant', 'fireplace', 'firetruck', 'fish', 'flamingo', 'flashlight', 'flip_flops', 'floor_lamp', 'flower', 'flying_saucer', 'foot', 'fork', 'frog', 'frying_pan', 'garden', 'garden_hose', 'giraffe', 'goatee', 'golf_club', 'grapes', 'grass', 'guitar', 'hamburger', 'hammer', 'hand', 'harp', 'hat', 'headphones', 'hedgehog', 'helicopter', 'helmet', 'hexagon', 'hockey_puck', 'hockey_stick', 'horse', 'hospital', 'hot_air_balloon', 'hot_dog', 'hot_tub', 'hourglass', 'house', 'house_plant', 'hurricane', 'ice_cream', 'jacket', 'jail', 'kangaroo', 'key', 'keyboard', 'knee', 'knife', 'ladder', 'lantern', 'laptop', 'leaf', 'leg', 'light_bulb', 'lighter', 'lighthouse', 'lightning', 'line', 'lion', 'lipstick', 'lobster', 'lollipop', 'mailbox', 'map', 'marker', 'matches', 'megaphone', 'mermaid', 'microphone', 'microwave', 'monkey', 'moon', 'mosquito', 'motorbike', 'mountain', 'mouse', 'moustache', 'mouth', 'mug', 'mushroom', 'nail', 'necklace', 'nose', 'ocean', 'octagon', 'octopus', 'onion', 'oven', 'owl', 'paint_can', 'paintbrush', 'palm_tree', 'panda', 'pants', 'paper_clip', 'parachute', 'parrot', 'passport', 'peanut', 'pear', 'peas', 'pencil', 'penguin', 'piano', 'pickup_truck', 'picture_frame', 'pig', 'pillow', 'pineapple', 'pizza', 'pliers', 'police_car', 'pond', 'pool', 'popsicle', 'postcard', 'potato', 'power_outlet', 'purse', 'rabbit', 'raccoon', 'radio', 'rain', 'rainbow', 'rake', 'remote_control', 'rhinoceros', 'rifle', 'river', 'roller_coaster', 'rollerskates', 'sailboat', 'sandwich', 'saw', 'saxophone', 'school_bus', 'scissors', 'scorpion', 'screwdriver', 'sea_turtle', 'see_saw', 'shark', 'sheep', 'shoe', 'shorts', 'shovel', 'sink', 'skateboard', 'skull', 'skyscraper', 'sleeping_bag', 'smiley_face', 'snail', 'snake', 'snorkel', 'snowflake', 'snowman', 'soccer_ball', 'sock', 'speedboat', 'spider', 'spoon', 'spreadsheet', 'square', 'squiggle', 'squirrel', 'stairs', 'star', 'steak', 'stereo', 'stethoscope', 'stitches', 'stop_sign', 'stove', 'strawberry', 'streetlight', 'string_bean', 'submarine', 'suitcase', 'sun', 'swan', 'sweater', 'swing_set', 'sword', 'syringe', 't-shirt', 'table', 'teapot', 'teddy-bear', 'telephone', 'television', 'tennis_racquet', 'tent', 'The_Eiffel_Tower', 'The_Great_Wall_of_China', 'The_Mona_Lisa', 'tiger', 'toaster', 'toe', 'toilet', 'tooth', 'toothbrush', 'toothpaste', 'tornado', 'tractor', 'traffic_light', 'train', 'tree', 'triangle', 'trombone', 'truck', 'trumpet', 'umbrella', 'underwear', 'van', 'vase', 'violin', 'washing_machine', 'watermelon', 'waterslide', 'whale', 'wheel', 'windmill', 'wine_bottle', 'wine_glass', 'wristwatch', 'yoga', 'zebra', 'zigzag']


//Loading Page Set Up
overlayCanvas.font = "15px calibri";
overlayCanvas.textAlign = "center"
overlayCanvas.fillText("Loading Model.. Please Wait", 140,140 )



let isPainting = false;
let lineWidth = 10;


eraseButton.addEventListener('click' , (e) => clearCanvas(e))


bigCanvas.addEventListener('mousedown', () =>{
    isPainting = true;

});

bigCanvas.addEventListener('mouseup', () => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();

});

bigCanvas.addEventListener('mousemove', (e) => draw(e))



//loading Model
let sess;
let modelLoaded = false;

async function initModel() {
    sess = await ort.InferenceSession.create("./resnet50_final_boss.onnx"); // lowercase file name for GitHub Pages
    modelLoaded = true;
    overlayCanvas.clearRect(0, 0, overlay.width, overlay.height);
    overlay.style.display = "none";
}
initModel();


predict(false)
setTimeout(revealCanvas, 5000)



function revealCanvas(){
    overlay.style.display = "none";
}

function draw(e) {

    if (!isPainting) {
        return;
    }
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = "black";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    predict(true);

}

function clearCanvas(e){

    ctx.clearRect(0, 0, bigCanvas.width, bigCanvas.height);
    smallBox.clearRect(0, 0, smallCanvas.width, smallCanvas.height);
    
}

function getImgData() {

    smallBox.drawImage(ctx.canvas, 0, 0, 28, 28)
    const imgData = smallBox.getImageData(0, 0, 28, 28)

    let imgArray = []

    for(let i = 3; i <= imgData.data.length; i += 4){
        imgArray.push(imgData.data[i] / 255);
    }
    const imgTensor = new ort.Tensor('float32', Float32Array.from(imgArray), [1, 1, 28, 28]);
    return imgTensor

}

async function predict(changeText) {
    
    let input = getImgData()

    const feeds = { "input.1": input };  // replace "input" with actual input name if needed
    const outputMap = await sess.run(feeds);
    const outputTensor = outputMap[Object.keys(outputMap)[0]];
    const predictions =  outputTensor.data; 

    const maxPredictionIndex = predictions.indexOf(Math.max(...predictions));
    
    if(changeText === true){
        guessText.innerText = `I think its a ${class_names[maxPredictionIndex].replace(/_/g, ' ')}!`;
    }
}



