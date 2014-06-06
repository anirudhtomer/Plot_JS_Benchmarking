jscodeperfgraph
=========

A library for measuring and graphing time spent in javascript code blocks. It is inspired by HTML-5 [User Timing API].

Motivation and What it does?
---------------------------
As a javascript developer I sometimes want to know how much time it takes to parse my json objects, how much time does my for loop takes or how much time my HTTP calls take. And I want to do a quick comparative analysis of the various time values.

Earlier I used to do time calculations using Date object or HTML-5 [User Timing API] and send them to server in form of a json. From there I would dump them in excel sheet and plot the graphs.

But that was quite time consuming and so I decided to write a small library which would allow me to plot all the time values in a graph somewhere in my own web application. On just a temporary link, button or tab where I will click and see the graph in an instant.

This is what jscodeperfgraph does. It uses the [User Timing API] provided by HTML-5 browsers so that one can measure time taken by various components of his/her code with microsecond accuracy. It also works with browsers which do not support [DOMHighResTimeStamp], by switching to Date object for calculations. It then allows users to make a simple plotGraph() call and plot all measurements on a bar chart. [jqPlot] is used by default for graphing, but one can use his/her own favourite as well.

Demo links with source code
----------
I've used setTimeout() to introduce delay which should be assumed analogous to processing time for real applications.
* [Demo without dependencies]
* [Demo with custom graphing library]
* [Demo in default mode]

How it works?
-----------

To measure time taken by code blocks with microsecond accuracy it uses [DOMHighResTimeStamp] using performance object of HTML-5 browsers. For older browsers millisecond accuracy is supported using Date Object. 
For graphing time taken by various code blocks it uses [jqPlot] library. You can fit in your own charting library as well.

Dependencies
------------
The following dependencies are needed only if you want to use jqPlot graphing. In case you want to use this library just for managing timing calculations and don't want to graph anything then do not include jQuery or jqPlot and it will still work fine. Check this [Demo without dependencies].

* jQuery
* [jqPlot]: These plugins of jqPlot are used [jqplot.barRenderer.js], [jqplot.categoryAxisRenderer.js] and [jqplot.pointLabels.js]

You can skip jqPlot as a dependency if you want to use some other charting library. Check this [Demo with custom graphing library].

How to use?
--------------

#### First create a CodePerformanceObject. ####

```
var codePerformance = new window.CodePerformance();
```

#### To measure the time taken for a code block use the following.####
```
//The first parameter can be any name that you would like to give to your code block.
codePerformance.markStartTime("Json Parsing Time");

/*Assume code of json parsing here*/

codePerformance.markEndTime("Json Parsing Time");
```
You can create as many markers for your code blocks as you want.

#### To remove all/one of your markers use the following ####
```
//Remove a particular markers. Returns the deleted marker
var deletedMarker = codePerformance.deleteMarker("mymarker");

//Remove all markers. Returns nothing
codePerformance.deleteAllMarkers();
```

#### To get all/one particular marker and read time duration use the following ####
```
//Get a particular marker
var myMarker = codePerformance.getMarker("mymarker");
alert("Name of the marker is: " + myMarker.name);
alert("Time duration my code block took to execute: " + myMarker.duration);

//Get all markers
var allMarkers = codePerformance.getAllMarkers();
for(var i=0;i<allMarkers.length; i++){
    console.log(allMarkers[i].name + " took " 
    + allMarkers[i].duration + " ms to execute");
}
```

#### To see a graph plotted with jqPlot use the following ####
ATTENTION: You will need to include jqPlot libraries to make this work. Check this [Demo in default mode].
```
//HTML
<div id="foo" style="height: 500px; width:900px;"></div>

//Javascript
codePerformance.plotGraph("Title of my graph", "foo");
/*The second parameter expects id of the div where the graph will be plotted. 
Do not add a # in front of the id.*/
```

#### You want see measure different performance metrics in different graphs? ####
Suppose you want to see time taken by various HTTP calls in one jqPlot graph and time taken by parsing in another jqPlot graph. Then do this.
```
//HTML
<div id="htmlPerfGraph" style="height: 400px; width:900px;"></div>
<div id="parsingPerfGraph" style="height: 400px; width:900px;"></div>

var httpCallPerformance = new window.CodePerformance();
/*Code for measuring http call time using markers. 
Use the httpCallPerformance object to call markStartTime and markEndTime.*/

var parsingPerformance = new window.CodePerformance();
/*Code for measuring parsing time using markers. 
Use the parsingPerformance object to call markStartTime and markEndTime.*/

//Now plot both graphs
httpCallPerformance.plotGraph("HTTP Calls Performance", "htmlPerfGraph");
parsingPerformance.plotGraph("Parsing Performance", "parsingPerfGraph");
```

License
-------
[MIT License]

[MIT License]:https://github.com/anirudhtomer/jscodeperfgraph/blob/master/LICENSE
[User Timing API]:http://www.html5rocks.com/en/tutorials/webperformance/usertiming/
[DOMHighResTimeStamp]:http://www.w3.org/TR/hr-time/#sec-DOMHighResTimeStamp
[jqPlot]:http://www.jqplot.com/
[jqplot.barRenderer.js]:http://www.jqplot.com/docs/files/plugins/jqplot-barRenderer-js.html
[jqplot.categoryAxisRenderer.js]:http://www.jqplot.com/docs/files/plugins/jqplot-categoryAxisRenderer-js.html
[jqplot.pointLabels.js]:http://www.jqplot.com/docs/files/plugins/jqplot-pointLabels-js.html
[Demo without dependencies]:http://jsfiddle.net/SwapnaSK/LrwTf/
[Demo with custom graphing library]:http://jsfiddle.net/SwapnaSK/Dz76c/
[Demo in default mode]:http://jsfiddle.net/SwapnaSK/Xphj5/
