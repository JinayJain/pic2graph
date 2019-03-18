var pixels;

let thresh = 50;

function processImg(){

    var uploader = document.querySelector('input[type=file]').files[0];
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d"); 
    var reader = new FileReader();
    var img = document.getElementById("preview");

    reader.addEventListener("load", () => {
        img.src = reader.result;
    });

    if(uploader){
        reader.readAsDataURL(uploader);
    }

    img.onload = () => {
        document.getElementById('filename').innerText = uploader.name;

        ctx.drawImage(img, 0, 0);
        pixels = ctx.getImageData(0, 0, img.width, img.height);

        img.style.height = '256px';
        img.style.width = 'auto';

        let lines = [];

        console.log(pixels.width);
        console.log(pixels.height);

        console.log(pixels.data.length);

        for(let x = 0; x < pixels.width; x++){ // TODO change
            for(let y = 0; y < pixels.height; y++){
                let hasVert = false;
                let hasHoriz = false;


                for(let k = 0; k < 4; k++){
                    if(Math.abs(getPixel(x, y, k) - getPixel(x+1, y, k)) > thresh) hasVert = true;
                    if(Math.abs(getPixel(x, y, k) - getPixel(x, y+1, k)) > thresh) hasHoriz = true;
                }

                let newX = x - pixels.width/2;
                let newY = -y + pixels.height/2;

                if(hasVert){
                    lines.push({
                        dir: 0,
                        offset: newX+1,
                        start: newY-1,
                        end: newY
                    });
                }

                if(hasHoriz){
                    lines.push({
                        dir: 1,
                        offset: newY-1,
                        start: newX,
                        end: newX+1
                    });
                }

                

            }
        }

        console.log("DONE! Created " + lines.length + " lines.");
        let output = document.querySelector("#output");

        output.innerHTML = "";

        lines.forEach((line) => {
            output.innerHTML += getPrint(line);
        });

        output.select();
        document.execCommand("copy");



    };
}

function getPrint(line){
    if(line.dir == 0){

        return "x = " + line.offset + "\\left\\{" + line.start + "\\le y \\le" + line.end + "\\right\\}\n";
        
    } else {

        return "y = " + line.offset + "\\left\\{" + line.start + "\\le x \\le" + line.end + "\\right\\}\n";

    }
} 

function getPixel(i, j, c){
    return pixels.data[j * 4 * pixels.width + 4 * i + c];
}