let records = [];

while (true) {
    const name = prompt('请输入项目名称(留空可停止输入):');
    if (name === null) break;

    const amount_input = prompt('请输入消费金额(留空可停止输入):');
    const amount = parseFloat(amount_input);
    if (isNaN(amount)) break;

    records.push({
    name:name,
    amount:amount
})
}

console.log(records);