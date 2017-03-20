import {GraphDynamicOptions} from "./graph-dynamic-options";
export class ChartUtils {

    private static counter: number = 0;

    private static getGraphs(opts: GraphDynamicOptions[]) {
      let g = [];
      for (let i = 0; i < opts.length; i++) {
        g.push({
          "id":"g" + (ChartUtils.counter + i),
          "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
          "bullet": "round",
          "bulletSize": 4,
          "lineThickness": 1,
          "type": "smoothedLine",
          "title": opts[i].title,
          "valueField": opts[i].valueField
        });
      }
      return g;
    }

    public static getOptions(data: any[], graphs: GraphDynamicOptions[]) {
      let opt = {
        "type": "serial",
        "theme": "none",
        "marginTop":0,
        "marginRight": 20,
        "colors": [
          "#369",
          "#639",
          "#693",
          "#963"
        ],
        "dataProvider": data,
        "valueAxes": [{
          "axisAlpha": 0,
          "position": "left"
        }],
        "graphs": ChartUtils.getGraphs(graphs),
        "chartScrollbar": {
          "graph":"g" + ChartUtils.counter,
          "gridAlpha":0,
          "color":"#888888",
          "scrollbarHeight":55,
          "backgroundAlpha":0,
          "selectedBackgroundAlpha":0.1,
          "selectedBackgroundColor":"#888888",
          "graphFillAlpha":0,
          "autoGridCount":true,
          "selectedGraphFillAlpha":0,
          "graphLineAlpha":0.2,
          "graphLineColor":"#c2c2c2",
          "selectedGraphLineColor":"#888888",
          "selectedGraphLineAlpha":1

        },
        "chartCursor": {
          "categoryBalloonDateFormat": "YYYY-MM-DD",
          "cursorAlpha": 0.9,
          "valueLineEnabled":true,
          "valueLineBalloonEnabled":true,
          "valueLineAlpha":0.5,
          "fullWidth":false
        },
        "dataDateFormat": "YYYY-MM-DD",
        "categoryField": "date",
        "categoryAxis": {
          "minPeriod": "DD",
          "parseDates": true,
          "minorGridAlpha": 0.1,
          "minorGridEnabled": true
        },
        "export": {
          "enabled": true
        }
      };

      ChartUtils.counter += graphs.length;
      return opt;
    }

}
