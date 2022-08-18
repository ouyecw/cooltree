/**
 * 朴素贝叶斯分类器
 * 
 */
function Bayes()
{
	this.fc = {}; //记录特征的数量 feature 例如 {a:{yes:5,no:2},b:{yes:1,no:6}}
    this.cc = {}; //记录分类的数量 category 例如 {yes:6,no:8} 
}

//插入新特征值
Bayes.prototype.infc=function(w, cls) 
{
    if (!this.fc[w]) this.fc[w] = {};
    if (!this.fc[w][cls]) this.fc[w][cls] = 0;
    this.fc[w][cls] += 1;
}

//插入新分类
Bayes.prototype.incc=function(cls) 
{
    if (!this.cc[cls]) this.cc[cls] = 0;
    this.cc[cls] += 1;
}

//计算分类总数 all count
Bayes.prototype.allco=function() 
{
    var t = 0;
    for (var k in this.cc) t += this.cc[k];
    return t;
}

//特征标识概率
Bayes.prototype.fprob=function(w, ct) 
{ 
    if (Object.keys(this.fc).indexOf(w) >= 0) {
        if (Object.keys(this.fc[w]).indexOf(ct) < 0) {
            this.fc[w][ct] = 0
        }
        var c = parseFloat(this.fc[w][ct]);
        return c / this.cc[ct];
    } else {
        return 0.0;
    }
}

//分类概率
Bayes.prototype.cprob=function(c) 
{
    return parseFloat(this.cc[c] / this.allco());
}

//参数:学习的Array,标识类型(Yes|No)
Bayes.prototype.train=function(data, cls) 
{
    for (var w of data) this.infc(String(w), cls);
    this.incc(cls);
}

//获取结果
Bayes.prototype.test=function(data) 
{
    var ccp = {}; //P(类别)
    var fccp = {}; //P(特征|类别)
    for (var k in this.cc) ccp[k] = this.cprob(k);
    for (var i of data) {
        i = String(i);
        if (!i) continue;
        if (Object.keys(this.fc).indexOf(i)) {
            for (var k in ccp) {
                if (!fccp[k]) fccp[k] = 1;
                fccp[k] *= this.fprob(i, k); //P(特征1|类别1)*P(特征2|类别1)*P(特征3|类别1)...
            }
        }
    }
    var tmpk = "";
    for (var k in ccp) {
        ccp[k] = ccp[k] * fccp[k];
        if (!tmpk) tmpk = k;
        if (ccp[k] > ccp[tmpk]) tmpk = k;
    }
    return tmpk;
}

