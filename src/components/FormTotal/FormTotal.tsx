import React from 'react';
import './FormTotal.scss';

import { Requests } from './FormTotal.Requests';

interface Props {
  caption: string;
  name: string;
  type: string;
  classBlock: string;
}

interface State {
  finance: number;
  expMain: number;
  expMonth: number;
  expenses: number;
  balance: number;
  countDays: number;
  lastDays: number;
  willDays: number;
  mediumInDay: number;
  mediumInDayWill: number;
}

class FormTotal extends React.Component<Props, State> {
  static defaultProps = {
    caption: 'Имя формы',
    name: '',
    type: '',
    classBlock: '',
  };

  data: Props;
  refForm: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
    this.refForm = React.createRef();

    this.state = {
      finance: 0,
      expMain: 0,
      expMonth: 0,
      expenses: 0,
      balance: 0,
      countDays: 0,
      lastDays: 0,
      willDays: 0,
      mediumInDay: 0,
      mediumInDayWill: 0,
    };
  }

  render() {
    let {
      data: { caption },
      refForm,
    } = this;

    return (
      <div className="form-total" ref={refForm}>
        <h1 className="form-total__topic">{caption}</h1>

        <p className="form-total__item">
          Поступление: <span className="form-total__item-count">{this.state.finance}</span>
        </p>
        <p className="form-total__item">
          Расходы: <span className="form-total__item-count">{this.state.expMain} </span>+
          <span className="form-total__item-count"> {this.state.expMonth} </span>=
          <span className="form-total__item-count"> {this.state.expenses} </span>
        </p>

        <hr className="form-total__hr-line "></hr>

        <div className="form-total__total">Текущее: {this.state.balance}</div>

        <hr className="form-total__hr-line "></hr>

        <p className="form-total__item">
          Дней в периоде: <span className="form-total__item-count">{this.state.countDays} </span>
        </p>
        <p className="form-total__item">
          Прошло: <span className="form-total__item-count"> {this.state.lastDays} </span>
        </p>
        <p className="form-total__item">
          Осталось:<span className="form-total__item-count"> {this.state.willDays} </span>
        </p>

        <hr className="form-total__hr-line "></hr>

        <p className="form-total__item">
          Среднее в день:<span className="form-total__item-count"> {this.state.mediumInDay} </span>
        </p>
        <p className="form-total__item">
          Среднее в день осталось:
          <span className="form-total__item-count"> {this.state.mediumInDayWill} </span>
        </p>

        <div className="form-total__item form-total__item_grid">
          <p></p>
          <p className="form-total__item-caption">В день</p>
          <p className="form-total__item-caption">Всего</p>

          <p className="form-total__item-caption">Прогноз:</p>
          <p className="form-total__item-count"> 000 </p>
          <p className="form-total__item-count"> 000 </p>

          <p className="form-total__item-caption">Фактически:</p>
          <p className="form-total__item-count"> {this.state.mediumInDay} </p>
          <p className="form-total__item-count"> 000 </p>
          <p className="form-total__item-caption">Осталось:</p>
          <p className="form-total__item-count"> {this.state.mediumInDayWill} </p>
          <p className="form-total__item-count"> 0 </p>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const form = this.refForm.current;
    if (form) {
      const socket = new Requests(this);
      socket.getHistory();
    }
  }
}

export default FormTotal;
