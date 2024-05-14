const table = document.getElementById('table')
const saveBtn = document.getElementById('save')

const createTable = async (tableData, isPaginationRequest) => {
    if (tableData) {
        table.innerHTML = ''
    }

    const total = 100
    const response = await fetch(`https://dummyjson.com/product?limit=${total}&select=id,title,description,price,discountPercentage,rating,stock,brand,category`)
    const data = await response.json()
    const itemsPerPage = 5
    const products = tableData ? tableData : data.products
    const items = _.chunk(products, itemsPerPage)
    let currentPage = 1

    const headings = Object.keys(products[0]).filter(
        (key) => key !== 'thumbnail' && key !== 'images'
    )
    const paginationElement = document.getElementById('pagination')
    let paginationPrevArrow = ""
    let paginationNextArrow = ""

    if (!isPaginationRequest) {
        paginationPrevArrow = document.createElement('a')
        paginationPrevArrow.href = '#'
        paginationPrevArrow.textContent = '\u{00AB}'
        paginationNextArrow = document.createElement('a')
        paginationNextArrow.href = '#'
        paginationNextArrow.textContent = '\u{00BB}'
        paginationElement.appendChild(paginationPrevArrow)
    }
    items.map((_, idx) => {
        if (!isPaginationRequest) {
            const pageElement = document.createElement('a')
            pageElement.href = '#'
            pageElement.textContent = idx + 1
            paginationElement.appendChild(pageElement)
            pageElement.onclick = async () => {
                table.innerHTML = ''
                currentPage = idx + 1
                await createTable(items[idx], true)
            }
        }

    })
    if (!isPaginationRequest) {
        paginationElement.appendChild(paginationNextArrow)
        paginationNextArrow.onclick = async () => {
            table.innerHTML = ''
            currentPage++
            await createTable(items[currentPage - 1], true)
        }
        paginationPrevArrow.onclick = async () => {
            table.innerHTML = ''
            currentPage--
            await createTable(items[currentPage - 1], true)
        }
    }

    const trElement = document.createElement('tr')
    headings.forEach((headingName) => {
        const thElement = document.createElement('th')
        thElement.textContent = headingName
        trElement.appendChild(thElement)
    })
    const thElement = document.createElement('th')
    thElement.textContent = 'Edit/Delete'
    trElement.appendChild(thElement)
    table.appendChild(trElement)

    items[currentPage - 1].forEach((item) => {
        const datRowElement = document.createElement('tr')
        Object.values(item).forEach((product) => {
            const dataColumnElement = document.createElement('td')
            dataColumnElement.textContent = product
            datRowElement.appendChild(dataColumnElement)
        })
        const editBtn = document.createElement('button')
        const deleteBtn = document.createElement('button')
        editBtn.textContent = 'Edit'
        deleteBtn.textContent = 'Delete'
        datRowElement.id = `row-${item.id}`
        editBtn.id = `edit-btn-${item.id}`
        deleteBtn.id = `delete-btn-${item.id}`
        const editDeleteTdElement = document.createElement('td')
        editDeleteTdElement.appendChild(editBtn)
        editDeleteTdElement.appendChild(deleteBtn)
        datRowElement.appendChild(editDeleteTdElement)
        table.appendChild(datRowElement)

        editBtn.onclick = () => {
            let id = editBtn.id.split('-')[2]
            const rowValues = Array.from(
                document.getElementById(`row-${id}`).children
            )
                .map((child) =>
                    child.textContent === id ||
                        child.textContent.toLowerCase() === 'editdelete'
                        ? ''
                        : child.textContent
                )
                .filter((val) => val !== '')
            const inputs = Array.from(document.querySelector('#form').children)
                .map((child) =>
                    child.lastElementChild.nodeName === 'INPUT'
                        ? child.lastElementChild
                        : ''
                )
                .filter((val) => val !== '')
            inputs.forEach((el, idx) => {
                el.value = rowValues[idx]
            })

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
                    .filter((val) => val !== '')

                rowElements.forEach((el, idx) => {
                    el.textContent = inputs[idx].value
                })

                inputs.forEach((input) => {
                    input.value = ''
                })
            }
        }

        deleteBtn.onclick = () => {
            document.getElementById('modalBackground').style.display = 'flex'
            const cancelBtn = document.getElementById('modal-cancel-btn')
            const deletBtn = document.getElementById('modal-delete-btn')
            cancelBtn.onclick = () => {
                document.getElementById('modalBackground').style.display = 'none'
            }
            deletBtn.onclick = () => {
                document.getElementById('modalBackground').style.display = 'flex'
                document.getElementById('modalBackground').style.display = 'none'
                let deleteBtnId = deleteBtn.id.split('-')[2]
                let tr = document.getElementById(`row-${deleteBtnId}`)
                table.removeChild(tr)
            }
        }

    })



    const sortByButtonsIds = Array.from(document.getElementById('sort-by-buttons').children).map(childElem => childElem.id).filter(val => val)


    sortByButtonsIds.forEach(id => {
        const element = document.getElementById(id)

        if (element) {
            element.onclick = async () => {
                await sortData(id)
            }
        }
    })
}

const createNewRow = (id) => {
    const trElement = document.createElement('tr')
    const newRecord = []
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
    )
    newRecord.forEach((val) => {
        const tdElement = document.createElement('td')
        tdElement.textContent = val
        trElement.appendChild(tdElement)
    })
    const editBtn = document.createElement('button')
    const deleteBtn = document.createElement('button')
    editBtn.textContent = 'Edit'
    deleteBtn.textContent = 'Delete'
    trElement.id = `row-${id}`
    editBtn.id = `edit-btn-${id}`
    deleteBtn.id = `delete-btn-${id}`
    const tdElement = document.createElement('td')
    tdElement.appendChild(editBtn)
    editBtn.onclick = () => {
        let id = editBtn.id.split('-')[2]
        const rowValues = Array.from(document.getElementById(`row-${id}`).children)
            .map((child) =>
                child.textContent === id ||
                    child.textContent.toLowerCase() === 'editdelete'
                    ? ''
                    : child.textContent
            )
            .filter((val) => val !== '')
        const inputs = Array.from(document.querySelector('#form').children)
            .map((child) =>
                child.lastElementChild.nodeName === 'INPUT'
                    ? child.lastElementChild
                    : ''
            )
            .filter((val) => val !== '')
        inputs.forEach((el, idx) => {
            el.value = rowValues[idx]
        })

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
                .filter((val) => val !== '')

            rowElements.forEach((el, idx) => {
                el.textContent = inputs[idx].value
            })

            inputs.forEach((input) => {
                input.value = ''
            })
        }
    }
    tdElement.appendChild(deleteBtn)
    deleteBtn.onclick = () => {
        document.getElementById('modalBackground').style.display = 'flex'
        const cancelBtn = document.getElementById('modal-cancel-btn')
        const deletBtn = document.getElementById('modal-delete-btn')
        cancelBtn.onclick = () => {
            document.getElementById('modalBackground').style.display = 'none'
        }
        deletBtn.onclick = () => {
            document.getElementById('modalBackground').style.display = 'flex'
            document.getElementById('modalBackground').style.display = 'none'
            let deleteBtnId = deleteBtn.id.split('-')[2]
            let tr = document.getElementById(`row-${deleteBtnId}`)
            table.removeChild(tr)
        }
    }
    trElement.appendChild(tdElement)
    table.appendChild(trElement)
    id += 1
    document.getElementById('title').value = ''
    document.getElementById('description').value = ''
    document.getElementById('price').value = ''
    document.getElementById('discountPercentage').value = ''
    document.getElementById('rating').value = ''
    document.getElementById('stock').value = ''
    document.getElementById('brand').value = ''
    document.getElementById('category').value = ''
}

const addNewRecord = () => {
    let id = 31
    document.getElementById('button').onclick = () => createNewRow(id)
}

const getTableData = () => {
    const tableElem = document.getElementById('table')
    const tableData = Array.from(tableElem.children)
    return tableData
        .map((row) => {
            const values = Array.from(row.children)
            return values.map((val) => {
                if (val.textContent.toLowerCase() === 'editdelete') {
                    return ""
                } else {
                    return val.textContent
                }
            })
        })
        .slice(1)

}
const sortData = async (field) => {
    const rowsArray = getTableData()
    const keys = Array.from(document.getElementById('table').children[0].children).map(childElem => _.camelCase(childElem.textContent))
    const filteredKeys = keys.slice(0, - 1)
    const filteredRowsArray = rowsArray.map(row => row.filter(val => val !== ""))

    const rowsData = filteredRowsArray.map(subArray =>
        subArray.reduce((obj, value, index) => {
            if (filteredKeys[index] === 'id' || filteredKeys[index] === 'price' || filteredKeys[index] === 'discountPercentage' || filteredKeys[index] === 'rating' || filteredKeys[index] === 'stock') {
                value = Number(value)
            }
            obj[filteredKeys[index]] = value
            return obj
        }, {})
    )
    const sortByField = field.split('-')[0]
    const order = field.split('-').slice(-1)
    console.log(order)
    const sortedData = _.orderBy(rowsData, [(o) => typeof o[sortByField] === "string" ? o[sortByField].toLowerCase() : o[sortByField]], order)
    await createTable(sortedData)
}

createTable()
addNewRecord()
