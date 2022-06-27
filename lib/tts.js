const caklontong = require("../data/caklontong.js")
getRandom = async () => caklontong[Math.floor(Math.random() * caklontong.length)]
getByIndex = async(id) => {
    const res = caklontong.filter(d => d.index == id)
    if(res.length ==  0) return new Promise((r,reject) => reject())
    return new Promise((resolve) => resolve(res[0]))
}

module.exports = {
    getRandom: getRandom,
    getByIndex: getByIndex
}