export function log(... args) {
	console.log.apply(args);
}

export function createDocMessage(message : String, doc : any) {
	return message;
}