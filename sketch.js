
var originalVideo;
var pg;
var capture;
var w = 640;
var h = 480;
var sinx=0.000;
var savedRandomR = Math.floor(Math.random() * 255);
var savedRandomG = Math.floor(Math.random() * 255);
var savedRandomB = Math.floor(Math.random() * 255);

function setup() {
    // pg=createGraphics(200,200);
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function() {
        console.log('capture ready.')
    });
    capture.elt.setAttribute('playsinline', '');
    capture.size(w, h);
    createCanvas(w, h);
    createCanvas(w,h);
    capture.hide();
    //originalVideo = capture;
}

// [r g b a] r g b a r g b a ...
function draw() {
    // pg.background(100);
   //image(capture, 0, 0, w, h);
     capture.loadPixels();
     var NewPix=capture.pixels;
   //  originalVideo.loadPixels();

console.log(capture.pixels.length);
    if (capture.pixels.length > 0) { // don't forget this!
        var total = 0;
        var i = 0;
        var savedRandomR = Math.floor(Math.random() * 255) -200;
        // var savedRandomG = Math.floor(Math.random() * 255)-200;
        // var savedRandomB = Math.floor(Math.random() * 255)-150;

        // for (var L=0;L<capture.pixels.length;L++){
        //       var redValue = capture.pixels[i];
        //         total += redValue;
        //         i += 4;
        // } 
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
          
                NewPix[i]+= (Math.sin(sinx)*50);
                  NewPix[i+1]+=Math.sin(sinx)*50;
                   NewPix[i+2]+=Math.sin(sinx)*50;

                  // capture.pixels[i+3]-=savedRandomB;
  

                // console.log(i);
                var redValue = capture.pixels[i];
                total += redValue;
                i += 4;
            }
        }
        sinx+=0.01;
        //
        image(capture, 0, 0, w, h);
        capture.pixels=NewPix;
        capture.updatePixels();
        //console.log(capture.pixels);
        new Image();   
        image(capture, 0, 0, w, h);
        //image(originalVideo,0,0,w,h);
        var n = w * h;
        var avg = int(total / n);

    }
}
