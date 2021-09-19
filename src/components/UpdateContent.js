import React, { Component } from "react";

class UpdateContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.data.id,
      title: this.props.data.title,
      desc: this.props.data.desc,
    };
    this.inputFormHandler = this.inputFormHandler.bind(this); // 생성자에서 미리 바인딩하여 다른 메서드에서 함수처럼 사용하는 방법. 개인 프로젝트에서도 여러 번 해봤지?
  }

  // onChange prop에 할당하는 핸들러 함수의 중복을 피하기 위해서 만든 메서드
  inputFormHandler(e) {
    // key 자리에 [string]를 이용해서 문자열을 객체의 key값으로 사용할 수 있음.
    // input, textarea 모두 name이라는 prop이 있으니까, 둘 중 어디에서 핸들러 함수가 호출되던
    // e.target.name값을 state의 key값으로 사용해주면 각 입력폼에 대응하는 state 값을 setState로 변경시킬 수 있는것임.
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    console.log(this.props.data);
    console.log("UpdateContent render");
    return (
      <article>
        <h2>Update</h2>
        <form
          action="/create_process"
          method="post"
          onSubmit={function (e) {
            e.preventDefault();
            this.props.onSubmit(
              this.state.id,
              this.state.title,
              this.state.desc
            ); // App.state.contents에서 현재 content를 바꿔주기 위해 전달하는 값들.
            // this.state값들이 inputFormHandler에 의해 각 입력폼의 value와 동기화되므로 this.state 값들로 전달해줘도 됨.
          }.bind(this)}
        >
          <input type="hidden" name="id" value={this.state.id} />
          <p>
            <input
              type="text"
              name="title"
              placeholder="title"
              value={this.state.title}
              onChange={this.inputFormHandler}
            />
          </p>
          <p>
            <textarea
              name="desc"
              placeholder="description"
              value={this.state.desc}
              onChange={this.inputFormHandler}
            ></textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
      </article>
    );
  }
}

export default UpdateContent;

/**
 * input 태그의 'value' prop에 this.props의 값을 바로 넣어주면 안됨.
 * 왜냐면, this.props는 read-only 데이터이므로, input의 value에 바로 넣어버리면
 * 그 초기값을 수정할 수 없게 됨.
 *
 * 따라서 this.props에 존재하는 넣고자 하는 값을 가변적인 state화 해야 함.
 *
 * 또한, 단순히 this.state에서 값만 넣어준다고 state값이 바뀌어야 할 근거는 없음!
 * 즉, state가 바뀔 일이 없는데도 state값을 넣어봤자 계속 read-only 데이터로 취급된다는 것.
 *
 * 따라서 onChange라는 prop을 사용해서 input의 value가 바뀔때마다
 * this.setState()로 e.target.value 즉, input에 입력하는 값을 state에 넣어줄 것임을 명시해야 함.
 * 그래야 React가 가변적인 state값이 value에 들어간다고 인식함!
 */

/**
 * HTML에서 textarea 태그는 일반적으로 default text를
 * <textarea>default text</textarea> 이렇게 넣는 게 맞음.
 *
 * 그러나, 여기서 사용되는 태그들은 HTML이 아닌 JSX임. 유사 HTML인거지.
 * 물론 나중에 리액트가 얘내들을 HTML 코드들로 바꿔주기는 하지만,
 * 엄밀히는 JSX !== HTML 이기 때문에 JSX는 JSX의 문법이 있는것임.
 *
 * 그래서 JSX에서는 default 값을 저런 식으로 태그 사이에 넣지 않고,
 * value라는 props를 정의한 다음 그 안에다가 넣어줘야 함. 안그러면 에러가 남.
 *
 * 물론 input 태그와 마찬가지로 onChange라는 prop을 사용해서
 * textarea의 value가 바뀔때마다 setState()로 입력받은 값을 넣어줄 것임을 명시해야 함.
 */

/**
 * App.state.contents의 내용을 업데이트 해주려면
 * 어디를 업데이트 할 것인지에 대한 식별자, 즉 id값을 알아야 함.
 *
 * 따라서 이 식별자에 대해서도 입력폼을 만들어야 하는데
 * 식별자는 사용자한테 보일 필요가 없기 때문에 'hidden form'을 사용함.
 *
 * 대신 식별자는 입력값을 받아서 변하는 값이 아니므로 onChange 핸들러는 없어도 됨.
 */
