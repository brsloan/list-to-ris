const inText = "An Overview of Overlay Toolset https://pro.arcgis.com/en/pro-app/tool-reference/analysis/an-overview-of-the-overlay-toolset.htm\n\nHow Union works?- https://pro.arcgis.com/en/pro-app/tool-reference/analysis/how-union-analysis-works.htm\n\nIntersect https://pro.arcgis.com/en/pro-app/tool-reference/analysis/intersect.htm\n\nClip https://pro.arcgis.com/en/pro-app/tool-reference/analysis/clip.htm\n\nErase https://pro.arcgis.com/en/pro-app/tool-reference/analysis/erase.htm\n\nAppend https://pro.arcgis.com/en/pro-app/tool-reference/data-management/append.htm\n\nMerge https://pro.arcgis.com/en/pro-app/tool-reference/data-management/merge.htm\n\nDissolve https://pro.arcgis.com/en/pro-app/tool-reference/data-management/dissolve.htm\n\nSplit https://pro.arcgis.com/en/pro-app/tool-reference/analysis/split.htm\n\nSelect Layer by Location https://pro.arcgis.com/en/pro-app/tool-reference/data-management/select-by-location-within-a-layer.htm\n";

var originalDisplay = document.getElementById('original-display');
var htmlContainer = document.getElementById('html-display-container');
var htmlDisplay = document.getElementById('html-display');
var risDisplay = document.getElementById('ris-text');
var downloadRISBtn = document.getElementById('download-ris-btn');
var uploadBtn = document.getElementById('upload-txt-btn');
var references = [];

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

htmlContainer.addEventListener('keydown', function(e){
  if(e.key === 'b'){
    e.preventDefault();
    convertSelectedTo(refTypes.book);
  }
  else if(e.key === 'c'){
    e.preventDefault();
    convertSelectedTo(refTypes.chapter);
  }
  else if(e.key === 'w'){
    e.preventDefault();
    convertSelectedTo(refTypes.website);
  }
  else if(e.key === 'a'){
    e.preventDefault();
    convertSelectedTo(refTypes.article);
  }
  else if(e.key === 'v'){
    e.preventDefault();
    convertSelectedTo(refTypes.video);
  }
  else if(e.key === 'd'){
    e.preventDefault();
    convertSelectedTo(refTypes.data);
  }
});

document.getElementById('btn-book').onclick = function(){
  convertSelectedTo(refTypes.book);
};
document.getElementById('btn-chap').onclick = function(){
  convertSelectedTo(refTypes.chapter);
};
document.getElementById('btn-web').onclick = function(){
  convertSelectedTo(refTypes.website);
};
document.getElementById('btn-art').onclick = function(){
  convertSelectedTo(refTypes.article);
};
document.getElementById('btn-vid').onclick = function(){
  convertSelectedTo(refTypes.video);
};
document.getElementById('btn-data').onclick = function(){
  convertSelectedTo(refTypes.data);
};

document.getElementById('filename-input').addEventListener('keydown', function(e){
  if(e.key === "Enter"){
    downloadRIS();
  }
});

function convertSelectedTo(refType){
  var selectedOps = document.getElementById('ref-select').selectedOptions;
  var selectedVals = Array.from(selectedOps).map(({ value }) => value);
  selectedVals.forEach(function(val){
    references[val].type = refType;
  });
  updateConversionDisplays();

  selectedVals.forEach(function(val){
    document.querySelector('#ref-select [value="' + val + '"]').selected = true;
  });
  document.getElementById('ref-select').focus();
}

function updateConversionDisplays(){
    generateRefHtml();
    risDisplay.value = referencesToRIS(references);
}

updateConversionDisplays();

function generateRefHtml(){
  refreshReferences();

  htmlDisplay.innerHTML = '';
  var refSelect = document.createElement('select');
    refSelect.multiple = true;
    refSelect.id = 'ref-select';
    refSelect.name = 'ref-select';

  references.forEach(function(ref, i){
    var refOption = document.createElement('option');
    refOption.innerText = getFriendlyRefType(ref.type) + ' | ' + ref.title + " | " + ref.url;
    refOption.value = i;

    refSelect.appendChild(refOption);
  });

  htmlDisplay.appendChild(refSelect);
}

function refreshReferences(){
  if(references.length == 0)
    references = parseReferences(originalDisplay.value);
  else {
    var newRefs = parseReferences(originalDisplay.value);

    newRefs.forEach(function(ref){
      var oldMatch = references.find(function(oldRef){
        return oldRef.title == ref.title || oldRef.url == ref.url;
      });
      if(oldMatch){
        ref.type = oldMatch.type;
      }
    });

    references = newRefs;
  }
}

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
    var risText = referencesToRIS(references);
    var filename = sanitizeFilename(document.getElementById('filename-input').value) + '.ris';
    downloadTextFile(risText, filename);
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