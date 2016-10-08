
/*global $*/
//(function() {
//var glossaryURL = "http://www.filltext.com/?callback=?";
var selctedDefination = getRandomInt(1, 99);
var cdnURL = 'https://api.cdnjs.com/libraries/';

/*
var sampleJSON = "https://jsonplaceholder.typicode.com/posts";

$.ajax({
  url: sampleJSON,
  method: 'GET'
}).then(function(data) {
  console.log(data);
});

*/

/*$.ajax({
    url : cdnURL,
     method: 'GET',
    success: function (data) {
        console.log(JSON.stringify(data));
    }
    
})*/

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isValueContains(originalVal, userVal) {
  return originalVal.indexOf(userVal) !== -1;

}

function arryContains(arr, arrVal, objValue) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][arrVal] === objValue) {
      return true;
    }
  }
  return false;
}

// format string and and heightlitht the matching keywords 
function formatSearchString(defString, keywordString) {
  var defString = defString;
  var keywordString = keywordString;
  var regex = new RegExp('(^|\)(' + keywordString + ')(\|$)', 'ig');
  var resultString = defString.replace(regex, '$1<b>$2</b>$3');
  return resultString;
}

var glossaryObj = {
  glossaryURL: cdnURL,
  //    glossaryURL: glossaryURL,
  glossaryData: [],
  alphabates: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  init: function() {
    this.cacheDOM();
    this.loadGlossaryData(cdnURL, glossaryObj.loadGlossaryUI);
    glossaryObj.loadEventListerers();
  },
  cacheDOM: function() {

    $glossaryListDIV = $('#glossaryList'),
      $glossarySearchResultsLIST = $('#glossarySearchResults'),
      $glossaryAlphbatesStripLIST = $('#glossaryAlphbatesStrip');
  },

  loadGlossaryData: function(url, fn) {
    /*        $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: {
                    'rows': 99,
                    'definationTitle': '{firstName}',
                    'definationDescription': '{lorem|15}',
                    'isSelected': '{bool|false}'
                },
                success: function (data) {
                    console.log(data);
                    glossaryObj.glossaryData = [];

                    $.each(data, function (i, item) {
                        glossaryObj.glossaryData.push({
                            definationGroup: item.definationTitle.charAt(0),
                            definationTitle: item.definationTitle,
                            definationDescription: item.definationDescription,
                        });
                    });
                    fn();
                },
                error: function () {
                    $('#records').text('error');
                }
            });*/

    $.ajax({
      url: url,
      type: 'GET',
      // dataType: 'json',
      success: function(data) {
        //console.log(data.results);
        glossaryObj.glossaryData = [];

        $.each(data.results, function(i, item) {
          if (isNaN(parseInt(item.name)) && (item.name.charAt(0).toUpperCase()) !== 'B' && (item.name.charAt(0).toUpperCase()) !== 'F') {
            glossaryObj.glossaryData.push({
              definationGroup: item.name.charAt(0).toUpperCase(),
              definationTitle: item.name,
              definationDescription: item.latest,
              definationId: i
            });
          }
        });
        fn();
      },
      error: function() {
        $('#errorDIV').text('error');
      }
    });

  },
  loadGlossaryUI: function() {
    glossaryObj.loadGlossaryList();
    glossaryObj.loadAlpabatesStrip();

  },
  loadGlossaryList: function() {
    var alphabatesArray = this.alphabates.split(''),
      glossaryDataArray = this.glossaryData,

      glossaryListHTML = '';

    $glossaryListDIV.html('');
    for (i = 0; i < alphabatesArray.length; i++) {
      glossaryListHTML += '<h3>' + alphabatesArray[i] + '</h3><ul id="' + alphabatesArray[i] + '_glossaryList"></ul>';
    };

    $glossaryListDIV.append(glossaryListHTML);

    for (i = 0; i < glossaryDataArray.length; i++) {
      $('#' + glossaryDataArray[i].definationGroup + '_glossaryList').append('<li><a href="#" id="' + glossaryDataArray[i].definationId + '_glossaryDefinationId_' + glossaryDataArray[i].definationGroup + '">' + glossaryDataArray[i].definationTitle + '</a></li>');
    };

    $glossaryListDIV.find()
    $('#glossaryList li:eq(' + selctedDefination + ') a').focus().click();

    //glossaryObj.focusSelectedDefination($('#glossaryList li.selected'));
    // glossaryObj.focusSelectedDefination( $glossaryListDIV +'li.selected');
    glossaryObj.focusSelectedDefination($glossaryListDIV.find('li.selected'));

  },

  loadAlpabatesStrip: function() {
    var alphabatesArray = glossaryObj.alphabates.split(''),
      alpabatesStripHTML = '',
      disabledClass = '';
    alphabatesArray.forEach(function(name) {
      disabledClass = arryContains(glossaryObj.glossaryData, 'definationGroup', name) ? "" : "disabled";
      alpabatesStripHTML += '<li class="' + disabledClass + '"><a href="#" id="' + name + '_alphabate">' + name + '</a></li>';
    });
    $glossaryAlphbatesStripLIST.html(alpabatesStripHTML);

  },
  loadGlossaryDefination: function(idNumber) {
    var glossaryText;
    glossaryObj.glossaryData.forEach(function(key, index) {
      if (key.definationId === idNumber) {
        glossaryText = key.definationDescription;
      }
    });
    return glossaryText;
  },
  selectGlossaryDefination: function() {
    console.log(this);
    var id = this.id,
      idNumber = parseInt(id),
      alphabate = id.substring(id.length - 1),
      description = glossaryObj.loadGlossaryDefination(idNumber);

    $('.glossary-explanation').text(description);
    $('#glossaryList li , #glossaryAlphbatesStrip li ').removeClass('selected');
    $('#' + idNumber + '_glossaryDefinationId_' + alphabate).closest('li').addClass('selected');
    $('#' + alphabate + '_alphabate').closest('li').addClass('selected');

    glossaryObj.focusSelectedDefination($('#glossaryList li.selected'));

    return false;

  },
  selectGlossaryAlphabate: function() {
    //console.log(this);
    var alphabate = (this.id).charAt(0);
    $('#' + alphabate + '_glossaryList li:first a').click();

    glossaryObj.focusSelectedDefination($('#' + alphabate + '_glossaryList li:first'));
    return false;
  },
  focusSelectedDefination: function(selectedElement) {
    $glossaryListDIV.animate({
      scrollTop: selectedElement.offset().top - $glossaryListDIV.offset().top + $glossaryListDIV.scrollTop()
    });
  },
  loadSearchDropDown: function() {
    var searchInputValue = $(this).val();

    if (searchInputValue.length > 2) {

      $glossarySearchResultsLIST.html('')
      var resultListHTML = '';

      glossaryObj.glossaryData.forEach(function(key, index) {

        if (isValueContains(key.definationTitle.toLowerCase(), searchInputValue.toLowerCase())) {
          resultListHTML += '<li><a href="#" id="' + glossaryObj.glossaryData[index].definationId + '_glossarySearchItem_' + glossaryObj.glossaryData[index].definationGroup + '">' + formatSearchString(key.definationTitle, searchInputValue) + '</a></li>';
        }

      });

      $glossarySearchResultsLIST.append(resultListHTML).slideDown();
    } else {
      $glossarySearchResultsLIST.html('').slideUp();
    }
  },
  resetSearchDropDown: function() {

  },
  loadEventListerers: function() {
    $('#inputGlossarySearch').on('input', glossaryObj.loadSearchDropDown);
    $('#glossarySearchResults').on('click', 'a', glossaryObj.selectGlossaryDefination);
    $glossaryListDIV.on('click', 'a', glossaryObj.selectGlossaryDefination);
    $glossaryAlphbatesStripLIST.on('click', 'a', glossaryObj.selectGlossaryAlphabate);
  }

  // show defination 
  //onclick="glossaryObj.loadGlossaryDefination(' + i + ')"
}

glossaryObj.init();

//})();

// Requirement 
/*
38
1. Javascript - Load & display Glossary List on UI alphabatically    : 4 hrs   
2. group data alphabatically                 : 4 hrs 
3. Glossary UI Structure - HTML - 5hrs
4. Glossary UI Structure - CSS - 8 hrs
5. Glossary  search -  if user presses 3 keyword Search - 8 hrs
6. Display glosary-Alphabates strip  - 3 hrs
7. Keyboard Interactions - 6



3. load glossary titles  alphabatically   : 3 hrs 
4. select glossaryItem and display info   : 2 hrs 
4. clicking on  glossary item to select it  : 2 hrs
5. display glosaryAlphabates strip  :   3 hrs
6. heighlight the glosaryAlphabates strip 3 hrs 
6. glosaryAlphabates strip click :  3 hrs 
7. search group  if user presses 3 keyword  show fuzzy search:  8 hrs 
8. on clicking of fuzzy searh item select glossary item  4 hrs


8 hrs
// top bottom keydown functionality for glossary list
//  right left keypress for alphabates strip




- System displays “Glossary” as a menu option in the left-hand navigation.
- displays all the unique glossary terms alphabetically
- displays A-Z strip/ribbon 
- e A-Z strip/ribbon.

*/