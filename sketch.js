
var originalVideo;
var pg;
var kernel=[40,40];
var kernelSize=kernel[0]*kernel[1];
var pixToEdit=[];
var capture;
var Kcount=0;
var w = 640;
var h = 480;
var sinx=0.000;
var savedRandomR = Math.floor(Math.random() * 255);
var savedRandomG = Math.floor(Math.random() * 255);
var savedRandomB = Math.floor(Math.random() * 255);

var lstMatObsc=[];

class MatrixObscura{
    constructor(startI,kernel){

        this.startI=startI;
        this.kernel=kernel;
        this.kernelWidth = kernel[0];
        this.kernelHeight = kernel[1];
        this.kernelSize=kernel[0]*kernel[1];

        this.pixelDomain=[];

        this.rAvg=0;
        this.gAvg=0;
        this.bvg=0;

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

        for (var i =0; i<=this.kernelSize; i++) {
            var indexPointer=this.pixelDomain[i]+this.startI;
            rTot+=capture.pixels[indexPointer];
            gTot+=capture.pixels[indexPointer+1];
            bTot+=capture.pixels[indexPointer+2];
        }
        this.rAvg = rTot/this.kernelSize;
        this.gAvg = gTot/this.kernelSize;
        this.bAvg = bTot/this.kernelSize;
        
     
        // console.log(rAvg,gAvg,bAvg);
    }
    AssigningNewValues(){
        
           for (var i =0; i< this.pixelDomain.length; i++) {
                var indexPointer=this.pixelDomain[i]+this.startI;
                capture.pixels[indexPointer]=this.rAvg;
                capture.pixels[indexPointer+1]=this.gAvg;
                capture.pixels[indexPointer+2]=this.bAvg;
        }

    }

}
function setup() {
    var obscuraDistance=40;
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
       for (var WMover=0;WMover<=(4*w);WMover+=obscuraDistance){
            for (var HMover=0;HMover<int(h/kernel[1]);HMover+=1){
                        // Hmover is the height delta aka how much to move down aka kernel[1](4*width) loops it
                        var newpos= WMover+(4*width)*(HMover*kernel[1]); 
                        var block = new MatrixObscura(newpos,kernel);
                        lstMatObsc.push(block);
                  }
                    }
       //         var block = new MatrixObscura(i,kernel);
       // lstMatObsc.push(block);
    
    console.log(lstMatObsc.length);
}

// [r g b a] r g b a r g b a ...
function draw() {

    // pg.background(100);
   //image(capture, 0, 0, w, h);
     capture.loadPixels();
     var NewPix=capture.pixels;
   //  originalVideo.loadPixels();


   //Filter


   //
// console.log(capture.pixels.length);
    if (capture.pixels.length > 0) { // don't forget this!
        var total = 0;
        var i = 0;
        
        // console.log(lstMatObsc.length);
        for (var i =0; i<lstMatObsc.length; i++) {
            // console.log("fami nani");
            var MatBlock=lstMatObsc[i];
        
            MatBlock.generateRegion();
            MatBlock.GettingAverageFromRegion();
            MatBlock.AssigningNewValues();
            MatBlock.pixelDomain=[];

        }
      
        var rTot=0;
        var gTot=0;
        var bTot=0;

        // for (var i =0; i<=kernelSize; i++) {
        //     var indexPointer=pixToEdit[i]+start;
        //     rTot+=capture.pixels[indexPointer];
        //     gTot+=capture.pixels[indexPointer+1];
        //     bTot+=capture.pixels[indexPointer+2];
        // }
        // var rAvg = rTot/kernelSize;
        // var gAvg = gTot/kernelSize;
        // var bAvg = bTot/kernelSize;

     
        // for (var i =0; i< pixToEdit.length; i++) {
        //     var indexPointer=pixToEdit[i]+start;
        //     capture.pixels[indexPointer]=rAvg;
        //     capture.pixels[indexPointer+1]=gAvg;
        //     capture.pixels[indexPointer+2]=bAvg;
        // }

        // for (var y = 0; y < h; y++) {
        //     for (var x = 0; x < w; x++) {
                
        //         NewPix[i]+= (Math.sin(sinx)*50);
        //           NewPix[i+1]+=Math.sin(sinx)*50;
        //            NewPix[i+2]+=Math.sin(sinx)*50;

        //           // capture.pixels[i+3]-=savedRandomB;
  

        //         // console.log(i);
        //         var redValue = capture.pixels[i];
        //         total += redValue;
        //         i += 4;
        //     }
        // }
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
