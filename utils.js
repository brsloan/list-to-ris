function checkIfDuplicateExists(arr) {
    if(arr && arr.length > 0)
        return new Set(arr).size !== arr.length
}

function escapeRegExp(string) {
  const specialCharacters = /[.*+?^${}()|[\]\\]/g; 
  return string.replace(specialCharacters, '\\$&');
}

function downloadTextFile(text, filename) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

  function sanitizeFilename(str){
    try{
      const lengthLimit = 100;
      var illegalRe = /[\/\?<>\\:\*\|":]/g;
      var controlRe = /[\x00-\x1f\x80-\x9f]/g;
      var reservedRe = /^\.+$/;
      var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;

      var sanitized = str.replace(illegalRe,'').replace(controlRe,'').replace(reservedRe,'').replace(windowsReservedRe, '');

      if(sanitized.length > lengthLimit)
        sanitized = sanitized.slice(0,lengthLimit);

      return sanitized;
    }
    catch(err){
      console.log(err);
    }
  }