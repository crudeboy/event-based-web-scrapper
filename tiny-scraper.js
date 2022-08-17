var axios = require("axios");
var xpath = require("xpath");
var { DOMParser } = require("xmldom");
const EventEmitter = require("events");

class TinyScraper extends EventEmitter {
	timeout_val;
	constructor(url, timeout = 2000) {
		super();
		this.timeout_val = timeout
		this.ScapperEvent(url);
	}

	async ScapperEvent(url) {
		try {
			await this.parseUrl(url);
		} catch (error) {
			this.emit('error')
			console.log("error occurred while scrapping");
		}
	}

	async retrievePage(url) {
		try {
			return axios.request({ url });
		} catch (error) {
			this.emit('error')
			console.log(error, "error");
		}
	}

	async convertBodyToDocument(body) {
		try {
			const doc = new DOMParser({
				locator: {},
				errorHandler: {
					warning: function (w) {},
					error: function (e) {},
					fatalError: function (e) {
						console.error(e);
					},
				},
			}).parseFromString(body);
			return doc;
		} catch (error) {
			this.emit('error')
			console.log("error occurred while scrapping");
		}
	}

	async nodesFromDocument(document, xpathselector) {
		try {
			return xpath.select(xpathselector, document);
		} catch (error) {
			this.emit('error')
			console.log("error occurred while scrapping");
		}
	}

	async mapProperties(paths, document) {
		try {
			let obj = {};
			const result = await Promise.all(
				Object.keys(paths).map(async (key) => {
					obj[key] = await this.nodesFromDocument(document, paths[key]);
					return obj;
				})
			);

			return obj;
		} catch (error) {
			this.emit('error')
			console.log("error occurred while scrapping");
		}
	}

	async parseUrl(url) {
		try {
			//emmit the scrapping start event
			this.emit("scrapeStarted", url);

			//initialize teh event for use in the set timeout to check if the scapping process is done
			let result;
			if(this.timeout_val){
				setTimeout(() => {
					if(!result){
						this.emit("timeout");
					}
				}, this.timeout_val);
			}


			const xpaths = {
				title: "string(//meta[@property='og:title']/@content)",
				description: "string(//meta[@property='og:description']/@content)",
				image: "string(//meta[@property='og:image']/@content)",
			};
			result = await this.retrievePage(url).then(async (response) => {
				const document = await this.convertBodyToDocument(response.data);
				const mappedProperties = await this.mapProperties(xpaths, document);
				return mappedProperties;
			});
			this.emit("scrapeSuccess", result);
			return "result";
		} catch (error) {
			this.emit('error')
			console.log("error occurred while scrapping");
		}
	}
}

module.exports = TinyScraper;
