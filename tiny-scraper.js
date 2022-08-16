var axios = require("axios");
var xpath = require("xpath");
var { DOMParser } = require("xmldom");
const EventEmitter = require("events");

class TinyScraper extends EventEmitter {
	constructor(url) {
		super();
		this.emit("scrapeStarted", "url");
		// this.parseUrl(url);
		this.ScapperEvent(url);
		setTimeout(() => {
            this.emit("timeout")
            
		    console.log("done!!!!!")
            
		}, 2000)
	}

	async ScapperEvent(url) {
		try {
			// this.emit("scrapeStarted", url);
			await this.parseUrl(url);
			return "";
		} catch (error) {
			console.log(error, "error");
		}
	}

	async retrievePage(url) {
		try {
			return axios.request({ url });
		} catch (error) {
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
			console.log(error, "error");
		}
	}

	async nodesFromDocument(document, xpathselector) {
		try {
			return xpath.select(xpathselector, document);
		} catch (error) {
			console.log(error, "error");
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
			console.log(error, "error");
		}
	}

	async parseUrl(url) {
		try {
			// this.emit("scrapeStarted", url);
			const xpaths = {
				title: "string(//meta[@property='og:title']/@content)",
				description: "string(//meta[@property='og:description']/@content)",
				image: "string(//meta[@property='og:image']/@content)",
			};
			const result = await this.retrievePage(url).then(async (response) => {
				const document = await this.convertBodyToDocument(response.data);
				const mappedProperties = await this.mapProperties(xpaths, document);
				return mappedProperties;
			});
			this.emit("scrapeSuccess", result);
			return "result";
		} catch (error) {
			console.log(error, "error");
		}
	}
}

module.exports = TinyScraper;
