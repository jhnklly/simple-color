const TOLERANCE = 5;
//var newColor = d3.color("hsla(120, 50%, 20%, 0.4)");
var newColor = d3.hsl("#00AAFF");
updateSliders(newColor);

d3.select('#old-color').style('background', newColor);
d3.select('#new-color').style('background', '#0af');

d3.selectAll('.colorpicker .slider').on('input',function(d){
  console.log(this.value);
});

d3.select('#hue').on('input',function(d){
  if ( Math.abs(newColor.h - this.value) >= TOLERANCE ) {
    newColor.h = this.value;
    // console.log(newColor);
    d3.select('#new-color').style('background', newColor);
    d3.select('#hue-number').attr('value',this.value);
    updateSliders(newColor);
  }
});

d3.select('#saturation').on('input',function(d){
  if ( Math.abs(newColor.s - this.value/100) >= TOLERANCE/100 ) {
    newColor.s = this.value/100;
    d3.select('#new-color').style('background', newColor);
    d3.select('#saturation-number').attr('value',this.value);
    updateSliders(newColor);
  }
});

d3.select('#lightness').on('input',function(d){
  if ( Math.abs(newColor.l - this.value/100) >= TOLERANCE/100 ) {
    newColor.l = this.value/100;
    d3.select('#new-color').style('background', newColor);
    d3.select('#lightness-number').attr('value',this.value);
    updateSliders(newColor);
  }
});


d3.select('#hue')
  .style('background', "linear-gradient(to right, hsla(0, 100%, 50%, 1),hsla(10, 100%, 50%, 1),hsla(20, 100%, 50%, 1),hsla(30, 100%, 50%, 1),hsla(40, 100%, 50%, 1),hsla(50, 100%, 50%, 1),hsla(60, 100%, 50%, 1),hsla(70, 100%, 50%, 1),hsla(80, 100%, 50%, 1),hsla(90, 100%, 50%, 1),hsla(100, 100%, 50%, 1),hsla(110, 100%, 50%, 1),hsla(120, 100%, 50%, 1),hsla(130, 100%, 50%, 1),hsla(140, 100%, 50%, 1),hsla(150, 100%, 50%, 1),hsla(160, 100%, 50%, 1),hsla(170, 100%, 50%, 1),hsla(180, 100%, 50%, 1),hsla(190, 100%, 50%, 1),hsla(200, 100%, 50%, 1),hsla(210, 100%, 50%, 1),hsla(220, 100%, 50%, 1),hsla(230, 100%, 50%, 1),hsla(240, 100%, 50%, 1),hsla(250, 100%, 50%, 1),hsla(260, 100%, 50%, 1),hsla(270, 100%, 50%, 1),hsla(280, 100%, 50%, 1),hsla(290, 100%, 50%, 1),hsla(300, 100%, 50%, 1),hsla(310, 100%, 50%, 1),hsla(320, 100%, 50%, 1),hsla(330, 100%, 50%, 1),hsla(340, 100%, 50%, 1),hsla(350, 100%, 50%, 1),hsla(360, 100%, 50%, 1))")
  ;


function updateSliders(d3color) {
  // Update hex code
  d3.select('#new-hex').attr('value', rgb2hex(d3color.toString()) );


  // Ramp saturation from 0 to 100
  var fromColor, toColor, gradientColor;
  var satFrom = `hsla(${d3color.h}, 0%, ${100*d3color.l}%, 1)`;
  var satTo = `hsla(${d3color.h}, 100%, ${100*d3color.l}%, 1)`;
  var satGrad = `linear-gradient(to right, ${satFrom}, ${satTo})`;
  d3.select('#saturation').style('background', satGrad);

  // Ramp lightness from 0 to 100
  fromColor = `hsla(${d3color.h}, ${100*d3color.s}%, 0%, 1)`;
  midColor = `hsla(${d3color.h}, ${100*d3color.s}%, 50%, 1)`;
  toColor = `hsla(${d3color.h}, ${100*d3color.s}%, 100%, 1)`;
  gradientColor = `linear-gradient(to right, ${fromColor}, ${midColor}, ${toColor})`;
  d3.select('#lightness').style('background', gradientColor);

  // Ramp hue from 0 to 100
  fromColor = `hsla(0, ${100*d3color.s}%, ${100*d3color.l}%, 1)`;
  midColor = `hsla(90, ${100*d3color.s}%, ${100*d3color.l}%, 1)`;
  toColor = `hsla(180, ${100*d3color.s}%, ${100*d3color.l}%, 1)`;
  // gradientColor = `linear-gradient(to right, ${fromColor}, ${midColor}, ${toColor})`;
  gradientColor = "linear-gradient(to right ";
  for (var i = 0; i <= 360; i = i + 10) {
    gradientColor += `, hsla(${i}, ${100*d3color.s}%, ${100*d3color.l}%, 1)`;
  }
  gradientColor += ") ";
  d3.select('#hue').style('background', gradientColor);

}

function rgb2hex(rgb){
  // ignores alpha
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}
