import React, { Component } from "react";

class TOC extends Component {
  shouldComponentUpdate(newProps, newState) {
    if (this.props.data === newProps.data) {
      return false;
    }
    return true;
  }

  render() {
    console.log("===>TOC render");
    let lists = [];
    const data = this.props.data;
    let i = 0;
    while (i < data.length) {
      lists.push(
        <li key={data[i].id}>
          <a
            href={"/content/" + data[i].id}
            data-id={data[i].id}
            onClick={function (e) {
              e.preventDefault();
              this.props.onChangePage(e.target.dataset.id);
            }.bind(this)}
          >
            {data[i].title}
          </a>
        </li>
      );
      i = i + 1;
    }

    return (
      <nav>
        <ul>{lists}</ul>
      </nav>
    );
  }
}

export default TOC;

/**
 * id값을 onClick에 할당하는 콜백함수에 전달하는 또 다른 방법: .bind()를 이용할 것!
 *
 * .bind(this)는 보통 this를 바인딩할 때 주로 사용하지만,
 * .bind(this, 인자1, 인자2, 인자3, ...) 이런 식으로 this 이후에 인자들을 더 넣어주면,
 * 바인딩된 콜백함수에 (인자1, 인자2, 인자3, ..., e) 이렇게 바인딩 된 인자들을 전달해줄 수 있음.
 * 이벤트 객체인 e는 그 순서가 점점 밀려서 맨 뒤에 위치하게 됨.
 *
 * 이렇게 하면 바인딩된 콜백함수에서 전달받은 인자를 사용할 수 있게 되는 것.
 * 이런 식으로도 id값을 전달할 수 있다! 아래에 예제를 남겨놓았음.
 *
 * <a
 *   href={"/content/" + data[i].id}
 *   onClick = {function(id, e){
 *     e.preventDefault();
 *     this.props.onChangePage(id);
 *   }.bind(this, data[i].id)}
 * >{data[i].title}</a>
 */
