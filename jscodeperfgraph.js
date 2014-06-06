function HashSet(){
	this.keys = {};
	this.length = 0;

	this.add = function(key){

		if(this.keys[key] === undefined){
			this.length++;
		}

		this.keys[key] = key;
	};

	this.keySet = function(){
		return this.keys;
	};

	this.size = function(){
		return this.length;
	};

	this.containsKey = function(key){
		return this.keys[key] !== undefined;
	};

	this.remove = function(key){
		if(this.containsKey(key)){
			delete this.keys[key];
			this.length--;
			return true;
		}
		else{
			return false;
		}
	};

	this.clear = function(){
		this.keys = {};
		this.length = 0;
	};
}

function ValuesHashMap(){
	this.keys = new HashSet();
	this.hashMap = {};
	this.length = 0;

	this.emptyIndices = [];
	this.valuesArr = [];

	this.keySet = function(){
		return this.keys.keySet();
	};

	this.size = function(){
		return this.length;
	};

	this.containsKey = function(key){
		return this.keys.containsKey(key);
	};

	this.clear = function(){
		this.emptyIndices.length = 0;
		this.valuesArr.length = 0;
		this.hashMap = {};
		this.length = 0;
		this.keys.clear();
	};

	this.put = function(key, value){
		var newIndex = undefined;
		if(this.containsKey(key)){
			newIndex = this.hashMap[key].index;
		}
		else{
			newIndex = this.emptyIndices.length == 0 ? this.length:this.emptyIndices.pop();
			this.length++;
		}
		this.keys.add(key);
		this.hashMap[key] = {
			"index": newIndex,
			"value": value
		};
		this.valuesArr[newIndex] = value;
	};

	this.getHashMap = function(){
		return this.hashMap;
	};

	this.get = function(key){
		if(this.containsKey(key)){
			return this.hashMap[key].value;
		}
		else{
			return undefined;
		}
	};

	this.remove = function(key){
		if(this.containsKey(key)){
			var retVal = this.hashMap[key];
			this.keys.remove(key);
			delete this.hashMap[key];
			this.length--;
			this.valuesArr[retVal.index] = undefined;
			this.emptyIndices.push(retVal.index);
			return retVal.value;
		}
		return null;
	};

	this.values = function(){

		while(this.emptyIndices.length > 0){
			var emptyIndex = this.emptyIndices.pop();

			while(this.valuesArr[this.valuesArr.length - 1] == undefined){
				this.valuesArr.pop();
			}

			if((this.valuesArr.length - 1) > emptyIndex){
				this.valuesArr[emptyIndex] = this.valuesArr.pop();
			}
		}

		return this.valuesArr;
	};
}

(function(){

	var TimeMeasurer = performance || window.performance || Date;

	var timeFormat = "%.3f";
	var jQueryAvailable = typeof jQuery !== 'undefined';
	var allRequiredJqPlotPluginsAvailable = false;
	var barGraphConfig = {};

	if(TimeMeasurer.now === undefined){
		TimeMeasurer = {
			now: function(){
				return new Date().getTime();
			}
		};

		timeFormat = "%d";
	}

	if(jQueryAvailable){
		allRequiredJqPlotPluginsAvailable = $.jqplot && $.jqplot.BarRenderer && $.jqplot.CategoryAxisRenderer;

		if(allRequiredJqPlotPluginsAvailable){
			barGraphConfig = {
				title: '',
				seriesDefaults: {
					renderer: $.jqplot.BarRenderer,
					rendererOptions: {
						fillToZero: true,
						barPadding: 1,
						barWidth: 50
					},
					pointLabels: {
						show: true
					}
				},
				series: [
					{label: 'Duration'}
				],
				legend: {
					show: true,
					placement: 'outsideGrid'
				},
				axes: {
					xaxis: {
						renderer: $.jqplot.CategoryAxisRenderer
					},
					yaxis: {
						pad: 1.05,
						tickOptions: {formatString: timeFormat},
						label: 'Time (ms)'
					}
				}
			};
		}
		else{
			if(window.console){
				console.warn("plotGraph() call will not work because either jqplot or its plugins BarRenderer and CategoryAxisRenderer are not available");
			}
		}
	}
	else{
		if(window.console){
			console.warn("plotGraph() call will not work because jQuery is not available");
		}
	}

	function CodePerformance(){
		var markers = new ValuesHashMap();
		var plot;

		var retObj = {
			markStartTime: function(markerName){
				var marker = {
					name: markerName,
					duration: 0,
					startTime: TimeMeasurer.now(),
					endTime: 0
				};

				markers.put(markerName, marker);
			},
			markEndTime: function(markerName){
				if(markers.containsKey(markerName)){
					var marker = markers.get(markerName);
					marker['endTime'] = TimeMeasurer.now();
					marker['duration'] = marker['endTime'] - marker['startTime'];
				}
			},
			deleteMarker: function(markerName){
				return markers.remove(markerName);
			},
			getMarker: function(markerName){
				return markers.get(markerName);
			},
			getAllMarkers: function(){
				return markers.values();
			},
			deleteAllMarkers: function(){
				markers.clear();
			}
		};

		if(jQueryAvailable && allRequiredJqPlotPluginsAvailable){
			retObj.plotGraph = function(plotTitle, divId){
				var markerValues = markers.values();
				barGraphConfig.title = plotTitle;
				var chartData = [];

				var index = 0;
				for(var index = 0; index < markerValues.length; index++){
					chartData[index] = [];
					chartData[index][0] = markerValues[index].name;
					chartData[index][1] = markerValues[index].duration;
				}

				if(plot !== undefined){
					plot.destroy();
				}
				plot = $.jqplot(divId, [chartData], barGraphConfig);
			}
		}
		else{
			if(window.console){
				console.warn("plotGraph() call will not work because either jQuery or jqPlot or its plugins BarRenderer and CategoryAxisRenderer are not available");
			}
		}

		return retObj;
	};

	window.CodePerformance = CodePerformance;
}());
