var pixels;

let thresh = 10;

function processImg(){

    var uploader = document.querySelector('input[type=file]').files[0];
    var canvas = document.getElementById("cnvs");
    var ctx = canvas.getContext("2d"); 
    var reader = new FileReader();
    var img = new Image();

    reader.addEventListener("load", () => {
        img.src = reader.result;
    });

    if(uploader){
        reader.readAsDataURL(uploader);
    }

    img.onload = () => {
        document.getElementById('filename').innerText = uploader.name;

        canvas.width = img.width;
        canvas.height = img.height;


        ctx.drawImage(img, 0, 0, img.width, img.height);
        console.log("Image drawing complete.");
        
        pixels = ctx.getImageData(0, 0, img.width, img.height);

        // img.style.height = '256px';
        // img.style.width = 'auto';

        let lines = [];

        console.log(pixels.width);
        console.log(pixels.height);

        console.log(pixels.data.length);

        console.log(pixels.data);


        // horizontal lines

        for(let y = 0; y < pixels.height; y++){
            let hasLine = false;
            let lineStart = -1;
            for(let x = 0; x < pixels.width; x++){
                let pixLine = false;
                for(let k = 0; k < 4; k++){
                    if(Math.abs(getPixel(x, y, k) - getPixel(x, y+1, k)) >= thresh) {
                        pixLine = true;
                        break;
                    }
                }

                if(pixLine){
                    if(!hasLine){
                        hasLine = true;
                        lineStart = getX(x);
                    }
                } else {
                    if(hasLine){
                        lines.push({
                            dir: 1,
                            offset: getY(y) - 1,
                            start: lineStart,
                            end: getX(x)
                        });
                        if(lines.length >= 5000){
                            document.getElementById('filename').innerText = "Image too complex!";
                            return;
                        }

                        hasLine = false;
                    }
                }
            }

            if (hasLine) {
                lines.push({
                    dir: 1,
                    offset: getY(y) - 1,
                    start: lineStart,
                    end: getX(pixels.width)
                });

                hasLine = false;
            }
        }

        // vertical lines
        for(let x = 0; x < pixels.width; x++){
            let hasLine = false;
            let lineStart = -1;
            for(let y = pixels.height - 1; y >= 0; y--){
                let pixLine = false;
                for(let k = 0; k < 4; k++){
                    if(Math.abs(getPixel(x, y, k) - getPixel(x+1, y, k)) >= thresh) {
                        pixLine = true;
                        break;
                    }
                }

                if(pixLine){
                    if(!hasLine){
                        hasLine = true;
                        lineStart = getY(y);
                    }
                } else {
                    if(hasLine){
                        lines.push({
                            dir: 0,
                            offset: getX(x) + 1,
                            start: lineStart-1,
                            end: getY(y)-1
                        });

                        if(lines.length >= 5000){

                            document.getElementById('filename').innerText = "Image too complex!";
                            return;
                        }

                        hasLine = false;
                    }
                }
            }
            if (hasLine) {
                lines.push({
                    dir: 0,
                    offset: getX(x) + 1,
                    start: lineStart-1,
                    end: getY(pixels.height)-1
                });

                hasLine = false;
            }
        }


        console.log("DONE! Created " + lines.length + " lines.");
        let output = document.querySelector("#output");

        output.innerHTML = "";

        lines.forEach((line) => {
            output.innerHTML += getLineEquation(line);
        });

        output.select();
        document.execCommand("copy");



    };
}

function getLineEquation(line){
    if(line.dir == 0){

        return "x = " + line.offset + "\\left\\{" + line.start + "\\le y \\le" + line.end + "\\right\\}\n";
        
    } else {

        return "y = " + line.offset + "\\left\\{" + line.start + "\\le x \\le" + line.end + "\\right\\}\n";

    }
} 

function getPixel(i, j, c){
    
    return pixels.data[j * 4 * pixels.width + 4 * i + c];
}

function getX(x) { return x - pixels.width/2; }
function getY(y) { return -y + pixels.height/2; }