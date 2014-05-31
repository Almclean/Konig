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




$(function() {
    console.log('Page is now ready !');
    
    $('#btnQuery').click(function(e) {
        console.log('The query button was clicked !')
        return false;
    });
    
    $('#btnAnimal').click(function(e) {
        
        // Make the Canvas element the correct size
        updateCanvas();
        
        // Connect arbor to the canvas object and hook it up
        var sys = arbor.ParticleSystem(1000, 400, 1);
        sys.parameters({gravity:false});
        
        sys.renderer = Renderer('#mview');
        sys.graft(nodeData);
        
        $('#fntAnimal').addClass('fa-check-circle');
        // Link the socket data to grafting new nodes to arbor and display
        // them in the canvas element
    });

});


function updateCanvas() {
    var canvasNode = document.getElementById('mview');
    var div = document.getElementById('candiv');
    canvasNode.width = div.clientWidth;
    canvasNode.height = div.clientHeight;
}

