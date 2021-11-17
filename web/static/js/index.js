function buildClientLocationMap(data) {
    Highcharts.mapChart('client_location_container', {
        chart: {
            map: 'custom/world',
            style: {
                fontFamily: 'Helvetica'
            }
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            let country = this.Country;
                            $.get('/location-actions?country=' + country, function (data, status) {
                                data.forEach(item => item.y = parseInt(item.y));
                                buildLocationActionsPie(country, data);
                            })
                        }
                    }
                }
            }
        },
        title: {text: 'Requests by country'},
        legend: {enabled: false},
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },
        series: [{
            name: 'Countries',
            color: '#E0E0E0'
        }, {
            type: 'mapbubble',
            joinBy: ['iso-a2', 'Country'],
            data: data,
            minSize: 4,
            maxSize: '12%'
        }]
    })
}

function buildLocationActionsPie(country, data) {

    Highcharts.chart('location_actions_container', {
        chart: {
            type: 'pie',
            style: {
                fontFamily: 'Helvetica'
            }
        },
        title: {
            text: 'Request actions on ' + country
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Actions',
            data: data
        }]
    });
}

function buildRequestCountChart(data) {

    Highcharts.chart('request_count_container', {
        chart: {
            height: 500,
        },
        title: {
            text: 'Request count by hour'
        },
        xAxis: {
            type: 'datetime'
        },
        series: [{
            name: "Count",
            type: 'area',
            data: data
        }]
    });


}

$(document).ready( function() {
    $.get('/client-locations', function (data, status) {
        data.forEach(item => item.z = parseInt(item.z));
        buildClientLocationMap(data);
    })

    $.get('/location-actions?country=US', function (data, status) {
        data.forEach(item => item.y = parseInt(item.y));
        buildLocationActionsPie("US", data);
    })

    $.get('/request-count', function(data, status) {
        data.forEach(item => {
            item.x = parseInt(item.x) * 1000
            item.y = parseInt(item.y)
        });
        buildRequestCountChart(data)
    })
})
