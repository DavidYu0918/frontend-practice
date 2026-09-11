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

const clean_record = (list) => list.filter(r => r.amount >= 0);

//根据name进行分组
const group_name = (list) => {
    const category = {};
    for (let i = 0;i<records.length;++i) {
        let record = records[i];
        let name = record.name;
        if (category[name] === undefined) {
            category[name] = [];
        }

        category[name].push(record);
    }
    return category;
};

//求出各组的总消费
const sum_categary = (category) => {
    const sums = {};
    for (const name in category) {
        sums[name] = category[name].reduce((total,r) => total+r.amount,0);
    }
    return sums;
}


const highest = (list) => list.reduce((max,r) => (r.amount > max.amount ? r : max));
const total = (list) => list.reduce((sum,r) => sum+r.amount,0);

const report = (list) => {
    const valid = clean_record(list);
    if (valid.length === 0) {
        return '无有效消费记录';
    }
    const top = highest(valid);
    const category = group_name(valid);
    const sums = sum_categary(category);
    const sumText = Object.keys(sums)
        .map(name => `${name}${sums[name]}元`)
        .join(' ');

    return `总消费${total(valid)}元,单笔最高${top.amount}元(${top.name});
    分类数量:${Object.keys(category).length};
    分类汇总:${sumText}`;
};

try {
    console.log(report(records));
} catch(err){
    console.error('报告生成失败:',err.message);
}