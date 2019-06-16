import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class City extends Component {
  constructor() {
    super();
    this.state = {
      selectCities: Array.apply(null, { length:99 }).map(function (undef, i) {
    return false}),
      city: {},
      graph: [],
      years:[]
    };

    // 都道府県一覧を取得
    fetch('https://opendata.resas-portal.go.jp/api/v1/prefectures', {
      headers: { 'X-API-KEY': "zSqPZVLX2YOY00Pd7hO8M0Lg6OXRY5JtW3BfLiZc" }
    })
    .then(res => res.json())
    .then(res => {
      this.setState({ city: res.result });
    });
  }

  renderCity(props) {
    return (
      <li>
        <input type="checkbox"
               id={props.prefCode}
               onChange={() => this.changeCity(props.prefCode)}
        />
        <label for={props.prefCode}>{props.prefName}</label>
      </li>
    );
  }
  changeCity(index) {
    index--;

    // stateの内容を退避
    const tmpChecked = this.state.selectCities.slice();

    // グラフ用データ
    var aryGraphData = [];
    var aryYears = [];

    // 選択時
    if( !tmpChecked[index] ){
      // 対象の都道府県情報を取得
      fetch("https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode="+(index+1), {
        headers: { 'X-API-KEY': "zSqPZVLX2YOY00Pd7hO8M0Lg6OXRY5JtW3BfLiZc" }
      })
      .then(res => res.json())
      .then(res => {
        let tmpYearlyPop = Object(res.result.data[0].data);
        for( var i = 0 ; i < tmpYearlyPop.length; i++){
           aryGraphData.push(tmpYearlyPop[i].value);
           aryYears.push(tmpYearlyPop[i].year)
        }

        this.setState({
          graph: [...this.state.graph,{
              name: this.state.city[index].prefName,
              data: [...aryGraphData]
          }],
          years:aryYears
        });
      });
    // 選択外し
    }else{
      var tmpGraph = this.state.graph;
      var setGraph = []
        for( var i = 0 ; i < tmpGraph.length; i++){
          if(tmpGraph[i].name !== this.state.city[index].prefName){
            setGraph.push(tmpGraph[i]);
          }
        }

        this.setState({
          graph: setGraph
        });
    }

    // Render
    tmpChecked[index] = !tmpChecked[index];
    this.setState({ selectCities: tmpChecked });
  }

  render() {
    const alCities = this.state.city;
    const options = {
      title: {  //グラフのタイトル
          text: '都道府県別の総人口推移'
      },

      yAxis: {  //y軸の設定
          title: {  //y軸のタイトル
              text: '人口数'
          }
      },
      xAxis: {  //y軸の設定
          title: {  //y軸のタイトル
              text: '年度'
          },
          //
          categories : this.state.years
      },
      legend: {  //グラフの凡例
          layout: 'vertical',  //縦方向に並べる
          align: 'right',  //グラフの右に表示（左右中央）
          verticalAlign: 'top'  //グラフの中央に表示（上下中央）
      },
      // 名前＋数値データ
      series: this.state.graph
    };
    return (
      <div>
        <ul>
        {Object.keys(alCities).map(key => this.renderCity(alCities[key]))}
        </ul>
        <HighchartsReact highcharts={Highcharts} options={options} />
        {this.state.value}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <City />
      </div>
    );
  }
}

export default App;
