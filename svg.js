const config = {
    target: $(".circle"),
    line: $(".line"),
    delay: 40 // enter zero for live resizing
  }

  let maps = {
    1:[2],
    2:[4,12],
    3:[4,5,6,7,8,9,11],
    4:[5,6,7,8,10,11,14],
    5:[6,8,9,11,12,14],
    6:[11,12],
    7:[11],
    8:[9,11],
    9:[11,12,14],
    10:[11],
    11:[14],
    12:[13],
  };
  
  let links = [];
  

  function conntionInfo (maps, links) {
    while(links.length > 0) {
      x = links.pop();
  }
  links.push(document.getElementById("pair1"));
  links.push(document.getElementById("pair3"));
  links.push(document.getElementById("pair7"));
  links.push(document.getElementById("pair10"));
  }

  function lineDistance(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};

function drawLine(a, b, line) {
  var pointA = $(a).offset();
  var pointB = $(b).offset();
  var pointAcenterX = $(a).width() / 2;
  var pointAcenterY = $(a).height() / 2;
  var pointBcenterX = $(b).width() / 2;
  var pointBcenterY = $(b).height() / 2;
  var angle = Math.atan2(pointB.top - pointA.top, pointB.left - pointA.left) * 180 / Math.PI;
  var distance = lineDistance(pointA.left, pointA.top, pointB.left, pointB.top);

  // INFO
  $('.info .point-a').text('Point-A: Left: ' + pointA.left + ' Top: ' + pointA.top);
  $('.info .point-b').text('Point-B: Left: ' + pointB.left + ' Top: ' + pointB.top);
  $('.info .angle').text('Angle: ' + angle);
  $('.info .distance').text('Distance: ' + distance);

  // Set Angle
  $(line).css('transform', 'rotate(' + angle + 'deg)');

  // Set Width
  $(line).css('width', distance + 'px');
                  
  // Set Position
  $(line).css('position', 'absolute');
  if(pointB.left < pointA.left) {
    $(line).offset({top: pointA.top + pointAcenterY, left: pointB.left + pointBcenterX});
  } else {
    $(line).offset({top: pointA.top + pointAcenterY, left: pointA.left + pointAcenterX});
  }
}

  function connect(div1, div2, color, thickness) { // draw a line connecting elements
    
    var t1 = div1.offsetTop;
    var t2 = div2.offsetTop;
    var l1 = div1.offsetLeft;
    var l2 = div2.offsetLeft;
    var w1 = div1.offsetWidth;
    var w2 = div2.offsetWidth;
    var h1 = div1.offsetHeight;
    var h2 = div2.offsetHeight;

    // bottom right
    var x1 = l1 + w1 + 450;
    var y1 = t1 + h1 + 100;
    // top right
    var x2 = l2 + w2 + 450;
    var y2 = t2 + 100;
    // distance
    var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
    // make hr
    var htmlLine = "<div style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
    //
    // alert(htmlLine);
    document.body.innerHTML += htmlLine;
}

  const drawBetweenObjects = {
    //cmake the line
    makeLine: function(line, div1, div2) {
      //console.log("makeLines", div1, div2, typeof(div1));
      var className = div1.id + div2.id;
      if ( className.includes("undefined") !== true ) { //error check
        $(line).clone().addClass('deleteMe').addClass(className).removeClass("original").insertAfter(line);
        //calculations (for legibility, these are separte vars)
        //console.log("Left ", $(div1).width());
        var x1 = $(div1).offset().left + $(div1).width()/2;
        var y1 = $(div1).offset().top + $(div1).height()/2;
        var x2 = $(div2).offset().left + $(div2).width()/2;
        var y2 = $(div2).offset().top + $(div2).height()/2;
        //console.log("Class Name ", className);
        $("."+className).attr('x1',x1).attr('y1',y1).attr('x2',x2).attr('y2',y2); //svg attributes
      } else { console.error("undefined object") }
     },
    findLines: function(mappings) {
      $(".deleteMe").remove(); //remove last set of lines
      for (let keyCandle in mappings) {
        //console.log("Candle Number ", keyCandle);
        let nextCandles = mappings[keyCandle];
        for (let i = 0; i < nextCandles.length; i++) {
          var candle1 = document.getElementById("pair"+keyCandle);
          var candle2 = document.getElementById("pair"+nextCandles[i]);
            drawBetweenObjects.makeLine(config.line, candle1, candle2);   //args order - line, div1 and div2 - the next div.
          }
        }
     },
    init: function() {
      drawBetweenObjects.findLines( maps );
      
      
      //give resizing time to happen
      var resizeId;
      $(window).resize(function() {
          clearTimeout(resizeId);
          if (config.delay !== 0) {
            resizeId = setTimeout(doneResizing, config.delay);
          } else {
            drawBetweenObjects.findLines( config.target );
          }
      });
      function doneResizing(){
        //connect(document.getElementById("pair1"), document.getElementById("pair6"), "lightgray", "2");
        drawBetweenObjects.findLines( maps );
      }
    }
  }
  
  conntionInfo ( maps, links); 
  document.body.classList.toggle("dark-mode");
  console.log("Before Init");
  drawBetweenObjects.init();
  
  // umimportant ugly scripting
  // this just randomizes the points
  // It's pretty ugly.
  $(".btn").click(function() {
      console.log("Clicked");
    var heightMax = $(document).height(),
        widthMax = $(document).width();
    function widthCalc () {
      return Math.floor( Math.random() * widthMax );
    }
    function heightCalc() {
      return Math.floor( Math.random() * heightMax )
    }
    $("#one").css({  left: widthCalc(),  top: heightCalc() });
    $("#four").css({ left: widthCalc(),  top: heightCalc() });
    $("#three").css({ right: widthCalc(), top: heightCalc() });
    $("#two").css({ right: widthCalc(), top: heightCalc()  });
     drawBetweenObjects.findLines( config.target );
  });
