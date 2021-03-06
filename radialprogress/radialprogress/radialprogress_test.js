/*
 Copyright (c) 2016, BrightPoint Consulting, Inc.

 MIT LICENSE:

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 IN THE SOFTWARE.
 */

// @version 1.1.54

//**************************************************************************************************************
//
//  This is a test/example file that shows you one way you could use a vizuly object.
//  We have tried to make these examples easy enough to follow, while still using some more advanced
//  techniques.  Vizuly does not rely on any libraries other than D3.  These examples do use jQuery and
//  materialize.css to simplify the examples and provide a decent UI framework.
//
//**************************************************************************************************************


// html element that holds the chart
var viz_container;

// our radial components and an array to hold them
var viz;

// our radial themes and an array to hold them
var theme;

// our div elements we will put radials in
var div;

// show reel for demo only;
var reels=[];

function initialize() {

    //Here we use the three div tags from our HTML page to load the three components into.
    div = d3.select("#radial");
    //Store the divs in an array for easy access

    //Here we create our three radial progress components by passing in a parent DOM element (our div tags)
    viz = vizuly.viz.radial_progress(document.getElementById("radial"));


    //Here we create three vizuly themes for each radial progress component.
    //A theme manages the look and feel of the component output.  You can only have
    //one component active per theme, so we bind each theme to the corresponding component.
    theme = vizuly.theme.radial_progress(viz).skin(vizuly.skin.RADIAL_PROGRESS_BUSINESS);

    //Like D3 and jQuery, vizuly uses a function chaining syntax to set component properties
    //Here we set some bases line properties for all three components.
    viz.data(0)                       // Current value
        .height(600)                    // Height of component - radius is calculated automatically for us
        .min(0)                         // min value
        .max(100)                       // max value
        .capRadius(1)                   // Sets the curvature of the ends of the arc.
        .on("tween",onTween)            // On the arc animation we create a callback to update the label
        .on("mouseover",onMouseOver)    // mouseover callback - all viz components issue these events
        .on("mouseout",onMouseOut)      // mouseout callback - all viz components issue these events
        .on("click",onClick);           // mouseout callback - all viz components issue these events

    //
    // Now we set some unique properties for all three components to demonstrate the different settings.
    //
    // vizs[0]
    //     .startAngle(250)                         // Angle where progress bar starts
    //     .endAngle(110)                           // Angle where the progress bar stops
    //     .arcThickness(.12)                        // The thickness of the arc (ratio of radius)
    //     .label(function (d,i) {                  // The 'label' property allows us to use a dynamic function for labeling.
    //         return d3.format(".0f")(d);
    //     });

    // vizs[1]
    //     .startAngle(210)
    //     .endAngle(150)
    //     .arcThickness(.07)
    //     .label(function (d,i) { return d3.format("$,.2f")(d); });

    viz
        .startAngle(0)
        .endAngle(360)
        .arcThickness(.10);
        // .label(function (d,i) { return d3.format(".0f")(d) + "%"; });

    //We use this function to size the components based on the selected value from the RadiaLProgressTest.html page.
    // changeSize(d3.select("#currentDisplay").attr("item_value"));

}

//Here we want to animate the label value by capturin the tween event
//that occurs when the component animates the value arcs.
function onTween(viz,i) {
    var diff = viz.data() - last;
    // console.log(diff * i);
    var display = d3.format(".0f")(last + (diff * i));
    // console.log(display);
    viz.selection().selectAll(".vz-radial_progress-label")
        .text(viz.label()(display + "%"));
}

function onMouseOver(viz,d,i) {
    //We can capture mouse over events and respond to them
}

function onMouseOut(viz,d,i) {
    //We can capture mouse out events and respond to them
}

function onClick(viz,d,i) {
    //We can capture click events and respond to them
}

//---------------------------------------------------------
//
//  The following functions are triggered by the user making changes in the settings panel which is declared in the
//  RadialProgressTest.html file.
//
//---------------------------------------------------------


//This function is called when the user selects a different skin.
function changeSkin(val) {
    //If the user selects "none" for the skin we need to tell the theme to release the component and clear
    //any applied styles.
    if (val == "none") {
        theme.release();
        viz.update();
    }
    //If the user selected a skin, make sure each viz has a theme and apply the skin
    else {
        theme.viz(viz);
        theme.skin(val);
        theme.viz().update();  //We could use theme.apply() here, but we want to trigger the tween.
    }
}

//This is applies different end caps to each arc track by adjusting the 'capRadius' property
function changeEndCap(val) {
    viz.capRadius(Number(val)).update();
}

//This changes the size of the component by adjusting the radius and width/height;
function changeSize(val) {
    var s = String(val).split(",");
    viz_container.transition().duration(300).style('width', s[0] + 'px').style('height', s[1] + 'px');

    // var divWidth = s[0] * 0.80 / 3;
    var divWidth = 580;

    // div.style("width",divWidth + 'px').style("margin-left", (s[0] *.05) + "px");
    viz.width(divWidth).height(divWidth).radius(divWidth/2.2).update();

}

//This sets the same value for each radial progress
function changeData(val) {
    console.log(val);
    viz.data(Number(val)).update();
}


// custom functions

var counter = null;
var count = 1;

function startCount() {
    counter = setInterval(function() {
        if (count < 100) {
            count++;
            setNumber(count);
        } else {
            stopCount();
        }
    }, 1000);
}

function stopCount() {
    clearInterval(counter);
}

var last = 0;
function setNumber(number) {
    last = parseFloat(viz.data());
    if (!number) {
        number = parseFloat($('#number').val());
    }
    console.log("From " + last + " to " + number);
    viz.data(number).update();
}





