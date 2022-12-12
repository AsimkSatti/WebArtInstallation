var effectEnabled=false; 
var originalVideo;
var firstEntry=true;
var pg;
var kernel=[10,10];
var kernelSize=kernel[0]*kernel[1];
var pixToEdit=[];
var capture;
var Kcount=0;
var w = 960;
var h = w*0.75;
var sinx=0.000;
var obscuraDistance=20;

var UpdateMatrix=false;

var lstMatObsc=[];

class MatrixObscura{
    constructor(startI,kernel){

        this.startI=startI;
        this.kernel=kernel;
        this.kernelWidth = kernel[0];
        this.kernelHeight = kernel[1];
        this.kernelSize=kernel[0]*kernel[1];

        this.pixelDomain=[];
        this.avgLum;

        this.prevRavg=0;
        this.rAvg=0;
        this.gAvg=0;
        this.bvg=0;

    }
    assignRandomPixValues(){
                for (var i =0; i<=this.kernelSize; i++) {
            var indexPointer=this.pixelDomain[i]+Mat;
            rTot+=capture.pixels[indexPointer];
            gTot+=capture.pixels[indexPointer+1];
            bTot+=capture.pixels[indexPointer+2];
        }
    }
    PreProcess(){
        for (var i =0; i<=this.kernelSize; i++) {
            
             var indexPointer=this.pixelDomain[i]+this.startI;
             var lum = 0.2126 * capture.pixels[indexPointer] + 0.7152 *capture.pixels[indexPointer+1] + 0.0722 *capture.pixels[indexPointer+2]
    
             if (lum<40){
                    capture.pixels[indexPointer] *=0.98;
 
                    capture.pixels[indexPointer+1] *= 0.98;
                    capture.pixels[indexPointer+2] *=0.98;
             }
             if(lum>40){
                   capture.pixels[indexPointer] *=1.03;
 
                    capture.pixels[indexPointer+1] *= 1.03;
                    capture.pixels[indexPointer+2] *=1.03;
             }
            // var rTemp=capture.pixels[indexPointer] 
            // capture.pixels[indexPointer] =  capture.pixels[indexPointer+1]
            // capture.pixels[indexPointer+1] = capture.pixels[indexPointer+2]
            // capture.pixels[indexPointer+2] = 1.2*rTemp;


            // Math.Max(capture.pixels[indexPointer],capture.pixels[indexPointer+1],capture.pixels[indexPointer+2])

        }
    }
    generateRegion(){
          
           for (var WMover=0;WMover<(4*this.kernelWidth);WMover+=4){
            this.pixelDomain.push(WMover+this.startI);

            
            for (var HMover=0;HMover<this.kernelHeight;HMover+=1){
                        // Hmover is the height delta aka how much to move down aka kernel[1](4*width) loops it
                       this.pixelDomain.push(WMover+this.startI + (4*width)*HMover); 
             
                    }
        }
    }
    GettingAverageFromRegion(){
     
        
        var rTot=0;
        var gTot=0;
        var bTot=0;
        var lumTemp=0;

        for (var i =0; i<=this.kernelSize; i++) {
            var indexPointer=this.pixelDomain[i]+this.startI;
            rTot+=capture.pixels[indexPointer];
            gTot+=capture.pixels[indexPointer+1];
            bTot+=capture.pixels[indexPointer+2];

            lumTemp+= (0.2126 * capture.pixels[indexPointer] + 0.7152 *capture.pixels[indexPointer+1] + 0.0722 *capture.pixels[indexPointer+2]);
             
        }
        this.avgLum=lumTemp/this.kernelSize;
        this.rAvg = rTot/this.kernelSize;
        this.gAvg = gTot/this.kernelSize;
        this.bAvg = bTot/this.kernelSize;
        
     
        // console.log(rAvg,gAvg,bAvg);
    }
    AssigningNewValues(){
       // this.PreProcess();            
            var newR = Math.random()*255;
            var newG = Math.random()*255;
            var newB = Math.random()*255;
           for (var i =0; i< this.pixelDomain.length; i++) {

                var indexPointer=this.pixelDomain[i]+this.startI;
                if(this.prevRavg!=this.rAvg && !firstEntry){
                    capture.pixels[indexPointer]=newR;
                    capture.pixels[indexPointer+1]=newG;
                    capture.pixels[indexPointer+2]=newB;
                }
                else{
                capture.pixels[indexPointer]=this.rAvg;
                capture.pixels[indexPointer+1]=this.gAvg;
                capture.pixels[indexPointer+2]=this.bAvg;
                    
                }
            this.prevRavg = this.rAvg;
        
        }
    firstEntry=false;
    }

}
function divideImage(){
    lstMatObsc=[];
    for (var WMover=0;WMover<=(4*w);WMover+=obscuraDistance){
        for (var HMover=0;HMover<int(h/kernel[1]);HMover+=1){
                    // Hmover is the height delta aka how much to move down aka kernel[1](4*width) loops it
                    var newpos= WMover+(4*width)*HMover*kernel[1]/2; 
                    var block = new MatrixObscura(newpos,kernel);
                    // console.log(newpos, WMover, width, HMover, kernel[1]);
                    lstMatObsc.push(block);
              }
                }
}

function setup() {
    var obscuraDistance=20;
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
 
    divideImage();
 
 
}



function toggleEffect(){
    effectEnabled=!effectEnabled;
    if(effectEnabled){
 
        document.getElementById("button").innerHTML = "Stop Fun";

    }
    else{
        document.getElementById("button").innerHTML = "Start Fun";
    }
}
// [r g b a] r g b a r g b a ...
function draw() {
 
     capture.loadPixels();
     var NewPix=capture.pixels;
 


   //Filter
   if(UpdateMatrix){
        console.log("will update");
        if(sliderVal<5){
            sliderVal=5;
        }
        var newKSize = sliderVal;
        
        console.log(newKSize);
        kernel=[newKSize,newKSize];
        obscuraDistance=2*(newKSize);

        // Recreate MatrixObscure
        divideImage();
        UpdateMatrix=false;
   }
 
    if (capture.pixels.length > 0) { // don't forget this!
        var total = 0;
        var i = 0;
        
        // console.log(lstMatObsc.length);
        if(effectEnabled){
        for (var i =0; i<lstMatObsc.length; i++) {
            // console.log("fami nani");

            var MatBlock=lstMatObsc[i];
        
             MatBlock.generateRegion();
             MatBlock.GettingAverageFromRegion();
             MatBlock.AssigningNewValues();
             MatBlock.pixelDomain=[];

        }
    }
      
        var rTot=0;
        var gTot=0;
        var bTot=0;

       
        sinx+=0.01;
        //
        pixToEdit=[];
        image(capture, 0, 0, w, h);
        capture.pixels=NewPix;
        capture.updatePixels();
        //console.log(capture.pixels);
   
         image(capture, 0, 0, w, h);
        //image(originalVideo,0,0,w,h);
        var n = w * h;
        var avg = int(total / n);

    }
}
