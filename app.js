const wppconnect = require("@wppconnect-team/wppconnect");
const fs = require("fs");
const csv = require("csv-parser");

let csvData = [];
let phones = [];

wppconnect
	.create()
	.then((client) => start(client))
	.catch((error) => {
		console.log(error);
	});

async function treatNumbers(number) {
	if (number.charAt(0) === "0") {
		// Primeiro remove o número 0 do início e substitui por 55
		let numberArray = number.split("");
		numberArray.shift();
		numberArray.unshift("55");

		// Depois remove os espaços e traços
		let treatedNumber = numberArray.join("").replace(/\s|-/g, "");
		return treatedNumber;
	} else if (number.charAt(0) === "(") {
		// Primeiro remove as parenteses
		let newNumber = number.replace(/\(|\)/g, "");
		// Depois remove os espaços e traços
		let treatedNumber = newNumber.replace(/\s|-/g, "");
		// adiciona o 55 no início
		treatedNumber = "55" + treatedNumber;
		return treatedNumber;
	} else if (number.charAt(0) === "+") {
		// Primeiro remove o sinal de +
		let treatedNumber = number.replace("+", "");
		return treatedNumber;
	}
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function start(client) {
	let message = "Olá, tudo bem?";

	fs.createReadStream("./csv/leads.csv")
		.pipe(csv({ separator: ";" })) // Separador do CSV
		.on("data", (data) => {
			csvData.push(data);
		})
		.on("end", async () => {
			for (const element of csvData) {
				let number = element.Phone;
				if (!element.Phone.startsWith("55")) {
					number = await treatNumbers(element.Phone);
				}
				phones.push(number);
			}

			// Enviando a mensagem via loop com delay
			for (const [i, phone] of phones.entries()) {
				try {
					await client.sendText(phone, message);
					console.log(
						"Mensagem enviada para",
						csvData[i]["Business Name"]
					);
				} catch (erro) {
					console.log(
						"Erro ao enviar mensagem para",
						csvData[i]["Business Name"]
					);
				}

				// Delay entre os envios para evitar bloqueio
				await delay(30000); // Aguarda 30 segundos antes de enviar a próxima mensagem
			}
		});
}
