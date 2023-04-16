const tableBody = document.querySelector("tbody");
let bucket = [];
async function generateTable(url) {
    
    const response = await fetch(url);
    const {data} = await response.json();

    return (
        tableBody.innerHTML = data.map((item) => {
            let { id, img, description, price, discount, tax} = item;

            return `
            <tr>
                <td><img src=${img} alt="image"></td>
                <td>${description}</td>
                <td>
                    <span id=${id}>0</span>
                    <button onclick="decrease(${id},${price},${discount},${tax})"class="decrease">-</button>
                    <button onclick="increase(${id},${price},${discount},${tax})"class="increase">+</button>
                    <button onclick="remove(${id})"class="remove">x</button>
                </td>
                <td>$${price}</td>
                <td>$${discount}</td>
                <td>$${tax}</td>
                <td id=total-${id}>$0</td>
            </tr>
        `;
        }).join(""));
};
generateTable("data.json")

function increase(id, price, discount, tax) {
    let selectedItem = id;
    let search = bucket.find((obj) => obj.id === selectedItem.id);
    let total = price + tax - discount;
    if (search === undefined) {
        bucket.push({
            id: selectedItem.id,
            item: 1,
            total,
            discount,
            tax
        })
    } else {
        search.item += 1;
        search.total += total;
        search.discount += discount;
        search.tax += tax;
    }
    console.log(bucket);
    update(selectedItem.id);
}
function decrease(id, price, discount, tax) {
    let selectedItem = id;
    let search = bucket.find((obj) => obj.id === selectedItem.id);
    let total = price + tax - discount;
    if (search.item === 0) {
        return;
    }
    else {
        search.item -= 1;
        search.total -= total;
        search.discount -= discount;
        search.tax -= tax;
    }
    update(selectedItem.id);
}
function remove(id) {
    let selectedItem = id;
    let search = bucket.find((obj) => obj.id === selectedItem.id);
    let tr = document.getElementById(`total-${selectedItem.id}`).parentElement;
    console.log(tr);
    if (search === undefined) return;
    else {
        search.total = 0;
        search.discount = 0;
        search.tax = 0;
    }
    calculateTotalPrice(selectedItem.id);
    for (var i = 0; i < tableBody.rows.length; i++) {
        if (tableBody.rows[i] == tr) {
            tableBody.deleteRow(i);
        }
    }
}
function update(id) {
    let search = bucket.find((obj) => obj.id === id);
    document.getElementById(id).innerHTML = search.item;
    calculateTotalPrice(id);
}
function calculateTotalPrice(id) {
    let search = bucket.find((obj) => obj.id === id);
    let totalprice = bucket.map((obj) => obj.total).reduce((x, y) => x + y, 0);
    let totaldiscount = bucket.map((obj) => obj.discount).reduce((x, y) => x + y, 0);
    let totaltax = bucket.map((obj) => obj.tax).reduce((x, y) => x + y, 0);

    document.getElementById(`total-${id}`).innerHTML = `$${search.total}`;
    document.getElementById("totalprice").innerHTML = `$${totalprice}`;
    document.getElementById("totaldiscount").innerHTML = `$${totaldiscount}`;
    document.getElementById("totaltax").innerHTML = `$${totaltax}`;
}
