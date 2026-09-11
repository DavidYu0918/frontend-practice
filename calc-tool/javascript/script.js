let records = [];

//交互式添加对象
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
console.table(records);

const clean_record = (records) = records.filter(r => r.amount >= 0);

//根据name进行分组
let category = {};
for (let i = 0;i<records.length;++i) {
    let record = records[i];
    let name = record.name;
    if (category[name] === undefined) {
        category[name] = [];
    }

    category[name].push(record);
}
console.table('分组结果',category);

//求出各组的总消费
let sums = {};
for (let name in category) {
    let list = category[name];
    let sum = 0;
    sum = list.reduce((total,record) => total+=record.amount,0);
    sums[name] = sum;
}
console.table('分类汇总',sums);