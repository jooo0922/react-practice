import React, {
  Component
} from 'react';

class Subject extends Component {
  render() {
    console.log('Subject render');
    return (
      <header>
        <h1><a href="/" onClick={function(e){
          e.preventDefault();
          this.props.onChangePage();
        }.bind(this)}>{this.props.title}</a></h1>
        {this.props.sub}
      </header>
    );
  }
}

export default Subject;

/**
 * onClick에 할당된 콜백함수도 App 컴포넌트에서 했던 것과 마찬가지로 바인딩 및 preventDefault를 해줘야 할 것이고,
 * App에서 정의한 Subject 컴포넌트의 props 중에서 '이벤트(즉, onChangePage)'에 해당하는 prop을 호출하면 됨. 
 * 
 * 왜냐? App에서 onChangePage에 함수를 할당해줬기 때문에, 저 prop은 '함수'가 되는 것임.
 * 그러니까 이벤트 prop에 정의된 함수를 a태그 클릭 시 호출함으로써,
 * Subject 컴포넌트의 사용자가 onChangePage에 할당한 사용자 정의 함수를 실행하게 되겠지.
 * 
 * 이런 식으로 컴포넌트 내부에서 사용자가 정의한 함수를 호출할 수 있음!
 */