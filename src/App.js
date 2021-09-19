import React, { Component } from "react";
import TOC from "./components/TOC";
import ReadContent from "./components/ReadContent";
import CreateContent from "./components/CreateContent";
import UpdateContent from "./components/UpdateContent";
import Subject from "./components/Subject";
import Control from "./components/Control";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.max_content_id = 3;
    this.state = {
      mode: "welcome",
      selected_content_id: 2,
      subject: { title: "WEB", sub: "World Wide Web!" },
      welcome: { title: "Welcome", desc: "Hello, React!!" },
      contents: [
        { id: 1, title: "HTML", desc: "HTML is for Information" },
        { id: 2, title: "CSS", desc: "CSS is for design" },
        { id: 3, title: "JavaScript", desc: "JavaScript is for interactive" },
      ],
    };
  }

  getReadContent() {
    let i = 0;
    while (i < this.state.contents.length) {
      const data = this.state.contents[i];
      if (data.id === this.state.selected_content_id) {
        return data;
        break;
      }
      i = i + 1;
    }
  }

  getContent() {
    let _title,
      _desc,
      _article = null;
    if (this.state.mode === "welcome") {
      _title = this.state.welcome.title;
      _desc = this.state.welcome.desc;
      _article = <ReadContent title={_title} desc={_desc}></ReadContent>;
    } else if (this.state.mode === "read") {
      const _content = this.getReadContent();
      _article = (
        <ReadContent title={_content.title} desc={_content.desc}></ReadContent>
      );
    } else if (this.state.mode === "create") {
      _article = (
        <CreateContent
          onSubmit={function (_title, _desc) {
            // add content to this.state.contents
            this.max_content_id = this.max_content_id + 1;
            // const _contents = this.state.contents.concat({
            //   id: this.max_content_id,
            //   title: _title,
            //   desc: _desc,
            // });
            const _contents = Array.from(this.state.contents);
            _contents.push({
              id: this.max_content_id,
              title: _title,
              desc: _desc,
            });
            this.setState({
              contents: _contents,
              mode: "read",
              selected_content_id: this.max_content_id, // 얘내도 업데이트와 마찬가지로 create 하자마자 read 모드로 바꾸고, 현재 content_id를 방금 추가해 준 max_content_id로 바꿔줘서 제출하자마자 추가한 content가 보이도록 함
            });
          }.bind(this)}
        ></CreateContent>
      );
    } else if (this.state.mode === "update") {
      const _content = this.getReadContent();
      _article = (
        <UpdateContent
          data={_content}
          onSubmit={function (_id, _title, _desc) {
            // 새로운 배열 추가가 아닌, 기존의 contents 배열을 수정해야 하므로 Array.from을 이용해서 내용은 동일하지만 전혀 다른 새로운 배열을 복사함.
            // 이런거를 Immutable(불변성), 즉 원본을 바꾸지 않는 테크닉이고, 성능 개선 시 필요하다는 거 배웠지!
            // 그니까 쉽게 생각하면, state 내의 배열이나 객체 수정 시, 일단 복제하고, 복제한 거를 수정해서 다시 넣어준다고 생각하면 됨.
            let _contents = Array.from(this.state.contents);
            let i = 0;
            while (i < _contents.length) {
              if (_contents[i].id === _id) {
                _contents[i] = {
                  id: _id,
                  title: _title,
                  desc: _desc,
                };
                break;
              }
              i = i + 1;
            } // getReadContent()와 비슷함. contents 배열을 반복문으로 돌려서 전달받은 _id값과 일치하는 content를 찾고, 안에 값들을 전달받은 값으로 바꿔줌.
            this.setState({
              contents: _contents,
              mode: "read", // 이거는 뭐냐면, update 모드에서 제출과 동시에 this.state.mode도 'read'로 바꿔줘서 수정된 content를 클릭하지 않아도 자동으로 모드를 변경하여 보여주려는 것.
            });
          }.bind(this)}
        ></UpdateContent>
      );
    }

    return _article;
  }

  render() {
    console.log("App render");
    return (
      <div className="App">
        <Subject
          title={this.state.subject.title}
          sub={this.state.subject.sub}
          onChangePage={function () {
            // 참고로 Subject 컴포넌트에서 처럼 a태그의 onClick에 할당하는 함수가 아니므로,
            // e.preventDefault()를 해주지 않아도 됨. 그거는 Subject 컴포넌트 내에서 자체적으로 해주고 있음.
            this.setState({
              mode: "welcome",
            });
          }.bind(this)}
        ></Subject>
        <TOC
          onChangePage={function (id) {
            this.setState({
              mode: "read",
              selected_content_id: Number(id),
            });
          }.bind(this)}
          data={this.state.contents}
        ></TOC>
        <Control
          onChangeMode={function (_mode) {
            if (_mode === "delete") {
              if (window.confirm("really?")) {
                let _contents = Array.from(this.state.contents); // 위에서 update, create에서 해줬던 것과 동일하게 contents 배열 원본을 복사하고, 그거를 while 문을 돌려서 selected_index_id와 동일한 content를 찾아줌.
                let i = 0;
                while (i < _contents.length) {
                  if (_contents[i].id === this.state.selected_content_id) {
                    // 현재 선택된 content의 id와 동일한 content를 찾아야 하니까!
                    _contents.splice(i, 1); // 복사한 배열의 i번째에서 1개만 지움.
                    break; // 값을 바꿨으면 더 이상 순회할 필요가 없으니 순회를 중단
                  }
                  i = i + 1;
                }
                this.setState({
                  mode: "welcome", // 삭제를 끝마쳤으면 맨처음 모드였던 welcome으로 돌아와야 함.
                  contents: _contents, // 선택된 content가 삭제된 복사 배열을 this.state.contents에 다시 넣어줌.
                });
                alert("deleted!");
              }
            } else {
              this.setState({
                mode: _mode,
              });
            }
          }.bind(this)}
        ></Control>
        {this.getContent()}
      </div>
    );
  }
}

export default App;

/**
 * 1. 이벤트가 발생했을 때 호출되는 이벤트핸들러 함수 내부에서는
 * this가 비어있기 때문에 this를 바인딩해줘야 함.
 *
 *
 * 2. this.state.mode = 'welcome';
 * 이렇게 써주면 리액트는 state가 바뀌었다는 것을 감지하지 못함.
 *
 * 왜냐하면, constructor(생성자)에서는 state를 저렇게 변경하거나 할당해줘도 되지만,
 * 이미 컴포넌트가 생성이 끝난 후, 이벤트 등에 의해 동적으로 state값을 바꿀 때는 저렇게 하면 안되기 때문임.
 * 따라서 아래와 같이 this.setState()를 사용해서 변경하고 싶은 값을 객체 형태로 전달해줘야
 * 리액트는 state가 변경되었음을 감지함.
 *
 * 근데 저런 방식으로 해도, 실제 this.state의 값이 바뀌는 것은 맞다.
 * 그런데 왜 아무런 변화가 없는걸까? render가 왜 재호출되지 않는걸까?
 * 왜냐하면, this.state.mode = ~~ 이런 식으로 바꾸는 게 사실상 리액트가 모르게 바꾸는 셈.
 * 리액트에게 값을 변경하려는 것을 알리면서 바꿔줘야 render가 다시 호출되겠지.
 * state가 변경되는 순간 render 메서드를 다시 호출하는 게 리액트에서 정한 약속이기 때문!
 *
 *
 * 3. 이제 저렇게 만든 이벤트핸들러 함수를 Subject 컴포넌트 내에서 호출해서 사용하려면 어떻게 해야 할까?
 * 컴포넌트의 props에 '이벤트 직접 만들면' 됨.
 *
 * 이렇게 하면, 내가 만든 컴포넌트를 다른 사용자들이 사용할 때 해당 이벤트에
 * 함수만 작성이 되면, 그 이벤트가 발생했을 때 사용자가 작성한 함수가 실행되도록 할 수 있음.
 *
 * 즉, 엘레먼트에 달린 이벤트를 사용하는 게 아닌,
 * 내가 직접 컴포넌트에 이벤트를 만드는 '이벤트 생산자'가 된 것임.
 */

/**
 * Array.push() vs Array.concat()
 *
 * 공통점은 둘 다 원본 배열 끝 부분에 요소를 추가하는 기능을 함.
 *
 * 차이점은 Array.push() 하면, 원본 배열인 Array 자체를 변화시킴. 원본 배열이 변화함.
 * 그러나, Array.concat() 하면, 원본 배열인 Array는 변하지 않음. 원본은 건드리지 않는 것.
 * 대신 const result = Array.concat() 이런 식으로 원본 배열에 값이 추가된 새로운 배열을 리턴받아서
 * 어떤 변수에 할당해놓게 되면, 거기에는 값이 추가된 배열로 할당이 됨.
 *
 * 즉, 원본 배열이 변화하냐, 아니면 원본 배열은 건들지 않고 새로운 배열을 리턴해주냐의 차이.
 *
 * 그럼 왜 위에서 this.state.contents에 값을 추가할 때 concat를 이용한걸까?
 * 왜냐하면, React에서는 state에 값을 추가할때는, 오리지널 데이터를 변형시키는 push와 같은 것을 쓰는 건 좋지 않음.
 * 그것보다는, concat 처럼 오리지널 데이터를 변경하지 않고 새로운 데이터를 추가하는 방법을 사용해야 함.
 *
 * 그래서 원본인 state 내부 데이터를 변경하지 않은 채 새로운 배열을 리턴받은 뒤,
 * 그걸 this.setState를 이용해서 추가해줘야 리액트도 state가 변경되었음을 감지할 수 있고,
 * 기존 데이터를 건들이지 않기 때문에 나중에 리액트 앱의 성능을 개선해야 할 때
 * 훨씬 쉽게 개선할 수 있음.
 *
 * 그럼 구체적으로 어떻게 성능 개선을 하길래 concat을 쓰라는거야?
 * App 컴포넌트의 자식 컴포넌트인 TOC, Control 등등은 App의 state 값이 바뀔때마다
 * 일률적으로 render 메서드를 호출하게 됨.
 *
 * 그런데, 굳이 UI적으로 변화가 없는 컴포넌트를 모두 다 render 실행시키면 불필요한 계산을 하게 됨.
 * 그래서 React 에서는 각각의 하위 컴포넌트의 render 메서드를 상황에 따라 실행할 지 말 지를 결정하는
 * shouldComponentUpdate(newProps, newState) 라는 메서드를 사용함.
 *
 * 여기서 newProps, newState를 인자로 받아서 해당 컴포넌트가 원래 가지고 있던
 * this.props, this.state와 비교해서 달라진 값이 존재하면 true, 그렇지 않으면 false 이런 식으로 리턴해줘서
 * render 메서드를 호출할 지 말 지를 결정하는 원리임.
 * -> 이렇게 하면 불필요한 컴포넌트의 render 호출을 방지함으로써 성능 개선이 가능하겠지!
 *
 * 그런데 push를 이용하여 this.state, this.props 내부의 원본 값을 변경해버리면,
 * 기존의 this.state와 this.props의 값이 newProps, newState의 값과 동일하게 되어버림.
 * 이러면 둘 다 똑같아지니까 값이 변경된건지 안된건지 구분이 안되겠지?
 *
 * 그래서 결국 원본 state, props값은 변경하지 않는 concat을 써줘야
 * shouldComponentUpdate를 제대로 사용할 수 있기 때문에 concat을 쓰라고 하는 거임.
 * 그래야 성능 개선이 가능할테니까!!
 *
 * 물론 애플리케이션의 규모가 워낙 쪼그매서 성능개선할 필요 없다면 그냥 push를 쓰건 concat을 쓰건 상관없음.
 * 근데 만약 하위 컴포넌트들이 너무 많아져서 매번 다 render하기 어려운 규모라면
 * 당연히 concat을 써줘야겠지!
 */

/**
 * Immutable(불변성) -> 원본을 바꾸지 않는다, 원본이 불변한다 라는 뜻의 개념
 *
 * 1. 만약 배열에서 concat을 쓸지, push를 쓸지 일일히 다 구분하기가 귀찮다면,
 * const 새 배열 = Array.from(원본 배열) 이런 식으로 새로운 배열을 리턴받아도 됨.
 * Array.from으로 리턴받는 새 배열은 원본 배열과 내용은 동일하지만,
 * '새 배열 === 원본 배열' => false로 나옴. 즉 서로 다른 배열이라는 뜻.
 * 그래서 새 배열에 push를 써도 원본배열의 값이 변하지 않아서 사용하기 편리함.
 * 만약 push를 그냥 쭉 써버리고 싶다면 Array.from으로 새 배열을 리턴받아서 사용할 것.
 *
 * 2. 그럼 객체(Object)에서는 어떻게 해야 새 객체를 얻을 수 있을까?
 * const 새 객체 = Object.assign({}, 원본 객체)를 해주면 됨.
 * Array.from과 마찬가지로 새 객체와 원본 객체는 내용은 동일하지만,
 * '새 객체 === 원본 객체' => false로 나옴.
 * 또한 const 새 객체 = Object.assign({left: 1, right: 2}, 원본 객체) 이런 식으로 해주면,
 * 새 객체에는 {left: 1, right: 2}에 원본 객체의 값들이 추가된 새로운 객체가 리턴됨.
 */

/**
 * Window.confirm(message)
 *
 * 확인, 취소 두 버튼을 가지며, 인자로 전달한 string을 메시지로 표시해주는 모달창을 띄움.
 * 이 모달창에서 사용자가 확인을 누르면 true를, 취소를 누르면 false를 리턴해 줌.
 *
 * 위에서는 delete 버튼을 눌렀을 때, 정말 삭제할 것인지 확인하는 용도로 사용한 것!
 */
