import React from 'react';
import './FormFinance.scss';

import ButtonSubmit from '../ButtonSubmit/ButtonSubmit';
import InputText from '../InputText/InputText';
import History from '../History/History';

import { Requests } from './FormFinance.Requests';
import { HistoryList } from '../../modules/interfaces';

interface Props {
  caption: string;
  name: string;
  type: string;
  classBlock: string;
}

class FormFinance extends React.Component<Props, HistoryList> {
  static defaultProps = {
    caption: 'Имя формы',
    name: '',
    type: '',
    classBlock: '',
  };

  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;

    this.state = {
      historyList: [],
    };
  }

  render() {
    let {
      data: { caption, name },
    } = this;

    return (
      <div className="form-finance">
        <h1 className="form-finance__topic">{caption}</h1>

        <form className="form-finance__ff-send" name={name}>
          <div className="form-finance__item form-finance__item_input-date">
            <InputText id={'ff_date'} name={'date'} />
          </div>
          <div className="form-finance__item form-finance__item_input-sum">
            <InputText id={'ff_sum'} name={'sumEntry'} placeholder={'1000'} />
          </div>
          <div className="form-finance__item">
            <InputText id={'ff_name'} name={'nameEntry'} placeholder={'наименование'} />
          </div>
          <div className="form-finance__item">
            <ButtonSubmit text={'Добавить'} border={false} />
          </div>

          <div className="form-finance__item_1-5">
            <p className="form-finance__notification"></p>
          </div>
        </form>

        <hr className="form-finance__hr-line "></hr>

        <History historyList={this.state.historyList} />
      </div>
    );
  }

  componentDidMount() {
    const socket = new Requests();
    socket.getHistory(this);
  }
}

export default FormFinance;
