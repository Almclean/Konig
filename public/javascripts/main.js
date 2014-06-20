// This is just test data for now...
var nodeData = {
    nodes: {
        animals: {'color': 'red', 'shape': 'dot', 'label': 'Animals'},
        dog: {'color': 'green', 'shape': 'dot', 'label': 'dog'},
        cat: {'color': 'blue', 'shape': 'dot', 'label': 'cat'}
    },
    edges: {
        animals: { dog: {}, cat: {} }
    }
};

// Event Handlers
$(function () {
    "use strict";
    console.log('Page is now ready !');

    $('#btnQuery').click(function (e) {
        console.log('The query button was clicked !');
        return false;
    });

    $('#btnAnimal').click(function (e) {
        // Go off and get some JSON
        $('#fntAnimal').addClass('fa-check-circle');
        return false;
    });

    $('#btnGraph2').click(function (e) {
        // Go off and get some JSON
        console.log('Nothing to see here !');
        return false;
    });

    $('#querybar').submit(function (event) {
        console.log('Query received...');
        event.preventDefault();
        var resultArray = $.post('/api/rawquery', $('#querybar').serialize(), function (data) {
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
        });
        return false;
    });
});