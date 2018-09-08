let fs = require('fs')
let fork = require('child_process').fork;
let spawn = require('child_process').spawn;
let format = require('./format');
var path = require('path');

let readFile = require('util').promisify(fs.readFile);
let appendFile = require('util').promisify(fs.appendFile);


function getAllFiles(root) {
    var res = [];
    var files = fs.readdirSync(root);

    files.forEach(function(file) {
        var pathname = root + '/' + file;

        var stat = fs.lstatSync(pathname);

        if (!stat.isDirectory()) {

            res.push(pathname);
        } else {
            res = res.concat(getAllFiles(pathname));
        }
    });
    return res;
}

function getFileContent() {
    let allFiles = getAllFiles(__dirname + '/markdown');
    allFiles = allFiles.filter(item => {
        return item.indexOf('.DS_Store') === -1;
    });
    allFileNames = allFiles.map(item => item.split('/').pop());

    if (allFileNames.length > 0) {
        // -------针对有效的分析；
        let imgFiles = allFiles.filter(item => item.split('.').pop() !== 'md');
        let imgFileNames = allFileNames.filter(item => item.split('.').pop() !== 'md');

        let mdFile = allFileNames.filter(item => item.split('.').pop() === 'md')[0];
        let mdFilePath = allFiles.filter(item => item.split('.').pop() === 'md')[0];
        let mdName = '';
        mdFile.replace(/(.*)\.md$/g, ($0, $1) => {
            mdName = $1;
        });

        return {
            imgFiles,
            imgFileNames,
            mdFile,
            mdFilePath,
            mdName
        }
    } else {
        console.log('请在markdown文件夹下放入内容');
        process.exit(0);
    }
}

function createMd(name, callback) {
    const sonProcess = spawn('hexo', ['new', 'post', name]);
    sonProcess.stdout.on('data', (data) => {
        console.log(`创建文章成功：${data}`);
    });

    sonProcess.stderr.on('data', (data) => {
        console.log(`创建文章错误：${data}`);
    });

    sonProcess.on('close', (code) => {
        console.log(`子进程退出码：${code}`);
    });
}

function watchMd() {

    const sonProcess = spawn('hexo', ['generate', '--watch']);
    sonProcess.stdout.on('data', (data) => {
        console.log(`生成文章成功：${data}`);
    });

    sonProcess.stderr.on('data', (data) => {
        console.log(`生成文章错误：${data}`);
    });

    sonProcess.on('close', (code) => {
        console.log(`子进程退出码：${code}`);
    });
    // -------启动服务
    const sonProcess2 = spawn('hexo', ['s']);
    sonProcess2.stdout.on('data', (data) => {
        console.log(`开启服务成功：${data}`);
    });

    sonProcess2.stderr.on('data', (data) => {
        console.log(`开启服务错误：${data}`);
    });

    sonProcess2.on('close', (code) => {
        console.log(`子进程退出码：${code}`);
    });


}


function rmOldMd(name) {
    const sonProcess = spawn('rm', ['-rf', name]);
    sonProcess.stdout.on('data', (data) => {
        console.log(`删除成功：${data}`);
    });

    sonProcess.stderr.on('data', (data) => {
        console.log(`删除错误：${data}`);
    });

    sonProcess.on('close', (code) => {
        console.log(`子进程退出码：${code}`);
    });
}

function mvFiles(sourceFile, destPath) {

    fs.rename(sourceFile, destPath, function(err) {
        if (err) throw err;
        fs.stat(destPath, function(err, stats) {
            if (err) throw err;
            console.log('stats: ' + JSON.stringify(stats));
        });
    });
}

async function start() {
    let dirName = process.argv.slice(2)[0] || '';
    dirName = dirName.trim();
    let {
        imgFiles = [],
            imgFileNames = [],
            mdFilePath = '',
            mdName
    } = getFileContent();

    if(!dirName){
        return ;
    }

    if (dirName === 'c') {
        createMd(mdName);

        // 格式化
        format(mdName);

    } else if (dirName === 'w') {
        watchMd()
    } else if (!/2018|2019|2020/g.test(dirName)) {
        console.log('请输入正确的文件名');
    } else {
        // 格式化
        format(mdName);

        imgFiles.forEach((item, i) => {
            mvFiles(item, path.join(__dirname, `/source/_posts/${dirName}/${imgFileNames[i]}`));
        });

        let mdCon = await readFile(mdFilePath, 'utf8');

        await appendFile(path.join(__dirname, `/source/_posts/${dirName}.md`), mdCon);

        // 删除源文件
        // rmOldMd(path.join(__dirname,'/markdown/*'));
    }
}

start()