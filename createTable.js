const table = document.getElementById('table');
const saveBtn = document.getElementById('save');

const createTable = async () => {
  const response = await fetch('https://dummyjson.com/product');

  const data = await response.json();
  const products = data.products;
  const headings = Object.keys(products[0]).filter(
    (key) => key !== 'thumbnail' && key !== 'images'
  );
  const trElement = document.createElement('tr');
  headings.forEach((headingName) => {
    const thElement = document.createElement('th');
    thElement.textContent = headingName;
    trElement.appendChild(thElement);
  });
  const thElement = document.createElement('th');
  thElement.textContent = 'Edit/Delete';
  trElement.appendChild(thElement);
  table.appendChild(trElement);

  products.forEach((product) => {
    const trElement = document.createElement('tr');
    headings.forEach((val) => {
      const tdElement = document.createElement('td');
      tdElement.textContent = product[val];
      trElement.appendChild(tdElement);
    });
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    deleteBtn.textContent = 'Delete';
    trElement.id = `row-${product.id}`;
    editBtn.id = `edit-btn-${product.id}`;
    deleteBtn.id = `delete-btn-${product.id}`;
    const tdElement = document.createElement('td');
    tdElement.appendChild(editBtn);
    editBtn.onclick = () => {
      let id = editBtn.id.split('-')[2];
      const rowValues = Array.from(
        document.getElementById(`row-${id}`).children
      )
        .map((child) =>
          child.textContent === id ||
          child.textContent.toLowerCase() === 'editdelete'
            ? ''
            : child.textContent
        )
        .filter((val) => val !== '');
      const inputs = Array.from(document.querySelector('#form').children)
        .map((child) =>
          child.lastElementChild.nodeName === 'INPUT'
            ? child.lastElementChild
            : ''
        )
        .filter((val) => val !== '');
      inputs.forEach((el, idx) => {
        el.value = rowValues[idx];
      });

      saveBtn.onclick = () => {
        const rowElements = Array.from(
          document.getElementById(`row-${id}`).children
        )
          .map((child) =>
            child.textContent === id ||
            child.textContent.toLowerCase() === 'editdelete'
              ? ''
              : child
          )
          .filter((val) => val !== '');

        rowElements.forEach((el, idx) => {
          el.textContent = inputs[idx].value;
        });

        inputs.forEach((input) => {
          input.value = '';
        });
      };
    };
    tdElement.appendChild(deleteBtn);
    deleteBtn.onclick = () => {
      document.getElementById('modalBackground').style.display = 'flex';
      const cancelBtn = document.getElementById('modal-cancel-btn');
      const deletBtn = document.getElementById('modal-delete-btn');
      cancelBtn.onclick = () => {
        document.getElementById('modalBackground').style.display = 'none';
      };
      deletBtn.onclick = () => {
        document.getElementById('modalBackground').style.display = 'flex';
        document.getElementById('modalBackground').style.display = 'none';
        let deleteBtnId = deleteBtn.id.split('-')[2];
        let tr = document.getElementById(`row-${deleteBtnId}`);
        table.removeChild(tr);
      };
    };
    trElement.appendChild(tdElement);
    table.appendChild(trElement);
  });
};

const createNewRow = (id) => {
  const trElement = document.createElement('tr');
  const newRecord = [];
  newRecord.push(
    id,
    document.getElementById('title').value,
    document.getElementById('description').value,
    document.getElementById('price').value,
    document.getElementById('discountPercentage').value,
    document.getElementById('rating').value,
    document.getElementById('stock').value,
    document.getElementById('brand').value,
    document.getElementById('category').value
  );
  newRecord.forEach((val) => {
    const tdElement = document.createElement('td');
    tdElement.textContent = val;
    trElement.appendChild(tdElement);
  });
  const editBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  deleteBtn.textContent = 'Delete';
  trElement.id = `row-${id}`;
  editBtn.id = `edit-btn-${id}`;
  deleteBtn.id = `delete-btn-${id}`;
  const tdElement = document.createElement('td');
  tdElement.appendChild(editBtn);
  editBtn.onclick = () => {
    let id = editBtn.id.split('-')[2];
    const rowValues = Array.from(document.getElementById(`row-${id}`).children)
      .map((child) =>
        child.textContent === id ||
        child.textContent.toLowerCase() === 'editdelete'
          ? ''
          : child.textContent
      )
      .filter((val) => val !== '');
    const inputs = Array.from(document.querySelector('#form').children)
      .map((child) =>
        child.lastElementChild.nodeName === 'INPUT'
          ? child.lastElementChild
          : ''
      )
      .filter((val) => val !== '');
    inputs.forEach((el, idx) => {
      el.value = rowValues[idx];
    });

    saveBtn.onclick = () => {
      const rowElements = Array.from(
        document.getElementById(`row-${id}`).children
      )
        .map((child) =>
          child.textContent === id ||
          child.textContent.toLowerCase() === 'editdelete'
            ? ''
            : child
        )
        .filter((val) => val !== '');

      rowElements.forEach((el, idx) => {
        el.textContent = inputs[idx].value;
      });

      inputs.forEach((input) => {
        input.value = '';
      });
    };
  };
  tdElement.appendChild(deleteBtn);
  deleteBtn.onclick = () => {
    document.getElementById('modalBackground').style.display = 'flex';
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const deletBtn = document.getElementById('modal-delete-btn');
    cancelBtn.onclick = () => {
      document.getElementById('modalBackground').style.display = 'none';
    };
    deletBtn.onclick = () => {
      document.getElementById('modalBackground').style.display = 'flex';
      document.getElementById('modalBackground').style.display = 'none';
      let deleteBtnId = deleteBtn.id.split('-')[2];
      let tr = document.getElementById(`row-${deleteBtnId}`);
      table.removeChild(tr);
    };
  };
  trElement.appendChild(tdElement);
  table.appendChild(trElement);
  id += 1;
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('price').value = '';
  document.getElementById('discountPercentage').value = '';
  document.getElementById('rating').value = '';
  document.getElementById('stock').value = '';
  document.getElementById('brand').value = '';
  document.getElementById('category').value = '';
};

const addNewRecord = () => {
  let id = 31;
  document.getElementById('button').onclick = () => createNewRow(id);
};

function sortData(name) {
  const tableElem = document.getElementById('table');
  const tableData = Array.from(tableElem.children);
  const rowsArray = tableData
    .map((row) => {
      const values = Array.from(row.children);
      return values.map((val) => {
        if (val.textContent.toLowerCase() === 'editdelete') {
          return val.children;
        } else {
          return val.textContent;
        }
      });
    })
    .slice(1);
  const keys = document.getElementById('sort-by-buttons').children;
  keys.map((val) => val.id);
  const rowsData = rowsArray.map((item) => {
    return keys.reduce((obj, key, idx) => {
      if (
        key === 'id' ||
        key === 'title' ||
        key === 'price' ||
        key === 'discountPercentage' ||
        key === 'rating' ||
        key === 'stock' ||
        key === 'brand' ||
        key === 'category'
      ) {
        obj[key] = Number(item[idx]);
        return obj;
      }
    }, {});
  });
  const sortedData = _.sortBy(rowsData, function (o) {
    return o[name];
  });
  console.log(sortedData);
}

createTable();
document.getElementById('id').onclick = () => {
  setTimeout(() => sortData('id'), 2000);
};
document.getElementById('title').onclick = () => {
  setTimeout(() => sortData('title'), 2000);
};
document.getElementById('price').onclick = () => {
  setTimeout(() => sortData('price'), 2000);
};
document.getElementById('discountPercentage').onclick = () => {
  setTimeout(() => sortData('discountPercentage'), 2000);
};
document.getElementById('rating').onclick = () => {
  setTimeout(() => sortData('rating'), 2000);
};
document.getElementById('stock').onclick = () => {
  setTimeout(() => sortData('stock'), 2000);
};
document.getElementById('brand').onclick = () => {
  setTimeout(() => sortData('brand'), 2000);
};
document.getElementById('category').onclick = () => {
  setTimeout(() => sortData('category'), 2000);
};

addNewRecord();
