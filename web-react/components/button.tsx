import React from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

const Button: React.FC<any> = (props) => {
  const { mode, theme } = useSelector((state: RootStateOrAny) => state);

  return (
    <button className="Button" onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export default Button