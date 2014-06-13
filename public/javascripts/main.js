'use strict';

// This is just test data for now...
var nodeData = {
    nodes:{
        animals:{'color':'red','shape':'dot','label':'Animals'},
        dog:{'color':'green','shape':'dot','label':'dog'},
        cat:{'color':'blue','shape':'dot','label':'cat'}
    },
    edges:{
        animals:{ dog:{}, cat:{} }}
};

// Init Graph
function setupGraph(cElement) {
    var sys = arbor.ParticleSystem(200, 300, 0.6, true);
    sys.parameters({gravity:true});
    sys.renderer = Renderer(cElement);
    return sys;
}

// Event Handlers
$(function() {
    console.log('Page is now ready !');

    //updateCanvas();
    var g = setupGraph('#mview');
    
    $('#btnQuery').click(function(e) {
        console.log('The query button was clicked !')
        return false;
    });
    
    $('#btnAnimal').click(function(e) {
        // Go off and get some JSON
        g.graft(nodeData);
        $('#fntAnimal').addClass('fa-check-circle');
        return false;
    });

    $('#btnGraph2').click(function(e) {
        // Go off and get some JSON
        console.log('Nothing to see here !')
        g.graft({});
        return false;
    });

    $('#querybar').submit(function(event) {
        console.log('Query received...');
        event.preventDefault();
        var resultArray = $.post('/api/rawquery', $('#querybar').serialize(), function(data) {
            // Just log for now...
            var dataObj = {};
            dataObj.nodes = {};
            dataObj.edges = {};
            console.log(JSON.stringify(data));
            for (var i in data) {
                for (var key in data[i]) {
                    var obj = data[i][key];
                    var name = obj._data.data.name;
                    console.log(name);
                    dataObj.nodes['node' + i] = {'color': 'blue', 'shape': 'dot', 'label': name};
                }
            }
            console.log(JSON.stringify(dataObj));
            g.graft(dataObj);
        });
        return false;
    });

});

// Canvas Init
function updateCanvas() {
    var canvasNode = document.getElementById('mview');
    var div = document.getElementById('candiv');
    canvasNode.width = div.clientWidth;
    canvasNode.height = div.clientHeight;
}

