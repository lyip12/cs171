var displaydata

//Main function, update visualization upon scrolling
var scrollVis = function () {
    // constants to define the size
    // and margins of the vis area.
    var width =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*0.6;
    var height =Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*0.6;

    // Keep track of which visualization we are on and which was the last
    // index activated. When user scrolls quickly, we want to call all the
    // activate functions that they pass.
    var lastIndex = -1;
    var activeIndex = 0;

    // Sizing for the grid visualization
    var numPerRow = 30;

    var circleSize = Math.floor(width/numPerRow*2/3);
    var circlePad =  Math.floor(width/numPerRow/3);

    var widthcount = 30;
    var heightcount = 30;

    var margin = { top: circleSize/2, bottom: 0, left: circleSize/2, right: 0 };
    // main svg used for visualization
    var svg = d3.select("#matrixvis");

    // d3 selection that will be used for displaying visualizations
    var g = null;

    // When scrolling to a new section the activation function for that section is called.
    var activateFunctions = [];

    // If a section has an update function then it is called while scrolling
    // through the section with the current    // progress through the section.
    var updateFunctions = [];



    /**chart**/
    var chart = function (selection) {
        selection.each(function (rawData) {
            // create svg and give it a width and height

            var matrixData = wrangleData(rawData);

            displaydata = matrixData;

            svg = d3.select(this).selectAll('svg').data([matrixData.prevalence]);
            var svgE = svg.enter().append('svg');
            // @v4 use merge to combine enter and existing selection
            svg = svg.merge(svgE);

            svg.attr('width', width);
            svg.attr('height', height);

            svg.append('g');


            // this group element will be used to contain all
            // other elements.
            g = svg.select('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // perform some preprocessing on raw data
            //var displayData = getData(rawData);



            //console.log(displayData);
            //console.log(matrixData.prevalence);
            setupVis(matrixData);

            //setupVis(displayData);

            setupSections();
        });
    };


    /**
     * setupVis - creates initial elements for all
     * sections of the visualization.*/
    var setupVis = function (displayData) {
        // square grid
        // @v4 Using .merge here to ensure
        // new and old data have same attrs applied

        total = d3.sum(displayData, function(d){return d.total});
        console.log(displayData);

        console.log(total);

        var circles = g.selectAll('.circle').data(displayData["Fewer Confidants"]);//.prevalence);

        //console.log(displayData);

        var circlesE = circles.enter()
            .append('circle')
            .classed('circle', true);

        circles = circles.merge(circlesE)
            .attr('r', circleSize/2.5)
            .attr('fill', '#fff')
            .classed('fill-circle', function (d) { return d.filler; })
            .attr('cx', function (d) { return d.x;})
            .attr('cy', function (d) { return d.y;})
            .attr('opacity', 0);

    };

    var setupSections = function () {
        // activateFunctions are called each
        // time the active section changes
        activateFunctions[0] = showGrid;
        activateFunctions[1] = highlightPre;
        activateFunctions[2] = highlightAge;
        activateFunctions[3] = highlightMartial;
        activateFunctions[4] = highlightEvent;
        activateFunctions[5] = highlightImpact;
        activateFunctions[6] = highlightInt;

        // updateFunctions are called while in a particular section to update
        // the scroll progress in that section. Most sections do not need to be updated
        // for all scrolling and so are set to no-op functions.
        for (var i = 0; i < 9; i++) {
            updateFunctions[i] = function () {};
        }
    };


    function showGrid() {
        g.selectAll('.circle')
            .transition()
            .duration(600)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.8)
            .attr('fill', '#ddd');
    }

    function highlightPre() {

        g.selectAll('.circle')
            .transition()
            .duration(600)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.3)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.fill-circle')
            .transition('move-fills')
            .duration(800)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });


        g.selectAll('.fill-circle')
            .transition()
            .duration(800)
            .attr('opacity', function (d) { return d.filler ? 1 : 0.3; })
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });

    }

    function highlightAge() {

        var circles =  g.selectAll('.circle')
            .data(displaydata["employment"])
            .classed('age-circle', function (d) { return d.filler; })
            .transition()

            circles.duration(800)
                .delay(function (d) {
                    return 5 * d.row;
                })
            .attr('opacity', 0.3)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.age-circle')
            .transition('move-fills')
            .duration(800)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });

        //console.log(displaydata["martial status"]);
        g.selectAll('.age-circle')
            .transition()
            .duration(800)
            .attr('opacity', function (d) { return d.filler ? 1 : 0.3; })
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });
    }

    function highlightMartial() {

        var circles =  g.selectAll('.circle')
            .data(displaydata["Fewer Confidants"])
            .classed('m-circle', function (d) { return d.filler; })
            .transition()

        circles.duration(800)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.3)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.m-circle')
            .transition('move-fills')
            .duration(800)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });

        g.selectAll('.m-circle')
            .transition()
            .duration(800)
            .attr('opacity', function (d) { return d.filler ? 1 : 0.3; })
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });
    }

    function highlightEvent() {

        var circles =  g.selectAll('.circle')
            .data(displaydata["specific events"])
            .classed('e-circle', function (d) { return d.filler; })
            .transition()

        circles.duration(800)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.3)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.e-circle')
            .transition('move-fills')
            .duration(800)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });

        g.selectAll('.e-circle')
            .transition()
            .duration(800)
            .attr('opacity', function (d) { return d.filler ? 1 : 0.3; })
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });
    }

    function highlightImpact() {

        var circles =  g.selectAll('.circle')
            .data(displaydata["impact"])
            .classed('im-circle', function (d) { return d.filler; })
            .transition()

        circles.duration(800)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.3)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.im-circle')
            .transition('move-fills')
            .duration(800)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });

        g.selectAll('.im-circle')
            .transition()
            .duration(800)
            .attr('opacity', function (d) { return d.filler ? 1 : 0.3; })
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });
    }


    function highlightInt() {

        var circles =  g.selectAll('.circle')
            .data(displaydata["martial status"])
            .classed('it-circle', function (d) { return d.filler; })
            .transition()

        circles.duration(800)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.3)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.it-circle')
            .transition('move-fills')
            .duration(800)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });

        g.selectAll('.it-circle')
            .transition()
            .duration(800)
            .attr('opacity', function (d) { return d.filler ? 1 : 0.3; })
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });
    }

    // wrangle and parse data to fit visualization
    function wrangleData(data, matrixsize=numPerRow*numPerRow)
    {
        //rewrite the csv file into json file for easier data parsing
        var newdata = [];
        var namelist = [];
        data.forEach(function(d, index)
        {
            if(d.category !='') namelist.push( d.category);
        });
        //get a list of all the categories from the csv file
        //console.log(namelist);

        var stack = {};
        let sumvalue = 0;

        var dotvalue = 300/matrixsize;

        var nesteddata = d3.nest().key(function(d){return d.category}).entries(data);

        nesteddata.forEach(function(d, index){if (!(d.key in namelist)){namelist.push(d.key);}})
        console.log(namelist)

        var matrixcolor = d3.schemeRdBu[10]

        console.log(nesteddata);


        //parse the csv file into json format for easier access.
        //meanwhile parse string into numberic representations
        nesteddata.forEach(function(g, index) {
            var temp = g.values;
            temp.Total = +temp.Total;
            temp.units = Math.floor(temp.Total/dotvalue);
            console.log(temp)
            var groupdata = temp.map(function (d, index) { return
                    {Total: + d.Total}
                        })
            console.log(groupdata);
            newdata.push(groupdata);
        });
        console.log(newdata);

        var displayData = {};
        for(var i = 0; i<namelist.length;i++)
        {
            var unit = [];
            for (var j = 0; j< matrixsize; j++)
            {
                d = {}
                d.col=j % numPerRow;
                d.x=j % numPerRow * (circleSize + circlePad);
                d.row=Math.floor(j / numPerRow);
                d.y=Math.floor(j / numPerRow) * (circleSize + circlePad);
                //console.log(newdata[i]['total'])
                if(j<6*newdata[i].total){ d.filler=true}
                else{ d.filler=false}
                unit.push(d)
            }
            displayData[namelist[i]] = unit;
        }
        //console.log(displayData);

        return displayData;
    }

    chart.activate = function (index) {
        activeIndex = index;
        var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
        var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
        scrolledSections.forEach(function (i) {
            activateFunctions[i]();
        });
        lastIndex = activeIndex;
    };

    chart.update = function (index, progress) {
        updateFunctions[index](progress);
    };

    // return chart function
    return chart;
};


// the function that recognize current section and call visualization fucntion respectively
function display(data) {
    // create a new plot and
    // display it
    var plot = scrollVis();
    d3.select('#matrixvis')
        .datum(data)
        .call(plot);

    // setup scroll functionality
    var scroll = scroller()
        .container(d3.select('#floatingarea'));

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // setup event handling
    scroll.on('active', function (index) {
        // highlight current step text
        d3.selectAll('.step')
            .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

        // activate current section
        plot.activate(index);
    });

    scroll.on('progress', function (index, progress) {
        plot.update(index, progress);
    });
}

// load data and display
d3.csv('data/what are lonely people like.csv',  display);