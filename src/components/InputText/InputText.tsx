import React from 'react';
import Cleave from 'cleave.js/react';

import './InputText.scss';
import TopicLabel from '../../components/topic-label/topic-label';

type Props = {
  id: string;
  topic?: string;
  label?: string;
  placeholder?: string;
  inputText?: string;
  state?: string;
  type?: string;
  name?: string;
};

class InputText extends React.Component<Props> {
  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
  }

  checkSubscription(type: string) {
    return type === 'subscription' ? 'input-text_subscription' : '';
  }
  checkFocus(state: string) {
    return state === 'focus' ? 'input-text__input_hover' : '';
  }
  checkNameDate(name: string) {
    return name === 'date' ? 'input-text__input_date' : '';
  }

  render() {
    let {
      data: {
        id,
        topic = '',
        label = '',
        placeholder = 'Введите данные...',
        inputText = '',
        state = '',
        type = '',
        name = '',
      },
    } = this;
    let pattern, title;

    placeholder = name === 'date' ? 'ДД.ММ.ГГГГ' : placeholder;

    if (type == 'count') {
      pattern = '[0-9+.]*';
      title = 'Только цифры и знаки: + .';
    }

    return (
      <div className={`input-text ${this.checkSubscription(type)}`}>
        <TopicLabel topic={topic} label={label} />
        {name === 'date' ? (
          <Cleave
            type="text"
            className={`input-text__input ${this.checkFocus(state)} ${this.checkNameDate(name)}`}
            name={name}
            placeholder={placeholder}
            id={`inputText${id}`}
            value={inputText}
            options={{
              date: true,
              delimiter: '.',
              datePattern: ['d', 'm', 'Y'],
            }}
          />
        ) : (
          <input
            type="text"
            className={`input-text__input ${this.checkFocus(state)} ${this.checkNameDate(name)}`}
            name={name}
            placeholder={placeholder}
            id={`inputText${id}`}
            defaultValue={inputText}
            pattern={pattern}
            title={title}
          ></input>
        )}
      </div>
    );
  }
}

export default InputText;
