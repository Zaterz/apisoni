const cheerio = require('cheerio')
const axios = require('axios')

function getTribun(k){
	const kategori = ['nasional','sport','internasional','techno','bisnis','lifestyle']
	if(k){
	return new Promise(async(resolve, reject) => {
		if(!kategori.includes(k)) return reject('404')
		try {
			const res = await axios.get('https://www.tribunnews.com/'+k)
			const $ = cheerio.load(res.data)
			const obj = []
			let num = 0;
			$('#latestul li').each((i,el) => {
				if($(el).find('h3').text().trim() == '') return 
				const title = $(el).find('h3').text().trim()
				const link = $(el).find('a').attr('href')
				const imgUrl = $(el).find('img').attr('src')
				num += 1
				obj.push({
					title: title,
					link: link,
					img: imgUrl,
					id: num
				})
			})
			resolve(obj)
		} catch (err) {

			reject(err)
		}
	});
	} else {
		return new Promise(async(resolve,reject) => {
			try{
				let obj = {}
				for(let k of kategori){
					const res = await axios.get('https://www.tribunnews.com/'+k)
					obj[k] = []
					const $ = cheerio.load(res.data)
					$('#latestul li').each((i,el) => {
						if($(el).find('h3').text().trim() == '') return 
						const title = $(el).find('h3').text().trim()
						const link = $(el).find('a').attr('href')
						const imgUrl = $(el).find('img').attr('src')
						obj[k].push({
							title: title,
							link: link,
							img: imgUrl
						})
					})
				}
				resolve(obj)
			} catch(err) {
				reject(err)
			}
		})
	}

}


module.exports = getTribun