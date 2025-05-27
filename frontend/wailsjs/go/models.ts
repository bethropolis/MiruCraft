export namespace app {
	
	export class HTTPRequest {
	    url: string;
	    method: string;
	    headers: Record<string, string>;
	    body: any;
	
	    static createFrom(source: any = {}) {
	        return new HTTPRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.url = source["url"];
	        this.method = source["method"];
	        this.headers = source["headers"];
	        this.body = source["body"];
	    }
	}
	export class HTTPResponse {
	    status: number;
	    body: string;
	    headers: Record<string, string>;
	    error?: string;
	    duration?: string;
	
	    static createFrom(source: any = {}) {
	        return new HTTPResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.status = source["status"];
	        this.body = source["body"];
	        this.headers = source["headers"];
	        this.error = source["error"];
	        this.duration = source["duration"];
	    }
	}
	export class ImageResponse {
	    data: number[];
	    mimeType: string;
	
	    static createFrom(source: any = {}) {
	        return new ImageResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	        this.mimeType = source["mimeType"];
	    }
	}

}

