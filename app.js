var nodes = [];
var edges = [];
/* 
calculate is called on page load and when the submit button is clicked
Preload a course to show on load by passing its course code into calculate as a param

ie calculate("COE528")
*/
function calculate(x="") {
    function network_init() {
        var container = document.getElementById('mynetwork');
        var nodex = new vis.DataSet(nodes);
        var edgex = new vis.DataSet(edges);
        var data = {
            nodes: nodex,
            edges: edgex
        };
        var options = {
            physics: {
                enabled: true
            },
            nodes:{
                 shape: 'square',
                 color:{
    
                 }
            },
            edges: {
                arrows: {
                    to: {
                        enabled: false,
                        scaleFactor: 1,
                        type: 'arrow'
                    },
                    middle: {
                        enabled: false,
                        scaleFactor: 1,
                        type: 'arrow'
                    },
                    from: {
                        enabled: true,
                        scaleFactor: 1,
                        type: 'arrow'
                    }
                }
            },
            autoResize: true,
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: 'RL',
                    levelSeparation: 200,
                    sortMethod: 'directed'
                }
            }, // defined in the layout module.
    
        };
        var network = new vis.Network(container, data, options);
    }
    if (x == ""){
        x = document.getElementById("coursename").value.replace(/\s/g, '').toUpperCase();
    }
    var targetCourse;
    var data = new Array();
    if (curriculum[x] != null) {
        nodes = [];
        edges = [];
        targetCourse = push_prereqs(x, data)
        var prereq = "</br><b>Prerequisites: </b>"
        for (var i = 1; i < targetCourse.length; i++) {
            prereq += '<a class="badge bg-light text-dark badges" onClick="explorePrereq(this)">' + targetCourse[i] + '</a>&nbsp'
        }
        if (targetCourse.length < 2){
            prereq += "None"
        }
        document.getElementById("demo").innerHTML = "<b>Course Name: </b>" + curriculum[targetCourse[0]][0] + "</br>" + prereq;
        network_init()
    } else {
        document.getElementById("demo").innerHTML = "Course Not Found";
        document.getElementById("mynetwork").innerHTML = "";
    }
}

function push_prereqs(print_str, stack) {
    var j;
    var temp = print_str.trim().replace(' ', '').toUpperCase();
    if (!(stack.includes(temp))) {
        nodes.push({
            id: temp,
            label: temp
        })
        stack.push(temp)

    }
    for (j = 1; j < curriculum[temp].length; j++) {
        edges.push({
            from: temp,
            to: curriculum[temp][j].replace(' ', '')
        })
        if (curriculum[temp][j].length > 1) {
            push_prereqs(curriculum[temp][j], stack)
        }
    }
    return stack
}

function explorePrereq(el) {
    var x = document.getElementById("coursename");
    x.value = el.innerHTML;
    calculate();
}