### Criando uma aplicação de Mapas com __React__ e __Mapbox__ GL JS

Irei fazer uma série de 'artigos' mostrando como criar uma aplicação rica de funcionalidades utilizando React e Mapbox, também utilizaremos algumas bibliotecas interessantes como TurfJS e Mapbox GL Draw, sintam-se a vontade para opinar a respeito e dar pull requests, pois o intuito é sempre passar o conhecimento adiante, e quanto mais colaboradores melhor. Segue o bonde...

#### Documentações:

* [Mapbox](https://www.mapbox.com/mapbox-gl-js/api/)
* [ReactJS](https://facebook.github.io/react/docs/hello-world.html)
* [Create React App](https://github.com/facebookincubator/create-react-app)
* [Material UI](http://www.material-ui.com)

#### Getting started

Primeiramente devemos instalar globalmente o Create React App usando `npm install -g create-react-app`.  

Depois de instalado podemos navegar até uma pasta de preferencia e criar nossa primeira aplicação usando `create-react-app nomedomeuprojeto` o boilerplate básico vai ser intalado e configurado, e poderemos navegar até `nomedomeuprojeto` e dar um `npm start` pra vermos que a aplicação está no jeito para continuarmos o projeto \(todo esse tutorial pode ser encontrado na documentação oficial do create-react-app\).  

Antes de começarmos vamos apagar os arquivos de hello-world do create-react-app e deixar apenas  o necessário:  

```
--/node_modules  
--/public  
----index.html  
----manifest.json  
--/src
----App.css  
----App.js  
----index.css  
----index.js  
----registerServiceWorker.js  
--.gitignore  
--package.json  
--README.md
```  

Começaremos instalando o modulo `prop-types` pois chamar o metodo nativo está 'deprecated':

```
npm install --save prop-types
```

Agora vamos instalar os modulos mapbox-gl-js e material-ui:

```
npm install --save mapbox-gl
```
```
npm install --save material-ui
```

Para o desenvolvimento dos componentes em React nós vamos utilizar grande parte da [Metodologia para desenvolvimento de projetos em React \(web e native\)](https://github.com/rafaelcorreiapoli/react-metodologia) feita pelo [Rafael Correia](https://github.com/rafaelcorreiapoli). E para o design dos componentes utilizaremos o Material UI - "A Set of React Components that Implement Google's Material Design".  

Como na propria documentação do material-ui nos diz, devemos instalar o modulo _react-tap-event-plugin_ para ouvir eventos de touch, tap e click.  

```
npm install --save react-tap-event-plugin
```

Logo em seguida importa-lo na raiz da aplicação, no caso o nosso index.js da /src:

```js
import React from 'react';
import ReactDOM from 'react-dom'

import injectTapEventPlugin from 'react-tap-event-plugin'

import App from './App';
import registerServiceWorker from './registerServiceWorker'
import './index.css'

injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
```  

Vamos criar a pasta `app/components` dentro da `/src` para colocarmos nossos componentes que iremos criar:

```
mkdir src/app/components
```

Agora podemos criar nosso primeiro componente o **header.js**:

```js
import React from 'react'

import PropTypes from 'prop-types'

import { AppBar } from 'material-ui'

const Header = ({title, iconClassNameRight}) => {
  return(
    <AppBar
      title={title}
      iconClassNameRight={iconClassNameRight}
    />
  )
}

const { string } = PropTypes

Header.propTypes = {
  title: string.isRequired,
  iconClassNameRight: string.isRequired
}

export default Header

// a principio nosso header vai receber apenas duas props
```

Vamos criar uma pasta chamada `containers` e criar um arquivo chamado **homeContainer.js** para seguirmos a ideia de componentização.

Importamos o header no nosso **homeContainer.js**:

```js
import React, { Component } from 'react'

import Header from '../components/header'

class Home extends Component {
  render(){
    return(
      <div>
        <Header
          title='Mapster'
          iconClassNameRight='muidocs-icon-navigation-expand-more'
        />
      </div>
    )
  }
}

export default Home
```

Agora vamos usar uma 'trick' bem massa, o material-ui tem todo o esquema de cores da [UI Color Palette](https://www.google.com/design/spec/style/color.html#color-ui-color-palette) criado em forma de variáveis e isso nos permite dar uma customizada nas cores padrões sem ter que criar classes e CSS pŕoprios.

Vamos criar uma pasta chamada `themes` dentro da pasta `app`, e dentro dela criaremos um **index.js**:

```js
// nosso index.js ficará assim

import { getMuiTheme } from 'material-ui/styles' // o metodo que lida com essa estilização

import { deepPurple600 } from 'material-ui/styles/colors' // nossa cor diferente da cor padrão

export const muiTheme = getMuiTheme({
  appBar: {
    color: deepPurple600
  }
})

// note que exportamos uma constante que usa o metodo getMuiTheme num objeto o qual passamos
// o componente e as propriedades que queremos mudar.
```

Daí finalmente podemos ir no nosso `App.js` e deixa-lo dessa maneira:

```js
import React, { Component } from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider' // esse cara lida com a customização

import { muiTheme } from './app/themes' // nosso metodo com estilo proprio

import './App.css';

import Home from './app/containers/homeContainer' // o container header que criamos

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Home />
      </MuiThemeProvider>
    );
  }
}

export default App;
```

Agora podemos sair dos 'baby steps' e evoluir nossa aplicação, criando nosso componente `map.js` assim:

**_irei explicar passo a passo..._**

```js
//... acima tem os imports necessarios ...

class Map extends Component{ // criamos nosso componente Map como classe pois precisaremos usar algumas propriedades especificas
  constructor(props){
    super(props)
    this.state = {
      center: [-74.50, 40] // aqui setamos um estado inicial para ser o centro do mapa padrão
    }
    this.handleMap = this.handleMap.bind(this) // bind nas funções
    this.handlePosition = this.handlePosition.bind(this)
    this.handleFlyToAPosition = this.handleFlyToAPosition.bind(this)
  }

  // AGORA A GRANDE SACADA... é preciso criar uma função que lide com o mapa, que no caso é a handleMap, mas temos um porém, se você não manja do lifecycle do react provavelmente voce iria quebrar a cabeça com isso, pois temos que chamar a função que lida com o mapa APÓS o componente ser carregado, para que só assim ela reconheça a div que setamos na propriedade 'container' caso contrario ele ira carregar o canvas para renderizar o mapa, mas não irá encontrar o componente que precisa 'joga-lo' dentro, portanto sabendo disso, chamamos a função handleMap na função componentDidMount, pois ela só vai ser executada depois do metodo render, ou seja, depois que nossos componentes já tiverem sido carregados.

  componentDidMount(){
    const { container, style, zoom, accessToken } = this.props
    const { center } = this.state
    this.handleMap(container, style, center, zoom, accessToken)
    this.handlePosition()
  }

// a função handleMap, vai receber as props que passamos no homeContainer, e vai criar uma constante chamada Map, e que vai criar um novo mapa(a documentação do Mapbox tem todo esse getstated). Depois passamos para o state essa constante, apenas para não ficar criando objetos globais, pois precisaremos chamar esse cara depois.

  handleMap(container, style, center, zoom, accessToken){
    mapboxgl.accessToken = accessToken
    const map = new mapboxgl.Map({
      container: container,
      style: style,
      center: center,
      zoom: zoom
    })
    this.setState({
      map: map
    })
  }

// Aqui criamos uma função que usa uma feature do HTML5, chamada getCurrentPosition, que pega as informações de latitude e longitude do browser, caso o usuario permita, daí jogamos essas informações no estado da nossa aplicação para usar uma feature do mapbox logo em seguida, que vai fazer um 'flyTo' da posição inicial até a posição do usuario, esse evento é chamado pelo clique do botão 'Me Encontre'.

  handlePosition(){
    const options = {
      enableHighAccuracy: true
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const center = [pos.coords.longitude, pos.coords.latitude]
      this.setState({
        center: center
      })
    }, (err) => {
      console.log(err)
    }, options)
  }

// E finalmente a função que vai fazer esse 'flyTo', ela apenas pega as informações que jogamos no estado e executa a ação, veja que aqui precisamos usar a constante 'map', pois quando voce usa o metodo 'new mapboxgl.Map' somente essa constante possui os metodos para lidarmos com ações no mapa, por isso jogamos ela no estado ai cria-la para nao ficarmos gerando objetos globais.

  handleFlyToAPosition(){
    const { center, map } = this.state
    map.flyTo({
      center: center
    })
  }
  render(){
    const { container, classNameStyle } = this.props
    return(
      <div id={container} className={classNameStyle}>
        <div className='buttonMapTrackMe'> // uma classe própria para o posicionamento do componente botão
              <Button
                label='Me encontre'
                primary={false}
                onClickFunction={this.handleFlyToAPosition}
              />
        </div>

      </div>
    )
  }
}

const { string, number } = PropTypes

Map.propTypes = {
  container: string.isRequired,
  style: string.isRequired,
  classNameStyle: string.isRequired,
  zoom: number.isRequired,
  accessToken: string.isRequired
}

export default Map
```

Então temos nossa pequena aplicação, ainda sem muitas funcionalidades, porem utilizando React e Mapbox, também conseguimos criar nossos componentes com algumas boas práticas e focando no 'modelo' de desenvolvimento utilizando React. Nos proximos artigos irei focar mais em como criar features interessantes usando das ferramentas do Mapbox e do conceito de desenvolvimento com React, portanto teremos menos 'step-by-step' de 'como escrever código' e mais discussões a respeito das ferramentas e features. Até a proxima...

_feel free to pull request me if you want!!!_
