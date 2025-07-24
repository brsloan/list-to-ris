const inText = "An Overview of Overlay Toolset https://pro.arcgis.com/en/pro-app/tool-reference/analysis/an-overview-of-the-overlay-toolset.htm\n\nHow Union works?- https://pro.arcgis.com/en/pro-app/tool-reference/analysis/how-union-analysis-works.htm\n\nIntersect https://pro.arcgis.com/en/pro-app/tool-reference/analysis/intersect.htm\n\nClip https://pro.arcgis.com/en/pro-app/tool-reference/analysis/clip.htm\n\nErase https://pro.arcgis.com/en/pro-app/tool-reference/analysis/erase.htm\n\nAppend https://pro.arcgis.com/en/pro-app/tool-reference/data-management/append.htm\n\nMerge https://pro.arcgis.com/en/pro-app/tool-reference/data-management/merge.htm\n\nDissolve https://pro.arcgis.com/en/pro-app/tool-reference/data-management/dissolve.htm\n\nSplit https://pro.arcgis.com/en/pro-app/tool-reference/analysis/split.htm\n\nSelect Layer by Location https://pro.arcgis.com/en/pro-app/tool-reference/data-management/select-by-location-within-a-layer.htm\n";

var originalDisplay = document.getElementById('original-display');
var htmlDisplay = document.getElementById('html-display');
var risDisplay = document.getElementById('ris-text');
var downloadRISBtn = document.getElementById('download-ris-btn');
var uploadBtn = document.getElementById('upload-txt-btn');

originalDisplay.value = inText;

originalDisplay.addEventListener('keyup', function(e){
    updateConversionDisplays();
});

originalDisplay.addEventListener('keydown', function(e){
    if(e.key === 'Tab'){
        e.preventDefault();
        var selectPoint = e.target.selectionStart;
        originalDisplay.value = originalDisplay.value.slice(0,e.target.selectionStart) + '\t' + originalDisplay.value.slice(e.target.selectionStart);
        e.target.selectionStart = selectPoint + 1;
        e.target.selectionEnd = selectPoint + 1;
    }
});

function updateConversionDisplays(){
    //htmlDisplay.innerHTML = convertMdfToHtml(originalDisplay.value);
    //mdDisplay.value = convertMdfToMd(originalDisplay.value);
    risDisplay.value = txtToRIS(originalDisplay.value);
}

updateConversionDisplays();


downloadRISBtn.onclick = function(e){
    downloadRIS();
}

uploadBtn.onclick = function(e){
    uploadTextFile(function(text){
        originalDisplay.value = text;
        updateConversionDisplays();
    });
}

function downloadRIS(){
    var risText = txtToRIS(originalDisplay.value);
    downloadTextFile(risText, 'convertedRefs.ris');
}

function uploadTextFile(callback){
  var fileInput = document.createElement('input');
  fileInput.id = 'fileInput';
  fileInput.type = 'file';
  fileInput.accept = '.txt';

  fileInput.addEventListener('change', function(e){
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      callback(reader.result);
    }

    if(file && file.type && file.type.startsWith('text/')){
      reader.readAsText(file);
    }
  });

  fileInput.click();
}