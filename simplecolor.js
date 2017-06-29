/*
Usage:
var simpleColorPicker = sc(picker, target);
d3.select("#foo").call(simpleColorPicker);
*/
var sc = window.sc || {};
window.sc = sc;

// sc.simplecolor =

function simplecolor(pickerSelector, targetSelector) {
    var picker = d3.select(pickerSelector),
        target = d3.select(targetSelector),
        TOLERANCE = 5, // percent or degrees
        oldColorHex = target.style('background-color'),
        newColorObj
        ;

    var newColor = d3.hsl("#00AAFF");
    updateSliders(newColor);

    if (!d3.hsl(oldColorHex).h) oldColorHex = "#cccccc";
    newColorObj = d3.hsl(oldColorHex);
    if (!newColorObj.h) newColorObj.h = 0;

    console.log(picker);
    console.log(target);
    console.log(oldColorHex);
    console.log(newColorObj);


    // Make the colorpicker container, sliders, inputs, swatches, hex display
    // Append it to the pickerSelector
    var sccp = picker.append('div')
        .attr('class', 'sc-colorpicker')
        ;

    var scSliders = ["hue", "saturation", "lightness", "alpha"];
    var suffixes = {
        "hue": "°H",
        "saturation": "%S",
        "lightness": "%L",
        "alpha": "α"
    };

    var scRows = sccp.selectAll('div')
        .data(scSliders)
        .enter()
        .append('div')
            .attr('class','sc-flex-row')
        ;

    var scSliders = scRows
        .append('input')
            .attr('class', 'sc-slider sc-grow')
            .attr('id', (d) => d)
            .attr('type', 'range')
            .attr('value', 50)
            .attr('step', TOLERANCE)
        ;

    scRows
        .append('input')
            .attr('class', 'sc-number')
            .attr('id', (d) => {
                return d + "-number";
            })
            .attr('type', 'text')
            .attr('value', 50)
        ;

    scRows
        .append('span')
            .attr('class', 'sc-suffix')
            .text((d) => {
                return suffixes[d];
            })
        ;


    // Define the colorChange function
    function updateSliders(d3color) {
        // console.log(d3color);
        // Update hex code && target
        d3.select('#new-hex').attr('value', rgb2hex(d3color.toString()) );
        target.style('background', '#00aaff');

        // Ramp hue from 0 to 100
        fromColor = `hsla(0, ${100*d3color.s}%, ${100*d3color.l}%, 1)`;
        midColor = `hsla(90, ${100*d3color.s}%, ${100*d3color.l}%, 1)`;
        toColor = `hsla(180, ${100*d3color.s}%, ${100*d3color.l}%, 1)`;
        d3.select('#hue').style('background', makeGradient(d3color.toString()));

        // Ramp saturation from 0 to 100
        fromColor = `hsla(${d3color.h}, 0%, ${100*d3color.l}%, 1)`;
        // midColor = `hsla(${d3color.h}, ${100*d3color.s}%, 50%, 1)`;
        toColor = `hsla(${d3color.h}, 100%, ${100*d3color.l}%, 1)`;
        gradientColor = `linear-gradient(to right, ${fromColor}, ${toColor})`;
        d3.select('#saturation').style('background', gradientColor);

        // Ramp lightness from 0 to 100
        fromColor = `hsla(${d3color.h}, ${100*d3color.s}%, 0%, 1)`;
        midColor = `hsla(${d3color.h}, ${100*d3color.s}%, 50%, 1)`;
        toColor = `hsla(${d3color.h}, ${100*d3color.s}%, 100%, 1)`;
        gradientColor = `linear-gradient(to right, ${fromColor}, ${midColor}, ${toColor})`;
        d3.select('#lightness').style('background', gradientColor);

    }

    // Set the on change handlers

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


    function makeGradient(hex) {
        var colorArr = [];
        var d3c = d3.hcl(hex);
        var hcl;
        // Increment through the d3.hcl spectrum
        // Converting each to HSL for CSS
        for (var i = 0; i <= 360; i = i + 10) {
            d3c.h = i;
            colorArr.push(d3c.toString());
        }
        var ret = `linear-gradient(to right, ${colorArr.join(",")} )`;
        console.log(ret);
        return ret;
    }


}


function rgb2hex(rgb){
  // ignores alpha
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

