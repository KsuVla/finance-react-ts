import React from 'react';
import '../EntryHistory/EntryHistory.scss';

import ButtonSubmit from '../ButtonSubmit/ButtonSubmit';
import InputText from '../InputText/InputText';

type Props = {
  date: string;
  sumStr: string;
  sum: string;
  name: string;
  idItem: number;
  state: string;
};

export class EntryHistoryEditMonth extends React.Component<Props> {
  data: Props;

  constructor(props: Props) {
    super(props);
    this.data = this.props;
  }

  render() {
    const {
      data: { date = 'дд.мм.гггг', idItem, sumStr = '0', name = '' },
    } = this;
    return (
      <form className="entry-history entry-history_edit " name={`entry${idItem}`} id={`${idItem}`}>
        <p className="entry-history__item entry-history__item_date">{date}</p>
        <div className="entry-history__item-edit entry-history__item_input-sum">
          <InputText id={'ff_sum'} name={'sumEntry'} inputText={sumStr} placeholder={'1000'} type="count" />
        </div>
        <div className="entry-history__item-edit">
          <InputText id={'ff_name'} name={'nameEntry'} inputText={name} placeholder={'наименование'} />
        </div>
        <ButtonSubmit text={'сохр.'} border={false} name="save" />
        <div className="entry-history__item-edit entry-history__item-edit_1-5">
          <p className="form-finance__notification"></p>
        </div>
      </form>
    );
  }

  componentDidMount() {}
}

export default EntryHistoryEditMonth;
