
import fs from 'fs'
console.log(1);
// 异步读取
fs.readFile('package.json', function (err, data) {
    if (err) {
        return console.error(err);
    }
    console.log("异步读取: " + data.toString());
});

// 同步读取
var data = fs.readFileSync('package.json');
console.log("同步读取: " + data.toString());

console.log("程序执行完毕。");



