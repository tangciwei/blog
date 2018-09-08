let fs = require('fs');
let util = require('util');
// var S = require('string');

let promisify = util.promisify;
// promisify包装
let readFile = promisify(fs.readFile);
let writeFile = promisify(fs.writeFile);

async function start(name) {
    // let name = process.argv.slice(2)[0];
    if (!name) {
        console.log('请输入名称');
        return;
    }

    let prename = './markdown/';
    name = prename + name;
    let data = await readFile(`./${name}.md`, 'utf8');
    // #号处理和**处理
    data = data.split('\n').map((item, line) => {
        if (item[0] === '#') {
            item = item.replace(/\#+/, $0 => $0 + ' ');
        }

        // **处理
        item = item.replace(/\*\*([^\*]+)\*\*/g, ($0, $1) => {
            return `**${$1.trim()}**`;
        });

        // 图片处理
        item = item.replace(/\!\[[^\]]*\]\(([^\)]+)\)/g, ($0, $1) => {

            if ($1.slice(0, 4) !== 'http') {
                // 去掉./
                let arr = $1.split('/');
                $1 = arr[arr.length - 1];
                // 打印行号
                console.log(`第${line}行图片名称：`, $1);
                return `{% asset_img ${$1} img %}`;
            }

            return $0;
        });

        return item;
    });
    let len = data.length;
    // 表格处理
    for (let i = 0; i < len; i++) {
        let str = data[i];
        if (str.slice(0, 3) === '|--') {
            data[i - 2] += '\n';
        }

    }

    data = data.join('\n');

    await writeFile(`./${name}.md`, data);
}

module.exports = start;
