// stdio API 是process对象的一个部分
// 什么是流（console.log做的事情就是在指定的字符串后面加上\n，并将其写到stdout流中）
// process全局对象中包含了三个流对象，分别对应三个UNIX标准
// stdin**:标准输入（stdin是可读流）
// stdout**:标准输出（stdout是可写流）
// stderr**:标准错误（stderr是可写流）
const fs = require('fs');
const stdin = process.stdin;
const stdout = process.stdout;
console.log(process.argv); // 运行node程序时的所有参数
console.log(__dirname); // 获取执行文件所在的目录
console.log(process.cwd()); // 获取当前工作的目录

fs.readdir(__dirname, (err, files) => {
    let states = [];
    if (err) {
        console.log(`\\033[31m$ ${err} \\033[39m `);
    } else {
        if (files.length) {
            console.log(`Select which file or directory you want to see \n`)
        } else {
            return console.log(i + '.  \033[31m$ No files to show ! \033[39m \n')
        }

    }

    function file(i) {
        let fileName = files[i];
        fs.stat(__dirname + '/' + fileName, (err, stat) => {
            states[i] = stat;
            if (stat.isDirectory()) {
                console.log(i + '.\033[36m' + fileName + '\033[39m');
            } else {
                console.log(i + '.\033[90m' + fileName + '\033[39m');
            }
            if (++i == files.length) {
                read();
            } else {
                file(i)
            }
        });

    }
    file(0);

    function read() {
        console.log('');
        stdout.write('\033[33m Enter your choice \033[39m');
        stdin.on('data', option);
        stdin.resume();
        stdin.setEncoding('utf-8');
    }

    function option(data) {
        if (!files[Number(data)]) {
            stdout.write('\033[33m Enter your choice \033[39m')
        } else {
            stdout.write(files[Number(data)] + '\n');
            if (!states[Number(data)].isDirectory()) {
                fs.readFile(__dirname + '/' + files[Number(data)], 'utf-8', (err, data) => {
                    console.log('');
                    console.log(data.replace(/(.*)/g, '  $1'));
                })
            } else {
                fs.readdir(__dirname + '/' + files[Number(data)], (err, files) => {
                    console.log('');
                    files.forEach(item => {
                        console.log('  ——  ' + item);
                    })
                })
            }
            stdin.pause();
        }
    }
});