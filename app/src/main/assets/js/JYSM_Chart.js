var JYSM_Chart = {};
var chart;
/**
Xdata, Ydata1, _title, _xTitle, _yTitle, _PChartBody, _h, _type
options:{
data:{Xdata:json,Ydata:json},  数据
type:str, 类型
title:{ 标题
title:string, 主标题
xTitle:string, x标题
yTitle:string  y标题
},
height:h, 高度  这个可以不要，充满pBody
pBody:obj  放在哪

}
*/
// Make monochrome colors
var pieColors = (function () {
    var colors = [],
        base = Highcharts.getOptions().colors[0],
        i;

    for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
    }
    return colors;
}());

JYSM_Chart = {
    createChart: function (chartID, options) {
        var cObj;
        if (JYSM.$(chartID)) {
            JYSM.delObj(JYSM.$(chartID));
        }
        cObj = JYSM.$(chartID);
        if (options) {
            var pBody = JYSM.$(options.pBody) || document;

            var chartBox = JYSM.toEle("<div style='margin: 0 auto;width:100%;'></div>");
            chartBox.id = chartID;
            chartBox.style.height = pBody.clientHeight + "px";
            pBody.appendChild(chartBox);
            var _YlabelsEnabled = true;

            chart = new Highcharts.Chart({
                chart: {
                    renderTo: chartBox,
                    zoomType: 'x',
                    backgroundColor: "#20262e",
                    borderWidth: 0,
                    plotBackgroundColor:null,
                    //plotBackgroundColor: 'rgba(255, 255, 255, .5)',
                    plotShadow: false,
                    plotBorderWidth: 1,
                    borderRadius: 0

                },
                credits: {
                    enabled: false
                },
                title: {
                    text: options.title.title,
                    enabled:false,
                    style: { color: '#fff', fontSize: '11pt' }
                },
                //subtitle: {
                //    text: _yTitle + '最大:' + yMax1 + ' 最小:' + yMin1 + '',
                //    align: 'left',
                //    style: { color: '#eee', fontSize: '11px' }
                //},
                tooltip: {
                    shared: true,
                    //xDateFormat: '%Y-%m-%d %H:%M',
                    crosshairs: { width: 1, color: '#eee', dashStyle: 'solid' }
                },
                legend: {
                    enabled: false, align: 'right', verticalAlign: 'top', y: 5, itemStyle: { fontSize: '12px', color: "#fff" },
                    itemHiddenStyle: { color: "#ccc" }, itemHoverStyle: { color: "#fff" }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: false,
                        cursor: 'pointer',
                        colors: pieColors,
                        dataLabels: {
                            enabled: true,
                            format: '{point.percentage:.1f} %', //<b>{point.name}</b><br>
                            distance: -50,
                            filter: {
                                property: 'percentage',
                                operator: '>',
                                value: 4
                            }
                        }
                    }
                },
                xAxis: {
                    title: {
                        text: options.title.xTitle,
                        style: { color: '#eee' }
                    },
                    gridLineWidth: 0,
                    gridLineDashStyle: "longdash",
                    gridLineColor: "#eee",
                    categories: options.data.Xdata, //type: "datetime",
                    labels: {
                        formatter: function () {
                            //return Highcharts.dateFormat('%m-%d %H:%M', this.value);
                            return this.value;
                        },
                        style: { color: "#eee" }
                    }
                },

                yAxis: [
                    { // Secondary yAxis
                        title: {
                            text: options.title.yTitle,
                            style: { color: "#eee" }//_type.split(";")[1]
                        },
                        gridLineDashStyle: "longdash",
                        gridLineColor: "#eee",
                        gridLineWidth: 1,
                        min: 0,// parseInt(yMin1 - 0.5),
                        //max: parseInt(yMax1 + 2.5),
                        tickInterval: 20,
                        //minorTickInterval: 'auto',
                        labels: {
                            // format: '{value}',
                            style: { color: '#eee' },
                            enabled: _YlabelsEnabled
                        }
                    }],
                series: [{
                    type: options.type.t,
                    name: options.title.yTitle,
                    color: options.type.color,
                    //tooltip: { valueSuffix: ' ' },
                    data: options.data.Ydata,
                    borderColor: "none",
                    marker: { enabled: false }
                }]
            });

        } else {
            JYSM.alert.alertOK("<p style='text-align:center;font-size:16pt;color:#f00;'>参数错误！</p>");
        }

    },
    addChartSeries: function (cName,options) {
    }

};
JYSM.chart = JY.chart = JYSM_Chart;
