import React from 'react';
import './finance.scss';
import FormFinance from '../../components/FormFinance/FormFinance';

class Finance extends React.Component<{}> {
  render() {
    return (
      <main className="finance">
        <div className="finance__content-container">
          <div className="finance__form-search-num">
            <FormFinance caption={'Доходы'} />
          </div>
        </div>
      </main>
    );
  }
}

export default Finance;