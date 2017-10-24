import React from "react";

class InputBox extends React.Component {
  el = null;

  constructor(props) {
    super();

    this.state = {
      value: props.children,
    }
  }

  componentWillReceiveProps({ children: value }) {
    if (value !== this.state.value) {
      this.setState({ value });
    }
  }

  handleFocus = (e) => {
    e.target.select();
  };

  handleBlur = (e) => {
    this.update();
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.update(e);
      e.target.blur();
    }
  };

  handleChange = (e) => {
    const { value } = e.target;

    this.setState({ value });
  };

  update = () => {
    this.props.onUpdate(this.state.value);
  };

  render() {
    const { children, onUpdate, ...props } = this.props;

    return <input
      ref={ref => this.el = ref}
      onFocus={this.handleFocus}
      onChange={this.handleChange}
      {...props}
      type="text"
      value={this.state.value}
      onBlur={this.handleBlur}
      onKeyDown={this.handleKeyDown}
    />
  }
}

InputBox.defaultProps = {
  type: "text",
  onUpdate: () => undefined,
};

export default InputBox;
