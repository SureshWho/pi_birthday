/*
Usage: Position.ellipse(n, rx, ry, so, wh, idd, cls, cw);

where n = number of divs,
      rx = radius along X-axis,
      ry = radius along Y-axis,
      so = startOffset,
      wh = width/height of divs,
      idd = id of main div(ellipse),
      cls = className of divs;
      cw = clockwise(true/false)
*/
let candles = 14;

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

var Position = {
    ellipse: function(n, rx, ry, so, wh, idd, cls, cw) {
      var m = document.createElement('div'),
        ss = document.styleSheets;
      //ss[0].insertRule('#' + idd + ' { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); border-radius: 50%; box-shadow: inset 0 0 ' + wh + 'px ' + wh / 4 + 'px black; background: rgba(0, 0, 0, 0.2); width: ' + String((rx * 2) + wh) + 'px; height: ' + String((ry * 2) + wh) + 'px; }', 1);
      ss[0].insertRule('.' + cls + '{ position: absolute; background: black; color: papayawhip; text-align: center; font-family: "Open Sans Condensed", sans-serif; border-radius: 50%; transition: transform 0.2s ease; width: ' + wh + 'px; height: ' + wh + 'px; line-height: ' + wh + 'px;}', 1);
      ss[0].insertRule('.' + cls + ':hover { transform: scale(1.2); cursor: pointer; background: rgba(0, 0, 0, 0.8); }', 1);
      m.id = idd;
   
      for (var i = 0; i < n; i++) {
        var c = document.createElement('div');
        c.className = cls;
        c.id = "pair"+String(i+1);
        c.innerHTML = i + 1;
        c.style.top = String(ry + -ry * Math.cos((360 / n / 180) * (i + so) * Math.PI)) + 'px';
        c.style.left = String(rx + rx * (cw ? Math.sin((360 / n / 180) * (i + so) * Math.PI) : -Math.sin((360 / n / 180) * (i + so) * Math.PI))) + 'px';
        m.appendChild(c);      
      }
      console.log(m);
      document.body.appendChild(m);
      console.log(document.getElementById("pair1"));
      console.log(m);
    }
  }
  
  Position.ellipse(candles, 250, 250, 0, 10, 'main', 'circle', true);
  

