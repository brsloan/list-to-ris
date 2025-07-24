const refTypes = {
    book: 'BOOK',
    chapter: 'CHAP',
    website: 'ELEC',
    article: 'JOUR',
    video: 'MULTI',
    data: 'DATA'
}

const risTags = {
    type: 'TY',
    author: 'AU',
    pubYear: 'PY',
    title: 'T1',
    journalTitle: 'T2',
    publisher: 'PB',
    url: 'UR',
    endOfReference: 'ER'
}


function txtToRIS(rawText){
    var urlRegx = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    var lines = rawText.split(/\r\n|\n\n|\n|\r/);
    var ris = '';

    lines.forEach(line => {
      if(line != ''){
        let url = null;
        let urlResults = urlRegx.exec(line);
        if(urlResults && urlResults.length > 0)
          url = urlResults[0];
        let title = url ? line.replace(url, '') : line;
        ris += getRIS(refTypes.website, title, url);
      }
    });

    return ris;
};

function getRIS(refType, title, url = null, author = null, publisher = null){
    var ris = '';
    const dash = '  - ';

    ris += risTags.type + dash + refType + '\n';
    ris += risTags.title + dash + title + '\n';
    if(url)
        ris += risTags.url + dash + url + '\n';
    if(author)
        ris += risTags.author + dash + author + '\n';
    if(publisher)
        ris += risTags.publisher + dash + author + '\n';

    ris += risTags.endOfReference + dash + '\n';

    return ris;
}

