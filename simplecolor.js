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
    newColor.opacity = 0.5; // todo - sync

    if (!d3.hsl(oldColorHex).h) oldColorHex = "#cccccc";
    newColorObj = d3.hsl(oldColorHex);
    if (!newColorObj.h) newColorObj.h = 0;

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
        .append('div')
            .attr('id', (d) => {
                return "sc-slider-container-" + d;
            })
            .append('input')
                .attr('class', 'sc-slider sc-grow')
                .attr('id', (d) => {
                    return "sc-" + d;
                })
                .attr('type', 'range')
                .attr('value', 50)
                .attr('step', TOLERANCE)
        ;
    // Override range for hue slider
    d3.select('.sc-slider#sc-hue')
        .attr('max',360)
        .attr('value',200)
        ;
    // Override background for opacity slider
    d3.select('.sc-slider#sc-alpha')
        .attr('max',1)
        .attr('value',0.5)
        .attr('step',0.1)
        .classed("checkerboard", true);
        ;

    scRows
        .append('input')
            .attr('class', 'sc-number')
            .attr('id', (d) => {
                return "sc-" + d + "-number";
            })
            .attr('type', 'text')
            .attr('value', 50)
        ;
    // Override numbers
    d3.select('#sc-hue-number')
        .attr('value',200)
        ;
    d3.select('#sc-alpha-number')
        .attr('value', 0.5)
        ;

    scRows
        .append('span')
            .attr('class', 'sc-suffix')
            .text((d) => {
                return suffixes[d];
            })
        ;

    // swatches & hex code
    var scSwatchRow = sccp.append('div')
        .attr('class','sc-flex-row')
        ;
    scSwatchRow.append('div')
        .attr('class','sc-swatch checkerboard')
        .append('div')
            .attr('id','sc-old-color')
            .attr('class','sc-swatch')
        ;
    scSwatchRow.append('div')
        .attr('class','sc-swatch checkerboard')
        .append('div')
            .attr('id','sc-new-color')
            .attr('class','sc-swatch')
        ;
    scSwatchRow.append('div')
        .append('input')
            .attr('id','sc-new-hex')
            .on('input', function(){
                // Use this value to update the sliders
                if ( d3.color(this.value) ) {
                    // updateSliders(this.value);
                    updateInputs(this.value);
                }
            })
        ;
    scSwatchRow.append('div')
        .append('input')
            .attr('id','sc-new-rgba')
        ;

    updateSliders(newColor);

    function updateInputs(colorString) {
        d3color = d3.hsl(colorString);
        d3.select('#sc-hue').attr('value', d3color.h);
        d3.select('#sc-saturation').attr('value', d3color.s);
        d3.select('#sc-lightness').attr('value', d3color.l);
        d3.select('#sc-alpha').attr('value', d3color.opacity);
        updateSliders(d3color);

        d3.select('#sc-hue-number').attr('value', d3color.h);
        d3.select('#sc-saturation-number').attr('value', d3color.s);
        d3.select('#sc-lightness-number').attr('value', d3color.l);
        d3.select('#sc-alpha-number').attr('value', d3color.opacity);
    }

    // Define the colorChange function
    function updateSliders(d3color) {
        // Update hex code && target
        d3.select('#sc-new-color').style('background', d3.hsl(d3color).toString() );
        d3.select('#sc-new-hex').attr('value', rgb2hex(d3color.toString()) );
        d3.select('#sc-new-rgba').attr('value', d3.rgb(d3color).toString().replace(/ /g,"") );
        // target.style('background', rgb2hex(d3color.toString()) ); // special case
        target.style('background', d3.hsl(d3color).toString() );

        // Ramp hue from 0 to 100
        fromColor = `hsla(0, ${100*d3color.s}%, ${100*d3color.l}%, 1)`;
        midColor = `hsla(90, ${100*d3color.s}%, ${100*d3color.l}%, 1)`;
        toColor = `hsla(180, ${100*d3color.s}%, ${100*d3color.l}%, 1)`;
        d3.select('#sc-hue').style('background', makeGradient(d3color.toString()));

        // Ramp saturation from 0 to 100
        fromColor = `hsla(${d3color.h}, 0%, ${100*d3color.l}%, 1)`;
        // midColor = `hsla(${d3color.h}, ${100*d3color.s}%, 50%, 1)`;
        toColor = `hsla(${d3color.h}, 100%, ${100*d3color.l}%, 1)`;
        gradientColor = `linear-gradient(to right, ${fromColor}, ${toColor})`;
        d3.select('#sc-saturation').style('background', gradientColor);

        // Ramp lightness from 0 to 100
        fromColor = `hsla(${d3color.h}, ${100*d3color.s}%, 0%, 1)`;
        midColor = `hsla(${d3color.h}, ${100*d3color.s}%, 50%, 1)`;
        toColor = `hsla(${d3color.h}, ${100*d3color.s}%, 100%, 1)`;
        gradientColor = `linear-gradient(to right, ${fromColor}, ${midColor}, ${toColor})`;
        d3.select('#sc-lightness').style('background', gradientColor);

        // Ramp alpha from 0 to 100
        fromColor = `hsla(${d3color.h}, ${100*d3color.s}%, ${100*d3color.l}%, 0)`;
        toColor = `hsla(${d3color.h}, ${100*d3color.s}%, ${100*d3color.l}%, 1)`;
        gradientColor = `linear-gradient(to right, ${fromColor}, ${toColor})`;
        d3.select('#sc-alpha').style('background', gradientColor);

    }

    // Set the on change handlers
    d3.select('#sc-hue').on('input',function(d){
        if ( Math.abs(newColor.h - this.value) >= TOLERANCE ) {
            newColor.h = this.value;
            d3.select('#sc-new-color').style('background', d3.hsl(newColor).toString() );
            d3.select('#sc-hue-number').attr('value',this.value);
            updateSliders(newColor);
        }
    });

    d3.select('#sc-saturation').on('input',function(d){
        if ( Math.abs(newColor.s - this.value/100) >= TOLERANCE/100 ) {
            newColor.s = this.value/100;
            d3.select('#sc-new-color').style('background', newColor);
            d3.select('#sc-saturation-number').attr('value',this.value);
            updateSliders(newColor);
        }
    });

    d3.select('#sc-lightness').on('input',function(d){
        if ( Math.abs(newColor.l - this.value/100) >= TOLERANCE/100 ) {
            newColor.l = this.value/100;
            d3.select('#sc-new-color').style('background', newColor);
            d3.select('#sc-lightness-number').attr('value',this.value);
            updateSliders(newColor);
        }
    });

    d3.select('#sc-alpha').on('input',function(d){
        if ( Math.abs(newColor.opacity - this.value) >= TOLERANCE/100 ) {
            newColor.opacity = this.value;
            d3.select('#sc-new-color').style('background', newColor);
            d3.select('#sc-alpha-number').attr('value',this.value);
            updateSliders(newColor);
        }
    });


    function makeGradient(hex) {
        var colorArr = [];
        var d3c = d3.hsl(hex);
        // Increment through the d3.hcl(?) spectrum
        // Converting each to HSL for CSS
        for (var i = 0; i <= 360; i = i + 10) {
            d3c.h = i;
            colorArr.push(d3c.toString());
        }
        var ret = `linear-gradient(to right, ${colorArr.join(",")} )`;
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
