const WebSocketServer = new require('ws');
const fs = require('fs');
const clients = new Set();

const webSocketServer = new WebSocketServer.Server({ port: 9001 });
webSocketServer.on('connection', function (ws) {
  clients.add(ws);
  console.log(`Новое соединение ${clients}`);

  ws.on('message', function (message) {
    console.log(`Получено сообщение: ${message}`);

    const messageToString = JSON.parse(message);

    checkGetData(messageToString);
    checkAddFinance(messageToString);
    checkEditEntry(messageToString);
    checkSaveEntry(messageToString);
    checkDeleteEntry(messageToString);
  });

  ws.on('close', function () {
    console.log(`Соединение закрыто ${clients}`);
    clients.delete(ws);
  });
});

//--------------------------------------------------------------

function checkGetData(messageToString) {
  const formName = messageToString.getData;
  if (formName !== undefined) {
    runStart(formName);
    const getDataFile = getDataFromFile(formName);
    sortData(formName);

    const allSum = total(formName);

    if (getDataFile[formName] !== undefined) {
      for (const client of clients) {
        const getJSON = JSON.stringify({
          form: formName,
          [formName]: getDataFile[formName],
          allSum: allSum,
        });
        client.send(getJSON);
      }
    }
  }
}

function checkAddFinance(messageToString) {
  if (messageToString.addFinance !== undefined) {
    const formName = messageToString.formName;

    writeData(
      {
        [formName]: messageToString.addFinance,
      },
      formName
    );

    const getDataFile = getDataFromFile(formName);
    const allSum = total(formName);

    if (getDataFile[formName] !== undefined) {
      for (const client of clients) {
        const getJSON = JSON.stringify({
          addFinance: `Данные зафиксированы`,
          form: formName,
          [formName]: getDataFile[formName],
          allSum: allSum,
        });
        client.send(getJSON);
      }
    } else {
      for (const client of clients) {
        const getJSON = JSON.stringify({
          addFinance: `Данные зафиксированы, но получение обновленных данных не удалось`,
        });
        client.send(getJSON);
      }
    }
  }
}

function checkEditEntry(messageToString) {
  if (messageToString.editEntry !== undefined) {
    const editEntry = messageToString.editEntry;
    const idEdit = parseInt(editEntry.id);

    updateEntrys(idEdit, editEntry, 'edit');
  }
}

function checkSaveEntry(messageToString) {
  if (messageToString.saveEntry !== undefined) {
    const saveEntry = messageToString.saveEntry;
    const idEdit = parseInt(saveEntry.id);

    updateEntrys(idEdit, saveEntry, 'save');
  }
}

function checkDeleteEntry(messageToString) {
  if (messageToString.deleteEntry !== undefined) {
    const deleteEntry = messageToString.deleteEntry;
    const idEdit = parseInt(deleteEntry.id);

    updateEntrys(idEdit, deleteEntry, 'delete');
  }
}

function updateEntrys(idEntry, objData, typeRequest) {
  const formName = objData.formName;
  const fileName = formName;
  let newJSON = {},
    newFin = [];

  const getDataFile = getDataFromFile(formName);

  if (getDataFile[formName] != undefined) {
    getDataFile[formName].forEach((item) => {
      if (parseInt(item.id) === idEntry) {
        console.log(`Я нашел запись c id ${idEntry}`);

        if (typeRequest === 'save') {
          newFin.push({
            date: objData.date,
            sum: objData.sum,
            name: objData.name,
            id: item.id,
            state: objData.state,
          });
        }
        if (typeRequest === 'edit') {
          newFin.push({
            date: item.date,
            sum: item.sum,
            name: item.name,
            id: item.id,
            state: 'edit',
          });
        }
        if (typeRequest === 'delete') {
        }

        return;
      } else {
        newFin.push({ date: item.date, sum: item.sum, name: item.name, id: item.id, state: item.state });
      }
    });
  }

  newJSON = Object.assign(getDataFile, { [formName]: newFin });

  fs.writeFileSync(`${fileName}.json`, JSON.stringify(newJSON));
  const json = getDataFromFile(formName);
  console.log(`\n Перезаписан data.json: изменено состояние id=${idEntry} (${typeRequest}) \n`);

  sortData(formName);
  const allSum = total(formName);

  const sendJSON = JSON.stringify({
    form: formName,
    [formName]: json[formName],
    allSum: allSum,
  });
  for (const client of clients) {
    client.send(sendJSON);
  }
}

function writeData(postJSON, formName) {
  const fileName = formName;
  let getJSON = getDataFromFile(formName);
  let newJSON = getJSON;

  for (let key in postJSON) {
    if (getJSON[key] === undefined) {
      getJSON[key] = [];
    }
  }

  Object.keys(getJSON).forEach((key) => {
    if (postJSON[key] != null) {
      newJSON[key] = [].concat(getJSON[key], postJSON[key]);
    }
  });

  fs.writeFileSync(`${fileName}.json`, JSON.stringify(newJSON));
  sortData(formName);

  const json = getDataFromFile(formName);
  console.log('\n Перезаписан data.json:\n');
  return json;
}

function getDataFromFile(fileName) {
  let getData;
  try {
    getData = JSON.parse(fs.readFileSync(`${fileName}.json`, 'utf8'));
  } catch (e) {
    fs.writeFileSync(`${fileName}.json`, JSON.stringify({}));
    getData = JSON.parse(fs.readFileSync(`${fileName}.json`, 'utf8'));
  }
  return getData;
}

function sortData(formName) {
  const fileName = formName;
  const getDataFile = getDataFromFile(formName);
  let fin = getDataFile[formName];

  if (fin !== undefined) {
    fin.sort((a, b) => {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
      return 0;
    });
  }

  const newFinance = Object.assign({ [formName]: fin }, getDataFile);

  fs.writeFileSync(`${fileName}.json`, JSON.stringify(newFinance));

  console.log(`Данные отсортированы`);
}

function runStart(formName) {
  const fileName = formName;
  let newJSON = {},
    newFin = [];

  const getDataFile = getDataFromFile(formName);
  if (getDataFile[formName] !== undefined) {
    getDataFile[formName].forEach((item) => {
      newFin.push({
        date: item.date,
        sum: item.sum,
        name: item.name,
        id: item.id,
        state: 'main',
      });
    });
  }

  newJSON = Object.assign(getDataFile, { [formName]: newFin });

  fs.writeFileSync(`${fileName}.json`, JSON.stringify(newJSON));

  console.log(`\n Перезаписан data.json: изменено состояние на main \n`);
}

//--------------------------------------------------------------

function total(fileName) {
  let getData,
    sum = 0;
  try {
    getData = JSON.parse(fs.readFileSync(`${fileName}.json`, 'utf8'));
    getData[fileName].forEach((item) => {
      sum = sum + parseFloat(item.sum);
    });
  } catch (e) {
    fs.writeFileSync(`${fileName}.json`, JSON.stringify({}));
    getData = JSON.parse(fs.readFileSync(`${fileName}.json`, 'utf8'));
  }

  return sum;
}
